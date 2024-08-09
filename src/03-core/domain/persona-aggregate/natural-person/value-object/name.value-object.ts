import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import PersonErrors from '../../root/error/person.error';
import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';

class Name {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value; // Almacenamos el valor tal como fue validado
  }

  public static create(value: string): Result<Name, ErrorResult> {
    // Transformamos el valor para eliminar espacios y validamos que no sea nulo
    value = value?.trim();

    // Validamos el nombre
    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(PersonErrors.PERSON_INVALID_NAME(validationResult.reasons));
    }

    return ok(new Name(value));
  }

  private static validate(value: string): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (!value) {
      reasons.push(messagesValidator.empty('name'));
    }
    if (value?.length < domainRules.personNameMinLength) {
      reasons.push(
        messagesValidator.minLength('name', domainRules.personNameMinLength)
      );
    }
    if (value?.length > domainRules.personNameMaxLength) {
      reasons.push(
        messagesValidator.maxLength('name', domainRules.personNameMaxLength)
      );
    }
    if (!domainRules.personNameValid.test(value)) {
      reasons.push(messagesValidator.nameInvalidFormat);
    }

    return { isValid: reasons?.length === 0, reasons };
  }

  get value(): string {
    return this._value;
  }

  public equals(other: Name): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}

export default Name;
