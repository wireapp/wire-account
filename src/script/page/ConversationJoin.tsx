/*
 * Wire
 * Copyright (C) 2021 Wire Swiss GmbH
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
import {pathWithParams} from '@wireapp/commons/src/main/util/UrlUtil';
import {Button, ContainerXS} from '@wireapp/react-ui-kit';
import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import Document from 'script/component/Document';
import {WEBAPP_URL, REDIRECT_CONVERSATION_JOIN_URL} from 'script/Environment';

interface Props extends React.HTMLProps<Document>, RouteComponentProps<{}> {}

const QUERY_CODE_KEY = 'code';
const QUERY_KEY_KEY = 'key';

const ConversationJoin = ({location}: Props) => {
  const params = new URLSearchParams(location.search);
  const code = params.get(QUERY_CODE_KEY);
  const key = params.get(QUERY_KEY_KEY);

  return (
    <Document>
      <ContainerXS style={{alignItems: 'center', display: 'flex', flexDirection: 'column', margin: 'auto'}}>
        <Button
          onClick={() => {
            window.location.href = pathWithParams(REDIRECT_CONVERSATION_JOIN_URL, {
              code,
              key,
            });
          }}
        >
          {'Open installed app'}
        </Button>
        <Button
          onClick={() => {
            window.location.href = pathWithParams(`${WEBAPP_URL}/join`, {
              code,
              key,
            });
          }}
        >
          {'Open webapp'}
        </Button>
      </ContainerXS>
    </Document>
  );
};

export default withRouter(ConversationJoin);
