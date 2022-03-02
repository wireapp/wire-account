/*
 * Wire
 * Copyright (C) 2022 Wire Swiss GmbH
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

import React from 'react';
import {Runtime} from '@wireapp/commons';
import {pathWithParams} from '@wireapp/commons/src/main/util/UrlUtil';
import {ButtonLink} from '@wireapp/react-ui-kit';
import {DirectDownloadButton} from 'script/component/DirectDownloadButton';
import {WebsiteDownloadButton} from 'script/component/WebsiteDownloadButton';
import {WEBAPP_URL, IS_SELF_HOSTED} from 'script/Environment';

interface OpenWireProps {
  paths: {webapp: string; app: string};
  translate: (key: string, substitutions?: any) => string;
  uieName: string;
}

export const OpenWireButton: React.FC<OpenWireProps> = ({paths, translate, uieName}) => {
  const canJoinInApp = !IS_SELF_HOSTED; // Only public wire cloud can join with native app
  const canJoinInBrowser = !Runtime.isMobileOS();
  const showDownload = !IS_SELF_HOSTED;
  const hasDirectDownload = Runtime.isMobileOS() || Runtime.isMacOS();

  return (
    <>
      {canJoinInApp && (
        <ButtonLink
          href={pathWithParams(`wire://${paths.app}`)}
          style={{marginRight: 16}}
          data-uie-name={`${uieName}-app`}
        >
          {translate('openWithApp')}
        </ButtonLink>
      )}

      {canJoinInBrowser && (
        <ButtonLink
          href={pathWithParams(`${WEBAPP_URL}${paths.webapp}`)}
          style={{marginRight: 16}}
          data-uie-name={`${uieName}-webapp`}
        >
          {translate('openWithBrowser')}
        </ButtonLink>
      )}
      {showDownload &&
        (hasDirectDownload ? (
          <DirectDownloadButton style={{justifyContent: 'center'}}>{translate('downloadApp')}</DirectDownloadButton>
        ) : (
          <WebsiteDownloadButton style={{justifyContent: 'center'}} />
        ))}
    </>
  );
};
