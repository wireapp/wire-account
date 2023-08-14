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

import {ButtonLink, ButtonProps, COLOR} from '@wireapp/react-ui-kit';
import {useTranslation} from 'react-i18next';
import {BRAND_NAME, WEBSITE_URL} from 'script/Environment';

interface Props extends ButtonProps<any> {}

const WebsiteDownloadButton = (props: Props) => {
  const [t] = useTranslation('open');
  return (
    <ButtonLink
      backgroundColor={COLOR.GREEN}
      style={{color: COLOR.WHITE}}
      href={`${WEBSITE_URL}/download/`}
      data-uie-name="go-website-download"
      {...props}
    >
      {t('downloadButton', {company: BRAND_NAME})}
    </ButtonLink>
  );
};

export {WebsiteDownloadButton};
