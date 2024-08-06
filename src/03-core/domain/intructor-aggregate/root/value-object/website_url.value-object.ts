import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import regularExps from '@domain/helpers/regular-exp';
import InstructorDomainErrors from '../error/instructor.domain.error';

class WebsiteURL {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(
    value?: string | null
  ): Result<WebsiteURL | null, ErrorResult> {
    if (!value) {
      return ok(null);
    }

    value = value.trim();

    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(InstructorDomainErrors.INVALID_URL(validationResult.reasons));
    }

    return ok(new WebsiteURL(value));
  }

  private static validate(value: string): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (!regularExps.protocolRegex.test(value)) {
      reasons.push(messagesValidator.invalidProtocol('WebsiteURL', value));
    }

    if (!regularExps.domainRegex.test(value)) {
      reasons.push(messagesValidator.invalidDomain('WebsiteURL', value));
    }

    if (!regularExps.pathRegex.test(value)) {
      reasons.push(messagesValidator.invalidPath('WebsiteURL', value));
    }

    return { isValid: reasons.length === 0, reasons };
  }

  get value(): string | null {
    return this._value;
  }

  public equals(other: WebsiteURL): boolean {
    return other._value === this._value;
  }

  public toString(): string | null {
    return this._value;
  }
}

export default WebsiteURL;
