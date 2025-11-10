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

import {HeaderMenu, MenuLink} from '@wireapp/react-ui-kit';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Link as RRLink} from 'react-router-dom';
import {SUPPORT_URL, BRAND_NAME} from 'script/Environment';
import {ROUTE} from 'script/route';
import SVGProvider from 'script/util/SVGProvider';
import {pathWithParams} from 'script/util/urlUtil';

interface Props extends React.HTMLProps<Document> {}

const Header: React.FC<Props> = ({}) => {
  const [t] = useTranslation('header');
  const headerLogo = (
    <RRLink to={pathWithParams(ROUTE.HOME)} title={BRAND_NAME}>
      <span dangerouslySetInnerHTML={{__html: SVGProvider.logo}} />
    </RRLink>
  );
  return (
    <HeaderMenu logoElement={headerLogo} menuOpen={t('menuOpen')} menuClose={t('menuClose')}>
      <MenuLink rel="noopener noreferrer" target="_blank" href={SUPPORT_URL} data-uie-name="go-support-header">
        {t('support')}
      </MenuLink>
    </HeaderMenu>
  );
};

export default Header;
