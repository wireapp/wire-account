/*
 * Wire
 * Copyright (C) 2019 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

const del = require('del');
const fs = require('fs');
const moment = require('moment');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const config = {
  ext: ['node_modules/jquery/dist/jquery.js'],
  script: ['src/script/**/*.js'],
  style: ['src/style/style.less'],
};

const onError = function() {
  $.util.beep();
  return this.emit('end');
};

const timestamp = function() {
  return moment(new Date()).format('YYYY-MM-DD-hh-mm-ss');
};

gulp.task('init', 'Initial Tasks.', $.sequence('clean', 'ext:dev', 'script:dev', 'style:dev'));

gulp.task('default', 'Watch for changes and reload browser automatically.', $.sequence('init', ['watch', 'reload']));

gulp.task('style', false, function() {
  return gulp
    .src(config.style)
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.less())
    .pipe(
      $.cssnano({
        discardComments: {removeAll: true},
        zindex: false,
      }),
    )
    .pipe($.size({title: 'Minified styles'}))
    .pipe(gulp.dest('dist/static/style'));
});

gulp.task('style:dev', false, function() {
  return gulp
    .src(config.style)
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.sourcemaps.init())
    .pipe($.less())
    .pipe($.autoprefixer({map: true}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/static/style'));
});

gulp.task('ext', false, function() {
  return gulp
    .src(config.ext)
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.concat('ext.js'))
    .pipe($.uglify())
    .pipe($.size({title: 'Minified ext libs'}))
    .pipe(gulp.dest('dist/static/script'));
});

gulp.task('ext:dev', false, function() {
  return gulp
    .src(config.ext)
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.sourcemaps.init())
    .pipe($.concat('ext.js'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/static/script'));
});

gulp.task('script', false, function() {
  return gulp
    .src(config.script)
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.concat('script.js'))
    .pipe($.uglify())
    .pipe($.size({title: 'Minified scripts'}))
    .pipe(gulp.dest('dist/static/script'));
});

gulp.task('script:dev', false, function() {
  return gulp
    .src(config.script)
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.sourcemaps.init())
    .pipe($.concat('script.js'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/static/script'));
});

gulp.task('reload', false, function() {
  $.livereload.listen(35729);
  return gulp.watch(['dist/static/**/*.{css,js}', 'dist/templates/**/*.{html}']).on('change', $.livereload.changed);
});

gulp.task('watch', false, function() {
  gulp.watch('src/style/**/*.less', ['style:dev']);
  gulp.watch(config.ext, ['ext:dev']);
  return gulp.watch(config.script, ['script:dev']);
});

gulp.task('clean', false, function() {
  del('dist/static/script/');
  return del('dist/static/style/');
});

gulp.task('version', false, function() {
  return fs.writeFileSync('dist/version', timestamp());
});

gulp.task('zip', 'Zip Stuff.', function() {
  return gulp
    .src(['package.json', 'dist/**/*', '!dist/*.zip'], {dot: true, nodir: true})
    .pipe($.zip('wire-account.zip'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', 'Build to prepare for deployment.', $.sequence('clean', 'ext', 'script', 'style', 'version', 'zip'));

gulp.task('dist', 'Creates Elastic Beanstalk ZIP file for production uploads.', $.sequence('clean', 'build'));
