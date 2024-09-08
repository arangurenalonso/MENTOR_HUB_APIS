import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import BaseDomain from '@domain/abstract/BaseDomain';
import LevelDomain, { LevelDomainProperties } from '../level/level.domain';
import SubCategoryDomain, {
  SubCategoryDomainProperties,
} from '../sub-category/sub-category.domain';
import CourseId from './value-object/course-id.value-object';
import CourseTitle from './value-object/course-title.value-object';
import InstructorId from '@domain/intructor-aggregate/root/value-object/instructor-id.value-object';
import CourseDescription from './value-object/course-description.value-object';
import LearningObjectiveDomain, {
  LearningObjectiveDomainProperties,
} from '../learning-objective/learning-objective.domain';
import IntendedLearnerDomain, {
  IntendedLearnerDomainProperties,
} from '../intended-learner/intended-learner.domain';
import RequirementDomain, {
  RequirementDomainProperties,
} from '../requirement/requirement.domain';
import CourseImageS3Key from './value-object/course-img-s3-key.value-object';
import CoursePromotionalVideoS3Key from './value-object/course-promotional-video-s3-key.value-object';

export type CourseDomainProperties = {
  id: string;
  title: string;
  description: string;
  idInstructor: string;
  imgUrl: string | null;
  promotionalVideoUrl: string | null;
  level: LevelDomainProperties;
  subCategory: SubCategoryDomainProperties;
  learningObjectives: LearningObjectiveDomainProperties[];
  intendedLearners: IntendedLearnerDomainProperties[];
  requirements: RequirementDomainProperties[];
};

type CourseDomainCreateArg = {
  id?: string;
  title: string;
  description: string;
  idInstructor: InstructorId;
  imgS3Key?: string | null | undefined;
  promotionalVideoS3Key?: string | null | undefined;
  level: LevelDomain;
  subCategory: SubCategoryDomain;
  learningObjectives: LearningObjectiveDomain[];
  intendedLearners: IntendedLearnerDomain[];
  requirements: RequirementDomain[];
};

type CourseDomainConstructor = {
  id: CourseId;
  title: CourseTitle;
  description: CourseDescription;
  idInstructor: InstructorId;
  imgS3Key: CourseImageS3Key | null;
  promotionalVideoS3Key: CoursePromotionalVideoS3Key | null;
  level: LevelDomain;
  subCategory: SubCategoryDomain;
  learningObjectives: LearningObjectiveDomain[];
  intendedLearners: IntendedLearnerDomain[];
  requirements: RequirementDomain[];
};

class CourseDomain extends BaseDomain<CourseId> {
  private _idInstructor: InstructorId;
  private _level: LevelDomain;
  private _subCategory: SubCategoryDomain;
  private _title: CourseTitle;
  private _description: CourseDescription;
  private _learningObjectives: LearningObjectiveDomain[];
  private _intendedLearners: IntendedLearnerDomain[];
  private _requirements: RequirementDomain[];

  private _imgS3Key: CourseImageS3Key | null;
  private _promotionalVideoS3Key: CoursePromotionalVideoS3Key | null;
  private _imgUrl: string | null = null;
  private _promotionalVideoUrl: string | null = null;

  private constructor(properties: CourseDomainConstructor) {
    super(properties.id);
    this._idInstructor = properties.idInstructor;
    this._level = properties.level;
    this._subCategory = properties.subCategory;
    this._title = properties.title;
    this._description = properties.description;
    this._learningObjectives = properties.learningObjectives;
    this._intendedLearners = properties.intendedLearners;
    this._requirements = properties.requirements;
    this._imgS3Key = properties.imgS3Key;
    this._promotionalVideoS3Key = properties.promotionalVideoS3Key;
  }

  public static create(
    args: CourseDomainCreateArg
  ): Result<CourseDomain, ErrorResult> {
    const resultId = CourseId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }
    const resultTitle = CourseTitle.create(args.title);
    if (resultTitle.isErr()) {
      return err(resultTitle.error);
    }

    const resultDescription = CourseDescription.create(args.description);

    const resultImageS3Key = CourseImageS3Key.create(args.imgS3Key);
    if (resultImageS3Key.isErr()) {
      return err(resultImageS3Key.error);
    }
    const resultVideoS3Key = CoursePromotionalVideoS3Key.create(
      args.promotionalVideoS3Key
    );
    if (resultVideoS3Key.isErr()) {
      return err(resultVideoS3Key.error);
    }

    if (resultDescription.isErr()) {
      return err(resultDescription.error);
    }

    const id = resultId.value;
    const title = resultTitle.value;
    const description = resultDescription.value;
    const imgS3Key = resultImageS3Key.value;
    const promotionalVideoS3Key = resultVideoS3Key.value;

    const instructorDomain = new CourseDomain({
      id,
      title,
      description,
      idInstructor: args.idInstructor,
      level: args.level,
      subCategory: args.subCategory,
      learningObjectives: args.learningObjectives,
      intendedLearners: args.intendedLearners,
      requirements: args.requirements,
      imgS3Key,
      promotionalVideoS3Key,
    });
    return ok(instructorDomain);
  }
  get imgS3Key() {
    return this._imgS3Key?.value || null;
  }
  get promotionalVideoS3Key() {
    return this._promotionalVideoS3Key?.value || null;
  }
  imgS3KeySet(key: string): Result<undefined, ErrorResult> {
    const resultImageS3Key = CourseImageS3Key.create(key);
    if (resultImageS3Key.isErr()) {
      return err(resultImageS3Key.error);
    }
    this._imgS3Key = resultImageS3Key.value;
    return ok(undefined);
  }
  promotionalVideoS3KeySet(key: string): Result<undefined, ErrorResult> {
    const resultVideoS3Key = CoursePromotionalVideoS3Key.create(key);
    if (resultVideoS3Key.isErr()) {
      return err(resultVideoS3Key.error);
    }
    this._promotionalVideoS3Key = resultVideoS3Key.value;
    return ok(undefined);
  }
  set imgUrl(url: string) {
    this._imgUrl = url;
  }
  set promotionalVideoUrl(url: string) {
    this._promotionalVideoUrl = url;
  }

  get properties(): CourseDomainProperties {
    return {
      id: this._id.value,
      title: this._title.value,
      idInstructor: this._idInstructor.value,
      level: this._level.properties,
      subCategory: this._subCategory.properties,
      description: JSON.stringify(this._description.value.value),
      learningObjectives: this._learningObjectives.map(
        (learningObjective) => learningObjective.properties
      ),
      intendedLearners: this._intendedLearners.map(
        (intendedLearner) => intendedLearner.properties
      ),
      requirements: this._requirements.map(
        (requirement) => requirement.properties
      ),
      imgUrl: this._imgUrl || null,
      promotionalVideoUrl: this._promotionalVideoUrl || null,
    };
  }
}

export default CourseDomain;
