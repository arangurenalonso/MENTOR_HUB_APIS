import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import IInstructorRepository from '@domain/intructor-aggregate/root/repository/instructor.repository';
import IUnitOfWork from '@domain/abstract/repository/IUnitOfWork';
import CommonApplicationError from '@application/errors/common-application-error';
import InstructorDomain from '@domain/intructor-aggregate/root/instructor.domain';
import LevelDomain from '@domain/courses-aggregate/level/level.domain';
import SubCategoryDomain from '@domain/courses-aggregate/sub-category/sub-category.domain';
import ICourseRepository from '@domain/courses-aggregate/root/repositories/ICourse.repository';
import CourseDomain from '@domain/courses-aggregate/root/course.domain';
import InstructorApplicationErrors from '@application/errors/instructor-application.error';
import CourseApplicationErrors from '@application/errors/course-application.error';
import UpdateCourseEntrollmentCriteriaCommand from './updateCourseEntrollmentCriteria.command';
import levelDomain from '@domain/courses-aggregate/level/level.domain';
import subCategoryDomain from '@domain/courses-aggregate/sub-category/sub-category.domain';
import LearningObjectiveId from '@domain/courses-aggregate/learning-objective/value-object/intended-learner-id.value-object';
import LearningObjectiveDomain from '@domain/courses-aggregate/learning-objective/learning-objective.domain';
import { title } from 'process';
import LearningObjectivesRequestDTO from '@application/features/course/command/updateCourseEntrollmentCriteria/learningObjectives.request.dto';
import IntendedLearnersRequestDTO from './intendedLearners.request.dto';
import RequirementRequestDTO from './requirement.request.dto';
import RequirementDomain from '@domain/courses-aggregate/requirement/requirement.domain';
import IntendedLearnerDomain from '@domain/courses-aggregate/intended-learner/intended-learner.domain';

@injectable()
@requestHandler(UpdateCourseEntrollmentCriteriaCommand)
class UpdateCourseEntrollmentCriteriaCommandHandler
  implements
    IRequestHandler<
      UpdateCourseEntrollmentCriteriaCommand,
      Result<void, ErrorResult>
    >
{
  constructor(
    @inject(TYPES.ICourseRepository)
    private _courseRepository: ICourseRepository,
    @inject(TYPES.InstructorRepository)
    private _instructorRepository: IInstructorRepository,
    @inject(TYPES.IUnitOfWork) private readonly _unitOfWork: IUnitOfWork
  ) {}
  async handle(
    command: UpdateCourseEntrollmentCriteriaCommand
  ): Promise<Result<void, ErrorResult>> {
    const convertRequestToDomainArrayResult = this.convertRequestToDomainArray(
      command.requirements,
      command.intendedLearners,
      command.learningObjectives
    );
    if (convertRequestToDomainArrayResult.isErr()) {
      return err(convertRequestToDomainArrayResult.error);
    }
    const {
      requirementDomain,
      intendedLearnerDomain,
      learningObjectiveDomain,
    } = convertRequestToDomainArrayResult.value;

    const fetchEntitiesResult = await this.fetchEntities(
      command.idInstructor,
      command.idCourse
    );
    if (fetchEntitiesResult.isErr()) {
      return err(fetchEntitiesResult.error);
    }

    const { instructorDomain, courseDomain } = fetchEntitiesResult.value;

    if (
      courseDomain.properties.idInstructor !== instructorDomain.properties.id
    ) {
      return err(
        CourseApplicationErrors.COURSE_BELONGS_TO_OTHER_INSTRUCTOR(
          courseDomain.properties.id
        )
      );
    }

    const updateResult = await this.updateCourse(
      courseDomain,
      requirementDomain,
      intendedLearnerDomain,
      learningObjectiveDomain
    );
    if (updateResult.isErr()) {
      return err(updateResult.error);
    }
    return ok(undefined);
  }

  private convertRequestToDomainArray(
    requirementRequestDTO: RequirementRequestDTO[],
    intendedLearnersRequestDTO: IntendedLearnersRequestDTO[],
    learningObjectivesRequestDTO: LearningObjectivesRequestDTO[]
  ): Result<
    {
      requirementDomain: RequirementDomain[];
      intendedLearnerDomain: IntendedLearnerDomain[];
      learningObjectiveDomain: LearningObjectiveDomain[];
    },
    ErrorResult
  > {
    const requirementDomain: RequirementDomain[] = [];
    const intendedLearnerDomain: IntendedLearnerDomain[] = [];
    const learningObjectiveDomainArray: LearningObjectiveDomain[] = [];

    for (const item of requirementRequestDTO) {
      const domain = RequirementDomain.create({
        id: item.id,
        description: item.description,
      });

      if (domain.isErr()) {
        return err(domain.error);
      }

      requirementDomain.push(domain.value);
    }

    for (const item of intendedLearnersRequestDTO) {
      const domain = IntendedLearnerDomain.create({
        id: item.id,
        description: item.description,
      });

      if (domain.isErr()) {
        return err(domain.error);
      }

      intendedLearnerDomain.push(domain.value);
    }
    for (const item of learningObjectivesRequestDTO) {
      const domain = LearningObjectiveDomain.create({
        id: item.id,
        description: item.description,
      });

      if (domain.isErr()) {
        return err(domain.error);
      }

      learningObjectiveDomainArray.push(domain.value);
    }

    return ok({
      requirementDomain: requirementDomain,
      intendedLearnerDomain: intendedLearnerDomain,
      learningObjectiveDomain: learningObjectiveDomainArray,
    });
  }

  private async updateCourse(
    course: CourseDomain,
    requirementDomain: RequirementDomain[],
    intendedLearnerDomain: IntendedLearnerDomain[],
    learningObjectiveDomain: LearningObjectiveDomain[]
  ): Promise<Result<void, ErrorResult>> {
    const updateEntrollmentCriteria = course.updateCourseEntrollmentCriteria(
      requirementDomain,
      intendedLearnerDomain,
      learningObjectiveDomain
    );

    if (updateEntrollmentCriteria.isErr()) {
      return err(updateEntrollmentCriteria.error);
    }
    try {
      await this._unitOfWork.startTransaction();
      await this._unitOfWork.courseRepository.modify(course);
      this._unitOfWork.collectDomainEvents([course]);
      await this._unitOfWork.commit();
    } catch (error) {
      console.log('error', error);

      await this._unitOfWork.rollback();
      return err(InstructorApplicationErrors.CREATE_ERROR(`${error}`));
    }

    return ok(undefined);
  }
  private async fetchEntities(
    idInstructor: string,
    idCourse: string
  ): Promise<
    Result<
      {
        instructorDomain: InstructorDomain;
        courseDomain: CourseDomain;
      },
      ErrorResult
    >
  > {
    const [instructorDomainResult, courseDomainResult] = await Promise.all([
      this._instructorRepository.getInstructorById(idInstructor),
      this._courseRepository.getCourseById(idCourse),
    ]);

    if (instructorDomainResult.isErr()) {
      return err(instructorDomainResult.error);
    }
    if (courseDomainResult.isErr()) {
      return err(courseDomainResult.error);
    }

    const instructorDomain = instructorDomainResult.value;
    if (!instructorDomain) {
      return err(
        CommonApplicationError.notFound('Instructor', [
          {
            property: 'id',
            value: idInstructor,
          },
        ])
      );
    }
    const courseDomain = courseDomainResult.value;
    if (!courseDomain) {
      return err(
        CommonApplicationError.notFound('Course', [
          {
            property: 'id',
            value: idCourse,
          },
        ])
      );
    }

    return ok({
      instructorDomain: instructorDomain,
      courseDomain: courseDomain,
    });
  }
}
export default UpdateCourseEntrollmentCriteriaCommandHandler;
