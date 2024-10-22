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

import * as Environment from 'script/Environment';

const EXTERNAL_ROUTE = {
  ACCOUNT_DELETE_SURVEY_URL: Environment.ACCOUNT_DELETE_SURVEY_URL,
  APP_WIRE: Environment.WEBAPP_URL,
  TEAM_SETTINGS: Environment.TEAMS_URL,
  TERMS_OF_USE_TEAMS: Environment.URL_TERMS_OF_USE_TEAMS,
  SUPPORT_BACKUP_HISTORY: Environment.URL_SUPPORT_BACKUP_HISTORY,
};

const ROUTE = {
  CONVERSATION_JOIN: '/conversation-join',
  DELETE_ACCOUNT: '/d',
  HOME: '/',
  PASSWORD_FORGOT: '/forgot',
  PASSWORD_FORGOT_BOT: '/forgot/bot',
  PASSWORD_RESET: '/reset',
  PASSWORD_RESET_BOT: '/reset/bot',
  USER_PROFILE: '/user-profile',
  VERIFY_ACCOUNT_BOT: '/verify/bot',
  VERIFY_ACCOUNT_EMAIL: '/verify',
  ACCEPT_INVITATION: '/accept-invitation',
  TERMS_ACKNOWLEDGEMENT: '/migration/terms-acknowledgement',
  CONFIRM_INVITATION: '/migration/confirm-invitation',
  WELCOME: '/migration/welcome',
};

export {ROUTE, EXTERNAL_ROUTE};
