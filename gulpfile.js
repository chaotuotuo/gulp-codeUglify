
let gulp = require('gulp'),
	rename = require('gulp-rename'),
	babel = require('gulp-babel'),
	pump = require('pump'),
	del = require('del'),
	uglifyJS = require('gulp-uglify'),
	uglifyHTML = require('gulp-html-minifier2'),
	uglifyCSS = require('gulp-css-condense');

const DEST = 'Build',
	PROJECT = 'source',
	BASE = './'+PROJECT+'/**/*';

let folderJS = [BASE+'.js',]
	folderHTML = [BASE+'.html'],
	folderCSS = [BASE+'.css'],
	folderOther = [
					BASE,
					// '!'+folderJS[0],
					'!'+folderHTML[0],
					'!'+folderCSS[0],
				];


gulp.task('default',['uglifyCSS'])

gulp.task('uglifyJS',['copyFile'],function(){
	return gulp.src(folderJS)
		.pipe(uglifyJS({
			warnings:true
		}))
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

gulp.task('copyFile',['clearDest'],function(){
	return gulp.src(folderOther)
		.pipe(gulp.dest(DEST));
})

gulp.task('clearDest',function(){
	del(DEST+'**/*');
})


gulp.task('jsMini',['clearDest'],function(){
	return gulp.src(folderJS)
		pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglifyJS())
		.pipe(gulp.dest(DEST));
})