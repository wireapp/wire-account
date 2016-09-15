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

from uuid import uuid4
import os

ENV = os.environ.get('ENV', 'localhost')
PRODUCTION = ENV != 'localhost'
DEBUG = DEVELOPMENT = not PRODUCTION

SECRET_KEY = os.environ.get('SECRET_KEY', '2.71828182845904523536028747135266')
ANALYTICS_ID = os.environ.get('ANALYTICS_ID', '')

BACKEND_URL = os.environ.get('BACKEND_URL', 'https://prod-nginz-https.wire.com')
DOWNLOAD_ANDROID_URL = os.environ.get('DOWNLOAD_ANDROID_URL', 'https://play.google.com/store/apps/details?id=com.wire')
DOWNLOAD_IOS_URL = os.environ.get('DOWNLOAD_IOS_URL', 'https://itunes.apple.com/app/wire/id930944768?mt=8')
DOWNLOAD_OSX_URL = os.environ.get('DOWNLOAD_OSX_URL', 'https://itunes.apple.com/app/wire/id931134707?mt=12')
DOWNLOAD_WINDOWS_URL = os.environ.get('DOWNLOAD_WINDOWS_URL', 'https://wire-app.wire.com/win/prod/WireSetup.exe')
REDIRECT_VERIFY_URL = os.environ.get('REDIRECT_VERIFY_URL', 'wire://email-verified')
WEBAPP_URL = os.environ.get('WEBAPP_URL', 'https://app.wire.com')

WIRE_URL = os.environ.get('WIRE_URL', 'https://wire.com')
WIRE_DOWNLOAD_URL = os.environ.get('WIRE_DOWNLOAD_URL', 'https://wire.com/download/')

try:
  with open(os.path.join(os.path.dirname(__file__), 'version')) as version:
    VERSION = version.readline()
except:
  VERSION = 'develop'

EXPIRES_MIMETYPES = [
  'application/javascript',
  'text/css',
  'text/javascript',
]

NOCACHE_MIMETYPES = [
  'text/html',
]
