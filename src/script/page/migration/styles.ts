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
import {COLOR_V2, QUERY, QueryKeys} from '@wireapp/react-ui-kit';

export const headerCss: CSSObject = {
  color: COLOR_V2.GRAY_90,
  fontSize: '3rem',
  display: 'block',
  textAlign: 'center',
  [QUERY[QueryKeys.TABLET_DOWN]]: {
    fontSize: '2rem',
    marginTop: '1.5rem',
  },
};

export const loginSubHeaderCss: CSSObject = {
  color: COLOR_V2.GRAY_70,
  lineHeight: '2.5rem',
  margin: '5rem 0',
  fontSize: '1.75rem',
  display: 'block',
  textAlign: 'center',

  [QUERY[QueryKeys.TABLET_DOWN]]: {
    lineHeight: '1.75rem',
    margin: '1rem 0 5rem 0',
    fontSize: '1rem',
  },
};

export const loginContainerCss: CSSObject = {
  maxWidth: '32rem',
  textAlign: 'center',
  padding: '1.5rem',
  margin: '4rem auto',
  [QUERY[QueryKeys.TABLET_DOWN]]: {
    marginTop: '1.5rem',
    margin: '2rem auto',
  },
};

export const termsContainerCss: CSSObject = {
  margin: '0 auto',
  textAlign: 'left',
  padding: '1.5rem 4rem',
  maxWidth: '55rem',
  [QUERY[QueryKeys.TABLET_DOWN]]: {
    marginTop: '1.5rem',
    margin: '0 auto',
    padding: '1.5rem 0',
  },
};

export const termsSubHeaderCss: CSSObject = {
  ...loginSubHeaderCss,
  margin: '1.8rem 0',
  [QUERY[QueryKeys.TABLET_DOWN]]: {
    ...(loginSubHeaderCss[QUERY[QueryKeys.TABLET_DOWN]] as CSSObject),
    margin: '1rem 2rem',
    fontSize: '1.25rem',
  },
};

export const termsContentHeaderCss: CSSObject = {
  fontSize: '1.25rem',
  marginBottom: '1rem',
  display: 'block',
  [QUERY[QueryKeys.TABLET_DOWN]]: {
    fontSize: '1rem',
  },
};

export const termsListCss: CSSObject = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  paddingLeft: '2rem',
  [QUERY[QueryKeys.TABLET_DOWN]]: {
    paddingLeft: '1.5rem',
  },
};

export const termsListItemCss: CSSObject = {
  fontSize: '1.25rem',
  lineHeight: '1.75rem',
  color: COLOR_V2.GRAY_70,
  [QUERY[QueryKeys.TABLET_DOWN]]: {
    fontSize: '1rem',
  },
};

export const termsContentWarningBox: CSSObject = {
  background: COLOR_V2.AMBER_DARK_50,
  border: '1px solid',
  borderColor: COLOR_V2.AMBER_DARK_600,
  padding: '1rem',
  borderRadius: '1rem',
  margin: '0 2rem',
};
export const termsContentWarningBoxContent: CSSObject = {
  fontSize: '1.25rem',
  lineHeight: '1.75rem',
  color: COLOR_V2.GRAY_90,
  [QUERY[QueryKeys.TABLET_DOWN]]: {
    fontSize: '1rem',
  },
};

export const termsContentBlueBox: CSSObject = {
  background: COLOR_V2.GRAY_20,
  padding: '0.75rem',
  borderRadius: '1rem',
  margin: '1rem 0',
  display: 'flex',
};

export const termsContentBlueBoxContent: CSSObject = {
  marginLeft: '1.5rem',
  fontSize: '1.25rem',
  lineHeight: '1.75rem',
  color: COLOR_V2.GRAY_80,
  textTransform: 'none',
  [QUERY[QueryKeys.TABLET_DOWN]]: {
    fontSize: '1rem',
  },
};

export const forgotPasswordCss: CSSObject = {
  textAlign: 'right',
  marginTop: '-0.25rem',
  marginBottom: '0.75rem',
  '& a:link': {
    color: COLOR_V2.GRAY_60,
  },
};

export const buttonCss: CSSObject = {
  width: '100%',
  ':disabled': {
    background: COLOR_V2.GRAY_60,
  },
};

export const termsCheckboxLabelCss: CSSObject = {
  color: '#34383B',
  fontSize: '0.875rem',
  fontWeight: 'normal',
};
