import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import SocialMediaErrors from '../error/social-media.error';
import ErrorValueObject from '@domain/common/errorValueObject';
import messagesValidator from '@domain/helpers/messages-validator';

class SocialMediaURLProfile {
  private static _error: ErrorValueObject = new ErrorValueObject(
    'SOCIAL_MEDIA',
    'URL_PROFILE'
  );
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(
    value: string,
    baseURL: string
  ): Result<SocialMediaURLProfile, ErrorResult> {
    if (value === null || value === undefined) {
      return err(this._error.buildError(messagesValidator.required()));
    }

    value = value.trim();
    if (!value.startsWith(baseURL)) {
      return err(SocialMediaErrors.INVALID_URL_PROFILE(baseURL));
    }

    return ok(new SocialMediaURLProfile(value));
  }

  get value(): string {
    return this._value;
  }

  public equals(other: SocialMediaURLProfile): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}

export default SocialMediaURLProfile;
