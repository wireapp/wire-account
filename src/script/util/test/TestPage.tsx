/*
 * Wire
 * Copyright (C) 2020 Wire Swiss GmbH
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

import React from 'react';
import {act, fireEvent} from '@testing-library/react';
import {mountComponent} from './TestUtil';

export default class TestPage<T = undefined> {
  private readonly driver: ReturnType<typeof mountComponent>;
  private readonly props?: T;

  constructor(Component: React.FC<T> | React.ComponentClass<T>, props?: T) {
    this.props = props;
    this.driver = mountComponent(<Component {...this.props} />);
  }

  getProps = () => this.props;

  queryByTestId = (selector: string) => this.driver.queryByTestId(selector);

  private readonly do = (action: Function) => {
    act(() => {
      action();
    });
  };
  click = (element: HTMLElement) => this.do(() => fireEvent.click(element));
  changeValue = (element: HTMLElement, value: string) => this.do(() => fireEvent.change(element, {target: {value}}));
  changeFiles = (element: HTMLElement, files: File[]) => this.do(() => fireEvent.change(element, {target: {files}}));
  submit = (element: HTMLElement) => this.do(() => fireEvent.submit(element));
  mouseEnter = (element: HTMLElement) => this.do(() => fireEvent.mouseEnter(element));
  keyCodeUp = (element: HTMLElement, keyCode: number) => this.do(() => fireEvent.keyUp(element, {keyCode}));
  keyCodeDown = (element: HTMLElement, keyCode: number) => this.do(() => fireEvent.keyDown(element, {keyCode}));

  // eslint-disable-next-line no-console
  debug = (element?: HTMLElement) => console.log(element ? element : this.driver);
}
