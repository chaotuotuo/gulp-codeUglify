const gulp = require('gulp'),
	imageMin = require('gulp-imagemin'),
	minifier = require('gulp-minifier');



const PROJECT = 'duobang',
	DEST = PROJECT+'-Build',
	all = '/**/*',
	buildImgs = [PROJECT+all+'.{png,jpg}'],
	buildFile = [PROJECT+all+'.{js,css,html}'],
	copyFile = [PROJECT+all,'!'+buildFile,'!'+buildImgs];


gulp.task('default',['imageMini'],() => {
	return gulp.src(buildFile)
		.pipe(minifier({
			minify: true,
		    minifyHTML: {
		      collapseWhitespace: true,
		      conservativeCollapse: false,
		    },
		    minifyJS: {
		      sourceMap: false
		    },
		    minifyCSS: false
		}))
		.pipe(gulp.dest(DEST))
})

gulp.task('imageMini',['copyFile'],function(){
	return gulp.src(buildImgs)
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
gulp.task('copyFile',() => {
	return gulp.src(copyFile)
		.pipe(gulp.dest(DEST))
})