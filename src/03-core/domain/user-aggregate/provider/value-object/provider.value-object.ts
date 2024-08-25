import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import { ProviderEnum } from '../enum/provider.enum';
import ErrorValueObject from '@domain/common/errorValueObject';

class Provider {
  private static _error: ErrorValueObject = new ErrorValueObject(
    'AUTH_PROVIDER',
    'PROVIDER_NAME'
  );
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value?: string | null): Result<Provider, ErrorResult> {
    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(this._error.buildError(validationResult.reasons));
    }

    return ok(new Provider(value!));
  }

  private static validate(value?: string | null): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (value === null || value === undefined) {
      reasons.push(messagesValidator.empty('Provider'));
      return { isValid: false, reasons };
    }

    const normalizedValue = value.trim();
    const validProviders = Object.values(ProviderEnum);

    if (!validProviders.includes(normalizedValue as ProviderEnum)) {
      reasons.push(messagesValidator.invalidProviderMessage(normalizedValue));
    }

    return { isValid: reasons.length === 0, reasons };
  }

  get value(): string {
    return this._value;
  }

  public equals(other: Provider): boolean {
    return other.value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}

export default Provider;
