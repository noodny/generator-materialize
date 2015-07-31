var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var glob = require('glob');
var fs = require('fs');

var globals = {
    appname: '<%= appname %>'
};

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('static', function() {
    gulp.src(['./src/js/**/*', './src/img/**/*'], {base: './src/'})
        .pipe($.watch(['./src/js/**/*', './src/img/**/*']))
        .pipe($.plumber({
            errorHandler: handleError
        }))
        .pipe(gulp.dest('./dist'))
        .on('data', browserSync.reload);
});

gulp.task('styles', function() {
    gulp.src('./src/css/scss/**/*.scss')
        .pipe($.watch('./src/css/scss/**/*.scss'))
        .pipe($.plumber({
            errorHandler: handleError
        }))
        .pipe($.sass())
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('html', function() {
    gulp.src('./src/html/views/*.ejs')
        .pipe($.watch('./src/html/views/*.ejs'))
        .pipe($.plumber({
            errorHandler: handleError
        }))
        .pipe($.ejs({
            globals: globals
        }))
        .pipe(gulp.dest('./dist/views/'))
        .on('data', browserSync.reload);
});

gulp.task('html:index', function() {
    var views = glob.sync('./dist/views/*.html');

    views.forEach(function(view, index) {
        views[index] = view.replace('./dist/', '');
    });

    gulp.src('./src/html/index.ejs')
        .pipe($.watch(['./src/html/index.ejs', './src/html/views/*.ejs']))
        .pipe($.plumber({
            errorHandler: handleError
        }))
        .pipe($.ejs({
            globals: globals,
            views: views
        }))
        .pipe(gulp.dest('./dist/'))
        .on('data', browserSync.reload);
});

gulp.task('sync', function() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
});

gulp.task('default', $.sequence(['styles', 'html', 'html:index', 'static'], 'sync'));
