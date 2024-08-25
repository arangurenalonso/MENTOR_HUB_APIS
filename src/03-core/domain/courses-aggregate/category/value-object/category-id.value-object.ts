import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import ErrorValueObject from '@domain/common/errorValueObject';
import messagesValidator from '@domain/helpers/messages-validator';

class CategoryId {
  private readonly _value: string;

  private static _error: ErrorValueObject = new ErrorValueObject(
    'SUB_CATEGORY',
    'ID'
  );

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value?: string): Result<CategoryId, ErrorResult> {
    if (value === null || value === undefined) {
      value = uuidv4();
    }
    if (!this.validate(value)) {
      return err(this._error.buildError(messagesValidator.guid()));
    }
    return ok(new CategoryId(value));
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

  public equals(other: CategoryId): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}
export default CategoryId;
