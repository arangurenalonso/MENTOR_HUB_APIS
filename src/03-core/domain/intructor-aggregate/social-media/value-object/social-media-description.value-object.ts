import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';
import ErrorValueObject from '@domain/common/errorValueObject';

class SocialMediaDescription {
  private static _error: ErrorValueObject = new ErrorValueObject(
    'SOCIAL_MEDIA',
    'DESCRIPTION'
  );
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(
    value: string
  ): Result<SocialMediaDescription, ErrorResult> {
    value = value.trim();

    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(this._error.buildError(validationResult.reasons));
    }

    return ok(new SocialMediaDescription(value));
  }

  private static validate(value: string = ''): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (value === null || value === undefined) {
      reasons.push(messagesValidator.empty('Social Media Description'));
      return { isValid: false, reasons };
    }
    if (!domainRules.socialMediaDescription.test(value)) {
      reasons.push(messagesValidator.socialMediaDescriptionInvalidFormat);
    }
    if (value?.length < domainRules.socialMediaDescriptionMinLength) {
      reasons.push(
        messagesValidator.minLength(domainRules.socialMediaDescriptionMinLength)
      );
    }
    if (value?.length > domainRules.socialMediaDescriptionMaxLength) {
      messagesValidator.maxLength(domainRules.socialMediaDescriptionMaxLength);
    }

    return { isValid: reasons.length === 0, reasons };
  }

  get value(): string {
    return this._value;
  }

  public equals(other: SocialMediaDescription): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}

export default SocialMediaDescription;
