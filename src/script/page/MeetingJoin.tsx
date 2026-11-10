/*
 * Wire
 * Copyright (C) 2026 Wire Swiss GmbH
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
import {pathWithParams} from '@wireapp/commons/lib/util/UrlUtil';
import {
  Button,
  ContainerSM,
  FlexBox,
  H1,
  H2,
  Loading,
  Paragraph,
  QUERY,
  QueryKeys,
  Small,
  Text,
  useMatchMedia,
} from '@wireapp/react-ui-kit';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useLocation} from 'react-router-dom';
import Document from 'script/component/Document';
import {OpenWireButtons, hasDisplayedButtons} from 'script/component/OpenWireButtons';
import {BRAND_NAME, IS_SELF_HOSTED} from 'script/Environment';
import {useActionContext} from 'script/module/action';

const QUERY_CODE_KEY = 'code';
const QUERY_KEY_KEY = 'key';
const QUERY_DOMAIN_KEY = 'domain';

type ValidationOutcome = 'valid' | 'invalid' | 'unsupported' | 'failed';
const ERROR_COPY: Record<Exclude<ValidationOutcome, 'valid'>, {headline: string; description: string}> = {
  invalid: {headline: 'invalidHeadline', description: 'invalidDescription'},
  unsupported: {headline: 'unsupportedHeadline', description: 'unsupportedDescription'},
  failed: {headline: 'checkFailedHeadline', description: 'checkFailedDescription'},
};

export const MeetingJoin = () => {
  const location = useLocation();
  const translationNamespaces = IS_SELF_HOSTED ? ['conversationJoinSelfHosted', 'conversationJoin'] : undefined;
  const [t] = useTranslation(['conversationJoin', 'conversationJoinSelfHosted', 'meetingJoin']);
  const isMobile = useMatchMedia(QUERY[QueryKeys.TABLET_DOWN]);
  const {accountAction} = useActionContext();

  const [validation, setValidation] = useState<{requestKey: string; outcome: ValidationOutcome} | undefined>();
  const [retryAttempt, setRetryAttempt] = useState(0);

  const params = new URLSearchParams(location.search);
  const code = params.get(QUERY_CODE_KEY);
  const key = params.get(QUERY_KEY_KEY);
  const domain = params.get(QUERY_DOMAIN_KEY);
  const requestKey = JSON.stringify([domain, key, code, retryAttempt]);

  useEffect(() => {
    let active = true;

    if (!domain || !key || !code) {
      setValidation({requestKey, outcome: 'invalid'});
      return () => {
        active = false;
      };
    }

    accountAction
      .validateMeetingJoin(domain, key, code)
      .then(() => {
        if (active) {
          setValidation({requestKey, outcome: 'valid'});
        }
      })
      .catch(error => {
        if (!active) {
          return;
        }
        if (error?.label === 'invalid-meeting-password') {
          setValidation({requestKey, outcome: 'valid'});
          return;
        }
        const outcome =
          error?.label === 'meeting-api-unsupported'
            ? 'unsupported'
            : error?.label === 'meeting-not-found' || error?.code === 404
              ? 'invalid'
              : 'failed';
        console.warn('Meeting link validation failed', error);
        setValidation({requestKey, outcome});
      });

    return () => {
      active = false;
    };
  }, [accountAction, domain, key, code, requestKey]);

  const outcome = validation?.requestKey === requestKey ? validation.outcome : undefined;
  const errorCopy = outcome && outcome !== 'valid' ? ERROR_COPY[outcome] : undefined;

  return (
    <Document>
      {!outcome ? (
        <FlexBox column align="center" css={{margin: 'auto'}}>
          <Loading css={{margin: 'auto'}} />
          <Small muted center css={{margin: '16px 0'}}>
            {t('loading')}
          </Small>
        </FlexBox>
      ) : (
        <ContainerSM css={{margin: 'auto 0'}}>
          {errorCopy ? (
            <>
              <H1 data-uie-name="element-meeting-join-error-headline">{t(`meetingJoin:${errorCopy.headline}`)}</H1>
              <Text center data-uie-name="element-meeting-join-error-description">
                {t(`meetingJoin:${errorCopy.description}`)}
              </Text>
              {outcome === 'failed' && (
                <Button
                  data-uie-name="do-retry-meeting-validation"
                  onClick={() => setRetryAttempt(attempt => attempt + 1)}
                >
                  {t('meetingJoin:retry')}
                </Button>
              )}
            </>
          ) : (
            <>
              <H2 style={{fontWeight: 500, marginBottom: 40, marginTop: '0'}}>{t('meetingJoin:title')}</H2>
              {hasDisplayedButtons() ? (
                <>
                  <Text block>{t('description', {ns: translationNamespaces})}</Text>
                  {IS_SELF_HOSTED && (
                    <Paragraph muted css={{marginTop: '8px'}}>
                      {t('meetingJoin:conversationLocation', {domain})}
                    </Paragraph>
                  )}
                  <Paragraph muted css={{marginTop: '8px'}}>
                    {t('meetingJoin:wirelessHeadline', {brandName: BRAND_NAME})}
                  </Paragraph>
                  <FlexBox flexWrap="wrap" column={isMobile} css={{marginTop: 24}}>
                    <OpenWireButtons
                      translate={(key, substitutes) => t(key, {...substitutes, ns: translationNamespaces})}
                      uieName="do-meeting-join"
                      paths={{
                        app: pathWithParams('meeting-join/', {domain, code, key}),
                        webapp: pathWithParams('/meeting-join', {domain, code, key}),
                      }}
                    />
                  </FlexBox>
                </>
              ) : (
                <Text color="#696C6E">{t('meetingJoin:cannotJoinOnMobile')}</Text>
              )}
            </>
          )}
        </ContainerSM>
      )}
    </Document>
  );
};

export default MeetingJoin;
