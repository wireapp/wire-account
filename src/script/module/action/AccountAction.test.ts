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

import {APIClient} from '@wireapp/api-client';

import {AccountAction} from './AccountAction';

describe('AccountAction meeting validation', () => {
  const createAction = (version = 19) => {
    const apiClient = new APIClient({urls: {name: 'test', rest: 'https://backend.example.com', ws: undefined}});
    apiClient.transport.http.useVersion(version);
    apiClient.backendFeatures = {...apiClient.backendFeatures, version};
    const request = jest.fn().mockResolvedValue({
      data: {title: 'Private meeting', start_time: '2099-01-01T12:00:00Z'},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });
    apiClient.transport.http.client.defaults.adapter = request;
    return {action: new AccountAction(apiClient), request};
  };

  it.each([19, 20])('checks the meeting at negotiated API version %s and discards metadata', async version => {
    const {action, request} = createAction(version);

    await expect(action.validateMeetingJoin('example.com', 'key', 'code')).resolves.toBeUndefined();

    expect(request).toHaveBeenCalledTimes(1);
    const config = request.mock.calls[0][0];
    expect(config.method).toBe('get');
    expect(config.baseURL).toBe('https://backend.example.com');
    expect(config.url).toBe(`/v${version}/meeting/example.com/key/code/code-check`);
    expect(config.params).toBeUndefined();
    expect(config.headers.Authorization).toBeUndefined();
    expect(config.data).toBeUndefined();
  });

  it('encodes path parameters', async () => {
    const {action, request} = createAction();

    await action.validateMeetingJoin('example.com', 'key/segment', 'code?value#fragment');

    const config = request.mock.calls[0][0];
    expect(config.url).toBe('/v19/meeting/example.com/key%2Fsegment/code%3Fvalue%23fragment/code-check');
  });

  it.each([403, 404])('propagates a rejected meeting check (%s)', async status => {
    const {action, request} = createAction();
    const error = new Error(`Meeting check failed: ${status}`);
    request.mockRejectedValueOnce(error);

    await expect(action.validateMeetingJoin('example.com', 'key', 'code')).rejects.toBe(error);
  });

  it.each([12, 19])('keeps conversation checks on negotiated API version %s', async version => {
    const {action, request} = createAction(version);

    await action.validateConversationJoin('group-key', 'group-code');

    const config = request.mock.calls[0][0];
    expect(config.method).toBe('post');
    expect(config.url).toBe(`/v${version}/conversations/code-check`);
    expect(JSON.parse(config.data)).toEqual({key: 'group-key', code: 'group-code'});
  });

  it.each([12, 18])('rejects meeting validation at API version %s without a request', async version => {
    const {action, request} = createAction(version);

    await expect(action.validateMeetingJoin('example.com', 'key', 'code')).rejects.toMatchObject({
      label: 'meeting-api-unsupported',
    });
    expect(request).not.toHaveBeenCalled();
  });
});
