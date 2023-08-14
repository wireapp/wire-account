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

import {ButtonLink, COLOR, ButtonProps} from '@wireapp/react-ui-kit';
import {WEBAPP_URL} from 'script/Environment';

interface Props extends ButtonProps<any> {}

const OpenWebappButton = (props: Props) => {
  return (
    <ButtonLink
      backgroundColor={COLOR.BLUE}
      style={{color: COLOR.WHITE}}
      href={`${WEBAPP_URL}/auth/?immediate_login#login`}
      data-uie-name="go-webapp"
      {...props}
    />
  );
};

export {OpenWebappButton};
