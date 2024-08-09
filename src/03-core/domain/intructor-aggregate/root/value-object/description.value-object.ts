import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';
import { err, ok, Result } from 'neverthrow';

class Description {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(
    type: string,
    value?: string | null
  ): Result<Description, ErrorResult> {
    if (!value) {
      return ok(new Description(''));
    }
    value = value.trim();

    if (!domainRules.textValid.test(value)) {
      return err(
        new ErrorResult(
          `${type.toUpperCase()}_INVALID`,
          messagesValidator.invalidFormat(type),
          400
        )
      );
    }

    return ok(new Description(value));
  }

  get value(): string {
    return this._value;
  }

  public equals(other: Description): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}

export default Description;
