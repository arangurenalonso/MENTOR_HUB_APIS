import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import SocialMediaErrors from '../error/social-media.error';
import regularExps from '@domain/helpers/regular-exp';

class SocialMediaDescription {
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
      return err(
        SocialMediaErrors.INVALID_DESCRIPTION(validationResult.reasons)
      );
    }

    return ok(new SocialMediaDescription(value));
  }

  private static validate(value: string = ''): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (!value) {
      reasons.push(messagesValidator.empty('Social Media Description'));
      return { isValid: false, reasons };
    }
    if (!regularExps.socialMediaDescription.test(value)) {
      reasons.push(messagesValidator.socialMediaDescriptionInvalidFormat);
    }
    if (value?.length < regularExps.socialMediaDescriptionMinLength) {
      reasons.push(
        messagesValidator.minLength(
          'Social Media Description',
          regularExps.socialMediaDescriptionMinLength
        )
      );
    }
    if (value?.length > regularExps.socialMediaDescriptionMaxLength) {
      messagesValidator.maxLength(
        'Social Media Description',
        regularExps.socialMediaDescriptionMaxLength
      );
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
