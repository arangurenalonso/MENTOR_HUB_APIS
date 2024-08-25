import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';
import ErrorValueObject from '@domain/common/errorValueObject';

class Heading {
  private static _error: ErrorValueObject = new ErrorValueObject(
    'INSTRUCTOR',
    'HEADING'
  );
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(
    value?: string | null
  ): Result<Heading | null, ErrorResult> {
    if (value === null || value === undefined) {
      return ok(null);
    }
    value = value.trim();

    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(this._error.buildError(validationResult.reasons));
    }

    return ok(new Heading(value));
  }

  private static validate(value: string): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (value === null || value === undefined) {
      reasons.push(messagesValidator.empty('Heading'));
    }
    if (value.length < domainRules.headingMinLength) {
      reasons.push(messagesValidator.minLength(domainRules.headingMinLength));
    }
    if (value.length > domainRules.headingMaxLength) {
      reasons.push(messagesValidator.maxLength(domainRules.headingMaxLength));
    }
    if (!domainRules.headingValid.test(value)) {
      reasons.push(messagesValidator.headingInvalidFormat);
    }

    return { isValid: reasons.length === 0, reasons };
  }

  get value(): string {
    return this._value;
  }

  public equals(other: Heading): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}

export default Heading;
