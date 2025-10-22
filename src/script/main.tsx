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

const ReactPostprocessor = require('i18next-react-postprocessor');
import i18n from 'i18next';
import {createRoot} from 'react-dom/client';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';
import Root from 'script/Root';
import {CommonConfig} from '@wireapp/commons';
import {initializeAPIClient} from './module/action';
const deDE = require('i18n/de-DE.json');
const enUS = require('i18n/en-US.json');
const frFR = require('i18n/fr-FR.json');

i18n
  .use(
    new ReactPostprocessor.default({
      keepUnknownVariables: true,
    }),
  )
  .use(LanguageDetector)
  .use(initReactI18next)
  // See https://www.i18next.com/overview/configuration-options
  .init({
    debug: false,
    detection: {
      lookupQuerystring: CommonConfig.LANGUAGE_QUERY_PARAMETER,
      order: ['querystring', 'header'],
    },
    fallbackLng: {
      de: ['de-DE'],
      default: [CommonConfig.ACCOUNT_PAGES_DEFAULT_LANGUAGE],
      fr: ['fr-FR'],
    },
    interpolation: {
      escapeValue: false,
    },
    postProcess: ['reactPostprocessor'],
    preload: CommonConfig.ACCOUNT_PAGES_SUPPORTED_LANGUAGES,
    resources: {
      ['de-DE']: deDE,
      ['en-US']: enUS,
      ['fr-FR']: frFR,
    },
    returnEmptyString: false,
  });

const render = (Component: any) => {
  const root = createRoot(document.getElementById('main'));
  root.render(<Component />);
};

async function runApp() {
  // Initialize API Client before rendering
  await initializeAPIClient();

  // Now render the app
  render(Root);
  if (module.hot) {
    module.hot.accept('./Root', () => {
      const NextApp = require('./Root').default;
      render(NextApp);
    });
  }
}

runApp();
