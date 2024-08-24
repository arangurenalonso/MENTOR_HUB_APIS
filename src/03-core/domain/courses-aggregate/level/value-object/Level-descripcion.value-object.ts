import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';
import LevelErrors from '../error/level.error';
import TextValidationBuilder from '@domain/helpers/TextValidationBuilder';
import LengthValidationBuilder from '@domain/helpers/LengthValidationBuilder';
import { get } from 'http';

class LevelDescription {
  private static prefix: string = 'DESCRIPTION';
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value.toUpperCase(); // Ensure the value is stored in uppercase
  }
  public static create(value: string): Result<LevelDescription, ErrorResult> {
    // Transform to uppercase and ensure it starts with "ROLE_"
    value = value?.trim().toUpperCase();

    // Validate the description
    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(LevelErrors.INVALID_DESCRIPTION(validationResult.reasons));
    }
    return ok(new LevelDescription(value));
  }

  private static validate(value: string = ''): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (value === null || value === undefined || value === '') {
      reasons.push(messagesValidator.empty('Role Description'));
      return { isValid: false, reasons };
    }
    const textValidationResult = TextValidationBuilder.addLowercaseLetters()
      .addUppercaseLetters()
      .addNumbers()
      .build()
      .validate(value);

    if (textValidationResult.isErr()) {
      reasons.push(textValidationResult.error);
    }
    const lenghtValidationResult = LengthValidationBuilder.setMinLength(
      domainRules.levelDescriptionMinLength
    )
      .setMaxLength(domainRules.levelDescriptionMaxLength)
      .build()
      .validate(value);

    if (lenghtValidationResult.isErr()) {
      reasons.push(lenghtValidationResult.error);
    }

    return { isValid: reasons.length === 0, reasons };
  }

  get value(): string {
    return this._value;
  }

  public equals(other: LevelDescription): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}

export default LevelDescription;
