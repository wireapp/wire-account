/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
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

import * as dotenv from 'dotenv';
import {IHelmetContentSecurityPolicyDirectives as HelmetCSP} from 'helmet';
import * as path from 'path';
import {fileIsReadable, readFile} from './util/FileUtil';

dotenv.config();

const defaultCSP: HelmetCSP = {
  connectSrc: [
    "'self'",
    'blob:',
    'data:',
    'https://wire.com',
    'https://www.google.com',
    'https://*.giphy.com',
    'https://*.unsplash.com',
    'https://apis.google.com',
  ],
  defaultSrc: ["'self'"],
  fontSrc: ["'self'", 'data:'],
  frameSrc: [
    'https://*.soundcloud.com',
    'https://*.spotify.com',
    'https://*.vimeo.com',
    'https://*.youtube-nocookie.com',
    'https://accounts.google.com',
  ],
  imgSrc: [
    "'self'",
    'blob:',
    'data:',
    'https://*.cloudfront.net',
    'https://*.giphy.com',
    'https://1-ps.googleusercontent.com',
    'https://csi.gstatic.com',
  ],
  manifestSrc: [],
  mediaSrc: ["'self'", 'blob:', 'data:', '*'],
  objectSrc: ["'self'", 'https://*.youtube-nocookie.com', 'https://1-ps.googleusercontent.com'],
  prefetchSrc: [],
  scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'https://apis.google.com'],
  styleSrc: ["'self'", "'unsafe-inline'", 'https://*.googleusercontent.com'],
  workerSrc: [],
};

function parseCommaSeparatedList(list: string = ''): string[] {
  const cleanedList = list.replace(/\s/g, '');
  if (!cleanedList) {
    return [];
  }
  return cleanedList.split(',');
}

function mergedCSP(): HelmetCSP {
  const csp: HelmetCSP = {
    connectSrc: [
      ...defaultCSP.connectSrc,
      ...parseCommaSeparatedList(process.env.CSP_EXTRA_CONNECT_SRC),
    ],
    defaultSrc: [...defaultCSP.defaultSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_DEFAULT_SRC)],
    fontSrc: [...defaultCSP.fontSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_FONT_SRC)],
    frameSrc: [...defaultCSP.frameSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_FRAME_SRC)],
    imgSrc: [...defaultCSP.imgSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_IMG_SRC)],
    manifestSrc: [...defaultCSP.manifestSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_MANIFEST_SRC)],
    mediaSrc: [...defaultCSP.mediaSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_MEDIA_SRC)],
    objectSrc: [...defaultCSP.objectSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_OBJECT_SRC)],
    prefetchSrc: [...defaultCSP.prefetchSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_PREFETCH_SRC)],
    scriptSrc: [...defaultCSP.scriptSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_SCRIPT_SRC)],
    styleSrc: [...defaultCSP.styleSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_STYLE_SRC)],
    workerSrc: [...defaultCSP.workerSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_WORKER_SRC)],
  };
  return Object.entries(csp)
    .filter(([key, value]) => !!value.length)
    .reduce((accumulator, [key, value]) => ({...accumulator, [key]: value}), {});
}

export interface ServerConfig {
  APP_BASE: string;
  APP_NAME: string;
  BACKEND_REST: string;
  CACHE_DURATION_SECONDS: number;
  CSP: HelmetCSP;
  DEVELOPMENT?: boolean;
  ENVIRONMENT: string;
  URL: {
    ACCOUNT_DELETE_SURVEY: string;
    DOWNLOAD_ANDROID_BASE: string;
    DOWNLOAD_IOS_BASE: string;
    DOWNLOAD_OSX_BASE: string;
    DOWNLOAD_WINDOWS_BASE: string;
    OPEN_GRAPH_IMAGE: string;
    REDIRECT_PHONE_BASE: string;
    REDIRECT_RESET_BASE: string;
    REDIRECT_VERIFY_BASE: string;
    SUPPORT_BASE: string;
    TEAMS_BASE: string;
    WEBAPP_BASE: string;
    WEBSITE_BASE: string;
  };
  FEATURE: {
    ENABLE_DEBUG: boolean;
  };
  VERSION?: string;
  PORT_HTTP: number;
  PIWIK_HOSTNAME: string;
  PIWIK_ID: string;
  ROBOTS: {
    ALLOWED_HOSTS: string[];
    ALLOW: string;
    DISALLOW: string;
  };
}

const nodeEnvironment = process.env.NODE_ENV || 'production';

const config: ServerConfig = {
  APP_BASE: process.env.APP_BASE,
  APP_NAME: process.env.APP_NAME,
  BACKEND_REST: process.env.BACKEND_REST,
  CACHE_DURATION_SECONDS: 300,
  CSP: mergedCSP(),
  DEVELOPMENT: nodeEnvironment === 'development',
  ENVIRONMENT: nodeEnvironment,
  FEATURE: {
    ENABLE_DEBUG: process.env.FEATURE_ENABLE_DEBUG == 'true' ? true : false,
  },
  URL: {
    ACCOUNT_DELETE_SURVEY: process.env.URL_ACCOUNT_DELETE_SURVEY,
    DOWNLOAD_ANDROID_BASE: process.env.URL_DOWNLOAD_ANDROID_BASE,
    DOWNLOAD_IOS_BASE: process.env.URL_DOWNLOAD_IOS_BASE,
    DOWNLOAD_OSX_BASE: process.env.URL_DOWNLOAD_OSX_BASE,
    DOWNLOAD_WINDOWS_BASE: process.env.URL_DOWNLOAD_WINDOWS_BASE,
    OPEN_GRAPH_IMAGE: process.env.URL_OPEN_GRAPH_IMAGE,
    REDIRECT_PHONE_BASE: process.env.URL_REDIRECT_PHONE_BASE,
    REDIRECT_RESET_BASE: process.env.URL_REDIRECT_RESET_BASE,
    REDIRECT_VERIFY_BASE: process.env.URL_REDIRECT_VERIFY_BASE,
    SUPPORT_BASE: process.env.URL_SUPPORT_BASE,
    TEAMS_BASE: process.env.URL_TEAMS_BASE,
    WEBAPP_BASE: process.env.URL_WEBAPP_BASE,
    WEBSITE_BASE: process.env.URL_WEBSITE_BASE,
  },
  VERSION: undefined,
  PORT_HTTP: Number(process.env.PORT) || 21080,
  PIWIK_HOSTNAME: process.env.PIWIK_HOSTNAME,
  PIWIK_ID: process.env.PIWIK_ID,
  ROBOTS: {
    ALLOW: '',
    ALLOWED_HOSTS: ['account.wire.com'],
    DISALLOW: '',
  },
};

const robotsDir = path.join(__dirname, 'robots');
const robotsAllowFile = path.join(robotsDir, 'robots.txt');
const robotsDisallowFile = path.join(robotsDir, 'robots-disallow.txt');
const versionFile = path.join(__dirname, 'version');

if (fileIsReadable(robotsAllowFile, true)) {
  try {
    config.ROBOTS.ALLOW = readFile(robotsAllowFile, true);
  } catch (error) {}
}

if (fileIsReadable(robotsDisallowFile, true)) {
  try {
    config.ROBOTS.DISALLOW = readFile(robotsDisallowFile, true);
  } catch (error) {}
}

if (fileIsReadable(versionFile, true)) {
  try {
    config.VERSION = readFile(versionFile, true);
  } catch (error) {}
}

export default config;
