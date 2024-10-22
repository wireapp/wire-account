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

export enum QUERY_KEY {
  CONVERSATION_CODE = 'join_code',
  CONVERSATION_KEY = 'join_key',
  CURRENCY = 'currency',
  EMAIL = 'email',
  HIDE_SSO = 'hide_sso',
  IMMEDIATE_LOGIN = 'immediate_login',
  JOIN_EXPIRES = 'expires_in',
  LANGUAGE = 'hl',
  LOCALE = 'hl',
  LOGOUT_REASON = 'reason',
  PWA_AWARE = 'pwa_aware',
  TRACKING = 'tracking',
  LANG = 'hl',
  TEAM_CODE = 'team_code',
}

const FORWARDED_QUERY_KEYS = [QUERY_KEY.LOCALE, QUERY_KEY.TRACKING];

function pathWithParams(path: string, additionalParams?: string, whitelistParams = FORWARDED_QUERY_KEYS) {
  const searchParams = window.location.search
    .replace(/^\?/, '')
    .split('&')
    .filter(searchParam => !!searchParam)
    .filter(searchParam => {
      const [paramName] = searchParam.split('=') as QUERY_KEY[];
      return !whitelistParams || whitelistParams.includes(paramName);
    });

  if (additionalParams) {
    searchParams.push(additionalParams);
  }
  const joinedParams = searchParams.join('&');
  return `${path}${joinedParams.length ? `?${joinedParams}` : ''}`;
}

function getURLParameter(parameterName: QUERY_KEY) {
  return (window.location.search.split(`${parameterName}=`)[1] || '').split('&')[0];
}

function hasURLParameter(parameterName: QUERY_KEY) {
  return window.location.search
    .split(/\?|&/)
    .map(parameter => parameter.split('=')[0])
    .includes(parameterName);
}

function secureOpen(url: string) {
  const newWindow = window.open();
  newWindow.opener = null;
  newWindow.location.assign(url);
  return newWindow;
}

export {FORWARDED_QUERY_KEYS, pathWithParams, getURLParameter, hasURLParameter, secureOpen};
