import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';

class CoursePromotionalVideoS3Key {
  private readonly _value: string | null;

  private constructor(value: string | null) {
    this._value = value;
  }
  public static create(
    value?: string | null | undefined
  ): Result<CoursePromotionalVideoS3Key | null, ErrorResult> {
    if (value === null || value === undefined || value === '') {
      return ok(null);
    }
    return ok(new CoursePromotionalVideoS3Key(value));
  }

  get value(): string | null {
    return this._value;
  }

  public equals(other: CoursePromotionalVideoS3Key): boolean {
    return other._value === this._value;
  }

  public toString(): string {
    return this._value || '';
  }
}

export default CoursePromotionalVideoS3Key;
