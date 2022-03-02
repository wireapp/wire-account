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
import {
  ButtonLink,
  ContainerSM,
  FlexBox,
  H1,
  H2,
  H3,
  Loading,
  QUERY,
  QueryKeys,
  Small,
  Text,
  TextLink,
  useMatchMedia,
} from '@wireapp/react-ui-kit';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {DirectDownloadButton} from 'script/component/DirectDownloadButton';
import Document from 'script/component/Document';
import {WebsiteDownloadButton} from 'script/component/WebsiteDownloadButton';
import {WEBAPP_URL, REDIRECT_CONVERSATION_JOIN_URL, BRAND_NAME} from 'script/Environment';
import {ActionContext} from 'script/module/action';
import {IS_SELF_HOSTED} from 'script/Environment';

export interface ConversationJoinProps extends React.HTMLProps<Document>, RouteComponentProps<{}> {}

const QUERY_CODE_KEY = 'code';
const QUERY_KEY_KEY = 'key';
const QUERY_DOMAIN_KEY = 'domain';

export const ConversationJoin: React.FC<ConversationJoinProps> = ({location}) => {
  const [t] = useTranslation('conversationJoin');
  const isMobile = useMatchMedia(QUERY[QueryKeys.TABLET_DOWN]);
  const {accountAction} = useContext(ActionContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const params = new URLSearchParams(location.search);
  const code = params.get(QUERY_CODE_KEY);
  const key = params.get(QUERY_KEY_KEY);
  const domain = params.get(QUERY_DOMAIN_KEY);

  const renderButtons = () => {
    const canJoinInApp = !IS_SELF_HOSTED; // Only public wire cloud can join with native app
    const canJoinInBrowser = !Runtime.isMobileOS();
    const showDownload = !IS_SELF_HOSTED;
    const hasDirectDownload = Runtime.isMobileOS() || Runtime.isMacOS();
    return (
      <>
        {canJoinInApp && (
          <ButtonLink
            href={pathWithParams(REDIRECT_CONVERSATION_JOIN_URL, {
              code,
              key,
            })}
            style={{marginRight: 16}}
            data-uie-name="do-conversation-join-app"
          >
            {t('joinWithApp')}
          </ButtonLink>
        )}

        {canJoinInBrowser && (
          <ButtonLink
            href={pathWithParams(`${WEBAPP_URL}/join`, {
              code,
              key,
            })}
            style={{marginRight: 16}}
            data-uie-name="do-conversation-join-webapp"
          >
            {IS_SELF_HOSTED ? t('joinWithBrowserOnDomain') : t('joinWithBrowser')}
          </ButtonLink>
        )}
        {showDownload &&
          (hasDirectDownload ? (
            <DirectDownloadButton style={{justifyContent: 'center'}}>{t('downloadApp')}</DirectDownloadButton>
          ) : (
            <WebsiteDownloadButton style={{justifyContent: 'center'}} />
          ))}
      </>
    );
  };

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
        <FlexBox column align="center" css={{margin: 'auto'}}>
          <Loading css={{margin: 'auto'}} />
          <Small muted center css={{margin: '16px 0'}}>
            {t('loading')}
          </Small>
        </FlexBox>
      ) : (
        <ContainerSM css={{margin: 'auto 0'}}>
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
                {!IS_SELF_HOSTED ? t('title', {brandName: BRAND_NAME}) : t('titleDomain', {domain})}
              </H2>
              <Text block>{t('description')}</Text>
              <FlexBox column={isMobile} css={{marginTop: 24}}>
                {renderButtons()}
              </FlexBox>

              {!Runtime.isMobileOS() && (
                <>
                  <H3 css={{marginBottom: 8, marginTop: 48}}>
                    {!IS_SELF_HOSTED ? t('wirelessHeadline', {brandName: BRAND_NAME}) : t('wirelessDomainHeadline')}
                  </H3>
                  <TextLink
                    block
                    href={pathWithParams(`${WEBAPP_URL}/join`, {
                      code,
                      key,
                    })}
                    data-uie-name="do-conversation-join-webapp"
                  >
                    {!IS_SELF_HOSTED ? t('wirelessLink') : t('wirelessLinkDomain', {domain})}
                  </TextLink>
                  <Text muted>{t('wirelessNote')}</Text>
                </>
              )}
            </>
          )}
        </ContainerSM>
      )}
    </Document>
  );
};

export default withRouter(ConversationJoin);
