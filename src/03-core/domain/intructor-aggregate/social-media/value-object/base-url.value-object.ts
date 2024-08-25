import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';
import ErrorValueObject from '@domain/common/errorValueObject';

class BaseURL {
  private static _error: ErrorValueObject = new ErrorValueObject(
    'SOCIAL_MEDIA',
    'BASE_URL'
  );
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string = ''): Result<BaseURL, ErrorResult> {
    value = value.trim();

    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(this._error.buildError(validationResult.reasons));
    }
    const url = new URL(value);
    const baseURL = `${url.protocol}//${url.hostname}${
      url.port ? `:${url.port}` : ''
    }/`;
    return ok(new BaseURL(baseURL));
  }

  private static validate(value: string): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (value === null || value === undefined) {
      reasons.push(messagesValidator.empty('Base URL'));
      return { isValid: false, reasons };
    }

    let baseURL = '';
    try {
      const url = new URL(value);
      baseURL = `${url.protocol}//${url.hostname}${
        url.port ? `:${url.port}` : ''
      }/`;
    } catch (error) {
      reasons.push(messagesValidator.invalidURLFormat('WebsiteURL', value));
    }

    if (!domainRules.protocolRegex.test(value)) {
      reasons.push(messagesValidator.invalidProtocol('WebsiteURL', value));
    }

    return { isValid: reasons.length === 0, reasons };
  }

  get value(): string {
    return this._value;
  }

  public equals(other: BaseURL): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}

export default BaseURL;
