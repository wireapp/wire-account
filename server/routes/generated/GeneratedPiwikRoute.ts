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

import {Router} from 'express';

import {ServerConfig} from '../../ServerConfig';

const GeneratedPiwikRoute = (config: ServerConfig) => {
  return Router().get('/generated/piwik.js', (req, res) => {
    let response = '';

    if (typeof config.PIWIK_HOSTNAME === 'string' && config.PIWIK_ID) {
      response = `
      var _paq = _paq || [];
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      (function() {
        var u = '${config.PIWIK_HOSTNAME.replace(/\/$/g, '')}/';
        _paq.push(['setTrackerUrl', u+'piwik.php']);
        _paq.push(['setSiteId', ${config.PIWIK_ID}]);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
      })();
      `;
    } else {
      response = '// No Piwik ID or Piwik hostname defined.';
    }

    res.type('application/javascript').send(response);
  });
};

export default GeneratedPiwikRoute;
