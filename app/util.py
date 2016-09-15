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

import hashlib
import datetime
import re

import flask
import requests

from libs import httpagentparser
import config


###############################################################################
# Request Parameters
###############################################################################
def param(name, cast=None):
  value = None
  if flask.request.json:
    return flask.request.json.get(name, None)

  if value is None:
    value = flask.request.args.get(name, None)
  if value is None and flask.request.form:
    value = flask.request.form.get(name, None)

  if cast and value is not None:
    if cast is bool:
      return value.lower() in ['true', 'yes', 'y', '1', '']
    if cast is list:
      return value.split(',') if len(value) > 0 else []
    return cast(value)
  return value


def update_headers(response):
  # Security
  response.headers['Strict-Transport-Security'] = 'max-age=26280000'
  response.headers['X-Content-Type-Options'] = 'nosniff'
  response.headers['X-Frame-Options'] = 'deny'
  response.headers['X-XSS-Protection'] = '1; mode=block'

  csp_values = ';'.join([
    "connect-src 'self' blob: https://*.wire.com https://wire.com wss://*.wire.com https://*.zinfra.io wss://*.zinfra.io" + ' ws://localhost:35729' if config.DEVELOPMENT else '',
    "font-src 'self' data:",
    "frame-src 'self' https://accounts.google.com https://*.youtube.com https://*.soundcloud.com https://*.vimeo.com https://*.spotify.com",
    "img-src 'self' blob: data: filesystem: https://*.wire.com https://*.zinfra.io http://www.google-analytics.com",
    # Note: The "blob:" attribute needs to be explicitly set for Chrome 47+: https://code.google.com/p/chromium/issues/detail?id=473904
    "media-src blob: data: *",
    "object-src 'self' https://*.youtube.com 1-ps.googleusercontent.com",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.wire.com https://*.zinfra.io http://www.google-analytics.com" + ' http://localhost:35729' if config.DEVELOPMENT else '',
    "style-src 'self' 'unsafe-inline' https://*.wire.com https://*.googleusercontent.com"
  ])

  response.headers['Content-Security-Policy'] = csp_values
  response.headers['X-Content-Security-Policy'] = csp_values
  response.headers['X-Wire'] = 'Great Conversations.'
  response.headers['X-Wire-Version'] = config.VERSION

  if response.mimetype in config.EXPIRES_MIMETYPES:
    expiry_time = datetime.datetime.utcnow() + datetime.timedelta(365)
    response.headers['Expires'] = expiry_time.strftime('%a, %d %b %Y %H:%M:%S GMT')

  if response.mimetype in config.NOCACHE_MIMETYPES:
    response.headers['Cache-Control'] = 'no-cache'

  return response


###############################################################################
# User Agent Stuff
###############################################################################
def user_agent():
  user_agent = flask.request.headers['User-Agent']

  agent = param('agent')
  if agent == 'ipad':
    user_agent = 'Mozilla/5.0 (iPad; CPU OS 7_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D167 Safari/9537.53'
  elif agent == 'iphone':
    user_agent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D167 Safari/9537.53'
  elif agent in ['osx', 'macos']:
    user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1897.8 Safari/537.36'
  elif agent == 'android':
    user_agent = 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 5 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.166 Mobile Safari/537.36'
  elif agent == 'windows':
    user_agent = 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36'
  elif agent == 'linux':
    user_agent = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.115 Safari/537.36'
  elif agent == 'lumia':
    user_agent = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)'
  elif agent == 'nexus7':
    user_agent = 'Mozilla/5.0 (Linux; Android 4.1.1; Nexus 7 Build/JRO03D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166  Safari/535.19'
  elif agent == 'electron':
    user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Wire/2.6.2587 Chrome/49.0.2623.75 Electron/0.37.2 Safari/537.36'
  elif agent == 'googlebot':
    user_agent = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  elif agent:
    user_agent = agent

  agent = httpagentparser.detect(user_agent)

  agent['agent'] = user_agent

  # Electron
  electron_version = ''.join(re.findall(r'Electron/(.*)\ ', user_agent)).strip()
  if electron_version:
    agent['wrapper'] = {
        'name': 'Electron',
        'version': electron_version,
      }

  is_media = {}
  is_media['electron'] = bool(electron_version)
  is_media['wrapper'] = is_media['electron']

  # Google Related
  is_media['android'] = value_exists(agent, 'platform/name', 'android')
  is_media['chrome'] = value_exists(agent, 'browser/name', 'chrome')

  # Apple Related
  is_media['ios'] = value_exists(agent, 'platform/name', 'ios')
  is_media['ipad'] = value_exists(agent, 'dist/name', 'ipad')
  is_media['iphone'] = value_exists(agent, 'dist/name', 'iphone')
  is_media['osx'] = value_exists(agent, 'platform/name', 'mac')
  is_media['safari'] = value_exists(agent, 'browser/name', 'safari')

  # Microsoft Related
  is_media['ie'] = value_exists(agent, 'browser/name', 'microsoft internet explorer')
  is_media['windows_phone'] = value_exists(agent, 'os/name', 'windows phone')
  is_media['windows'] = not is_media['windows_phone'] and value_exists(agent, 'platform/name', 'windows')

  # Misc
  is_media['linux'] = value_exists(agent, 'platform/name', 'linux')
  is_media['opera'] = value_exists(agent, 'browser/name', 'opera')
  is_media['blackberry'] = value_exists(agent, 'platform/name', 'blackberry')
  is_media['firefox'] = value_exists(agent, 'browser/name', 'firefox')

  # Tablets
  is_media['android_tablet'] = is_media['android'] and user_agent.lower().find('mobile') == -1
  is_media['blackberry_tablet'] = is_media['blackberry'] and user_agent.lower().find('tablet') >= 0

  # Device Type
  is_media['tablet'] = is_media['ipad'] or is_media['android_tablet'] or is_media['blackberry_tablet']
  is_media['phone'] = not is_media['tablet'] and (is_media['ios'] or is_media['android'] or is_media['windows_phone'] or is_media['blackberry'])
  is_media['mobile'] = is_media['phone'] or is_media['tablet']
  is_media['desktop'] = not is_media['mobile']

  is_media['bingbot'] = user_agent.lower().find('bingbot') >= 0
  is_media['googlebot'] = user_agent.lower().find('googlebot') >= 0
  is_media['yahoobot'] = user_agent.lower().find('yahoo') >= 0
  is_media['crawler'] = is_media['bingbot'] or is_media['googlebot'] or is_media['yahoobot']

  agent['is'] = is_media

  return agent


def value_exists(obj, path, value):
  try:
    content = obj
    for key in path.split('/'):
      content = content[key]
    return content.lower().find(value.lower()) >= 0
  except:
    return False


def track_event_to_ga(category, action, label=None, value=None):
  if not config.ANALYTICS_ID:
    return 0
  data = {
    'v': '1',
    'tid': config.ANALYTICS_ID,
    'cid': hashlib.md5('%s%s' % (flask.request.remote_addr, config.VERSION)).hexdigest(),
    't': 'event',
    'ec': category,
    'ea': action,
    'el': label,
    'ev': value,
  }
  result = requests.post(
    'https://www.google-analytics.com/collect',
    data=data,
    headers={'Content-Type': 'application/x-www-form-urlencoded'},
  )
  return result.status_code
