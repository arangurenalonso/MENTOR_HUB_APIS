import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import ErrorValueObject from '@domain/common/errorValueObject';

class Birthdate {
  private static _error: ErrorValueObject = new ErrorValueObject(
    'NATURAL_PERSON',
    'BIRTHDATE'
  );
  private readonly _value: Date;

  private constructor(value: Date) {
    this._value = value;
  }

  public static create(
    value: string | number | Date | null | undefined
  ): Result<Birthdate | null, ErrorResult> {
    if (value === null || value === undefined) {
      return ok(null);
    }

    const validationResult = this.validate(value);
    if (validationResult.isErr()) {
      return err(validationResult.error);
    }

    return ok(new Birthdate(validationResult.value));
  }

  private static validate(
    value: string | number | Date
  ): Result<Date, ErrorResult> {
    const reasons: string[] = [];
    let parsedDate: Date;

    if (typeof value === 'string' || typeof value === 'number') {
      parsedDate = new Date(value);
    } else if (value instanceof Date) {
      parsedDate = value;
    } else {
      reasons.push(messagesValidator.invalidDateFormat('birthdate'));
      return err(this._error.buildError(reasons));
    }

    if (isNaN(parsedDate.getTime())) {
      reasons.push(messagesValidator.invalidDateFormat('birthdate'));
    }

    const today = new Date();
    if (parsedDate > today) {
      reasons.push(messagesValidator.dateInFuture('birthdate'));
    }

    if (reasons?.length > 0) {
      return err(this._error.buildError(reasons));
    }

    return ok(parsedDate);
  }

  get value(): Date {
    return this._value;
  }

  public equals(other: Birthdate): boolean {
    return this._value.getTime() === other._value.getTime();
  }

  public toString(): string {
    return this._value.toISOString().split('T')[0];
  }
}

export default Birthdate;
