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

export interface ServerConfig {
  CLIENT: {
    APP_NAME: string;
    BACKEND_REST: string;
    BRAND_NAME: string;
    ENVIRONMENT: string;
    FEATURE: {
      ENABLE_DEBUG: boolean;
    };
    NEW_PASSWORD_MINIMUM_LENGTH: number;
    /** true if the server is not a wire public cloud instance */
    IS_SELF_HOSTED: boolean;
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
    COUNTLY_SERVER_URL: string;
    COUNTLY_API_KEY: string;
    VERSION: string;
  };
  COMMIT: string;
  SERVER: {
    APP_BASE: string;
    CACHE_DURATION_SECONDS: number;
    CSP: Record<string, Iterable<string>>;
    ENFORCE_HTTPS: boolean;
    ENVIRONMENT: string;
    SSL_CERTIFICATE_KEY_PATH?: string;
    SSL_CERTIFICATE_PATH?: string;
    PORT_HTTP: number;
    ROBOTS: {
      ALLOWED_HOSTS: string[];
      ALLOW: string;
      DISALLOW: string;
    };
  };
}
