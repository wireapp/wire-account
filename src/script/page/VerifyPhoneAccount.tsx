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
import {ContainerXS, H1, Text} from '@wireapp/react-ui-kit';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import Document from 'script/component/Document';
import {OpenWebappButton} from 'script/component/OpenWebappButton';
import {BRAND_NAME, REDIRECT_PHONE_URL} from 'script/Environment';

const VerifyPhoneAccount = () => {
  const {code} = useParams();

  const [t] = useTranslation('verify');
  const redirectPhone = `${REDIRECT_PHONE_URL}/${code}`;
  const OpenAppButton = () => (
    <OpenWebappButton href={redirectPhone} style={{margin: '32px 0'}} data-uie-name="go-verify-phone">
      {t('open:openWire', {company: BRAND_NAME})}
    </OpenWebappButton>
  );
  window.location.assign(redirectPhone);
  return (
    <Document>
      <ContainerXS style={{alignItems: 'center', display: 'flex', flexDirection: 'column', margin: 'auto'}}>
        <H1 center>{t('successPhoneDescription')}</H1>
        <Text center>{t('open:description', {company: BRAND_NAME})}</Text>
        <OpenAppButton />
        {/* The link element is for QA to detect wire protocol redirects */}
        <link id="url" data-redirect={redirectPhone} />
      </ContainerXS>
    </Document>
  );
};

export default VerifyPhoneAccount;
