import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import InstructorAvailabilityDomainErrors from '../error/instructor.domain.error';
import domainRules from '@domain/helpers/regular-exp';

class DayName {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value?: string | null): Result<DayName, ErrorResult> {
    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(
        InstructorAvailabilityDomainErrors.INVALID_DATE_NAME(
          validationResult.reasons
        )
      );
    }

    return ok(new DayName(value!));
  }

  private static validate(value?: string | null): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (value === null || value === undefined) {
      reasons.push(messagesValidator.empty('Day Name'));
      return { isValid: false, reasons };
    }

    const normalizedValue = value.trim().toLowerCase();
    const validDayNames = domainRules.dayNameValid.map((x) =>
      x.trim().toLowerCase()
    );

    if (!validDayNames.includes(normalizedValue)) {
      reasons.push(messagesValidator.invalidDayNameFormat(normalizedValue));
    }

    value = value.trim().toLowerCase();
    return { isValid: reasons.length === 0, reasons };
  }

  get value(): string {
    return this._value;
  }

  public equals(other: DayName): boolean {
    return other.value === this._value;
  }

  public toString(): string {
    return this._value;
  }
}

export default DayName;
