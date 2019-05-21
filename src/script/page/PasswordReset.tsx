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
import {Runtime, ValidationUtil} from '@wireapp/commons';
import {Button, COLOR, ContainerXS, FlexBox, Form, H1, Input, Text} from '@wireapp/react-ui-kit';
import React, {useContext, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {RouteComponentProps, withRouter} from 'react-router';
import {DirectDownloadButton} from 'script/component/DirectDownloadButton';
import Document from 'script/component/Document';
import {OpenWebappButton} from 'script/component/OpenWebappButton';
import {WebsiteDownloadButton} from 'script/component/WebsiteDownloadButton';
import {BRAND_NAME, NEW_PASSWORD_MINIMUM_LENGTH} from 'script/Environment';
import {ActionContext} from 'script/module/action/actionContext';
import ValidationError from 'script/module/action/ValidationError';

interface Props extends React.HTMLProps<Document>, RouteComponentProps<{}> {}

const HTTP_STATUS_INVALID_LINK = 400;
const HTTP_STATUS_PASSWORD_ALREADY_USED = 409;

const QUERY_CODE_KEY = 'code';
const QUERY_KEY_KEY = 'key';

const PasswordReset = ({location}: Props) => {
  const params = new URLSearchParams(location.search);
  const code = params.get(QUERY_CODE_KEY);
  const key = params.get(QUERY_KEY_KEY);

  const passwordInput = useRef<HTMLInputElement>();
  const [passwordValid, setPasswordValid] = useState(true);
  const [password, setPassword] = useState('');

  const [t] = useTranslation('reset');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const {accountAction} = useContext(ActionContext);
  const completePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setError('');
      const passwordInputNode = passwordInput.current;
      if (!passwordInputNode.checkValidity()) {
        setPasswordValid(passwordInputNode.validity.valid);
        throw ValidationError.handleValidationState(passwordInputNode.name, passwordInputNode.validity);
      }
      await accountAction.completePasswordReset(password, key, code);
      setSuccess(true);
    } catch (error) {
      if (error instanceof ValidationError) {
        const PASSWORD_PATTERN_MISMATCH: string = ValidationError.FIELD.PASSWORD['PATTERN_MISMATCH'];
        const PASSWORD_VALUE_MISSING: string = ValidationError.FIELD.PASSWORD['VALUE_MISSING'];
        switch (error.label) {
          case PASSWORD_VALUE_MISSING:
          case PASSWORD_PATTERN_MISMATCH: {
            setError(t('passwordInfo', {minPasswordLength: NEW_PASSWORD_MINIMUM_LENGTH}));
            break;
          }
          default: {
            setError(t('errorUnknown'));
            console.warn('Failed password reset completion', error);
          }
        }
      } else {
        switch (error.code) {
          case HTTP_STATUS_INVALID_LINK: {
            setError(t('errorInvalidLink'));
            break;
          }
          case HTTP_STATUS_PASSWORD_ALREADY_USED: {
            setError(t('errorPasswordAlreadyUsed'));
            break;
          }
          default: {
            setError(t('errorUnknown'));
            console.warn('Failed password reset completion', error);
          }
        }
      }
    }
  };

  const DesktopSuccess = () => (
    <React.Fragment>
      <Text center>{t('open:description', {company: BRAND_NAME})}</Text>
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
      <Text center>{t('open:description', {company: BRAND_NAME})}</Text>
      <OpenWebappButton style={{margin: '32px 0'}}>{t('open:openWire', {company: BRAND_NAME})}</OpenWebappButton>
    </React.Fragment>
  );
  return (
    <Document>
      <ContainerXS style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto'}}>
        {key && code ? (
          success ? (
            <React.Fragment>
              <H1 center>{t('title')}</H1>
              <Text center style={{margin: '16px 0'}}>
                {t('successDescription')}
              </Text>
              {Runtime.isMobileOS() ? (
                <DirectDownloadButton />
              ) : Runtime.isDesktopOS() ? (
                <DesktopSuccess />
              ) : (
                <UnknownSuccess />
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <H1>{t('title')}</H1>
              <Form onSubmit={completePasswordReset}>
                <Input
                  autoFocus
                  ref={passwordInput}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPasswordValid(true);
                    setPassword(event.currentTarget.value);
                  }}
                  markInvalid={!passwordValid}
                  placeholder={t('passwordPlaceholder')}
                  name="password"
                  type="password"
                  pattern={ValidationUtil.getNewPasswordPattern(NEW_PASSWORD_MINIMUM_LENGTH)}
                  required
                  data-uie-name="enter-new-password"
                />
                {error ? (
                  <Text color={COLOR.RED} center data-uie-name="error-message">
                    {error}
                  </Text>
                ) : (
                  <Text center data-uie-name="element-password-help">
                    {t('passwordInfo', {minPasswordLength: NEW_PASSWORD_MINIMUM_LENGTH})}
                  </Text>
                )}
                <Button type="submit" formNoValidate style={{marginTop: 34}} data-uie-name="do-set-new-password">
                  {t('button')}
                </Button>
              </Form>
            </React.Fragment>
          )
        ) : (
          <React.Fragment>
            <H1>{'Something went wrong'}</H1>
            <Text center>{'Please try again to reset your password.'}</Text>
          </React.Fragment>
        )}
      </ContainerXS>
    </Document>
  );
};

export default withRouter(PasswordReset);
