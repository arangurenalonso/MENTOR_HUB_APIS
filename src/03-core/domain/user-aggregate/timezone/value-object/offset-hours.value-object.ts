import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';
import ErrorValueObject from '@domain/common/errorValueObject';

class OffsetHours {
  private static _error: ErrorValueObject = new ErrorValueObject(
    'TIME_ZONE',
    'OFFSET_HOURS'
  );
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  public static create(value: number): Result<OffsetHours, ErrorResult> {
    // Validate the value
    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(this._error.buildError(validationResult.reasons));
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
      value < domainRules.minHoursOffSetValid ||
      value > domainRules.maxHoursOffSetValid
    ) {
      reasons.push(
        messagesValidator.range(
          domainRules.minHoursOffSetValid,
          domainRules.maxHoursOffSetValid
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
