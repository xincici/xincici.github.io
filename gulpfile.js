'use strict';
var gulp = require('gulp');

// Load plugins
var $ = require('gulp-load-plugins')();

var fileinclude = require('gulp-file-include');
gulp.task('html', function() {
    gulp.src('app/*.html')
    .pipe(fileinclude({
        prefix: '@@',
        basepath: 'app/part/'
    }))
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./'));
});

// Styles
gulp.task('css', function () {
    return gulp.src('app/styles/*.scss')
        .pipe($.rubySass({
            style: 'compact',
            precision: 3
        }))
        .pipe(gulp.dest('static/stylesheets'))
        .pipe($.size());
});

// Default task
gulp.task('default', ['html', 'css']);
