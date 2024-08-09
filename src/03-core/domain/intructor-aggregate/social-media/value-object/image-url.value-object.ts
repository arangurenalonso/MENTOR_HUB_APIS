import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';
import InstructorDomainErrors from '@domain/intructor-aggregate/root/error/instructor.domain.error';

class ImageURL {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(
    value?: string | null
  ): Result<ImageURL | null, ErrorResult> {
    if (!value) {
      return ok(null);
    }

    value = value.trim();

    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(InstructorDomainErrors.INVALID_URL(validationResult.reasons));
    }

    return ok(new ImageURL(value));
  }

  private static validate(value: string): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (!domainRules.protocolRegex.test(value)) {
      reasons.push(messagesValidator.invalidProtocol('WebsiteURL', value));
    }
    const domain = value.replace(domainRules.protocolRegex, '').split('/')[0];
    if (!domainRules.domainRegex.test(domain)) {
      reasons.push(messagesValidator.invalidDomain('WebsiteURL', domain));
    }

    if (!domainRules.pathRegex.test(value)) {
      reasons.push(messagesValidator.invalidPath('WebsiteURL', value));
    }

    // if (!regularExps.imageExtension.test(value)) {
    //   reasons.push(messagesValidator.invalidImageFormat);
    // }

    return { isValid: reasons.length === 0, reasons };
  }

  get value(): string | null {
    return this._value;
  }

  public equals(other: ImageURL): boolean {
    return other._value === this._value;
  }

  public toString(): string | null {
    return this._value;
  }
}

export default ImageURL;
