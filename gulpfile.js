
let gulp = require('gulp'),
	uglifyJS = require('gulp-terser'),
	uglifyHTML = require('gulp-html-minifier2'),
	uglifyCSS = require('gulp-css-condense'),
	rename = require('gulp-rename'),
	babel = require('gulp-babel'),
	imageMin = require('gulp-imagemin'),
	pump = require('pump'),
	del = require('del'),
	zip = require('gulp-zip');


const DEST = 'Build',
	PROJECT = 'device_product_YD',
	BASE = './'+PROJECT+'/**/*';


let folderJS = [BASE+'.js'],
	folderHTML = [BASE+'.html'],
	folderCSS = [BASE+'.css'],
	folderImage = [BASE+'/**/*.{png,jpg}'],
	ignoreUglify = [].concat(folderJS,folderHTML,folderCSS,folderImage).map(item => ('!'+item).replace(/\!{2}/g,'')),
	folderOther = [BASE].concat(ignoreUglify);


gulp.task('default',['zipFile'])

gulp.task('uglifyJS',['uglifyCSS'],function(){
	return gulp.src(folderJS)
		.pipe(uglifyJS())
		.pipe(gulp.dest(DEST));
})

gulp.task('uglifyHTML',['copyFile'],function(){
	return gulp.src(folderHTML)
		.pipe(uglifyHTML({
			collapseWhitespace: true,
			minifyCSS:true,
			minifyJS:true,
			minifyURLs:true,
			processConditionalComments:true,
			removeComments:true
		}))
		.pipe(gulp.dest(pa => {
			return pa.base.replace(PROJECT,DEST);
		}));
})

gulp.task('uglifyCSS',['uglifyHTML'],function(){
	return gulp.src(folderCSS)
		.pipe(uglifyCSS())
		.pipe(gulp.dest(pa => {
			return pa.base.replace(PROJECT,DEST);
		}));
})

gulp.task('imageMini',['uglifyJS'],function(){
	return gulp.src(folderImage)
		.pipe(imageMin([
					imageMin.gifsicle({interlaced: true}),
					imageMin.jpegtran({progressive: true}),
					imageMin.optipng({optimizationLevel: 5}),
					imageMin.svgo({
						plugins: [
							{removeViewBox: true},
							{cleanupIDs: false}
						]
					})
				]))
		.pipe(gulp.dest(DEST));
})

gulp.task('copyFile',['clearDest'],function(){
	return gulp.src(folderOther)
		.pipe(gulp.dest(DEST));
})

gulp.task('clearDest',function(){
	del(DEST);
})

gulp.task('zipFile',['imageMini'],function(){
	return gulp.src(DEST+'/**/*')
		.pipe(zip(PROJECT+'.zip'))
		.pipe(gulp.dest(DEST));
})


/**
 * by --chaotuotuo
 * 2018.11.15
 */