import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import EmailErrors from '../error/email.error';

class EmailId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value?: string): Result<EmailId, ErrorResult> {
    if (value === null || value === undefined) {
      value = uuidv4();
    }
    if (!this.validate(value)) {
      return err(EmailErrors.EMAIL_INVALID_ID(value));
    }
    return ok(new EmailId(value));
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

  public equals(other: EmailId): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}
export default EmailId;
