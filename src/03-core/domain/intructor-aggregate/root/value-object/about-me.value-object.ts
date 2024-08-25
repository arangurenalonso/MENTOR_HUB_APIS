import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';
import RichTextJsonContent from '@domain/common/RichTextJsonContent';
import ErrorValueObject from '@domain/common/errorValueObject';

class AboutMe {
  private static _error: ErrorValueObject = new ErrorValueObject(
    'INSTRUCTOR',
    'ABOUT_ME'
  );
  private readonly _introduction: RichTextJsonContent;
  private readonly _teachingExperience: RichTextJsonContent;
  private readonly _motivation: RichTextJsonContent;

  private constructor(
    introduction: RichTextJsonContent,
    teachingExperience: RichTextJsonContent,
    motivation: RichTextJsonContent
  ) {
    this._introduction = introduction;
    this._teachingExperience = teachingExperience;
    this._motivation = motivation;
  }

  public static create(
    introductionText?: string | null,
    teachingExperienceText?: string | null,
    motivationText?: string | null
  ): Result<AboutMe | null, ErrorResult> {
    const introductionResult = RichTextJsonContent.create(
      'Introduction',
      introductionText
    );
    if (introductionResult.isErr()) return err(introductionResult.error);

    const teachingExperienceResult = RichTextJsonContent.create(
      'Teaching Experience',
      teachingExperienceText
    );
    if (teachingExperienceResult.isErr())
      return err(teachingExperienceResult.error);

    const motivationResult = RichTextJsonContent.create(
      'Motivation',
      motivationText
    );
    if (motivationResult.isErr()) return err(motivationResult.error);

    const intruduction = introductionResult.value;
    const teachingExperience = teachingExperienceResult.value;
    const motivation = motivationResult.value;

    if (
      intruduction == null &&
      teachingExperience == null &&
      motivation == null
    ) {
      return ok(null);
    }
    if (
      intruduction == null ||
      teachingExperience == null ||
      motivation == null
    ) {
      const missingFields = [];
      if (intruduction == null) missingFields.push('Introduction');
      return err(
        this._error.buildError(
          missingFields.map((x) => messagesValidator.required(x))
        )
      );
    }

    const totalWords =
      intruduction.totalWords +
      teachingExperience.totalWords +
      motivation.totalWords;

    if (totalWords > domainRules.aboutMeMaxLength) {
      return err(
        this._error.buildError(
          messagesValidator.maxLength(domainRules.aboutMeMaxLength)
        )
      );
    }

    return ok(new AboutMe(intruduction, teachingExperience, motivation));
  }

  get introduction(): RichTextJsonContent {
    return this._introduction;
  }

  get teachingExperience(): RichTextJsonContent {
    return this._teachingExperience;
  }

  get motivation(): RichTextJsonContent {
    return this._motivation;
  }

  public equals(other: AboutMe): boolean {
    return (
      this._introduction.equals(other.introduction) &&
      this._teachingExperience.equals(other.teachingExperience) &&
      this._motivation.equals(other.motivation)
    );
  }

  public toString(): string {
    return `${this._introduction.toString()} ${this._teachingExperience.toString()} ${this._motivation.toString()}`.trim();
  }
}

export default AboutMe;
