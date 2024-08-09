import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import InstructorAvailabilityDomainErrors from '../error/instructor.domain.error';
import domainRules from '@domain/helpers/regular-exp';

class DayIndex {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  public static create(value?: number | null): Result<DayIndex, ErrorResult> {
    const validationResult = this.validate(value);
    if (!validationResult.isValid) {
      return err(
        InstructorAvailabilityDomainErrors.INVALID_DATE_INDEX(
          validationResult.reasons
        )
      );
    }

    return ok(new DayIndex(value!));
  }

  private static validate(value?: number | null): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (!value) {
      reasons.push(messagesValidator.empty('Day Index'));
      return { isValid: false, reasons };
    }

    if (!Number.isInteger(value)) {
      reasons.push(messagesValidator.mustBeInteger('Day Index'));
    }
    if (
      value < domainRules.minDateIndexValid ||
      value > domainRules.maxDateIndexValid
    ) {
      reasons.push(
        messagesValidator.range(
          'Day Index',
          domainRules.minDateIndexValid,
          domainRules.maxDateIndexValid
        )
      );
    }

    return { isValid: reasons.length === 0, reasons };
  }

  get value(): number {
    return this._value;
  }

  public equals(other: DayIndex): boolean {
    return other.value === this._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}

export default DayIndex;
