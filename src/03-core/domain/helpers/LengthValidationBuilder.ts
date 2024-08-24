import { err, ok, Result } from 'neverthrow';

class LengthValidation {
  private _minLength?: number;
  private _maxLength?: number;

  private constructor(minLength?: number, maxLength?: number) {
    this._minLength = minLength;
    this._maxLength = maxLength;
  }

  public static create(
    minLength?: number,
    maxLength?: number
  ): LengthValidation {
    return new LengthValidation(minLength, maxLength);
  }

  validate(value: string): Result<void, string> {
    const length = value.length;
    if (!this._minLength && !this._maxLength) {
      return err('No length validation rules found.');
    }
    if (this._minLength && this._maxLength) {
      if (
        (this._minLength && length < this._minLength) ||
        (this._maxLength && length > this._maxLength)
      ) {
        return err(
          `must be at least ${this._minLength} characters and must not exceed ${this._maxLength} characters long.`
        );
      }
    }
    if (this._minLength && length < this._minLength) {
      return err(`must be at least ${this._minLength} characters long.`);
    }

    if (this._maxLength && length > this._maxLength) {
      return err(`must not exceed ${this._maxLength} characters.`);
    }

    return ok(undefined);
  }
}

class LengthValidationBuilder {
  private static minLength?: number;
  private static maxLength?: number;

  public static setMinLength(
    minLength: number
  ): typeof LengthValidationBuilder {
    this.minLength = minLength;
    return this;
  }

  public static setMaxLength(
    maxLength: number
  ): typeof LengthValidationBuilder {
    this.maxLength = maxLength;
    return this;
  }

  public static build(): LengthValidation {
    return LengthValidation.create(this.minLength, this.maxLength);
  }
}

export default LengthValidationBuilder;
