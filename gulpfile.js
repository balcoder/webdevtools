
// create variables to require each plugin
var gulp = require('gulp');
//we chain .create to creates a server that listens for changes and updates the browser
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

// create our gulp tasks

//call gulp.task and name it css supplying a function that returns our source
//folder which we run our tasks on with the pipe function
gulp.task('css', function() {
  //use globbing to search for all .scss file to process in our sass folder
	return gulp.src('src/sass/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
    .pipe(sourcemaps.write('./maps'))
    //call gulp.dest with our dist folder path to write the processed files
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream())
});

//run imagmin manually from cli once on all images in src/images and write to dist/images
gulp.task('images', function(){
	return gulp.src('src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
});

//copy any files that are not processed to the dist folder
gulp.task('copy', function() {
	return gulp.src('src/**/*.+(html|js)')
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream())
});

//initialise browserSync pointing it to our distribution folder
gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'dist'
		},
	})
});

//create a watch task passing in an array of tasks to run before anything else
gulp.task('watch', ['browserSync', 'css'], function(){
  //then watch for changes in sass for .scss and src for html or js running css
  // or copy tasks respectively
	gulp.watch('src/sass/**/*.scss', ['css']);
	gulp.watch('src/**/*.+(html|js)', ['copy']);
});
