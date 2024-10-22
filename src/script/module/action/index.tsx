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

import {APIClient} from '@wireapp/api-client';
import React, {HTMLProps, useContext} from 'react';
import * as Environment from 'script/Environment';

import {AccountAction} from './AccountAction';
import {SelfAction} from './SelfAction';
import {TeamAction} from './TeamAction';

interface ActionProviderProps extends HTMLProps<HTMLElement> {
  contextData?: ReturnType<typeof getActionRoot>;
}

const getActionRoot = (): {
  accountAction: AccountAction;
  selfAction: SelfAction;
  teamAction: TeamAction;
} => {
  const apiClient = new APIClient({
    urls: {name: 'backend', rest: Environment.HOST_HTTP, ws: undefined},
  });

  return {
    accountAction: new AccountAction(apiClient),
    selfAction: new SelfAction(apiClient),
    teamAction: new TeamAction(apiClient),
  };
};

const ActionContext = React.createContext(getActionRoot());

const ActionProvider = ({children, contextData}: ActionProviderProps) => (
  <ActionContext.Provider value={contextData || getActionRoot()}>{children}</ActionContext.Provider>
);

const useActionContext = () => useContext(ActionContext);

export {getActionRoot, ActionContext, ActionProvider, useActionContext};
