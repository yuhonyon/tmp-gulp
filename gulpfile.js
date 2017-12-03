"use strict";
var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
const $ = require('gulp-load-plugins')();
var del = require('del');


var precss = require('precss');
var autoprefixer = require('autoprefixer');
var cssnext = require('postcss-cssnext');
var mqpacker = require('css-mqpacker');
var cssnano = require('cssnano');
var px2rem = require('postcss-pxtorem');
const pxtorem = require('postcss-pxtorem');

const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const isDev = process.env.NODE_ENV === 'development';

const processors=[
  pxtorem({
    rootValue: 75,
    propList: ['*','!font', '!font-size'],
    minPixelValue: 2
  }),
  precss,
  autoprefixer({browsers: ['iOS 8','last 2 versions']}),
  cssnano({
    zindex: false
  })
];


let src="src/";
let dist="dist/";


gulp.task('dev', ['del'], function() {
    gulp.run(['html', 'watch', 'browser-sync', 'css', 'js','img','json']);
});
gulp.task('build', ['del'], function() {
    gulp.run(['html', 'css', 'js', 'img', 'json']);
});


gulp.task('css', function() {
    return gulp.src(src+'/**/*.css')
        .pipe($.ifElse(isDev, $.sourcemaps.init))
        .pipe($.postcss(processors))
        .pipe($.yfyRev({ tail: true, verConnecter: "?v=" }))
        .pipe($.ifElse(isDev, function() {
            return $.sourcemaps.write('.');
        }))
        .pipe(gulp.dest(dist))
        .pipe($.filter('**/*.css'))
        .pipe(reload({ stream: true }));
});


gulp.task('webpack', function(cb) {
    let config = Object.create(webpackConfig);

    if (!isDev) {
        config.plugins = config.plugins.concat(
            new webpack.DefinePlugin({
                "process.env": {
                    "NODE_ENV": "production"
                }
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin()
        );
    }

    webpack(config, function(err, stats) {
        if (err) {
            console.log(err);
        }
            console.log(stats);
        cb();
    });
});




gulp.task('html', function() {
    return gulp.src([src+'/**/*.html'])
        .pipe($.changed(dist))
        .pipe($.fileInclude({
            prefix: '@@',
            basepath: '@file'
          }))
        .pipe($.ifElse(!isDev, function() {
            return $.htmlmin({ collapseWhitespace: true });
        }))
        .pipe($.yfyRev({ tail: true, verConnecter: "?v=" }))
        .pipe(gulp.dest(dist));
});


gulp.task('js', function() {
    return gulp.src(src+'/**/*!(.es6).js')
        .pipe($.changed(dist))
        .pipe($.babel({
            "presets": [
              'es2015',
              'stage-3'
            ]
          }))
        .pipe($.yfyRev({ tail: true, verConnecter: "?v=" }))
        .pipe($.ifElse(!isDev, $.uglify))
        .pipe(gulp.dest(dist));
});


gulp.task('es6', function() {
    return gulp.src([src+'/**/*.es6.js'])
        .pipe($.changed(dist))
        .pipe($.babel({
            plugins: [
              ["transform-runtime", {
                "helpers": !isDev,
                "polyfill": true,
                "regenerator": true,
                "moduleName": "babel-runtime"
              }]
            ],
            "presets": [
              'es2015',
              'stage-3'
            ]
          }))
          .pipe($.browserify({
          insertGlobals: true,
          debug: isDev
        }))
        .pipe($.yfyRev({ tail: true, verConnecter: "?v=" }))
        .pipe($.ifElse(!isDev, $.uglify))
        .pipe(gulp.dest(dist));
});


gulp.task('img', function() {
    return gulp.src(src+'/**/*.+(jpeg|jpg|png|gif)')
        .pipe($.changed(dist))
        .pipe($.ifElse(!isDev, $.imagemin))
        .pipe($.ifElse(!isDev, $.imgload))
        .pipe(gulp.dest(dist));
});


gulp.task('json', function() {
    return gulp.src(src+'/**/*.json')
        .pipe($.changed(dist))
        .pipe(gulp.dest(dist));
});


gulp.task('del', function(cb) {
    del([dist], cb);
});


gulp.task('watch', function() {
    gulp.watch(src+'/**/*.css', ['css']);
    gulp.watch(src+'/**/*.html', ['html'], reload);
    gulp.watch(src+'/**/*.js', ['js'], reload);
    gulp.watch(src+'/**/*.+(jpeg|jpg|png|gif)', ['img'], reload);
});



gulp.task('browser-sync', function() {
    let files = [
        'dist/**/*.html',
        'dist/**/*.css',
        'dist/**/*.+(jpeg|jpg|png|gif)',
        'dist/**/*.js',
        'dist/**/*.json'
    ];
    browserSync.init(files, {
        server: {
            baseDir: ["./", "./dist"],
            directory: true
        },
        startPath: "./"+(!/\/$/.test(dist)?(dist+"/index.html"):"dist/"),
        open: "external"
    });
});
