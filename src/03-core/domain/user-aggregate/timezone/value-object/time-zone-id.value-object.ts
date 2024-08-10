import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import TimeZoneErrors from '../error/time-zone.error';
class TimeZoneId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value?: string): Result<TimeZoneId, ErrorResult> {
    if (value === null || value === undefined) {
      value = uuidv4();
    }
    if (!this.validate(value)) {
      return err(TimeZoneErrors.INVALID_ID(value));
    }
    return ok(new TimeZoneId(value));
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

  public equals(other: TimeZoneId): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}
export default TimeZoneId;
