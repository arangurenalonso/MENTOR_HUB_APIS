import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import TimeZoneErrors from '../error/time-zone.error';
import regularExps from '@domain/helpers/regular-exp';

class OffsetHours {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  public static create(value: number): Result<OffsetHours, ErrorResult> {
    // Validate the value
    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(TimeZoneErrors.INVALID_OFFSET_HOURS(validationResult.reasons));
    }

    return ok(new OffsetHours(value));
  }

  private static validate(value: number): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (!Number.isInteger(value)) {
      reasons.push(messagesValidator.mustBeInteger('Offset Hours'));
    }
    if (
      value < regularExps.minHoursOffSetValid ||
      value > regularExps.maxHoursOffSetValid
    ) {
      reasons.push(
        messagesValidator.range(
          'Offset Hours',
          regularExps.minHoursOffSetValid,
          regularExps.maxHoursOffSetValid
        )
      );
    }

    return { isValid: reasons.length === 0, reasons };
  }

  get value(): number {
    return this._value;
  }

  public equals(other: OffsetHours): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}

export default OffsetHours;
