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

import {FlexBox, Loading, StyledApp, THEME_ID} from '@wireapp/react-ui-kit';
import React, {lazy, Suspense, useEffect} from 'react';
import {Route, Routes, BrowserRouter, Navigate} from 'react-router-dom';
import {ROUTE} from 'script/route';
import {QUERY_KEY} from './util/urlUtil';

interface Props {}

const LazyIndex = lazy(() => import('./page/Index'));
const LazyDeleteAccount = lazy(() => import('./page/DeleteAccount'));
const LazyPasswordForgot = lazy(() => import('./page/PasswordForgot'));
const LazyBotPasswordForgot = lazy(() => import('./page/BotPasswordForgot'));
const LazyPasswordReset = lazy(() => import('./page/PasswordReset'));
const LazyBotPasswordReset = lazy(() => import('./page/BotPasswordReset'));
const LazyVerifyEmailAccount = lazy(() => import('./page/VerifyEmailAccount'));
const LazyVerifyBotAccount = lazy(() => import('./page/VerifyBotAccount'));
const LazyConversationJoin = lazy(() => import('./page/ConversationJoin'));
const LazyUserProfile = lazy(() => import('./page/UserProfile'));

const Root: React.FC<Props> = () => {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const hlParam = queryParams.get(QUERY_KEY.LANG);
    const userLocale = navigator.languages?.length ? navigator.languages[0] : navigator.language;

    if (!hlParam && !userLocale.includes('en')) {
      queryParams.set(QUERY_KEY.LANG, userLocale);
      window.history.pushState(null, '', `?${queryParams.toString()}`);
      window.location.reload();
    }
  }, []);

  return (
    <StyledApp themeId={THEME_ID.DEFAULT}>
      <Suspense
        fallback={
          <FlexBox justify="center" align="center" style={{minHeight: '100vh'}}>
            <Loading style={{margin: 'auto'}} />
          </FlexBox>
        }
      >
        <BrowserRouter>
          <Routes>
            <Route index path={ROUTE.HOME} element={<LazyIndex />} />
            <Route path={ROUTE.DELETE_ACCOUNT} element={<LazyDeleteAccount />} />
            <Route path={ROUTE.PASSWORD_FORGOT} element={<LazyPasswordForgot />} />
            <Route path={ROUTE.PASSWORD_FORGOT_BOT} element={<LazyBotPasswordForgot />} />
            <Route path={ROUTE.PASSWORD_RESET} element={<LazyPasswordReset />} />
            <Route path={ROUTE.PASSWORD_RESET_BOT} element={<LazyBotPasswordReset />} />
            <Route path={ROUTE.VERIFY_ACCOUNT_EMAIL} element={<LazyVerifyEmailAccount />} />
            <Route path={ROUTE.VERIFY_ACCOUNT_BOT} element={<LazyVerifyBotAccount />} />
            <Route path={ROUTE.CONVERSATION_JOIN} element={<LazyConversationJoin />} />
            <Route path={ROUTE.USER_PROFILE} element={<LazyUserProfile />} />
            <Route path="*" element={<Navigate to={ROUTE.HOME} replace={true} />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </StyledApp>
  );
};

export default Root;
