/*
 * Wire
 * Copyright (C) 2021 Wire Swiss GmbH
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
import {ContainerSM, FlexBox, H2, QUERY, QueryKeys, Text, useMatchMedia} from '@wireapp/react-ui-kit';
import {useTranslation} from 'react-i18next';
import {useLocation} from 'react-router-dom';
import Document from 'script/component/Document';
import {OpenWireButtons} from 'script/component/OpenWireButtons';
import {BRAND_NAME} from 'script/Environment';

const USER_ID_KEY = 'id';

export const UserProfile = () => {
  const location = useLocation();
  const [t] = useTranslation('userProfile');
  const isMobile = useMatchMedia(QUERY[QueryKeys.TABLET_DOWN]);

  const params = new URLSearchParams(location.search);
  const idParam = params.get(USER_ID_KEY);

  let userId = '';
  let domain = '';

  if (idParam) {
    const [uid, dom] = idParam.split('@');
    userId = uid;
    domain = dom || ''; // domain is optional
  } else {
    console.error('Invalid or missing id parameter in URL');
  }

  const app = domain ? `user/${domain}/${userId}` : `user/${userId}`;
  const webapp = domain ? `/#/user/${domain}/${userId}` : `/#/user/${userId}`;

  return (
    <Document>
      <ContainerSM css={{margin: 'auto 0'}}>
        <>
          <H2 style={{fontWeight: 500, marginBottom: 40, marginTop: '0'}}>{t('title', {brandName: BRAND_NAME})}</H2>
          <Text block>{t('description')}</Text>
          <FlexBox column={isMobile} css={{marginTop: 24}}>
            <OpenWireButtons translate={t} uieName="open-user-profile" paths={{app, webapp}} />
          </FlexBox>
        </>
      </ContainerSM>
    </Document>
  );
};

export default UserProfile;
