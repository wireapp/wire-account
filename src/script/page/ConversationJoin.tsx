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
import {
  ContainerSM,
  FlexBox,
  H1,
  H2,
  Loading,
  QUERY,
  QueryKeys,
  Small,
  Text,
  useMatchMedia,
} from '@wireapp/react-ui-kit';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import Document from 'script/component/Document';
import {OpenWireButtons, hasDisplayedButtons} from 'script/component/OpenWireButtons';
import {BRAND_NAME, IS_SELF_HOSTED} from 'script/Environment';
import {ActionContext} from 'script/module/action';

export interface ConversationJoinProps extends React.HTMLProps<Document>, RouteComponentProps<{}> {}

const QUERY_CODE_KEY = 'code';
const QUERY_KEY_KEY = 'key';
const QUERY_DOMAIN_KEY = 'domain';

export const ConversationJoin: React.FC<ConversationJoinProps> = ({location}) => {
  const translationNamespaces = IS_SELF_HOSTED ? ['conversationJoinSelfHosted', 'conversationJoin'] : undefined;
  const [t] = useTranslation(['conversationJoin', 'conversationJoinSelfHosted']);
  const isMobile = useMatchMedia(QUERY[QueryKeys.TABLET_DOWN]);
  const {accountAction} = useContext(ActionContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const params = new URLSearchParams(location.search);
  const code = params.get(QUERY_CODE_KEY);
  const key = params.get(QUERY_KEY_KEY);
  const domain = params.get(QUERY_DOMAIN_KEY);

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
      {isLoading ? (
        <FlexBox column align="center" style={{margin: 'auto'}}>
          <Loading style={{margin: 'auto'}} />
          <Small muted center style={{margin: '16px 0'}}>
            {t('loading')}
          </Small>
        </FlexBox>
      ) : (
        <ContainerSM style={{margin: 'auto 0'}}>
          {error ? (
            <>
              <H1 data-uie-name="element-conversation-join-error-headline">{t('errorConversationNotFoundHeadline')}</H1>
              <Text center data-uie-name="element-conversation-join-error-description">
                {t('errorConversationNotFoundDescription')}
              </Text>
            </>
          ) : (
            <>
              <H2 style={{fontWeight: 500, marginBottom: 40, marginTop: '0'}}>
                {t('title', {brandName: BRAND_NAME, domain, ns: translationNamespaces})}
              </H2>
              {hasDisplayedButtons() ? (
                <>
                  <Text block>{t('description', {ns: translationNamespaces})}</Text>
                  <FlexBox flexWrap="wrap" column={isMobile} style={{marginTop: 24}}>
                    <OpenWireButtons
                      translate={(key, substitutes) => t(key, {...substitutes, ns: translationNamespaces})}
                      uieName="do-conversation-join"
                      paths={{
                        app: pathWithParams('conversation-join/', {code, key}),
                        webapp: pathWithParams('/join', {code, key}),
                      }}
                    />
                  </FlexBox>
                </>
              ) : (
                <Text color="#696C6E">{t('cannotJoinOnMobile')}</Text>
              )}
            </>
          )}
        </ContainerSM>
      )}
    </Document>
  );
};

export default withRouter(ConversationJoin);
