import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';
import ErrorValueObject from '@domain/common/errorValueObject';

class RoleDescription {
  private static _error: ErrorValueObject = new ErrorValueObject(
    'ROLE',
    'DESCRIPTION'
  );
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value.toUpperCase(); // Ensure the value is stored in uppercase
  }
  public static create(value: string): Result<RoleDescription, ErrorResult> {
    // Transform to uppercase and ensure it starts with "ROLE_"
    value = value?.trim().toUpperCase();

    // Validate the description
    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(this._error.buildError(validationResult.reasons));
    }
    return ok(new RoleDescription(value));
  }

  private static validate(value: string = ''): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (value === null || value === undefined) {
      reasons.push(messagesValidator.empty('Role Description'));
      return { isValid: false, reasons };
    }
    if (!domainRules.roleDescription.test(value)) {
      reasons.push(messagesValidator.roleDescriptionInvalidFormat);
    }
    if (value?.length < domainRules.roleDescriptionMinLength) {
      reasons.push(
        messagesValidator.minLength(domainRules.roleDescriptionMinLength)
      );
    }
    if (value?.length > domainRules.roleDescriptionMaxLength) {
      messagesValidator.maxLength(domainRules.roleDescriptionMaxLength);
    }
    if (domainRules.blankSpace.test(value)) {
      // No permite espacios
      reasons.push(messagesValidator.blankSpace('Role Description'));
    }

    return { isValid: reasons.length === 0, reasons };
  }

  get value(): string {
    return this._value;
  }

  public equals(other: RoleDescription): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}

export default RoleDescription;
