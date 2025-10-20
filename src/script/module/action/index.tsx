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
import React, {HTMLProps, useContext, useMemo} from 'react';
import * as Environment from 'script/Environment';
import {ENABLE_DEV_BACKEND_API, SUPPORTED_API_RANGE} from 'script/Environment';

import {AccountAction} from './AccountAction';
import {SelfAction} from './SelfAction';
import {TeamAction} from './TeamAction';

export type ActionRoot = {
  accountAction: AccountAction;
  selfAction: SelfAction;
  teamAction: TeamAction;
};

interface ActionProviderProps extends HTMLProps<HTMLElement> {
  contextData?: ActionRoot;
}

let actionRoot: ActionRoot | null = null;
let initializing: Promise<ActionRoot> | null = null;

const createActionRoot = (apiClient: APIClient): ActionRoot => ({
  accountAction: new AccountAction(apiClient),
  selfAction: new SelfAction(apiClient),
  teamAction: new TeamAction(apiClient),
});

// Initialize once and later calls reuse the same instance or in-flight promise.
export const initializeAPIClient = async (): Promise<ActionRoot> => {
  if (actionRoot) {
    return actionRoot;
  }
  if (initializing) {
    return initializing;
  }

  const [apiVersionMin, apiVersionMax] = SUPPORTED_API_RANGE;
  const apiClient = new APIClient({
    urls: {name: 'backend', rest: Environment.HOST_HTTP, ws: undefined},
  });

  // Make the promise immediately to avoid races.
  initializing = (async () => {
    try {
      await apiClient.useVersion(apiVersionMin, apiVersionMax, ENABLE_DEV_BACKEND_API);
      actionRoot = createActionRoot(apiClient);
      return actionRoot;
    } catch (err) {
      actionRoot = null;
      throw new Error(`Failed to initialize API client, Error: ${err}`);
    } finally {
      initializing = null;
    }
  })();

  return initializing;
};

const getActionRoot = (): ActionRoot => {
  if (!actionRoot) {
    throw new Error('APIClient not initialized. Call initializeAPIClient() before using actions.');
  }
  return actionRoot;
};

const ActionContext = React.createContext<ActionRoot | null>(null);

const ActionProvider = ({children, contextData}: ActionProviderProps) => {
  const value = useMemo(() => contextData ?? getActionRoot(), [contextData]);
  return <ActionContext.Provider value={value}>{children}</ActionContext.Provider>;
};

const useActionContext = (): ActionRoot => {
  const context = useContext(ActionContext);
  return context ?? getActionRoot();
};

export {getActionRoot, ActionContext, ActionProvider, useActionContext};
