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
import {Button, ButtonLink, ContainerXS, ErrorMessage, Form, H1, Input, Text} from '@wireapp/react-ui-kit';
import React, {useContext, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {WEBAPP_URL} from 'script/Environment';
import Document from 'script/component/Document';
import {ActionContext} from 'script/module/action';
import ValidationError from 'script/module/action/ValidationError';

const HTTP_STATUS_EMAIL_ALREADY_SENT = 409;

const PasswordForgot = () => {
  const emailInput = useRef<HTMLInputElement>();
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [t] = useTranslation('forgot');
  const {accountAction} = useContext(ActionContext);
  const initiatePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setError('');
      const emailInputNode = emailInput.current;
      emailInputNode.value = emailInputNode.value.trim();
      if (!emailInputNode.checkValidity()) {
        setIsEmailValid(emailInputNode.validity.valid);
        throw ValidationError.handleValidationState(emailInputNode.name, emailInputNode.validity);
      }
      await accountAction.initiatePasswordReset(emailInputNode.value);
      setSuccess(true);
    } catch (error) {
      if (error instanceof ValidationError) {
        const EMAIL_PATTERN_MISMATCH: string = ValidationError.FIELD.EMAIL.TYPE_MISMATCH;
        const EMAIL_VALUE_MISSING: string = ValidationError.FIELD.EMAIL.VALUE_MISSING;
        switch (error.label) {
          case EMAIL_VALUE_MISSING:
          case EMAIL_PATTERN_MISMATCH: {
            setError(t('errorInvalidEmail'));
            break;
          }
          default: {
            setError(t('errorUnknown'));
            console.warn('Failed email validation', error);
          }
        }
      } else {
        switch (error.code) {
          case HTTP_STATUS_EMAIL_ALREADY_SENT: {
            setError(t('errorAlreadyProcessing'));
            break;
          }
          default: {
            setError(t('errorUnknown'));
            console.warn('Failed to initiate password reset', error);
          }
        }
      }
    }
  };
  return (
    <Document>
      <ContainerXS style={{alignItems: 'center', display: 'flex', flexDirection: 'column', margin: 'auto'}}>
        {success ? (
          <React.Fragment>
            <H1>{t('successTitle')}</H1>
            <Text center>{t('successDescription')}</Text>
            <ButtonLink href={`${WEBAPP_URL}/auth`} css={{marginTop: 40}} data-uie-name="do-go-back-to-login">
              {t('login')}
            </ButtonLink>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <H1>{t('title')}</H1>
            <Text center>{t('description')}</Text>
            <Form css={{marginTop: 40}} onSubmit={initiatePasswordReset}>
              <Input
                required
                ref={emailInput}
                markInvalid={!isEmailValid}
                autoFocus
                onChange={event => {
                  setIsEmailValid(true);
                  setEmail(event.currentTarget.value);
                }}
                placeholder={t('emailPlaceholder')}
                label={t('emailPlaceholder')}
                name="email"
                type="email"
                data-uie-name="enter-email"
                error={error && <ErrorMessage>{error}</ErrorMessage>}
              />
              <Button
                type="submit"
                formNoValidate
                disabled={!email}
                style={{marginTop: 16}}
                data-uie-name="do-send-password-reset-email"
              >
                {t('button')}
              </Button>
            </Form>
          </React.Fragment>
        )}
      </ContainerXS>
    </Document>
  );
};

export default PasswordForgot;
