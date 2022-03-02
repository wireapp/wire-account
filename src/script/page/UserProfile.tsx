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
import React from 'react';
import {useTranslation} from 'react-i18next';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import Document from 'script/component/Document';
import {OpenWireButton} from 'script/component/OpenWireButtons';
import {BRAND_NAME} from 'script/Environment';

export interface UserProfileProps extends React.HTMLProps<Document>, RouteComponentProps<{}> {}

const USER_ID_KEY = 'id';

export const UserProfile = ({location}: UserProfileProps) => {
  const [t] = useTranslation('userProfile');
  const isMobile = useMatchMedia(QUERY[QueryKeys.TABLET_DOWN]);

  const params = new URLSearchParams(location.search);
  const userId = params.get(USER_ID_KEY);

  return (
    <Document>
      <ContainerSM css={{margin: 'auto 0'}}>
        <>
          <H2 style={{fontWeight: 500, marginBottom: 40, marginTop: '0'}}>{t('title', {brandName: BRAND_NAME})}</H2>
          <Text block>{t('description')}</Text>
          <FlexBox column={isMobile} css={{marginTop: 24}}>
            <OpenWireButton
              translate={t}
              uieName="open-user-profile"
              paths={{app: `user/${userId}`, webapp: `/#/user/${userId}`}}
            />
          </FlexBox>
        </>
      </ContainerSM>
    </Document>
  );
};

export default withRouter(UserProfile);
