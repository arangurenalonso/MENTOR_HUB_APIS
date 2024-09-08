import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';
import RichTextJsonContent from '@domain/common/RichTextJsonContent';
import ErrorValueObject from '@domain/common/errorValueObject';

class CourseDescription {
  private static _error: ErrorValueObject = new ErrorValueObject(
    'COURSE',
    'DESCRIPTION'
  );
  private readonly _value: RichTextJsonContent;

  private constructor(value: RichTextJsonContent) {
    this._value = value;
  }

  public static create(
    descriptionText: string
  ): Result<CourseDescription, ErrorResult> {
    const descriptionResult = RichTextJsonContent.create(
      'Course Description',
      descriptionText
    );
    if (descriptionResult.isErr()) return err(descriptionResult.error);

    const description = descriptionResult.value;

    if (description == null) {
      return err(this._error.buildError(messagesValidator.required()));
    }

    const totalWords = description.totalWords;

    if (totalWords > domainRules.courseDescriptionMaxLength) {
      return err(
        this._error.buildError(
          messagesValidator.maxLength(domainRules.courseDescriptionMaxLength)
        )
      );
    }

    return ok(new CourseDescription(description));
  }

  get value(): RichTextJsonContent {
    return this._value;
  }

  public equals(other: CourseDescription): boolean {
    return this._value.equals(other.value);
  }

  public toString(): string {
    return `${this._value.toString()}`.trim();
  }
}

export default CourseDescription;
