'use strict';
var gulp = require('gulp');

// Load plugins
var $ = require('gulp-load-plugins')();
var watchify = require('watchify');

var fileinclude = require('gulp-file-include');
gulp.task('html', function() {
    gulp.src('app/*.html')
    .pipe(fileinclude({
        prefix: '@@',
        basepath: 'app/part/'
    }))
    .pipe(gulp.dest(''));
});
// Default task
gulp.task('default', ['html']);
