#
# Wire
# Copyright (C) 2016 Wire Swiss GmbH
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see http://www.gnu.org/licenses/.
#

del = require 'del'
fs = require 'fs'
gulp = require('gulp-help') require 'gulp'
$ = require('gulp-load-plugins')()

config =
  ext: [
    'node_modules/jquery/dist/jquery.js'
  ]
  style: [
    'src/style/style.less'
  ]
  script: [
    'src/script/**/*.js'
  ]


onError = (err) ->
  $.util.beep()
  console.log err
  this.emit 'end'


timestamp = ->
  now = new Date()
  MM = "0#{now.getMonth() + 1}".slice(-2);
  DD = "0#{now.getDate()}".slice(-2);
  hh = "0#{now.getHours()}".slice(-2);
  mm = "0#{now.getMinutes()}".slice(-2);
  ss = "0#{now.getSeconds()}".slice(-2);
  return [now.getFullYear(), MM, DD, hh, mm, ss].join('-');

###############################################################################
# Init
###############################################################################
gulp.task 'init', 'Initial Tasks.',
  $.sequence 'clean:dev', 'ext:dev', 'script:dev', 'style:dev'


gulp.task 'default', 'Watch for changes and reload browser automatically.',
  $.sequence 'init', ['watch', 'reload']


###############################################################################
# Style
###############################################################################
gulp.task 'style', false, ->
  gulp.src config.style
  .pipe $.plumber errorHandler: onError
  .pipe $.less()
  .pipe $.cssnano
    discardComments: removeAll: true
    zindex: false
  .pipe $.size {title: 'Minified styles'}
  .pipe gulp.dest 'app/static/min/style'


gulp.task 'style:dev', false, ->
  gulp.src config.style
  .pipe $.plumber errorHandler: onError
  .pipe $.sourcemaps.init()
  .pipe $.less()
  .pipe $.autoprefixer {map: true}
  .pipe $.sourcemaps.write()
  .pipe gulp.dest 'app/static/dev/style'


###############################################################################
# Script
###############################################################################
gulp.task 'ext', false, ->
  gulp.src config.ext
  .pipe $.plumber errorHandler: onError
  .pipe $.concat 'ext.js'
  .pipe $.uglify()
  .pipe $.size {title: 'Minified ext libs'}
  .pipe gulp.dest 'app/static/min/script'


gulp.task 'ext:dev', false, ->
  gulp.src config.ext
  .pipe $.plumber errorHandler: onError
  .pipe $.sourcemaps.init()
  .pipe $.concat 'ext.js'
  .pipe $.sourcemaps.write()
  .pipe gulp.dest 'app/static/dev/script'


gulp.task 'script', false, ->
  gulp.src config.script
  .pipe $.plumber errorHandler: onError
  .pipe $.concat 'script.js'
  .pipe $.uglify()
  .pipe $.size {title: 'Minified scripts'}
  .pipe gulp.dest 'app/static/min/script'


gulp.task 'script:dev', false, ->
  gulp.src config.script
  .pipe $.plumber errorHandler: onError
  .pipe $.sourcemaps.init()
  .pipe $.concat 'script.js'
  .pipe $.sourcemaps.write()
  .pipe gulp.dest 'app/static/dev/script'


###############################################################################
# Watch
###############################################################################
gulp.task 'reload', false, ->
  $.livereload.listen 35729
  gulp.watch([
    'app/static/dev/**/*.{css,js}'
    'app/**/*.{html,py}'
  ]).on 'change', $.livereload.changed


gulp.task 'watch', false, ->
  gulp.watch 'src/style/**/*.less', ['style:dev']
  gulp.watch config.ext, ['ext:dev']
  gulp.watch config.script, ['script:dev']


###############################################################################
# Clean
###############################################################################
gulp.task 'clean', 'Delete temporary files and compiled Python files.', ->
  del './**/*.pyc'
  del './**/*.pyo'
  del './**/*.~'


gulp.task 'clean:dev', false, ->
  del 'app/static/dev/'

gulp.task 'clean:dist', false, ->
  del 'dist/'

gulp.task 'clean:min', false, ->
  del 'app/static/min/'


###############################################################################
# Deploy
###############################################################################
gulp.task 'version', false, ->
  fs.writeFileSync 'app/version', timestamp()


gulp.task 'zip', 'Zip Stuff.', ->
  gulp.src ['dist/**/*', 'app/**/*', '!app/server/**/*', '!app/static/dev/**/*', '!dist/*.zip'], {nodir: true, dot: true}
  .pipe $.zip 'wire-account.zip'
  .pipe gulp.dest 'dist'


gulp.task 'build', 'Build to prepare for deployment.',
  $.sequence 'clean', 'ext', 'script', 'style', 'version', 'zip'

gulp.task 'dist', 'Creates Elastic Beanstalk ZIP file for production uploads.',
  $.sequence 'clean:dist', 'build'
