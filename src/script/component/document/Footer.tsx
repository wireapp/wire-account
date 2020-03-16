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

import {Column, Columns, Content, Footer, Line, Link, Text} from '@wireapp/react-ui-kit';
import React from 'react';
import {WEBSITE_URL} from 'script/Environment';

interface Props extends React.HTMLProps<Document> {}

const WireFooter: React.FC<Props> = ({}) => {
  const copyrightText = '© Wire Swiss GmbH';
  return (
    <Footer>
      <Content>
        <Columns style={{padding: '16px 0'}}>
          <Column style={{textAlign: 'center'}}>
            <Line />
            {WEBSITE_URL ? (
              <Link href={`${WEBSITE_URL}/impressum/`}>{copyrightText}</Link>
            ) : (
              <Text fontSize={'11px'} bold style={{textTransform: 'uppercase'}}>
                {copyrightText}
              </Text>
            )}
          </Column>
        </Columns>
      </Content>
    </Footer>
  );
};

export default WireFooter;
