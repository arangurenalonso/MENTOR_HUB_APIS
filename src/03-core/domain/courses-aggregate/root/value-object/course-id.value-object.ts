import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import ErrorValueObject from '@domain/common/errorValueObject';
import messagesValidator from '@domain/helpers/messages-validator';

class CourseId {
  private readonly _value: string;

  private static _error: ErrorValueObject = new ErrorValueObject(
    'COURSE',
    'ID'
  );

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value?: string): Result<CourseId, ErrorResult> {
    if (value === null || value === undefined) {
      value = uuidv4();
    }
    if (!this.validate(value)) {
      return err(this._error.buildError(messagesValidator.guid()));
    }
    return ok(new CourseId(value));
  }

  private static validate(value: string): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    if (!uuidValidate(value)) {
      return false;
    }
    return true;
  }

  get value(): string {
    return this._value;
  }

  public equals(other: CourseId): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}
export default CourseId;