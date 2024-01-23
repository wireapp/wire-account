/*
 * Wire
 * Copyright (C) 2022 Wire Swiss GmbH
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

const mockConfig = {
  IS_SELF_HOSTED: false,
};
jest.mock('script/Environment', () => mockConfig);

import {OpenWireButtons} from './OpenWireButtons';
import {Runtime} from '@wireapp/commons';
import {render} from '@testing-library/react';
import {withTheme} from 'script/util/test/TestUtil';

describe('OpenWireButtons', () => {
  const defaultParams = {
    paths: {app: '', webapp: ''},
    translate: (key: string) => key,
    uieName: 'open',
  };
  describe('on mobile', () => {
    it('shows open app & direct download', () => {
      jest.spyOn(Runtime, 'isMobileOS').and.returnValue(true);

      const res = render(withTheme(<OpenWireButtons {...defaultParams} />));
      res.getByText('openWithApp');
      expect(res.queryByText('openWithBrowser')).toBe(null);
      res.getByText('downloadApp');
    });
  });

  describe('on desktop', () => {
    beforeEach(() => {
      jest.spyOn(Runtime, 'isMobileOS').and.returnValue(false);
      jest.spyOn(Runtime, 'isMacOS').and.returnValue(true);
    });

    it('shows open app, webapp & direct download on MacOS', async () => {
      const res = render(withTheme(<OpenWireButtons {...defaultParams} />));
      res.getByText('openWithApp');
      res.getByText('openWithBrowser');
      res.getByText('downloadApp');
    });

    it('only show join in webapp when in a self hosted env', async () => {
      mockConfig.IS_SELF_HOSTED = true;
      const res = render(withTheme(<OpenWireButtons {...defaultParams} />));
      expect(res.queryByText('openWithApp')).toBe(null);
      res.getByText('openWithBrowser');
      expect(res.queryByText('downloadApp')).toBe(null);
    });
  });
});
