import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import ProvidersErrors from '../error/provider.error';

class ProviderUid {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(
    value?: string | null
  ): Result<ProviderUid, ErrorResult> {
    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(
        ProvidersErrors.INVALID_PROVIDER_UID(validationResult.reasons)
      );
    }

    return ok(new ProviderUid(value!));
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
    if (normalizedValue.length == 0) {
      reasons.push(messagesValidator.empty('Provider'));
      return { isValid: false, reasons };
    }

    return { isValid: reasons.length === 0, reasons };
  }

  get value(): string {
    return this._value;
  }

  public equals(other: ProviderUid): boolean {
    return other.value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}

export default ProviderUid;
