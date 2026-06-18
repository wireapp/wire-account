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

import '../../util/test/mock/matchMediaMock';

import {screen} from '@testing-library/react';
import {Role, roleToPermissions} from '@wireapp/api-client/lib/team/member';
import {ActionProvider, ActionRoot} from 'script/module/action';
import {mountComponent} from 'script/util/test/TestUtil';

import {Welcome} from './Welcome';

function renderWelcomePage(teamName: string): void {
  const memberPermissions = roleToPermissions(Role.MEMBER);
  const mockContext = {
    accountAction: {},
    selfAction: {
      getSelf: jest.fn().mockResolvedValue({id: 'user-id', team: 'team-id'}),
    },
    teamAction: {
      getMember: jest.fn().mockResolvedValue({
        permissions: {
          copy: memberPermissions,
          self: memberPermissions,
        },
        user: 'user-id',
      }),
      getTeam: jest.fn().mockResolvedValue({
        creator: 'creator-id',
        icon: 'icon-id',
        id: 'team-id',
        name: teamName,
      }),
    },
  } as unknown as ActionRoot;

  mountComponent(
    <ActionProvider contextData={mockContext}>
      <Welcome />
    </ActionProvider>,
  );
}

describe('Welcome', () => {
  it('renders the migration welcome team name as text without executing markup', async () => {
    const maliciousTeamName = '<img src=x onerror=alert(1)><svg onload=alert(2)></svg><script>alert(3)</script>';
    renderWelcomePage(maliciousTeamName);

    const teamNameElement = await screen.findByText(maliciousTeamName);
    const welcomeSubHeaderElement = teamNameElement.parentElement;

    expect(teamNameElement.tagName).toBe('B');
    expect(teamNameElement.textContent).toBe(maliciousTeamName);
    expect(welcomeSubHeaderElement?.textContent).toContain(`Welcome to ${maliciousTeamName}`);
    expect(welcomeSubHeaderElement?.textContent).toContain(
      'We transferred your personal account into a team member account.',
    );

    expect(welcomeSubHeaderElement?.querySelector('br')).toBeDefined();
    expect(welcomeSubHeaderElement?.querySelector('img, svg, script')).toBeNull();
    expect(welcomeSubHeaderElement?.querySelector('[onerror], [onload]')).toBeNull();
  });
});
