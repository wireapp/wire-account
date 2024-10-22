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

import {Outlet, useNavigate} from 'react-router-dom';

import {Loading, Opacity, TransitionContainer} from '@wireapp/react-ui-kit';

import {MigrationLayout} from './layout/MigrationLayout';
import {useEffect, useState} from 'react';
import {useActionContext} from './module/action';
import {ROUTE} from './route';

export const PrivateRoot = () => {
  const {accountAction} = useActionContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    accountAction
      .init()
      .catch(() => {
        navigate(ROUTE.ACCEPT_INVITATION);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Loading
        css={{
          width: '100%',
          marginTop: '30vh',
        }}
      />
    );
  }

  return (
    <MigrationLayout>
      <TransitionContainer>
        <Opacity>
          <Outlet />
        </Opacity>
      </TransitionContainer>
    </MigrationLayout>
  );
};
