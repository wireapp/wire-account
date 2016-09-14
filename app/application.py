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

# coding: utf-8

import os
from datetime import datetime
import logging

import flask

from libs import flask_sslify
import config
import util


class MyFlask(flask.Flask):
  def process_response(self, response):
    return util.update_headers(response)

app = MyFlask(__name__, static_url_path='/static')
app.config.from_object(config)
app.jinja_env.line_statement_prefix = '#'
app.jinja_env.globals.update(
  user_agent=util.user_agent,
)
sslify = flask_sslify.SSLify(app, skips=['test'])


###############################################################################
# Main
###############################################################################
@app.route('/<path:url>')
@app.route('/')
def index(url='/'):
  path = flask.request.path
  query = flask.request.query_string

  target = '%s%s' % (config.WIRE_URL, path)
  if query:
    target = '%s%s%s' % (target, '&' if '?' in target else '?', query)

  if config.DEVELOPMENT:
    return flask.render_template(
      'index.html',
      redirect=target,
    )
  return flask.redirect(target)


###############################################################################
# Static
###############################################################################
@app.route('/favicon.ico')
def favicon():
  return flask.send_from_directory(
    os.path.join(app.root_path, 'static'),
    'favicon.ico',
    mimetype='image/vnd.microsoft.icon',
  )


@app.route('/robots.txt')
def robots():
  return flask.send_from_directory(
    os.path.join(app.root_path, 'static'),
    'robots.txt',
    mimetype='text/plain',
  )


###############################################################################
# Test
###############################################################################
@app.route('/test/')
def test():
  return flask.render_template(
    'test.html',
    title='Test',
  )


###############################################################################
# Verify
###############################################################################
@app.route('/verify/')
def verify():
  key = util.param('key')
  code = util.param('code')
  url = ''
  if key and code:
    url = '%s/activate?key=%s&code=%s' % (config.BACKEND_URL, key, code)

  return flask.render_template(
    'account/verify.html',
    html_class='account verify',
    title='Verify Account',
    status='success' if util.param('success') is not None else 'error',
    url=url,
    key=key,
  )


###############################################################################
# Error
###############################################################################
@app.errorhandler(400)  # Bad Request
@app.errorhandler(401)  # Unauthorized
@app.errorhandler(403)  # Forbidden
@app.errorhandler(404)  # Not Found
@app.errorhandler(405)  # Method Not Allowed
@app.errorhandler(406)  # Unsupported Browsers
@app.errorhandler(410)  # Gone
@app.errorhandler(418)  # I'm a Teapot
@app.errorhandler(500)  # Internal Server Error
def error_handler(e):
  try:
    e.code
  except AttributeError:
    e.code = 500
    e.name = 'Internal Server Error'

  handler = logging.StreamHandler()
  app.logger.addHandler(handler)
  app.logger.error('-=' * 40)
  app.logger.error(flask.request.url)
  app.logger.error('-=' * 40)
  app.logger.exception(e)

  return flask.render_template(
      'error.html',
      title='Error %d (%s)!!1' % (e.code, e.name),
      error=e,
      timestamp=datetime.utcnow(),
    ), e.code


###############################################################################
# Main :)
###############################################################################
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080)
