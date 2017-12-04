"use strict";
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
const $ = require('gulp-load-plugins')();
var del = require('del');

<%if(config.postcss){%>
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var cssnext = require('postcss-cssnext');
var mqpacker = require('css-mqpacker');
var cssnano = require('cssnano');
var px2rem = require('postcss-pxtorem');
const pxtorem = require('postcss-pxtorem');
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
<%}%>
<%if(config.js==='webpack'){%>
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
<%}else{%>

<%}%>
<%if(config.server){%>
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
<%}%>

const isDev = process.env.NODE_ENV === 'development';




let src="<%=config.from%>";
let dist="<%=config.to%>";


gulp.task('dev', ['del'], function() {
    gulp.run(['html', 'watch', 'browser-sync', 'css', 'js','img','json']);
});
gulp.task('build', ['del'], function() {
    gulp.run(['html', 'css', 'js', 'img', 'json']);
});

<%if(config.style){%>
gulp.task('css', function() {
    return gulp.src(src+'/**/*.@(css|scss|less)')
        .pipe($.ifElse(isDev, $.sourcemaps.init))
        <%if(config.style==='sass'){%>.pipe($.sass().on('error', $.sass.logError))<%}%>
        <%if(config.style==='less'){%>.pipe($.less())<%}%>
        .pipe($.postcss(processors))
        <%if(config.md5){%>.pipe($.yfyRev({ tail: true, verConnecter: "?v=" }))<%}%>
        .pipe($.ifElse(isDev, function() {
            return $.sourcemaps.write('.');
        }))
        .pipe(gulp.dest(dist))
        .pipe($.filter('**/*.css'))
        .pipe(reload({ stream: true }));
});
<%}%>




<%if(config.html){%>
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
        <%if(config.md5){%>.pipe($.yfyRev({ tail: true, verConnecter: "?v=" }))<%}%>
        .pipe(gulp.dest(dist));
});
<%}%>

<%if(config.js){%>
gulp.task('js', function() {
    return gulp.src(src+'/**/*!(.min).js')
        .pipe($.changed(dist))
        .pipe($.babel({
            "presets": [
              'es2015',
              'stage-3'
            ]
          }))
        <%if(config.js==='browserify'){%>.pipe($.browserify({
            insertGlobals: true,
            debug: isDev
          }))<%}%>
        <%if(config.md5){%>.pipe($.yfyRev({ tail: true, verConnecter: "?v=" }))<%}%>
        .pipe($.ifElse(!isDev, $.uglify))
        .pipe(gulp.dest(dist));
});

<%if(config.js==='webpack'){%>
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
<%}%>

gulp.task('js-copy', function() {
    return gulp.src(src+'/**/*.min.js')
        .pipe($.changed(dist))
        .pipe(gulp.dest(dist));
});
gulp.task('json-copy', function() {
    return gulp.src(src+'/**/*.json')
        .pipe($.changed(dist))
        .pipe(gulp.dest(dist));
});
<%}%>




<%if(config.img){%>
gulp.task('img', function() {
    return gulp.src(src+'/**/*.+(jpeg|jpg|png|gif)')
        .pipe($.changed(dist))
        .pipe($.imagemin({
              interlaced: true,
              progressive: true,
              optimizationLevel: 5,
              svgoPlugins: [{removeViewBox: true}]
          }))
        .pipe(gulp.dest(dist));
});
<%}%>






gulp.task('del', function(cb) {
    del([dist], cb);
});


gulp.task('watch', function() {
    <%if(config.style){%>gulp.watch(src+'/**/*.@(css|scss|less)', ['css']);<%}%>
    <%if(config.html){%>gulp.watch(src+'/**/*.html', ['html'], reload);<%}%>
    <%if(config.js){%>gulp.watch(src+'/**/*.js', ['js'], reload);<%}%>
    <%if(config.img){%>gulp.watch(src+'/**/*.+(jpeg|jpg|png|gif)', ['img'], reload);<%}%>
});


<%if(config.server){%>
gulp.task('browser-sync', function() {
    let files = [
        dist+'/**/*.html',
        dist+'/**/*.css',
        dist+'/**/*.+(jpeg|jpg|png|gif)',
        dist+'/**/*.js',
        dist+'/**/*.json'
    ];
    browserSync.init(files, {
        server: {
            baseDir: ["./", dist],
            directory: true
        },
        startPath: "./"+(!/\/$/.test(dist)?(dist+"/index.html"):dist),
        open: "external"
    });
});
<%}%>
