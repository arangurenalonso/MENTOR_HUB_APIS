import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import RoleErrors from '../error/role.error';

class RoleId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value?: string): Result<RoleId, ErrorResult> {
    if (!value) {
      value = uuidv4();
    }
    if (!this.validate(value)) {
      return err(RoleErrors.ROLE_INVALID_ID(value));
    }
    return ok(new RoleId(value));
  }

  private static validate(value: string): boolean {
    if (!value) {
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

  public equals(other: RoleId): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}
export default RoleId;