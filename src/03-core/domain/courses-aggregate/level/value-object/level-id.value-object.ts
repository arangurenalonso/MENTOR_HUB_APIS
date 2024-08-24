import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import LevelErrors from '../error/level.error';
class LevelId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value?: string): Result<LevelId, ErrorResult> {
    if (value === null || value === undefined) {
      value = uuidv4();
    }
    if (!this.validate(value)) {
      return err(LevelErrors.INVALID_ID(value));
    }
    return ok(new LevelId(value));
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

  public equals(other: LevelId): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}
export default LevelId;
