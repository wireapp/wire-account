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

import {Runtime} from '@wireapp/commons';
import {OperatingSystem} from '@wireapp/commons/src/main/util/Runtime';
import {ButtonLink, ButtonProps, COLOR} from '@wireapp/react-ui-kit';
import {useTranslation} from 'react-i18next';
import {
  BRAND_NAME,
  DOWNLOAD_ANDROID_URL,
  DOWNLOAD_IOS_URL,
  DOWNLOAD_OSX_URL,
  DOWNLOAD_WINDOWS_URL,
  WEBSITE_URL,
} from 'script/Environment';

interface Props extends ButtonProps<any> {
  backgroundColor?: string;
}

const DirectDownloadButton = ({children, ...props}: Props) => {
  const [t] = useTranslation('open');
  const DEFAULT_LINK = `${WEBSITE_URL}/download`;
  const SYSTEM_DEPENDENT_LINKS = {
    [OperatingSystem.ANDROID]: DOWNLOAD_ANDROID_URL,
    [OperatingSystem.IOS]: DOWNLOAD_IOS_URL,
    [OperatingSystem.MAC]: DOWNLOAD_OSX_URL,
    [OperatingSystem.WINDOWS]: DOWNLOAD_WINDOWS_URL,
    [OperatingSystem.LINUX]: DEFAULT_LINK,
  };

  return (
    <ButtonLink
      backgroundColor={COLOR.GREEN}
      href={SYSTEM_DEPENDENT_LINKS[Runtime.getOSFamily()] || DEFAULT_LINK}
      data-uie-name="go-direct-download"
      {...props}
    >
      {children || t('downloadButton', {company: BRAND_NAME})}
    </ButtonLink>
  );
};

export {DirectDownloadButton};
