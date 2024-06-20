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
import {Button, COLOR, ContainerSM, ContainerXS, ContainerXXS, Form, H1, Text, TextLink} from '@wireapp/react-ui-kit';
import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useLocation} from 'react-router-dom';
import Document from 'script/component/Document';
import {ACCOUNT_DELETE_SURVEY_URL, BRAND_NAME} from 'script/Environment';
import {ActionContext} from 'script/module/action';

const QUERY_CODE_KEY = 'code';
const QUERY_KEY_KEY = 'key';

const DeleteAccount = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const code = params.get(QUERY_CODE_KEY);
  const key = params.get(QUERY_KEY_KEY);

  const [t] = useTranslation('delete');
  const {accountAction} = useContext(ActionContext);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const deleteAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setError('');
      await accountAction.delete(key, code);
      setSuccess(true);
    } catch (deleteError) {
      console.warn('Failed to delete account', deleteError);
      setError(deleteError.toString());
    }
  };
  return (
    <Document>
      <ContainerSM style={{alignItems: 'center', display: 'flex', flexDirection: 'column', margin: 'auto'}}>
        {key && code && !error ? (
          <React.Fragment>
            {success ? (
              <React.Fragment>
                <H1 data-uie-name="successful-delete-account-headline">{t('headline')}</H1>
                <Text center data-uie-name="delete-account-confirmation">
                  {t('confirmation', {company: BRAND_NAME})}
                </Text>
                <Text center style={{marginTop: 16}}>
                  {t('surveyText', {
                    br: <br />,
                    company: BRAND_NAME,
                    link: <TextLink href={ACCOUNT_DELETE_SURVEY_URL}>{t('surveyLink')}</TextLink>,
                  })}
                </Text>
              </React.Fragment>
            ) : (
              <ContainerXS style={{alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
                <H1>{t('title')}</H1>
                <ContainerXXS style={{alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
                  <Text center>{t('greeting')}</Text>
                  <Text center>{t('description', {company: BRAND_NAME})}</Text>
                  <Form onSubmit={deleteAccount}>
                    <Button
                      type="submit"
                      data-uie-name="do-delete-account"
                      backgroundColor={COLOR.RED}
                      style={{marginTop: 34}}
                    >
                      {t('button')}
                    </Button>
                  </Form>
                  <Text center style={{marginTop: 24}}>
                    {t('resetText', {link: <TextLink>{t('resetLink', {company: BRAND_NAME})}</TextLink>})}
                  </Text>
                </ContainerXXS>
              </ContainerXS>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <H1 data-uie-name="error-title">{t('errorTitle')}</H1>
            <Text center data-uie-name="error-text">
              {t('errorDescription')}
            </Text>
          </React.Fragment>
        )}
      </ContainerSM>
    </Document>
  );
};

export default DeleteAccount;
