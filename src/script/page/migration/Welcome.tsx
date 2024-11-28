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
  ArrowIcon,
  Button,
  ButtonVariant,
  COLOR,
  FlexBox,
  Line,
  Loading,
  Logo,
  QUERY,
  QueryKeys,
  Text,
  useMatchMedia,
} from '@wireapp/react-ui-kit';
import {loginContainerCss, loginSubHeaderCss, headerCss} from './styles';

import {useNavigate} from 'react-router-dom';
import {EXTERNAL_ROUTE, ROUTE} from 'script/route';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import {useActionContext} from 'script/module/action';
import {isOwner, MemberData} from '@wireapp/api-client/lib/team/member';
import {TeamData} from '@wireapp/api-client/lib/team';
import {secureOpen} from 'script/util/urlUtil';
import MarkupTranslation from 'script/component/MarkupTranslation';
import {reportEvent} from 'script/util/Tracking/Tracking';
import {EventName, SegmentationKey, SegmentationValue} from 'script/util/Tracking/types';

export const Welcome = () => {
  const [t] = useTranslation(['migration']);
  const {teamAction, selfAction} = useActionContext();
  const isTablet = useMatchMedia(QUERY[QueryKeys.TABLET_DOWN]);
  const navigate = useNavigate();
  const isMobile = useMatchMedia(QUERY[QueryKeys.TABLET_DOWN]);
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<TeamData>();
  const [selfMember, setSelfMember] = useState<MemberData>();

  const getData = async () => {
    const self = await selfAction.getSelf();
    const member = await teamAction.getMember(self.team, self.id);
    const team = await teamAction.getTeam(self.team);

    return {member, team};
  };

  const handleEvent = (step: SegmentationValue) => {
    reportEvent(EventName.USER_MIGRATION_WELCOME, {
      [SegmentationKey.STEP]: step,
    });
  };

  useEffect(() => {
    handleEvent(SegmentationValue.OPENED);
    getData()
      .then(res => {
        setSelfMember(res.member);
        setTeam(res.team);
      })
      .catch(() => {
        navigate(ROUTE.HOME);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div css={loginContainerCss}>
        <Loading style={{margin: 'auto'}} />
      </div>
    );
  }

  const handleAppOpen = () => {
    handleEvent(SegmentationValue.OPENED_WEB_APP);
    secureOpen(EXTERNAL_ROUTE.APP_WIRE);
  };

  const handleTMOpen = () => {
    handleEvent(SegmentationValue.OPENED_TM);
    secureOpen(EXTERNAL_ROUTE.TEAM_SETTINGS);
  };

  return (
    <div css={loginContainerCss}>
      {isTablet && <Logo />}
      <Text css={headerCss}>{t('welcomePageHeader')}</Text>
      <Text css={loginSubHeaderCss}>
        <MarkupTranslation translation={t('welcomePageSubHeader', {teamName: team.name})} />
      </Text>
      <Button variant={ButtonVariant.PRIMARY} data-uie-name="do-open-app" block onClick={handleAppOpen}>
        {t('welcomePageAppOpenText')}
      </Button>
      {isOwner(selfMember.permissions) && (
        <>
          <FlexBox justify="center" align="center" css={{width: '100%'}}>
            <Line color={COLOR.GRAY_LIGHTEN_80} css={{margin: '40px 0', width: isMobile ? 120 : 200}} />
            <Text
              css={{
                color: COLOR.BLACK_LIGHTEN_40,
                fontSize: 20,
                paddingLeft: 32,
                paddingRight: 32,
              }}
            >
              {t('welcomePageOr')}
            </Text>
            <Line color={COLOR.GRAY_LIGHTEN_80} css={{margin: '40px 0', width: isMobile ? 120 : 200}} />
          </FlexBox>
          <Button
            data-uie-name="do-go-to-team-management"
            block
            variant={ButtonVariant.SECONDARY}
            onClick={handleTMOpen}
          >
            {t('welcomePageTMOpenText')}
            <ArrowIcon color={COLOR.BLUE} direction="right" css={{marginLeft: 12}} />
          </Button>
        </>
      )}
    </div>
  );
};
