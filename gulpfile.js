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

/* eslint-disable es5/no-block-scoping */

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
}.bind(this);

const timestamp = function() {
  return moment(new Date()).format('YYYY-MM-DD-hh-mm-ss');
};

gulp.task('clean', function() {
  del('dist/static/script/');
  return del('dist/static/style/');
});

gulp.task('ext:dev', function() {
  return gulp
    .src(config.ext)
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.sourcemaps.init())
    .pipe($.concat('ext.js'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/static/script'));
});

gulp.task('script:dev', function() {
  return gulp
    .src(config.script)
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.sourcemaps.init())
    .pipe($.concat('script.js'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/static/script'));
});

gulp.task('style:dev', function() {
  return gulp
    .src(config.style)
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.sourcemaps.init())
    .pipe($.less())
    .pipe($.autoprefixer({map: true}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/static/style'));
});

gulp.task(
  'init',
  gulp.series('clean', 'ext:dev', 'script:dev', 'style:dev', function(done) {
    done();
  }),
);

gulp.task('watch', function() {
  gulp.watch('src/style/**/*.less', gulp.series('style:dev'));
  gulp.watch(config.ext, gulp.series('ext:dev'));
  gulp.watch(config.script, gulp.series('script:dev'));
});

gulp.task('reload', function() {
  $.livereload.listen(35729);
  return gulp.watch(['dist/static/**/*.{css,js}', 'dist/templates/**/*.{html}']).on('change', $.livereload.changed);
});

gulp.task(
  'default',
  gulp.series('init', gulp.parallel('watch', 'reload'), function(done) {
    done();
  }),
);

gulp.task('style', function() {
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

gulp.task('ext', function() {
  return gulp
    .src(config.ext)
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.concat('ext.js'))
    .pipe($.uglify())
    .pipe($.size({title: 'Minified ext libs'}))
    .pipe(gulp.dest('dist/static/script'));
});

gulp.task('script', function() {
  return gulp
    .src(config.script)
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.concat('script.js'))
    .pipe($.uglify())
    .pipe($.size({title: 'Minified scripts'}))
    .pipe(gulp.dest('dist/static/script'));
});

gulp.task('version', function(done) {
  fs.writeFileSync('dist/version', timestamp());
  done();
});

gulp.task('zip', function() {
  return gulp
    .src(['package.json', '.env.defaults', 'dist/**/*', '!dist/*.zip'], {dot: true, nodir: true})
    .pipe($.zip('wire-account.zip'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.series('clean', 'ext', 'script', 'style', 'version', 'zip'));

gulp.task('dist', gulp.series('clean', 'build'));
