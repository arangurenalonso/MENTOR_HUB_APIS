import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';
import { err, ok, Result } from 'neverthrow';
import ErrorValueObject from '@domain/common/errorValueObject';

class Time {
  private static _error: ErrorValueObject = new ErrorValueObject(
    'TIME_OPTION',
    'TIME'
  );
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Result<Time, ErrorResult> {
    value = value.trim();

    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(this._error.buildError(validationResult.reasons));
    }

    return ok(new Time(value));
  }

  private static validate(value: string): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    // Expresión regular para validar el formato de hora HH:mm

    if (!domainRules.timeValidation.test(value)) {
      reasons.push(messagesValidator.invalidTimeFormat(value));
    }

    return { isValid: reasons.length === 0, reasons };
  }

  get value(): string {
    return this._value;
  }

  public equals(other: Time): boolean {
    return other.value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}

export default Time;
