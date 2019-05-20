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
import {Button, COLOR, ContainerXS, ContainerXXS, Form, H1, Text, TextLink} from '@wireapp/react-ui-kit';
import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {RouteComponentProps, withRouter} from 'react-router';
import Document from 'script/component/Document';
import {ACCOUNT_DELETE_SURVEY_URL, BRAND_NAME} from 'script/Environment';
import {ActionContext} from 'script/module/action/actionContext';

interface Props extends React.HTMLProps<Document>, RouteComponentProps<{}> {}

const QUERY_CODE_KEY = 'code';
const QUERY_KEY_KEY = 'key';

const DeleteAccount = ({location}: Props) => {
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
    } catch (error) {
      setError(error.toString());
    }
  };
  return (
    <Document>
      <ContainerXS style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto'}}>
        {key && code && !error ? (
          <React.Fragment>
            {success ? (
              <React.Fragment>
                <H1>{t('headline')}</H1>
                <Text center>{t('confirmation', {company: BRAND_NAME})}</Text>
                <Text center style={{marginTop: 16}}>
                  {t('surveyText', {
                    company: BRAND_NAME,
                    link: <TextLink href={ACCOUNT_DELETE_SURVEY_URL}>{t('surveyLink')}</TextLink>,
                  })}
                </Text>
              </React.Fragment>
            ) : (
              <ContainerXXS style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <H1>{t('title')}</H1>
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
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <H1>{t('errorTitle')}</H1>
            <Text center>{t('errorDescription')}</Text>
          </React.Fragment>
        )}
      </ContainerXS>
    </Document>
  );
};

export default withRouter(DeleteAccount);
