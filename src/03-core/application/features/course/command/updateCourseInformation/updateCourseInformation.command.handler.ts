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
import UpdateCourseInformationCommand from './updateCourseInformation.command';
import CourseApplicationErrors from '@application/errors/course-application.error';

@injectable()
@requestHandler(UpdateCourseInformationCommand)
class UpdateCourseInformationCommandHandler
  implements
    IRequestHandler<UpdateCourseInformationCommand, Result<void, ErrorResult>>
{
  constructor(
    @inject(TYPES.ICourseRepository)
    private _courseRepository: ICourseRepository,
    @inject(TYPES.InstructorRepository)
    private _instructorRepository: IInstructorRepository,
    @inject(TYPES.IUnitOfWork) private readonly _unitOfWork: IUnitOfWork
  ) {}
  async handle(
    command: UpdateCourseInformationCommand
  ): Promise<Result<void, ErrorResult>> {
    const fetchEntitiesResult = await this.fetchEntities(
      command.idInstructor,
      command.idLevel,
      command.idSubCategory,
      command.idCourse
    );
    if (fetchEntitiesResult.isErr()) {
      return err(fetchEntitiesResult.error);
    }

    const { instructorDomain, levelDomain, subCategoryDomain, courseDomain } =
      fetchEntitiesResult.value;

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
      levelDomain,
      subCategoryDomain,
      command.title,
      command.description
    );
    if (updateResult.isErr()) {
      return err(updateResult.error);
    }
    return ok(undefined);
  }
  private async updateCourse(
    course: CourseDomain,
    level: LevelDomain,
    subCategory: SubCategoryDomain,
    title: string,
    description: string
  ): Promise<Result<void, ErrorResult>> {
    const updateInformationResult = course.updateCourseInformation({
      title,
      description,
      level,
      subCategory,
    });
    if (updateInformationResult.isErr()) {
      return err(updateInformationResult.error);
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
    idLevel: string,
    idSubCategory: string,
    idCourse: string
  ): Promise<
    Result<
      {
        instructorDomain: InstructorDomain;
        levelDomain: LevelDomain;
        subCategoryDomain: SubCategoryDomain;
        courseDomain: CourseDomain;
      },
      ErrorResult
    >
  > {
    const [
      instructorDomainResult,
      levelDomainResult,
      subCategoryDomainResult,
      courseDomainResult,
    ] = await Promise.all([
      this._instructorRepository.getInstructorById(idInstructor),
      this._courseRepository.getLevelById(idLevel),
      this._courseRepository.getSubCategoryById(idSubCategory),
      this._courseRepository.getCourseById(idCourse),
    ]);

    if (instructorDomainResult.isErr()) {
      return err(instructorDomainResult.error);
    }
    if (levelDomainResult.isErr()) {
      return err(levelDomainResult.error);
    }
    if (subCategoryDomainResult.isErr()) {
      return err(subCategoryDomainResult.error);
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
    const levelDomain = levelDomainResult.value;
    if (!levelDomain) {
      return err(
        CommonApplicationError.notFound('Level', [
          {
            property: 'id',
            value: idLevel,
          },
        ])
      );
    }
    const subCategoryDomain = subCategoryDomainResult.value;
    if (!subCategoryDomain) {
      return err(
        CommonApplicationError.notFound('SubCategory', [
          {
            property: 'id',
            value: idSubCategory,
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
      levelDomain: levelDomain,
      subCategoryDomain: subCategoryDomain,
      courseDomain: courseDomain,
    });
  }
}
export default UpdateCourseInformationCommandHandler;
