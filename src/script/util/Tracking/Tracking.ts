/*
 * Wire
 * Copyright (C) 2024 Wire Swiss GmbH
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

import {APP_NAME, COUNTLY_API_KEY, COUNTLY_SERVER_URL, VERSION} from 'script/Environment';
import * as telemetry from '@wireapp/telemetry';
import {v4 as createUUID} from 'uuid';
import {EventName, SegmentationKey} from './types';
import {REPORTING_DEVICE_ID} from './constants';

let isProductReportingActivated = false;

const getDeviceId = () => {
  let deviceId = window.localStorage.getItem(REPORTING_DEVICE_ID);
  if (!deviceId) {
    deviceId = createUUID();
    window.localStorage.setItem(REPORTING_DEVICE_ID, deviceId);
  }
  return deviceId;
};

export const initializeTelemetry = () => {
  if (!COUNTLY_SERVER_URL || !COUNTLY_API_KEY) {
    return;
  }

  if (!telemetry.isLoaded() || isProductReportingActivated) {
    return;
  }

  isProductReportingActivated = true;

  telemetry.initialize({
    appVersion: VERSION,
    provider: {
      apiKey: COUNTLY_API_KEY,
      serverUrl: COUNTLY_SERVER_URL,
      enableLogging: false,
      autoClickTracking: true,
    },
  });

  telemetry.addAllConsentFeatures();

  const device_id = getDeviceId();

  telemetry.changeDeviceId(device_id);
  telemetry.disableOfflineMode(device_id);

  telemetry.beginSession();

  window.addEventListener('beforeunload', () => {
    telemetry.endSession();
  });
};

export const reportEvent = (eventName: EventName, segmentation?: Record<string, string>) => {
  if (!isProductReportingActivated) {
    return;
  }

  const telemetryEvent: telemetry.TelemetryEvent = {
    name: eventName,
    segmentation: {
      ...segmentation,
      [SegmentationKey.APP]: APP_NAME,
      [SegmentationKey.APP_VERSION]: VERSION,
    },
  };

  telemetry.trackEvent(telemetryEvent);
};
