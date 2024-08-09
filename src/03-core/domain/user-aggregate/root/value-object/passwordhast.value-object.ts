import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import domainRules from '@domain/helpers/regular-exp';
import UserErrors from '../error/user-error';
import messagesValidator from '@domain/helpers/messages-validator';

class PasswordHash {
  private readonly _value: string;

  private constructor(value: string) {
    if (!value || value?.length === 0) {
      throw new Error('Password hash cannot be empty.');
    }
    this._value = value;
  }

  public static create(value: string): Result<PasswordHash, ErrorResult> {
    // Check if the value is a bcrypt hash
    if (this.isHashed(value)) {
      return ok(new PasswordHash(value));
    }

    // If it's not a hash, validate it as a regular password
    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(UserErrors.USER_INVALID_PASSWORD(validationResult.reasons));
    }
    return ok(new PasswordHash(value));
  }
  private static isHashed(value: string): boolean {
    // Bcrypt hashes start with $2a$, $2b$, $2y$, or $2x$, followed by the cost factor (2 digits) and a 22-character salt
    return domainRules.bcryptHash.test(value);
  }
  private static validate(value: string): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (!value.match(domainRules.passwordLength)) {
      reasons.push(messagesValidator.passwordLength);
    }
    if (!value.match(domainRules.passwordLowercase)) {
      reasons.push(messagesValidator.passwordLowercase);
    }
    if (!value.match(domainRules.passwordUppercase)) {
      reasons.push(messagesValidator.passwordUppercase);
    }
    if (!value.match(domainRules.passwordNumber)) {
      reasons.push(messagesValidator.passwordNumber);
    }
    if (!value.match(domainRules.passwordSpecialChar)) {
      reasons.push(messagesValidator.passwordSpecialChar);
    }

    return { isValid: reasons?.length === 0, reasons };
  }
  get value(): string {
    return this._value;
  }

  public equals(other: PasswordHash): boolean {
    return this.value === other.value;
  }
}
export default PasswordHash;
