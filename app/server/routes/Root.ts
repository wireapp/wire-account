/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
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

import {Router} from 'express';
import {ServerConfig} from '../config';

const Root = (config: ServerConfig) => [
  Router().get('/', (req, res) => res.render('index')),
  Router().get('/delete', (req, res) => res.render('account/delete')),
  Router().get('/forgot', (req, res) => res.render('account/forgot')),
  Router().get('/reset', (req, res) => res.render('account/reset')),
  Router().get('/verify_bot', (req, res) => res.render('account/verify_bot')),
  Router().get('/verify_email', (req, res) => res.render('account/verify_email')),
  Router().get('/verify_phone', (req, res) => res.render('account/verify_phone')),
];

export default Root;
