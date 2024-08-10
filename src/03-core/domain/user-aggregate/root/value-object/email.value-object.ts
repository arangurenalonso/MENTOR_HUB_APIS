import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import domainRules from '@domain/helpers/regular-exp';
import UserErrors from '../error/user-error';

class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value?: string): Result<Email, ErrorResult> {
    if (value === null || value === undefined) {
      return err(UserErrors.USER_INVALID_EMAIL(value));
    }
    if (!this.validate(value)) {
      return err(UserErrors.USER_INVALID_EMAIL(value));
    }
    return ok(new Email(value));
  }
  private static validate(value: string): boolean {
    return domainRules.email.test(value);
  }

  get value(): string {
    return this._value;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }
}
export default Email;
