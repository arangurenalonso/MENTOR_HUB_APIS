import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';
import ErrorValueObject from '@domain/common/errorValueObject';

class TimeZoneStringId {
  private static _error: ErrorValueObject = new ErrorValueObject(
    'TIME_ZONE',
    'TIME_ZONE_STRING_ID'
  );
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Result<TimeZoneStringId, ErrorResult> {
    // Validate the value
    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(this._error.buildError(validationResult.reasons));
    }

    return ok(new TimeZoneStringId(value));
  }

  private static validate(value: string): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (value === null || value === undefined) {
      reasons.push(messagesValidator.empty('Time Zone String ID'));
      return { isValid: false, reasons };
    }

    if (!domainRules.timeZoneRegex.test(value)) {
      reasons.push(messagesValidator.timeZoneInvalidFormat(value));
    }

    return { isValid: reasons.length === 0, reasons };
  }

  get value(): string {
    return this._value;
  }

  public equals(other: TimeZoneStringId): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}

export default TimeZoneStringId;
