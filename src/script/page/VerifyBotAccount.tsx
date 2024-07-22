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
import {Runtime} from '@wireapp/commons';
import {ContainerXS, FlexBox, H1, Loading, Text} from '@wireapp/react-ui-kit';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {DirectDownloadButton} from 'script/component/DirectDownloadButton';
import Document from 'script/component/Document';
import {OpenWebappButton} from 'script/component/OpenWebappButton';
import {WebsiteDownloadButton} from 'script/component/WebsiteDownloadButton';
import {BRAND_NAME, REDIRECT_VERIFY_URL, WEBAPP_URL} from 'script/Environment';
import {ActionContext} from 'script/module/action';

const QUERY_CODE_KEY = 'code';
const QUERY_KEY_KEY = 'key';

const VerifyBotAccount = () => {
  const params = new URLSearchParams(location.search);
  const code = params.get(QUERY_CODE_KEY);
  const key = params.get(QUERY_KEY_KEY);

  const [t] = useTranslation('verify');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const {accountAction} = useContext(ActionContext);
  const redirectPhone = (Runtime.isAndroid() || Runtime.isIOS()) && REDIRECT_VERIFY_URL;
  const loginImmediately = !Runtime.isDesktopOS();

  if (redirectPhone) {
    window.location.assign(redirectPhone);
  }

  if (loginImmediately) {
    window.location.assign(`${WEBAPP_URL}/auth/?immediate_login#login`);
  }

  useEffect(() => {
    accountAction
      .verifyBot(key, code)
      .then(() => setSuccess(true))
      .catch(error => {
        console.warn('Failed to verify bot account', error);
        setError(error.toString());
      });
  }, []);

  const MobileSuccess = () => (
    <React.Fragment>
      <DirectDownloadButton style={{margin: '32px 0'}} />
    </React.Fragment>
  );

  const DesktopSuccess = () => (
    <React.Fragment>
      <FlexBox style={{margin: '32px 0'}}>
        {Runtime.isMacOS() ? (
          <DirectDownloadButton style={{marginRight: 8}} />
        ) : (
          <WebsiteDownloadButton style={{marginRight: 8}} />
        )}
        <OpenWebappButton style={{marginLeft: 8}}>{t('open:openWeb')}</OpenWebappButton>
      </FlexBox>
    </React.Fragment>
  );

  const UnknownSuccess = () => (
    <React.Fragment>
      <OpenWebappButton>{t('open:openWire', {company: BRAND_NAME})}</OpenWebappButton>
    </React.Fragment>
  );
  return (
    <Document>
      <ContainerXS style={{alignItems: 'center', display: 'flex', flexDirection: 'column', margin: 'auto'}}>
        {key && code && !error ? (
          success ? (
            <React.Fragment>
              <H1 center>{t('successBotTitle')}</H1>
              <Text center>{t('successBotDescription', {company: BRAND_NAME})}</Text>
              <Text center style={{marginTop: 16}}>
                {t('successBotDescriptionEmail')}
              </Text>
              {Runtime.isMobileOS() ? (
                <MobileSuccess />
              ) : Runtime.isDesktopOS() ? (
                <DesktopSuccess />
              ) : (
                <UnknownSuccess />
              )}
            </React.Fragment>
          ) : (
            <Loading />
          )
        ) : (
          <React.Fragment>
            <H1>{'Something went wrong'}</H1>
            <Text center>{'Please try to create your service account again.'}</Text>
          </React.Fragment>
        )}
      </ContainerXS>
    </Document>
  );
};

export default VerifyBotAccount;
