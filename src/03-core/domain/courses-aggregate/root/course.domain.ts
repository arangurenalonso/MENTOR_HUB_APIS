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
import CourseErrors from './error/course.error';

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
  instructor?: InstructorInformation;
  publish: boolean;
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
  instructorName?: string;
  publish: boolean;
};

type UpdateCourseInformationArg = {
  title: string;
  description: string;
  level: LevelDomain;
  subCategory: SubCategoryDomain;
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
  instructorName?: string;
  publish: boolean;
};

type InstructorInformation = {
  id: string;
  name: string;
};
class CourseDomain extends BaseDomain<CourseId> {
  private _idInstructor: InstructorId;
  private _instructor?: InstructorInformation;
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
  private _publish: boolean = false;

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
    this._publish = properties.publish;
    this._instructor = properties.instructorName
      ? {
          id: properties.idInstructor.value,
          name: properties.instructorName,
        }
      : undefined;
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
      instructorName: args.instructorName,
      publish: args.publish,
    });
    return ok(instructorDomain);
  }
  updateCourseInformation(
    args: UpdateCourseInformationArg
  ): Result<undefined, ErrorResult> {
    const resultTitle = CourseTitle.create(args.title);
    if (resultTitle.isErr()) {
      return err(resultTitle.error);
    }

    const resultDescription = CourseDescription.create(args.description);

    if (resultDescription.isErr()) {
      return err(resultDescription.error);
    }

    this._title = resultTitle.value;
    this._description = resultDescription.value;
    this._level = args.level;
    this._subCategory = args.subCategory;
    return ok(undefined);
  }
  updateCourseEntrollmentCriteria(
    requirementDomain: RequirementDomain[],
    intendedLearnerDomain: IntendedLearnerDomain[],
    learningObjectiveDomain: LearningObjectiveDomain[]
  ): Result<undefined, ErrorResult> {
    if (requirementDomain.length == 0) {
      return err(CourseErrors.EMPTY_REQUIREMENTS());
    }
    if (intendedLearnerDomain.length == 0) {
      return err(CourseErrors.EMPTY_INTENDED_LEARNERS());
    }
    if (learningObjectiveDomain.length == 0) {
      return err(CourseErrors.EMPTY_LEARNING_OBJECTIVES());
    }
    this._requirements = requirementDomain;
    this._intendedLearners = intendedLearnerDomain;
    this._learningObjectives = learningObjectiveDomain;

    return ok(undefined);
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
  publish(): Result<undefined, ErrorResult> {
    if (this._requirements.length == 0) {
      return err(CourseErrors.EMPTY_REQUIREMENTS());
    }
    if (this._intendedLearners.length == 0) {
      return err(CourseErrors.EMPTY_INTENDED_LEARNERS());
    }
    if (this._learningObjectives.length == 0) {
      return err(CourseErrors.EMPTY_LEARNING_OBJECTIVES());
    }
    if (!this._imgS3Key) {
      return err(CourseErrors.EMPTY_IMG());
    }
    if (!this._promotionalVideoS3Key) {
      return err(CourseErrors.EMPTY_VIDEO());
    }
    this._publish = true;
    return ok(undefined);
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
      instructor: this._instructor,
      publish: this._publish,
    };
  }
}

export default CourseDomain;
