/*
 * Wire
 * Copyright (C) 2016 Wire Swiss GmbH
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

window.initVerify = function() {
  var url = $('#url').data('url');

  if ($('#url').data('status') === 'success') {
    return verifySuccess(200);
  }

  if (url) {
    $.ajax({
      url: url,
      xhrFields: {withCredentials: eval($('#url').data('credentials'))}
    }).done(function(data, status_text, xhr) {
      sendEvent('account.verify-email', 'success', xhr.status, 1);
      verifySuccess(xhr.status);
    }).fail(function(xhr) {
      sendEvent('account.verify-email', 'fail', xhr.status, 1);
      verifyFail(xhr.status);
    });
  } else {
    verifyFail(404);
  }
};

window.checkForAccess = function() {
  var backendUrl = $('#url').data('backend-url');
  var teamsUrl = $('#url').data('redirect-teams');
  if (backendUrl && teamsUrl) {
    $.ajax({
      url: backendUrl + '/access',
      method: 'POST',
      xhrFields: {withCredentials: true}
    }).done(function(data, status_text, xhr) {
      redirectToTeams(backendUrl, teamsUrl, data);
    });
  }
}

window.redirectToTeams = function (backendUrl, teamsUrl, accessTokenData) {
  $.ajax({
    url: backendUrl + '/teams',
    headers: {
      'Authorization': accessTokenData.token_type + ' ' + accessTokenData.access_token,
      'Content-Type': 'application/json',
    }
  }).done(function(data, status_text, xhr) {
    var team = data.filter(function(team){
      return team.binding === true;
    });
    if (team[0]) {
      window.location.href = teamsUrl;
    }
  });
}

window.verifyFail = function(status) {
  $('.loading').hide();
  if (status === 404) {
    $('.' + status).removeClass('hide');
  } else {
    $('.500').removeClass('hide');
  }
};

window.verifySuccess = function(status) {
  $('.loading').hide();
  $('.' + status).removeClass('hide');
  checkForAccess();
  var redirectApp = $('#url').data('redirect');
  if (redirectApp) {
    window.location.href = redirectApp;
  }
};
