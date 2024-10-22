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

import {CSSObject} from '@emotion/react';
import {Bold, COLOR_V2, FlexBox, Logo, QUERY, QueryKeys, Text, useMatchMedia} from '@wireapp/react-ui-kit';
import {ReactNode} from 'react';
import {WavesPattern} from './WavesPattern';
import {useLocation} from 'react-router-dom';
import {ROUTE} from 'script/route';
import {useTranslation} from 'react-i18next';

export const MigrationLayout = ({children}: {children: ReactNode}) => {
  const location = useLocation();
  const [t] = useTranslation('migration');
  const isTablet = useMatchMedia(QUERY[QueryKeys.TABLET_DOWN]);
  const isWelcomePage = location.pathname === ROUTE.WELCOME;

  return (
    <FlexBox css={{flexDirection: 'row', background: COLOR_V2.WHITE, height: '100%', minHeight: '100vh'}}>
      {!isTablet && (
        <div css={leftSectionCss}>
          <Logo color={COLOR_V2.WHITE} scale={1.9} />
          <div css={{margin: '1.25rem 0'}}>
            <Text css={whiteFontCss} fontSize="1.25rem">
              {t('layoutSubHeader')}
            </Text>
            <br />
            <div css={{margin: '2rem 0'}}>
              <Bold css={whiteFontCss} fontSize="1.25rem">
                {isWelcomePage ? t('layoutListHeader2') : t('layoutListHeader1')}
              </Bold>
              <ul css={{paddingLeft: '1.5rem', lineHeight: '1.75rem', fontWeight: 'initial', maxWidth: '18rem'}}>
                {isWelcomePage ? (
                  <>
                    <li css={whiteFontCss}>{t('layoutListItem5')}</li>
                    <li css={whiteFontCss}>{t('layoutListItem6')}</li>
                  </>
                ) : (
                  <>
                    <li css={whiteFontCss}>{t('layoutListItem1')}</li>
                    <li css={whiteFontCss}>{t('layoutListItem2')}</li>
                    <li css={whiteFontCss}>{t('layoutListItem3')}</li>
                    <li css={whiteFontCss}>{t('layoutListItem4')}</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <WavesPattern />
        </div>
      )}
      <div css={{maxHeight: '100vh', overflowY: 'auto', width: '100%'}}>{children}</div>
    </FlexBox>
  );
};

const leftSectionCss: CSSObject = {
  background: 'black',
  width: '45%',
  margin: 0,
  height: '100vh',
  maxWidth: '30rem',
  padding: '6rem 3.75rem',
  position: 'relative',
  minHeight: '50rem',
};

const whiteFontCss: CSSObject = {
  color: 'white',
};
