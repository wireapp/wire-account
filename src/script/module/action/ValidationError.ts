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

export default class ValidationError extends Error {
  label: string;

  constructor(label: string) {
    super(label);
    this.name = this.constructor.name;
    this.label = label;
  }

  is = (label: string) => {
    return this.label === label;
  };

  static getAllPropertyNames<T>(obj: T): string[] {
    let props: string[] = [];
    do {
      props = props.concat(Object.getOwnPropertyNames(obj));
    } while ((obj = Object.getPrototypeOf(obj)));
    return props;
  }

  static handleValidationState(fieldName: string, validationState: ValidityState) {
    const field = ValidationError.getFieldByName(fieldName);
    const validationStateKeys = ValidationError.getAllPropertyNames(validationState);
    for (const key of validationStateKeys) {
      if (Object.values(ValidationError.ERROR).includes(key) && (validationState as any)[key]) {
        return new ValidationError((field as any)[ValidationError.getErrorKeyByValue(key)]);
      }
    }
    return null;
  }

  static ERROR = {
    PATTERN_MISMATCH: 'patternMismatch',
    RANGE_OVERFLOW: 'rangeOverflow',
    RANGE_UNDERFLOW: 'rangeUnderflow',
    STEP_MISMATCH: 'stepMismatch',
    TOO_LONG: 'tooLong',
    TYPE_MISMATCH: 'typeMismatch',
    VALUE_MISSING: 'valueMissing',
  };

  static getErrorKeyByValue = (errorValue: string) => {
    return Object.entries(ValidationError.ERROR).find(([key, value]) => value === errorValue)[0];
  };

  static mapErrorsToField = (fieldName: string): {[index: string]: string} => {
    return Object.entries(ValidationError.ERROR).reduce(
      (errors, [key, value]) => ({...errors, [key]: `${fieldName}-${value}`}),
      {},
    );
  };

  static FIELD: {[key: string]: {[key: string]: any}} = {
    EMAIL: {...ValidationError.mapErrorsToField('email'), name: 'email'},
    PASSWORD: {...ValidationError.mapErrorsToField('password'), name: 'password'},
  };

  static getFieldByName = (fieldName: string) => {
    return Object.entries(ValidationError.FIELD).find(([key, value]) => value.name === fieldName)[1];
  };
}
