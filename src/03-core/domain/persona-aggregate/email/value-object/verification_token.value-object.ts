import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import EmailErrors from '../error/email.error';

class VerificationToken {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Result<VerificationToken, ErrorResult> {
    if (!this.validate(value)) {
      return err(EmailErrors.EMAIL_INVALID_VERIFICATION_TOKEN(value));
    }
    return ok(new VerificationToken(value));
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

  public equals(other: VerificationToken): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}
export default VerificationToken;
