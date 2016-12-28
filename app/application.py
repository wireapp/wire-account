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

from datetime import datetime
import logging
import os
import re

from babel import localedata
from flask_babel import lazy_gettext as _
import flask
import flask_babel
import requests

from libs import flask_sslify
import config
import util


class MyFlask(flask.Flask):
  def process_response(self, response):
    return util.update_headers(response)

application = MyFlask(__name__, static_url_path='/static')
application.config.from_object(config)
application.jinja_env.line_statement_prefix = '#'
application.jinja_env.globals.update(
  user_agent=util.user_agent,
)
application.config['BABEL_DEFAULT_LOCALE'] = config.LOCALE_DEFAULT
babel = flask_babel.Babel(application)
sslify = flask_sslify.SSLify(application, skips=['test'])


###############################################################################
# Main - Special treatment for https://get.wire.com
###############################################################################
@application.route('/<path:url>')
@application.route('/')
def index(url='/'):
  target = flask.request.url.replace(flask.request.host_url[:-1], config.WIRE_URL)
  if flask.request.url.find(u'get.wire.com') > 0:
    ua_is = util.user_agent()['is']
    label = 'desktop'
    target = '%s/?connect' % config.WEBAPP_URL
    if ua_is['android']:
      target = '%s&referrer=getwire' % config.DOWNLOAD_ANDROID_URL
      label = 'android'
    elif ua_is['ios']:
      target = config.DOWNLOAD_IOS_URL
      label = 'ios'
    elif ua_is['safari']:
      target = config.WIRE_DOWNLOAD_URL
      label = 'safari'
    elif ua_is['ie']:
      target = config.WIRE_DOWNLOAD_URL
      label = 'ie'

  if config.DEVELOPMENT:
    return flask.render_template('index.html', redirect=target)
  return flask.render_template(
    'redirect.html',
    redirect=target,
    label=label,
  )


###############################################################################
# Static
###############################################################################
@application.route('/favicon.ico')
def favicon():
  return flask.send_from_directory(
    os.path.join(application.root_path, 'static'),
    'favicon.ico',
    mimetype='image/vnd.microsoft.icon',
  )


@application.route('/robots.txt')
def robots():
  return flask.send_from_directory(
    os.path.join(application.root_path, 'static'),
    'robots.txt',
    mimetype='text/plain',
  )


###############################################################################
# Test
###############################################################################
@application.route('/test/')
def test():
  return flask.render_template(
    'test.html',
    title=_('Test'),
    html_class='test',
  )


###############################################################################
# Verify Email
###############################################################################
@application.route('/verify/')
def verify():
  key = util.param('key')
  code = util.param('code')
  url = ''
  if key and code:
    url = '%s/activate?key=%s&code=%s' % (config.BACKEND_URL, key, code)

  return flask.render_template(
    'account/verify_email.html',
    html_class='account verify',
    title=_('Verify Account'),
    status='error' if util.param('success') is None else 'success',
    url=url,
    key=key,
    credentials='true',
  )


###############################################################################
# Verify Bot
###############################################################################
@application.route('/verify/bot/')
def verify_bot():
  key = util.param('key')
  code = util.param('code')
  url = ''
  if key and code:
    url = '%s/provider/activate?key=%s&code=%s' % (config.BACKEND_URL, key, code)

  return flask.render_template(
    'account/verify_bot.html',
    html_class='account verify',
    title=_('Verify Bot'),
    status='error' if util.param('success') is None else 'success',
    url=url,
    key=key,
    credentials='false',
  )


###############################################################################
# Verify Phone
###############################################################################
@application.route('/v/<code>/')
def verify_phone(code):
  util.track_event_to_piwik('account.verify-phone', 'success', 200, 1)
  return flask.render_template(
    'account/verify_phone.html',
    html_class='account phone',
    title=_('Verify Phone'),
    url='%s/%s' % (config.REDIRECT_PHONE_URL, code),
  )


###############################################################################
# Forgot
###############################################################################
@application.route('/forgot/', methods=['GET', 'POST'])
def forgot():
  status = ''
  error = ''

  if flask.request.method == 'POST':
    email = (util.param('email') or '').lower().strip()

    if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
      error = _('That does not look like an email.')
      status = 'error'
    else:
      try:
        result = requests.post(
          '%s/password-reset' % (config.BACKEND_URL),
          json={'email': email},
          timeout=8,
        )
        util.track_event_to_piwik('account.forgot', 'success' if result.status_code < 300 else 'fail', result.status_code, 1)

        if result.status_code == 201:
          return flask.redirect(flask.url_for('forgot', success=True))
        elif result.status_code == 400:
          error = _('This email is not in use.')
          status = 'error'
        elif result.status_code == 409:
          error = _('We already sent you an email. The link is valid for 10 minutes.')
          status = 'error'
        else:
          error = _('Something went wrong, please try again.')
          status = 'error'
      except requests.exceptions.ConnectTimeout:
        error = _('That took longer than usual, please try again.')
        status = 'error'

  return flask.render_template(
    'account/forgot.html',
    html_class='account forgot',
    title=_('Change Password'),
    status=status if util.param('success') is None else 'success',
    error=error,
  )


###############################################################################
# Reset
###############################################################################
@application.route('/reset/', methods=['GET', 'POST'])
def reset():
  status = 'error'
  error = ''

  code = util.param('code') or ''
  key = util.param('key') or ''

  if key and code:
    status = 'init'

  if flask.request.method == 'POST':
    status = 'error'
    password = util.param('password')

    if len(password) < 8:
      error = _('Choose a password that is at least 8 characters.')
      status = 'fail'
    elif key and code:
      try:
        result = requests.post(
          '%s/password-reset/%s' % (config.BACKEND_URL, key),
          json={'password': password, 'code': code},
          timeout=8,
        )
        util.track_event_to_piwik('account.reset', 'success' if result.status_code < 300 else 'fail', result.status_code, 1)
        if result.status_code == 200:
          return flask.redirect(flask.url_for('reset', success=True))
        if result.status_code == 400:
          status = 'error'
        else:
          error = _('Something went wrong, please try again.')
          status = 'fail'
      except requests.exceptions.ConnectTimeout:
        error = _('That took longer than usual, please try again.')
        status = 'fail'

  return flask.render_template(
    'account/reset.html',
    html_class='account reset',
    title=_('Password reset'),
    status=status if util.param('success') is None else 'success',
    error=error,
    code=code,
    key=key,
  )


@application.route('/i/<invite>/')
def invite(invite):
  if util.user_agent()['is']['desktop']:
    util.track_event_to_piwik('account.invite', 'redirect', 'desktop', 1)
    return flask.redirect('%s/auth/?invite=%s' % (config.WEBAPP_URL, invite))

  if util.user_agent()['is']['ios']:
    util.track_event_to_piwik('account.invite', 'redirect', 'ios', 1)
    return flask.redirect(config.DOWNLOAD_IOS_URL)

  if util.user_agent()['is']['android']:
    util.track_event_to_piwik('account.invite', 'redirect', 'android', 1)
    return flask.redirect('%s&referrer=invite-%s' % (config.DOWNLOAD_ANDROID_URL, invite))

  util.track_event_to_piwik('account.invite', 'redirect', 'other', 1)
  return flask.redirect(config.WIRE_DOWNLOAD_URL)


###############################################################################
# Delete
###############################################################################
@application.route('/d/', methods=['GET', 'POST'])
def delete():
  key = util.param('key')
  code = util.param('code')
  status = 'init' if key and code else 'error'

  if flask.request.method == 'POST' and key and code:
    try:
      result = requests.post(
        '%s/delete' % (config.BACKEND_URL),
        json={'key': key, 'code': code},
        timeout=8,
      )
      util.track_event_to_piwik('account.delete', 'success' if result.status_code < 300 else 'fail', result.status_code, 1)
      if result.status_code == 200:
        return flask.redirect(flask.url_for('delete', success=True))
      status = 'error'
    except requests.exceptions.ConnectTimeout:
      status = 'error'

  return flask.render_template(
    'account/delete.html',
    html_class='account delete',
    title=_('Delete Account'),
    status=status if util.param('success') is None else 'success',
    key=key,
    code=code,
  )


###############################################################################
# Babel Stuff
###############################################################################
def check_locale(locale):
  locale = locale.lower()
  if locale not in config.LOCALE:
    locale = config.LOCALE_DEFAULT
  return locale if localedata.exists(locale) else 'en'


@babel.localeselector
def get_locale():
  if hasattr(flask.request, 'locale'):
    return flask.request.locale
  locale = flask.session.pop('locale', None)
  if not locale:
    locale = flask.request.cookies.get('locale', None)
    if not locale:
      locale = flask.request.accept_languages.best_match(
          matches=config.LOCALE.keys(),
          default=config.LOCALE_DEFAULT,
        )
  return check_locale(locale)


@flask.request_started.connect_via(application)
def request_started(sender, **extra):
  hl = util.param('hl')
  flask.request.locale = check_locale(hl) if hl else get_locale()
  flask.request.locale_html = flask.request.locale.replace('_', '-')


@flask.request_finished.connect_via(application)
def request_finished(sender, response, **extra):
  if util.param('hl'):
    util.set_locale(check_locale(util.param('hl')), response)


###############################################################################
# Error
###############################################################################
@application.errorhandler(400)  # Bad Request
@application.errorhandler(401)  # Unauthorized
@application.errorhandler(403)  # Forbidden
@application.errorhandler(404)  # Not Found
@application.errorhandler(405)  # Method Not Allowed
@application.errorhandler(406)  # Unsupported Browsers
@application.errorhandler(410)  # Gone
@application.errorhandler(418)  # I'm a Teapot
@application.errorhandler(500)  # Internal Server Error
def error_handler(e):
  try:
    e.code
  except AttributeError:
    e.code = 500
    e.name = 'Internal Server Error'

  handler = logging.StreamHandler()
  application.logger.addHandler(handler)
  application.logger.error('-=' * 40)
  application.logger.error(flask.request.url)
  application.logger.error('-=' * 40)
  application.logger.exception(e)

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
  application.run(host='0.0.0.0', port=8080)
