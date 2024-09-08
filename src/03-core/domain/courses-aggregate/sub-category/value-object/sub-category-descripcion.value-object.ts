import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';
import TextValidationBuilder from '@domain/helpers/TextValidationBuilder';
import LengthValidationBuilder from '@domain/helpers/LengthValidationBuilder';
import ErrorValueObject from '@domain/common/errorValueObject';
class SubCategoryDescription {
  private static _error: ErrorValueObject = new ErrorValueObject(
    'SUB_CATEGORY',
    'DESCRIPTION'
  );
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value.toUpperCase(); // Ensure the value is stored in uppercase
  }
  public static create(
    value: string
  ): Result<SubCategoryDescription, ErrorResult> {
    value = value?.trim().toUpperCase();

    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(this._error.buildError(validationResult.reasons));
    }
    return ok(new SubCategoryDescription(value));
  }

  private static validate(value: string = ''): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (value === null || value === undefined || value === '') {
      reasons.push(messagesValidator.empty('Category Description'));
      return { isValid: false, reasons };
    }
    const textValidationResult = TextValidationBuilder.addLowercaseLetters()
      .addUppercaseLetters()
      .addNumbers()
      .addWhitespace()
      .addSpecialChars()
      .addPunctuation()
      .build()
      .validate(value);

    if (textValidationResult.isErr()) {
      reasons.push(textValidationResult.error);
    }
    const lenghtValidationResult = LengthValidationBuilder.setMinLength(
      domainRules.subCategoryMinLength
    )
      .setMaxLength(domainRules.subCategoryMaxLength)
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

  public equals(other: SubCategoryDescription): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}

export default SubCategoryDescription;
