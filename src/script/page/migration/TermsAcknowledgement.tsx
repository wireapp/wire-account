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

import {
  Bold,
  Button,
  Checkbox,
  COLOR_V2,
  Link,
  Loading,
  Logo,
  QUERY,
  QueryKeys,
  Text,
  useMatchMedia,
} from '@wireapp/react-ui-kit';
import {
  termsContainerCss,
  termsSubHeaderCss,
  headerCss,
  termsContentHeaderCss,
  termsListCss,
  termsListItemCss,
  termsContentWarningBox,
  termsContentWarningBoxContent,
  termsContentBlueBox,
  termsContentBlueBoxContent,
  buttonCss,
  termsCheckboxLabelCss,
  loginContainerCss,
} from './styles';
import {ShieldIcon} from './ShieldIcon';
import {OutlinedCheckIcon} from './OutlinedCheckIcon';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {EXTERNAL_ROUTE, ROUTE} from 'script/route';
import {useTranslation} from 'react-i18next';
import MarkupTranslation from 'script/component/MarkupTranslation';
import {useActionContext} from 'script/module/action';
import {getTeamInvitationCode} from './utils';

export const TermsAcknowledgement = () => {
  const navigate = useNavigate();
  const {teamAction} = useActionContext();
  const {t} = useTranslation('migration');
  const isTablet = useMatchMedia(QUERY[QueryKeys.TABLET_DOWN]);
  const code = getTeamInvitationCode();
  const [loading, setLoading] = useState(true);
  const [isMigrationAccepted, setIsMigrationAccepted] = useState(false);
  const [isTermOfUseAccepted, setIsTermOfUseAccepted] = useState(false);
  const [inviterEmail, setInviterEmail] = useState('');

  useEffect(() => {
    teamAction
      .getInvitationInfo(code)
      .then(res => {
        setInviterEmail(res.created_by_email);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div css={loginContainerCss}>
        <Loading style={{margin: 'auto'}} />
      </div>
    );
  }

  return (
    <div css={termsContainerCss}>
      {isTablet && (
        <div css={{textAlign: 'center', marginTop: '2rem'}}>
          <Logo />
        </div>
      )}
      <Text css={headerCss}>{t('termsPageHeader')}</Text>
      <Text css={termsSubHeaderCss}>{t('termsPageSubHeader', {email: inviterEmail})}</Text>
      <div css={{margin: '2rem', textAlign: 'left'}}>
        <Bold css={termsContentHeaderCss}>{t('termsPageListHeader')}</Bold>
        <ul css={termsListCss}>
          <li css={termsListItemCss}>
            <MarkupTranslation translation={t('termsPageListItem1')} />
          </li>
          <li css={termsListItemCss}>
            <MarkupTranslation translation={t('termsPageListItem2')} />
          </li>
          <li css={termsListItemCss}>
            <MarkupTranslation translation={t('termsPageListItem3')} />
          </li>
          <li css={termsListItemCss}>
            <MarkupTranslation translation={t('termsPageListItem4')} />
          </li>
          <li css={termsListItemCss}>
            <MarkupTranslation translation={t('termsPageListItem5')} />
          </li>
        </ul>
      </div>
      <div css={termsContentWarningBox}>
        <div css={termsContentWarningBoxContent}>
          <ShieldIcon /> <b css={{marginLeft: '1.5rem'}}>{t('termsPageAccountManagerHeader')}</b>
          <div css={{marginTop: '1rem'}}>{t('termsPageAccountManagerText')}</div>
        </div>
      </div>
      <div css={{margin: '2.5rem 2rem', textAlign: 'left'}}>
        <Bold css={termsContentHeaderCss}>{t('termsPageRecommendationsHeader')}</Bold>
        <div css={termsContentBlueBox}>
          <div css={{margin: '0.4rem 0'}}>
            <OutlinedCheckIcon />
          </div>
          <div css={termsContentBlueBoxContent}>{t('termsPageRecommendationItem1')}</div>
        </div>
        <div css={termsContentBlueBox}>
          <div css={{margin: '0.4rem 0'}}>
            <OutlinedCheckIcon />
          </div>

          <Link href={EXTERNAL_ROUTE.SUPPORT_BACKUP_HISTORY} target="_blank" css={{textDecoration: 'underline'}}>
            <b css={termsContentBlueBoxContent}>{t('termsPageRecommendationItem2')}</b>
          </Link>
        </div>
      </div>
      <div css={{margin: '2.5rem 2rem 1rem 2rem'}}>
        <Checkbox
          checked={isMigrationAccepted}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setIsMigrationAccepted(event.target.checked);
          }}
          id="do-accept-migration"
          data-uie-name="do-accept-migration"
        >
          <span css={termsCheckboxLabelCss}>{t('termsPageMigrationTerms')}</span>
        </Checkbox>
        <Checkbox
          wrapperCSS={{margin: '1rem 0'}}
          checked={isTermOfUseAccepted}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setIsTermOfUseAccepted(event.target.checked);
          }}
          id="do-accept-terms"
          data-uie-name="do-accept-terms"
        >
          <span css={termsCheckboxLabelCss}>
            {t('termsPageTermsOfUse')}{' '}
            <Link href={EXTERNAL_ROUTE.TERMS_OF_USE_TEAMS} target="_blank">
              <span css={{color: COLOR_V2.BLUE}}>{t('termsPageTermsOfUseLink')}</span>
            </Link>
          </span>
        </Checkbox>
      </div>
      <div css={{margin: '0 2rem'}}>
        <Button
          onClick={() => navigate(ROUTE.CONFIRM_INVITATION)}
          disabled={!isTermOfUseAccepted || !isMigrationAccepted}
          data-uie-name="do-continue"
          aria-label=""
          css={buttonCss}
        >
          {t('continueBtnText')}
        </Button>
      </div>
    </div>
  );
};
