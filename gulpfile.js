"use strict";
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
const $ = require('gulp-load-plugins')();
var del = require('del');


gulp.task('css', function() {
    return gulp.src(src+'/**/*.@(css|scss|less)')
        .pipe($.ifElse(isDev, $.sourcemaps.init))
        .pipe($.sass().on('error', $.sass.logError))
        
        .pipe($.ifElse(isDev, function() {
            return $.sourcemaps.write('.');
        }))
        .pipe(gulp.dest(dist))
        .pipe($.filter('**/*.css'))
        .pipe(reload({ stream: true }));
});

