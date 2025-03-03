/*
 * Wire
 * Copyright (C) 2024 Wire Swiss GmbH
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

import {
  Button,
  ErrorMessage,
  Form,
  Input,
  Link,
  Logo,
  QUERY,
  QueryKeys,
  Text,
  useMatchMedia,
} from '@wireapp/react-ui-kit';
import {MigrationLayout} from 'script/layout/MigrationLayout';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {ROUTE} from 'script/route';
import React, {FormEvent, useEffect, useState} from 'react';
import {QUERY_KEY} from 'script/util/urlUtil';
import {loginContainerCss, loginSubHeaderCss, headerCss, buttonCss, forgotPasswordCss} from './styles';
import {getTeamInvitationCode, setTeamInvitationCode} from './utils';
import {useTranslation} from 'react-i18next';
import {LoginData} from '@wireapp/api-client/lib/auth';
import {ClientType} from '@wireapp/api-client/lib/client';
import {useActionContext} from 'script/module/action';
import {reportEvent} from 'script/util/Tracking/Tracking';
import {EventName, SegmentationKey, SegmentationValue} from 'script/util/Tracking/types';

export const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const {accountAction} = useActionContext();
  const [t] = useTranslation(['migration']);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isTablet = useMatchMedia(QUERY[QueryKeys.TABLET_DOWN]);
  const code = searchParams.get(QUERY_KEY.TEAM_CODE);
  const cachedCode = getTeamInvitationCode();

  const trackEvent = (step: SegmentationValue) => {
    reportEvent(EventName.USER_MIGRATION_LOGIN, {
      [SegmentationKey.STEP]: step,
    });
  };

  useEffect(() => {
    trackEvent(SegmentationValue.OPENED);

    if (!code && !cachedCode) {
      navigate(ROUTE.HOME);
    }

    if (code) {
      setTeamInvitationCode(code);
    }

    setLoading(true);
    accountAction
      .init()
      .then(() => {
        navigate(ROUTE.TERMS_ACKNOWLEDGEMENT);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    trackEvent(SegmentationValue.CONTINUE_CLICKED);

    const login: LoginData = {
      clientType: ClientType.PERMANENT,
      password,
    };

    if (email.indexOf('@') > 0) {
      login.email = email;
    } else {
      login.handle = email;
    }

    try {
      await accountAction.login(login);
      navigate(ROUTE.TERMS_ACKNOWLEDGEMENT);
    } catch (error) {
      setError(t('wrongCredentialsError'));
      console.warn('Unable to login', error);
    }
  };

  return (
    <MigrationLayout>
      <div css={loginContainerCss}>
        {isTablet && <Logo />}

        <Text css={headerCss}>{t('invitationPageHeader')}</Text>
        <Text css={loginSubHeaderCss}>{t('invitationPageSubHeader')}</Text>

        <Form style={{marginTop: 30, textAlign: 'left'}} onSubmit={handleLogin}>
          <Input
            label={t('invitationPagLoginLabel')}
            autoComplete="section-login username"
            maxLength={1024}
            name="identifier"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
            placeholder={t('emailOrUsernamePlaceholder')}
            required
            title={t('invitationPagLoginLabel')}
            value={email}
            data-uie-name="enter-login-identifier"
            onBlur={() => trackEvent(SegmentationValue.EMAIL_ENTERED)}
          />

          <Input
            label={t('password')}
            autoComplete="section-login current-password"
            name="password"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
            pattern=".{1,1024}"
            placeholder={t('password')}
            required
            title={t('password')}
            type="password"
            value={password}
            data-uie-name="enter-login-password"
            onBlur={() => trackEvent(SegmentationValue.PASSWORD_ENTERED)}
          />
          <div css={forgotPasswordCss}>
            <Link
              href={ROUTE.PASSWORD_FORGOT}
              onClick={() => trackEvent(SegmentationValue.PASSWORD_FORGOTTEN)}
              data-uie-name="go-forgot-password"
            >
              {t('forgotPassword')}
            </Link>
          </div>

          <Button
            type="submit"
            disabled={!password || !email}
            data-uie-name="do-login"
            aria-label={t('login')}
            showLoading={loading}
            css={buttonCss}
          >
            {t('login')}
          </Button>
        </Form>

        <ErrorMessage>{error}</ErrorMessage>
      </div>
    </MigrationLayout>
  );
};
