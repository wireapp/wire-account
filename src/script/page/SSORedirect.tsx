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
import React from 'react';
import Document from 'script/component/Document';
import {REDIRECT_START_SSO_URL} from 'script/Environment';

interface Props extends React.HTMLProps<Document> {}

const QUERY_CODE_KEY = 'code';

const SSORedirect = (props: Props) => {
  const params = new URLSearchParams(location.search);
  const code = params.get(QUERY_CODE_KEY);

  const redirect = `${REDIRECT_START_SSO_URL}/${code}`;
  window.location.assign(redirect);
  return <Document />;
};

export default SSORedirect;
