import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import Description from './description.value-object';
import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';

class AboutMe {
  private readonly _introduction: Description;
  private readonly _teachingExperience: Description;
  private readonly _motivation: Description;

  private constructor(
    introduction: Description,
    teachingExperience: Description,
    motivation: Description
  ) {
    this._introduction = introduction;
    this._teachingExperience = teachingExperience;
    this._motivation = motivation;
  }

  public static create(
    introductionText?: string | null,
    teachingExperienceText?: string | null,
    motivationText?: string | null
  ): Result<AboutMe, ErrorResult> {
    const introductionResult = Description.create(
      'Introduction',
      introductionText
    );
    if (introductionResult.isErr()) return err(introductionResult.error);

    const teachingExperienceResult = Description.create(
      'Teaching Experience',
      teachingExperienceText
    );
    if (teachingExperienceResult.isErr())
      return err(teachingExperienceResult.error);

    const motivationResult = Description.create('Motivation', motivationText);
    if (motivationResult.isErr()) return err(motivationResult.error);

    const totalWords =
      introductionResult.value.value.length +
      teachingExperienceResult.value.value.length +
      motivationResult.value.value.length;

    if (totalWords > domainRules.aboutMeMaxLength) {
      return err(
        new ErrorResult(
          'ABOUT_ME_TOO_LONG',
          messagesValidator.maxLength('About Me', domainRules.aboutMeMaxLength),
          400
        )
      );
    }

    return ok(
      new AboutMe(
        introductionResult.value,
        teachingExperienceResult.value,
        motivationResult.value
      )
    );
  }

  get introduction(): Description {
    return this._introduction;
  }

  get teachingExperience(): Description {
    return this._teachingExperience;
  }

  get motivation(): Description {
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
