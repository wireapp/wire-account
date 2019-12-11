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
import {FlexBox, Text, TextLink} from '@wireapp/react-ui-kit';
import React from 'react';
import Document from 'script/component/Document';
import {DOWNLOAD_ANDROID_URL, DOWNLOAD_IOS_URL, isEnvironment, WEBSITE_URL} from 'script/Environment';

interface Props extends React.HTMLProps<Document> {}

const Index = (props: Props) => {
  let redirect = WEBSITE_URL;
  const isGetWireHost = window.location.hostname === 'get.wire.com' || window.location.hostname === 'get.zinfra.io';
  if (isGetWireHost) {
    redirect = `${WEBSITE_URL}/download`;
    if (Runtime.isAndroid()) {
      redirect = DOWNLOAD_ANDROID_URL;
    }
    if (Runtime.isIOS()) {
      redirect = DOWNLOAD_IOS_URL;
    }
  }
  if (!isEnvironment('development')) {
    window.location.assign(redirect);
  }
  return (
    <Document>
      <FlexBox style={{margin: 'auto'}}>
        <Text center block>
          {'This page would have redirected to: '}
          <TextLink href={redirect}>{redirect}</TextLink>
        </Text>
      </FlexBox>
    </Document>
  );
};

export default Index;
