import RoleErrors from '../error/role.error';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import regularExps from '@domain/helpers/regular-exp';

class RoleDescription {
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
      return err(RoleErrors.ROLE_INVALID_DESCRIPTION(validationResult.reasons));
    }
    return ok(new RoleDescription(value));
  }

  private static validate(value: string = ''): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (!value) {
      reasons.push(messagesValidator.empty('Role Description'));
      return { isValid: false, reasons };
    }
    if (!regularExps.roleDescription.test(value)) {
      reasons.push(messagesValidator.roleDescriptionInvalidFormat);
    }
    if (value?.length < regularExps.roleDescriptionMinLength) {
      reasons.push(
        messagesValidator.minLength(
          'Role Description',
          regularExps.roleDescriptionMinLength
        )
      );
    }
    if (value?.length > regularExps.roleDescriptionMaxLength) {
      messagesValidator.maxLength(
        'Role Description',
        regularExps.roleDescriptionMaxLength
      );
    }
    if (regularExps.blankSpace.test(value)) {
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
