import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import TimeZoneErrors from '@domain/user-aggregate/timezone/error/time-zone.error';
import domainRules from '@domain/helpers/regular-exp';

class TimeZoneStringId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Result<TimeZoneStringId, ErrorResult> {
    // Validate the value
    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(
        TimeZoneErrors.INVALID_TIMEZONE_STRING_ID(validationResult.reasons)
      );
    }

    return ok(new TimeZoneStringId(value));
  }

  private static validate(value: string): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (!value) {
      reasons.push(messagesValidator.empty('Time Zone String ID'));
      return { isValid: false, reasons };
    }

    if (!domainRules.timeZoneRegex.test(value)) {
      reasons.push(messagesValidator.timeZoneInvalidFormat);
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
