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

import {DEFAULT_PASSWORD_MIN_LENGTH} from '@wireapp/commons/lib/util/ValidationUtil';

declare global {
  interface Window {
    wire: {
      env: {
        APP_BASE: string;
        APP_NAME: string;
        BACKEND_REST: string;
        IS_SELF_HOSTED: boolean;
        BACKEND_WS: string;
        BRAND_NAME: string;
        ENVIRONMENT: string;
        NEW_PASSWORD_MINIMUM_LENGTH: number;
        RAYGUN_API_KEY: string;
        STRIPE_API_KEY: string;
        COUNTLY_SERVER_URL: string;
        COUNTLY_API_KEY: string;
        URL: {
          ACCOUNT_DELETE_SURVEY: string;
          DOWNLOAD_ANDROID_BASE: string;
          DOWNLOAD_IOS_BASE: string;
          DOWNLOAD_OSX_BASE: string;
          DOWNLOAD_WINDOWS_BASE: string;
          IMPRINT: string;
          OPEN_GRAPH_IMAGE: string;
          REDIRECT_CONVERSATION_JOIN_BASE: string;
          REDIRECT_RESET_BASE: string;
          REDIRECT_START_SSO_BASE: string;
          REDIRECT_VERIFY_BASE: string;
          SUPPORT_BASE: string;
          TEAMS_BASE: string;
          WEBAPP_BASE: string;
          WEBSITE_BASE: string;
          URL_TERMS_OF_USE_TEAMS: string;
          URL_SUPPORT_BACKUP_HISTORY: string;
        };
        VERSION: string;
        FEATURE: {
          ENABLE_DEBUG: boolean;
          ENABLE_DEV_BACKEND_API: boolean;
        };
      };
    };
  }
}

window.wire = window.wire || ({} as any);
window.wire.env = window.wire.env || ({} as any);
window.wire.env.URL = window.wire.env.URL || ({} as any);
window.wire.env.FEATURE = window.wire.env.FEATURE || ({} as any);

export function isEnvironment(environment: string) {
  return window.wire.env.ENVIRONMENT === String(environment).toLowerCase();
}

export const DEFAULT_TRANSITION_DURATION = 300;

export const APP_BASE = window.wire.env.APP_BASE;
export const APP_NAME = window.wire.env.APP_NAME;
export const BRAND_NAME = window.wire.env.BRAND_NAME;
export const FEATURE_ENABLE_DEBUG = window.wire.env.FEATURE.ENABLE_DEBUG;
export const HOST_HTTP = window.wire.env.BACKEND_REST;
export const IS_SELF_HOSTED = window.wire.env.IS_SELF_HOSTED;
export const NEW_PASSWORD_MINIMUM_LENGTH = window.wire.env.NEW_PASSWORD_MINIMUM_LENGTH || DEFAULT_PASSWORD_MIN_LENGTH;
export const VERSION = window.wire.env.VERSION;

export const ENABLE_DEV_BACKEND_API = window.wire.env.FEATURE.ENABLE_DEV_BACKEND_API;
export const SUPPORTED_API_RANGE = [1, window.wire.env.FEATURE.ENABLE_DEV_BACKEND_API ? Infinity : 11];

// URLs
export const ACCOUNT_DELETE_SURVEY_URL = window.wire.env.URL.ACCOUNT_DELETE_SURVEY;
export const WEBAPP_URL = window.wire.env.URL.WEBAPP_BASE;
export const DOWNLOAD_ANDROID_URL = window.wire.env.URL.DOWNLOAD_ANDROID_BASE;
export const DOWNLOAD_IOS_URL = window.wire.env.URL.DOWNLOAD_IOS_BASE;
export const DOWNLOAD_OSX_URL = window.wire.env.URL.DOWNLOAD_OSX_BASE;
export const DOWNLOAD_WINDOWS_URL = window.wire.env.URL.DOWNLOAD_WINDOWS_BASE;
export const IMPRINT_URL = window.wire.env.URL.IMPRINT;
export const OPEN_GRAPH_IURL = window.wire.env.URL.OPEN_GRAPH_IMAGE;
export const WIRE_APP_SCHEME = 'wire://';
export const REDIRECT_RESET_URL = window.wire.env.URL.REDIRECT_RESET_BASE;
export const REDIRECT_START_SSO_URL = window.wire.env.URL.REDIRECT_START_SSO_BASE;
export const REDIRECT_VERIFY_URL = window.wire.env.URL.REDIRECT_VERIFY_BASE;
export const SUPPORT_URL = window.wire.env.URL.SUPPORT_BASE;
export const TEAMS_URL = window.wire.env.URL.TEAMS_BASE;
export const WEBSITE_URL = window.wire.env.URL.WEBSITE_BASE;
export const URL_SUPPORT_BACKUP_HISTORY = window.wire.env.URL.URL_SUPPORT_BACKUP_HISTORY;
export const URL_TERMS_OF_USE_TEAMS = window.wire.env.URL.URL_TERMS_OF_USE_TEAMS;
export const COUNTLY_SERVER_URL = window.wire.env.COUNTLY_SERVER_URL;
export const COUNTLY_API_KEY = window.wire.env.COUNTLY_API_KEY;
