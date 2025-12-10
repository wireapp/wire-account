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
import {loginContainerCss, loginSubHeaderCss, headerCss, forgotPasswordCss, buttonCss} from './styles';
import React, {useEffect, useState} from 'react';
import {ROUTE} from 'script/route';
import {useNavigate} from 'react-router-dom';
import {getTeamInvitationCode, removeTeamInvitationCode} from './utils';
import {useTranslation} from 'react-i18next';
import {useActionContext} from 'script/module/action';
import {reportEvent} from 'script/util/Tracking/Tracking';
import {EventName, SegmentationKey, SegmentationValue} from 'script/util/Tracking/types';

export const ConfirmInvitation = () => {
  const isTablet = useMatchMedia(QUERY[QueryKeys.TABLET_DOWN]);
  const navigate = useNavigate();
  const [t] = useTranslation(['migration', 'login']);
  const {teamAction} = useActionContext();

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const code = getTeamInvitationCode();

  const trackEvent = (step: SegmentationValue) => {
    reportEvent(EventName.USER_MIGRATION_CONFIRMATION, {
      [SegmentationKey.STEP]: step,
    });
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    trackEvent(SegmentationValue.CONTINUE_CLICKED);
    setLoading(true);
    teamAction
      .acceptInvitation({
        code,
        password,
      })
      .then(() => {
        removeTeamInvitationCode();
        navigate(ROUTE.WELCOME);
      })
      .catch(() => {
        setError(t('wrongCredentialsError'));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    trackEvent(SegmentationValue.OPENED);
  }, []);

  return (
    <div css={loginContainerCss}>
      {isTablet && <Logo />}
      <Text css={headerCss}>{t('confirmPageHeader')}</Text>
      <Text css={loginSubHeaderCss}>{t('confirmPageSubHeader')}</Text>
      <Form style={{marginTop: 30, textAlign: 'left'}} onSubmit={handleSubmit}>
        <Input
          label={t('passwordLabel')}
          autoComplete="section-login current-password"
          name="password"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
          pattern=".{1,1024}"
          placeholder={t('passwordPlaceholder')}
          required
          title={t('passwordLabel')}
          type="password"
          value={password}
          data-uie-name="enter-login-password"
          onBlur={() => trackEvent(SegmentationValue.PASSWORD_ENTERED)}
          markInvalid={!!error}
          showTogglePasswordLabel={t('passwordShow')}
          hideTogglePasswordLabel={t('passwordHide')}
        />
        <div css={forgotPasswordCss}>
          <Link href={ROUTE.PASSWORD_FORGOT} data-uie-name="go-forgot-password">
            {t('forgotPassword')}
          </Link>
        </div>
        <Button
          type="submit"
          disabled={!password}
          data-uie-name="do-login"
          aria-label={t('logIn')}
          showLoading={loading}
          css={buttonCss}
        >
          {t('continueBtnText')}
        </Button>
      </Form>
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  );
};
