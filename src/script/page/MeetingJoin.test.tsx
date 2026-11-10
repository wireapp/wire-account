/*
 * Wire
 * Copyright (C) 2026 Wire Swiss GmbH
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

import '../util/test/mock/matchMediaMock';

import {Runtime} from '@wireapp/commons';
import {pathWithParams} from '@wireapp/commons/lib/util/UrlUtil';
import {act, fireEvent, screen, waitFor} from '@testing-library/react';
import {Route, Routes} from 'react-router-dom';
import * as Environment from 'script/Environment';
import {ActionProvider, ActionRoot} from 'script/module/action';
import {ROUTE} from 'script/route';
import {mountComponent} from 'script/util/test/TestUtil';

import {MeetingJoin} from './MeetingJoin';

jest.mock('script/util/SVGProvider', () => ({logo: undefined}));

const renderMeetingJoin = (validateMeetingJoin = jest.fn().mockResolvedValue(undefined)) => {
  const context = {accountAction: {validateMeetingJoin}, selfAction: {}, teamAction: {}} as unknown as ActionRoot;

  mountComponent(
    <ActionProvider contextData={context}>
      <Routes>
        <Route path={ROUTE.MEETING_JOIN} element={<MeetingJoin />} />
      </Routes>
    </ActionProvider>,
  );

  return validateMeetingJoin;
};

describe('MeetingJoin', () => {
  beforeEach(() => {
    jest.spyOn(Runtime, 'isMobileOS').mockReturnValue(false);
    jest.spyOn(Runtime, 'isMacOS').mockReturnValue(false);
    jest.replaceProperty(Environment, 'BRAND_NAME', 'Wire');
    window.history.pushState({}, '', `${ROUTE.MEETING_JOIN}?domain=example.com&key=key&code=code`);
  });

  afterEach(() => jest.restoreAllMocks());

  it.each([ROUTE.MEETING_JOIN, `${ROUTE.MEETING_JOIN}/`])(
    'shows the meeting invitation and validates credentials at %s',
    async path => {
      window.history.pushState({}, '', pathWithParams(path, {key: 'key', code: 'code'}));
      const validateMeetingJoin = renderMeetingJoin();

      expect(await screen.findByRole('heading', {name: 'You are invited to a meeting'})).toBeTruthy();
      expect(validateMeetingJoin).toHaveBeenCalledTimes(1);
      expect(validateMeetingJoin).toHaveBeenCalledWith('example.com', 'key', 'code');
      expect(
        screen.getByText(
          `Don’t have a ${Environment.BRAND_NAME} account? You can join this meeting as a temporary guest in your browser.`,
        ),
      ).toBeTruthy();
      expect(screen.queryByText(/You have been invited to join a conversation/)).toBeNull();
    },
  );

  it('does not display meeting metadata from query parameters or validation results', async () => {
    window.history.pushState(
      {},
      '',
      pathWithParams(ROUTE.MEETING_JOIN, {
        key: 'key',
        code: 'code',
        title: 'Private meeting',
        organizer: 'Private organizer',
      }),
    );
    renderMeetingJoin(jest.fn().mockResolvedValue({title: 'Confidential title', start_time: '2099-01-01T12:00:00Z'}));

    await screen.findByRole('heading', {name: 'You are invited to a meeting'});
    expect(screen.queryByText(/Private meeting|Private organizer|Confidential title|2099-01-01/)).toBeNull();
  });

  it('uses meeting destinations and preserves desktop website download', async () => {
    renderMeetingJoin();

    await screen.findByRole('heading', {name: 'You are invited to a meeting'});
    expect(screen.getByRole('link', {name: 'Join in App'}).getAttribute('href')).toBe(
      `${Environment.WIRE_APP_SCHEME}${pathWithParams('meeting-join/', {domain: 'example.com', code: 'code', key: 'key'})}`,
    );
    expect(screen.getByRole('link', {name: 'Join in Browser'}).getAttribute('href')).toBe(
      `${Environment.WEBAPP_URL}${pathWithParams('/meeting-join', {domain: 'example.com', code: 'code', key: 'key'})}`,
    );
    expect(screen.getByTestId('go-website-download')).toBeTruthy();
    expect(screen.queryByTestId('go-direct-download')).toBeNull();
  });

  it.each([true, false])('preserves direct download on mobile=%s', async isMobile => {
    jest.spyOn(Runtime, 'isMobileOS').mockReturnValue(isMobile);
    jest.spyOn(Runtime, 'isMacOS').mockReturnValue(!isMobile);
    renderMeetingJoin();

    await screen.findByRole('heading', {name: 'You are invited to a meeting'});
    expect(screen.getByRole('link', {name: 'Join in App'})).toBeTruthy();
    expect(Boolean(screen.queryByRole('link', {name: 'Join in Browser'}))).toBe(!isMobile);
    expect(screen.getByTestId('go-direct-download')).toBeTruthy();
    expect(screen.queryByTestId('go-website-download')).toBeNull();
  });

  it('uses the meeting headline on self-hosted deployments', async () => {
    jest.replaceProperty(Environment, 'IS_SELF_HOSTED', true);
    renderMeetingJoin();

    expect(await screen.findByRole('heading', {name: 'You are invited to a meeting'})).toBeTruthy();
    expect(screen.getByText('The meeting takes place on example.com')).toBeTruthy();
    expect(screen.queryByText('The conversation takes place on example.com')).toBeNull();
    expect(
      screen.getByText(
        `Don’t have a ${Environment.BRAND_NAME} account? You can join this meeting as a temporary guest in your browser.`,
      ),
    ).toBeTruthy();
    expect(screen.getByRole('link', {name: 'Join in Browser'})).toBeTruthy();
    expect(screen.queryByRole('link', {name: 'Join in App'})).toBeNull();
    expect(screen.queryByTestId('go-website-download')).toBeNull();
  });

  it('preserves the self-hosted mobile restriction', async () => {
    jest.replaceProperty(Environment, 'IS_SELF_HOSTED', true);
    jest.spyOn(Runtime, 'isMobileOS').mockReturnValue(true);
    renderMeetingJoin();

    await screen.findByRole('heading', {name: 'You are invited to a meeting'});
    expect(screen.getByText(/At the moment, you can’t join this meeting on your mobile device/)).toBeTruthy();
    expect(screen.queryByRole('link', {name: 'Join in Browser'})).toBeNull();
  });

  it('shows loading until validation finishes', async () => {
    let completeValidation: () => void = () => undefined;
    const validation = new Promise<void>(resolve => {
      completeValidation = resolve;
    });
    renderMeetingJoin(jest.fn().mockReturnValue(validation));

    expect(screen.getByText('Verifying link...')).toBeTruthy();
    expect(screen.queryByRole('heading', {name: 'You are invited to a meeting'})).toBeNull();

    await act(async () => completeValidation());

    expect(screen.getByRole('heading', {name: 'You are invited to a meeting'})).toBeTruthy();
  });

  it.each(['?domain=example.com&key=key', '?domain=example.com&code=code', '?key=key&code=code', ''])(
    'rejects missing credentials: %s',
    async query => {
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      window.history.pushState({}, '', `${ROUTE.MEETING_JOIN}${query}`);
      const validateMeetingJoin = renderMeetingJoin();

      expect(await screen.findByRole('heading', {name: 'Meeting link is invalid'})).toBeTruthy();
      expect(validateMeetingJoin).not.toHaveBeenCalled();
      expect(screen.queryByTestId('do-meeting-join-app')).toBeNull();
    },
  );

  it('shows meeting-specific copy for a missing meeting', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    renderMeetingJoin(jest.fn().mockRejectedValue(Object.assign(new Error('Not found'), {code: 404})));

    expect(await screen.findByRole('heading', {name: 'Meeting link is invalid'})).toBeTruthy();
    expect(screen.getByText('This meeting link has expired or is no longer valid.')).toBeTruthy();
    expect(screen.queryByRole('link', {name: 'Join in App'})).toBeNull();
  });

  it('allows retry after a network failure', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const validateMeetingJoin = jest
      .fn()
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValue(undefined);
    renderMeetingJoin(validateMeetingJoin);

    expect(await screen.findByRole('heading', {name: 'Unable to check the meeting link'})).toBeTruthy();
    expect(screen.queryByRole('link', {name: 'Join in App'})).toBeNull();

    fireEvent.click(screen.getByRole('button', {name: 'Try again'}));
    expect(await screen.findByRole('heading', {name: 'You are invited to a meeting'})).toBeTruthy();
    expect(validateMeetingJoin).toHaveBeenCalledTimes(2);
  });

  it('uses only the latest validation after meeting credentials change', async () => {
    let resolveFirst: () => void = () => undefined;
    let rejectSecond: (reason: Error) => void = () => undefined;
    const first = new Promise<void>(resolve => {
      resolveFirst = resolve;
    });
    const second = new Promise<void>((resolve, reject) => {
      void resolve;
      rejectSecond = reject;
    });
    const validateMeetingJoin = jest.fn().mockReturnValueOnce(first).mockReturnValueOnce(second);
    renderMeetingJoin(validateMeetingJoin);

    await act(async () => {
      window.history.pushState({}, '', `${ROUTE.MEETING_JOIN}?domain=example.com&key=next&code=second`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await waitFor(() => expect(validateMeetingJoin).toHaveBeenCalledTimes(2));
    expect(validateMeetingJoin).toHaveBeenLastCalledWith('example.com', 'next', 'second');
    expect(screen.queryByRole('link', {name: 'Join in App'})).toBeNull();

    await act(async () => resolveFirst());
    expect(screen.getByText('Verifying link...')).toBeTruthy();

    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    await act(async () => rejectSecond(Object.assign(new Error('Not found'), {code: 404})));
    expect(screen.getByRole('heading', {name: 'Meeting link is invalid'})).toBeTruthy();
    expect(screen.queryByRole('link', {name: 'Join in App'})).toBeNull();
  });

  it('keeps join actions available when the meeting requires a password', async () => {
    const error = Object.assign(new Error('Password required'), {label: 'invalid-meeting-password', code: 403});
    renderMeetingJoin(jest.fn().mockRejectedValue(error));

    expect(await screen.findByRole('heading', {name: 'You are invited to a meeting'})).toBeTruthy();
    expect(screen.getByRole('link', {name: 'Join in App'})).toBeTruthy();
    expect(screen.getByRole('link', {name: 'Join in Browser'})).toBeTruthy();
    expect(screen.queryByText('Meeting link is invalid')).toBeNull();
  });

  it('shows an unsupported API error without offering join actions', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const error = Object.assign(new Error('Meeting links require API v19 or newer'), {
      label: 'meeting-api-unsupported',
    });
    renderMeetingJoin(jest.fn().mockRejectedValue(error));

    expect(await screen.findByRole('heading', {name: 'Meeting links are unavailable'})).toBeTruthy();
    expect(screen.getByText('This server does not support joining meetings through a link.')).toBeTruthy();
    expect(screen.queryByText('Meeting link is invalid')).toBeNull();
    expect(screen.queryByRole('link', {name: 'Join in Browser'})).toBeNull();
    expect(screen.queryByRole('link', {name: 'Join in App'})).toBeNull();
  });

  it('does not treat unrelated forbidden errors as password-required links', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const error = Object.assign(new Error('Access denied'), {label: 'access-denied', code: 403});
    renderMeetingJoin(jest.fn().mockRejectedValue(error));

    expect(await screen.findByRole('heading', {name: 'Unable to check the meeting link'})).toBeTruthy();
    expect(screen.queryByRole('link', {name: 'Join in Browser'})).toBeNull();
  });
});
