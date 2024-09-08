import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import IInstructorRepository from '@domain/intructor-aggregate/root/repository/instructor.repository';
import IUnitOfWork from '@domain/abstract/repository/IUnitOfWork';
import CreateCourseCommand from './createCourse.command';
import CommonApplicationError from '@application/errors/common-application-error';
import InstructorDomain from '@domain/intructor-aggregate/root/instructor.domain';
import LevelDomain from '@domain/courses-aggregate/level/level.domain';
import SubCategoryDomain from '@domain/courses-aggregate/sub-category/sub-category.domain';
import ICourseRepository from '@domain/courses-aggregate/root/repositories/ICourse.repository';
import CourseDomain from '@domain/courses-aggregate/root/course.domain';
import InstructorApplicationErrors from '@application/errors/instructor-application.error';

@injectable()
@requestHandler(CreateCourseCommand)
class CreateCourseCommandHandler
  implements IRequestHandler<CreateCourseCommand, Result<string, ErrorResult>>
{
  constructor(
    @inject(TYPES.ICourseRepository)
    private _courseRepository: ICourseRepository,
    @inject(TYPES.InstructorRepository)
    private _instructorRepository: IInstructorRepository,
    @inject(TYPES.IUnitOfWork) private readonly _unitOfWork: IUnitOfWork
  ) {}
  async handle(
    command: CreateCourseCommand
  ): Promise<Result<string, ErrorResult>> {
    const fetchEntitiesResult = await this.fetchEntities(
      command.userConnected.idUser,
      command.idLevel,
      command.idSubCategory
    );
    if (fetchEntitiesResult.isErr()) {
      return err(fetchEntitiesResult.error);
    }

    const { instructorDomain, levelDomain, subCategoryDomain } =
      fetchEntitiesResult.value;
    const idCourse = await this.createCourse(
      instructorDomain,
      levelDomain,
      subCategoryDomain,
      command.title,
      command.description
    );
    if (idCourse.isErr()) {
      return err(idCourse.error);
    }
    return ok(idCourse.value);
  }
  private async createCourse(
    instructor: InstructorDomain,
    level: LevelDomain,
    subCategory: SubCategoryDomain,
    title: string,
    description: string
  ): Promise<Result<string, ErrorResult>> {
    const courseResult = CourseDomain.create({
      title,
      description,
      idInstructor: instructor.id,
      level,
      subCategory: subCategory,
      learningObjectives: [],
      intendedLearners: [],
      requirements: [],
    });

    if (courseResult.isErr()) {
      return err(courseResult.error);
    }

    const course = courseResult.value;

    let courseId = '';
    try {
      await this._unitOfWork.startTransaction();
      courseId = await this._unitOfWork.courseRepository.register(course);
      this._unitOfWork.collectDomainEvents([course]);
      await this._unitOfWork.commit();
    } catch (error) {
      console.log('error', error);

      await this._unitOfWork.rollback();
      return err(InstructorApplicationErrors.CREATE_ERROR(`${error}`));
    }
    console.log('courseId', courseId);

    return ok(courseId);
  }
  private async fetchEntities(
    idInstructor: string,
    idLevel: string,
    idSubCategory: string
  ): Promise<
    Result<
      {
        instructorDomain: InstructorDomain;
        levelDomain: LevelDomain;
        subCategoryDomain: SubCategoryDomain;
      },
      ErrorResult
    >
  > {
    const [instructorDomainResult, levelDomainResult, subCategoryDomainResult] =
      await Promise.all([
        this._instructorRepository.getInstructorById(idInstructor),
        this._courseRepository.getLevelById(idLevel),
        this._courseRepository.getSubCategoryById(idSubCategory),
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

    return ok({
      instructorDomain: instructorDomain,
      levelDomain: levelDomain,
      subCategoryDomain: subCategoryDomain,
    });
  }
}
export default CreateCourseCommandHandler;
