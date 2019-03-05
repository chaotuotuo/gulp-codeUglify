
let gulp = require('gulp'),
	uglifyJS = require('gulp-terser'),
	uglifyHTML = require('gulp-html-minifier2'),
	uglifyCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	babel = require('gulp-babel'),
	imageMin = require('gulp-imagemin'),
	pump = require('pump'),
	del = require('del'),
	zip = require('gulp-zip');


const DEST = 'Build',
	PROJECT = 'deviceProduct',
	BASE = './'+PROJECT+'/**/*';


let whiteList = [PROJECT+'/plugin/**/*.css'],
	folderJS = [BASE+'.js','!./'+PROJECT+'/Libras/gisbase_almond/**/*.js'],
	folderHTML = [BASE+'.html'],
	folderCSS = [BASE+'.css'].concat(whiteList),
	folderImage = [BASE+'/**/*.{png,jpg}'].concat(whiteList),
	ignoreUglify = [].concat(folderJS,folderHTML,folderCSS,folderImage).map(item => ('!'+item).replace(/\!{2}/g,'')),
	folderOther = [BASE].concat(ignoreUglify,whiteList);

console.log(folderOther)


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

// test task

gulp.task('jsMini',() => {
	return gulp.src('./PopupTemplate.js')
		.pipe(babel())
        .pipe(uglifyJS())
        .pipe(gulp.dest('Build'));
})

gulp.task('cssMini',() => {
	return gulp.src('./jedate.css')
		.pipe(uglifyCSS())
		.pipe(gulp.dest('Build'));
})
gulp.task('htmlMini',() => {
	return gulp.src('./disasterPop.html')
		.pipe(uglifyHTML({
			collapseWhitespace: true,
			minifyCSS:true,
			minifyJS:true,
			minifyURLs:true,
			processConditionalComments:true,
			removeComments:true
		}))
		.pipe(gulp.dest('Build'));
})


/**
 * by --chaotuotuo
 * 2018.11.15
 */