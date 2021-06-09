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
import {Runtime} from '@wireapp/commons';
import {pathWithParams} from '@wireapp/commons/src/main/util/UrlUtil';
import {ButtonLink, COLOR, Column, Columns, ContainerXS, H1, Loading, Small, Text} from '@wireapp/react-ui-kit';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import Document from 'script/component/Document';
import {WEBAPP_URL, REDIRECT_CONVERSATION_JOIN_URL} from 'script/Environment';
import {ActionContext} from 'script/module/action';

interface Props extends React.HTMLProps<Document>, RouteComponentProps<{}> {}

const QUERY_CODE_KEY = 'code';
const QUERY_KEY_KEY = 'key';

const ConversationJoin = ({location}: Props) => {
  const [t] = useTranslation('conversationJoin');
  const {accountAction} = useContext(ActionContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const params = new URLSearchParams(location.search);
  const code = params.get(QUERY_CODE_KEY);
  const key = params.get(QUERY_KEY_KEY);

  useEffect(() => {
    setIsLoading(true);
    accountAction
      .validateConversationJoin(key, code)
      .catch(error => {
        console.warn('Join link is not valid', error);
        setError(error.toString());
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Document>
      <ContainerXS css={{alignItems: 'center', display: 'flex', flexDirection: 'column', margin: 'auto'}}>
        {isLoading ? (
          <>
            <Loading css={{margin: 'auto'}} />
            <Small muted center css={{margin: '16px 0'}}>
              {t('loading')}
            </Small>
          </>
        ) : error ? (
          <>
            <H1>{t('errorTitle')}</H1>
            <Text center>{t('errorUnknown')}</Text>
          </>
        ) : (
          <>
            <H1 center>{t('title')}</H1>
            <Text center css={{margin: '16px 0'}}>
              {t('description')}
            </Text>
            <Columns css={{marginTop: 40}}>
              {Runtime.isMobileOS() ? (
                <Column>
                  <ButtonLink
                    block
                    href={pathWithParams(REDIRECT_CONVERSATION_JOIN_URL, {
                      code,
                      key,
                    })}
                    style={{color: COLOR.WHITE, justifyContent: 'center'}}
                    data-uie-name="do-conversation-join-mobile"
                  >
                    {Runtime.isIOS() ? 'Join with iOS app' : 'Join with Android app'}
                  </ButtonLink>
                </Column>
              ) : (
                <>
                  <Column>
                    <ButtonLink
                      block
                      href={pathWithParams(REDIRECT_CONVERSATION_JOIN_URL, {
                        code,
                        key,
                      })}
                      style={{color: COLOR.WHITE, justifyContent: 'center'}}
                      data-uie-name="do-conversation-join-desktop"
                    >
                      {'Join with Wire Desktop'}
                    </ButtonLink>
                  </Column>
                  <Column>
                    <ButtonLink
                      block
                      href={pathWithParams(`${WEBAPP_URL}/join`, {
                        code,
                        key,
                      })}
                      style={{color: COLOR.WHITE, justifyContent: 'center'}}
                      data-uie-name="do-conversation-join-webapp"
                    >
                      {'Join with Wire Webapp'}
                    </ButtonLink>
                  </Column>
                </>
              )}
            </Columns>
          </>
        )}
      </ContainerXS>
    </Document>
  );
};

export default withRouter(ConversationJoin);
