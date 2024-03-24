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
import {createBrowserHistory} from 'history';
import React, {lazy, Suspense, useEffect} from 'react';
import {Redirect, Route, Router, Switch} from 'react-router-dom';
import {ROUTE} from 'script/route';
import {QUERY_KEY} from './util/urlUtil';

const history = createBrowserHistory();

interface Props {}

const Root: React.FC<Props> = () => {
  const LazyIndex = lazy(() => import('./page/Index'));
  const LazyDeleteAccount = lazy(() => import('./page/DeleteAccount'));
  const LazyPasswordForgot = lazy(() => import('./page/PasswordForgot'));
  const LazyBotPasswordForgot = lazy(() => import('./page/BotPasswordForgot'));
  const LazyPasswordReset = lazy(() => import('./page/PasswordReset'));
  const LazyBotPasswordReset = lazy(() => import('./page/BotPasswordReset'));
  const LazyVerifyEmailAccount = lazy(() => import('./page/VerifyEmailAccount'));
  const LazyVerifyBotAccount = lazy(() => import('./page/VerifyBotAccount'));
  const LazyVerifyPhoneAccount = lazy(() => import('./page/VerifyPhoneAccount'));
  const LazyConversationJoin = lazy(() => import('./page/ConversationJoin'));
  const LazyUserProfile = lazy(() => import('./page/UserProfile'));

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
        <Router history={history}>
          <Switch>
            <Route exact path={ROUTE.HOME} component={LazyIndex} />
            <Route exact path={ROUTE.DELETE_ACCOUNT} component={LazyDeleteAccount} />
            <Route exact path={ROUTE.PASSWORD_FORGOT} component={LazyPasswordForgot} />
            <Route exact path={ROUTE.PASSWORD_FORGOT_BOT} component={LazyBotPasswordForgot} />
            <Route exact path={ROUTE.PASSWORD_RESET} component={LazyPasswordReset} />
            <Route exact path={ROUTE.PASSWORD_RESET_BOT} component={LazyBotPasswordReset} />
            <Route exact path={ROUTE.VERIFY_ACCOUNT_EMAIL} component={LazyVerifyEmailAccount} />
            <Route exact path={ROUTE.VERIFY_ACCOUNT_BOT} component={LazyVerifyBotAccount} />
            <Route exact path={ROUTE.VERIFY_ACCOUNT_PHONE} component={LazyVerifyPhoneAccount} />
            <Route exact path={ROUTE.CONVERSATION_JOIN} component={LazyConversationJoin} />
            <Route exact path={ROUTE.USER_PROFILE} component={LazyUserProfile} />
            <Redirect to={ROUTE.HOME} />
          </Switch>
        </Router>
      </Suspense>
    </StyledApp>
  );
};

export default Root;
