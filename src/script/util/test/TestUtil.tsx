/*
 * Wire
 * Copyright (C) 2020 Wire Swiss GmbH
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

import {mount} from 'enzyme';
import React from 'react';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {StyledApp, THEME_ID} from '@wireapp/react-ui-kit';
import {createMemoryHistory, History} from 'history';
import {Router} from 'react-router';
const enUS = require('i18n/en-US.json');

export const withRouter = (component: React.ReactElement, history: History) => (
  <Router history={history}>{component}</Router>
);

export const withTheme = (component: React.ReactElement): React.ReactElement => (
  <StyledApp themeId={THEME_ID.DEFAULT}>{component}</StyledApp>
);

export const withTranslations = (component: React.ReactElement): React.ReactElement => {
  i18n.use(initReactI18next).init({
    fallbackLng: 'en-US',
    lng: 'en-US',
    preload: ['en-US'],
    resources: {
      ['en-US']: enUS,
    },
  });
  return component;
};

export const mountComponent = (component: React.ReactElement, history: History = createMemoryHistory()) =>
  mount(withTranslations(withTheme(withRouter(component, history))));
