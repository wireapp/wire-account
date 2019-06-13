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

import {Global} from '@emotion/core';
import {COLOR, StyledApp} from '@wireapp/react-ui-kit';
import createBrowserHistory from 'history/createBrowserHistory';
import React from 'react';
import {Redirect, Route, Switch} from 'react-router';
import {Router} from 'react-router-dom';
import {ROUTE} from 'script/route';
import DeleteAccount from './page/DeleteAccount';
import Index from './page/Index';
import PasswordForgot from './page/PasswordForgot';
import PasswordReset from './page/PasswordReset';
import VerifyBotAccount from './page/VerifyBotAccount';
import VerifyEmailAccount from './page/VerifyEmailAccount';
import VerifyPhoneAccount from './page/VerifyPhoneAccount';

const history = createBrowserHistory();

interface Props {}

const Root: React.FC<Props> = () => {
  return (
    <StyledApp>
      <Global
        styles={{
          'a:link,a:visited,a:active': {
            color: COLOR.WHITE,
          },
        }}
      />
      <Router history={history}>
        <Switch>
          <Route exact path={ROUTE.HOME} component={Index} />
          <Route exact path={ROUTE.DELETE_ACCOUNT} component={DeleteAccount} />
          <Route exact path={ROUTE.PASSWORD_FORGOT} component={PasswordForgot} />
          <Route exact path={ROUTE.PASSWORD_RESET} component={PasswordReset} />
          <Route exact path={ROUTE.VERIFY_ACCOUNT_EMAIL} component={VerifyEmailAccount} />
          <Route exact path={ROUTE.VERIFY_ACCOUNT_BOT} component={VerifyBotAccount} />
          <Route exact path={ROUTE.VERIFY_ACCOUNT_PHONE} component={VerifyPhoneAccount} />
          <Redirect to={ROUTE.HOME} />
        </Switch>
      </Router>
    </StyledApp>
  );
};

export default Root;
