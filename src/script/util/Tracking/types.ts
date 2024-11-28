/*
 * Wire
 * Copyright (C) 2024 Wire Swiss GmbH
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

export enum EventName {
  USER_MIGRATION_LOGIN = 'user.migration_login',
  USER_MIGRATION_CONFIRMATION = 'user.migration_confirmation',
  USER_MIGRATION_TERMS_ACKNOWLEDGEMENT = 'user.migration_terms_acknowledgement',
  USER_MIGRATION_WELCOME = 'user.migration_welcome',
}

export enum SegmentationKey {
  APP = 'app',
  APP_VERSION = 'app_version',
  STEP = 'step',
}

export enum SegmentationValue {
  OPENED = 'opened',
  EMAIL_ENTERED = 'email_entered',
  PASSWORD_ENTERED = 'password_entered',
  CONTINUE_CLICKED = 'continue_clicked',
  PASSWORD_FORGOTTEN = 'password_forgotten',
  AGREE_MIGRATION_TERMS_CHECK = 'agree_migration_terms_check',
  AGREE_TOC_CHECK = 'agree_toc_checked',
  OPENED_WEB_APP = 'opened_web_app',
  OPENED_TM = 'opened_tm',
}
