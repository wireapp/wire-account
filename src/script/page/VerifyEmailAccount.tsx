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
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {DirectDownloadButton} from 'script/component/DirectDownloadButton';
import Document from 'script/component/Document';
import {OpenWebappButton} from 'script/component/OpenWebappButton';
import {WebsiteDownloadButton} from 'script/component/WebsiteDownloadButton';
import {BRAND_NAME, REDIRECT_VERIFY_URL, WEBAPP_URL} from 'script/Environment';
import {ActionContext} from 'script/module/action';

interface Props extends React.HTMLProps<Document>, RouteComponentProps<{}> {}

const QUERY_CODE_KEY = 'code';
const QUERY_KEY_KEY = 'key';

const VerifyEmailAccount = ({location}: Props) => {
  const params = new URLSearchParams(location.search);
  const code = params.get(QUERY_CODE_KEY);
  const key = params.get(QUERY_KEY_KEY);

  const [t] = useTranslation('verify');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const {accountAction} = useContext(ActionContext);
  const redirectPhone = (Runtime.isAndroid() || Runtime.isIOS()) && REDIRECT_VERIFY_URL;
  const loginImmediately = !Runtime.isDesktopOS();
  useEffect(() => {
    accountAction
      .verifyEmail(key, code)
      .then(() => setSuccess(true))
      .catch(error => {
        console.warn('Failed to verify email account', error);
        setError(error.toString());
      });
  }, []);

  const MobileSuccess = () => (
    <>
      <Text center>{t('successEmailAppDescription', {company: BRAND_NAME})}</Text>
      <DirectDownloadButton style={{margin: '32px 0'}} />
      {/* The link element is for QA to detect wire protocol redirects */}
      <link id="url" data-redirect={redirectPhone} />
      {redirectPhone && window.location.assign(redirectPhone)}
    </>
  );

  const DesktopSuccess = () => (
    <>
      <Text center>{t('open:description', {company: BRAND_NAME})}</Text>
      <FlexBox style={{margin: '32px 0'}}>
        {Runtime.isMacOS() ? (
          <DirectDownloadButton style={{marginRight: 8}} />
        ) : (
          <WebsiteDownloadButton style={{marginRight: 8}} />
        )}
        <OpenWebappButton style={{marginLeft: 8}}>{t('open:openWeb')}</OpenWebappButton>
      </FlexBox>
      {loginImmediately && window.location.assign(`${WEBAPP_URL}/auth/?immediate_login#login`)}
    </>
  );

  const UnknownSuccess = () => (
    <>
      <Text center>{t('open:description', {company: BRAND_NAME})}</Text>
      <OpenWebappButton style={{margin: '32px 0'}}>{t('open:openWire', {company: BRAND_NAME})}</OpenWebappButton>
    </>
  );

  return (
    <Document>
      <ContainerXS style={{alignItems: 'center', display: 'flex', flexDirection: 'column', margin: 'auto'}}>
        {key && code && !error ? (
          success ? (
            <>
              <H1 data-uie-name="verify-email-success-headline">{t('successEmailTitle')}</H1>
              {Runtime.isMobileOS() ? (
                <MobileSuccess />
              ) : Runtime.isDesktopOS() ? (
                <DesktopSuccess />
              ) : (
                <UnknownSuccess />
              )}
            </>
          ) : (
            <Loading />
          )
        ) : (
          <>
            <H1>{'Something went wrong'}</H1>
            <Text center>{'Please try to create your account again.'}</Text>
          </>
        )}
      </ContainerXS>
    </Document>
  );
};

export default withRouter(VerifyEmailAccount);
