import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import IInstructorRepository from '@domain/intructor-aggregate/root/repository/instructor.repository';
import IUnitOfWork from '@domain/abstract/repository/IUnitOfWork';
import ICourseRepository from '@domain/courses-aggregate/root/repositories/ICourse.repository';
import S3Service from '@service/s3.service';
import S3KeyBuilder, { S3FileType } from '@application/method/S3KeyBuilder';
import UpdatePromotionalVideoCourseCommand from './updatePromotionalVideoCourse.command';
import CommonApplicationError from '@application/errors/common-application-error';
import CourseDomain from '@domain/courses-aggregate/root/course.domain';
import InstructorDomain from '@domain/intructor-aggregate/root/instructor.domain';

@injectable()
@requestHandler(UpdatePromotionalVideoCourseCommand)
class UpdatePromotionalVideoCourseCommandHandler
  implements
    IRequestHandler<
      UpdatePromotionalVideoCourseCommand,
      Result<string, ErrorResult>
    >
{
  constructor(
    @inject(TYPES.ICourseRepository)
    private _courseRepository: ICourseRepository,
    @inject(TYPES.InstructorRepository)
    private _instructorRepository: IInstructorRepository,
    @inject(TYPES.IUnitOfWork) private readonly _unitOfWork: IUnitOfWork,
    @inject(TYPES.IS3Service) private readonly _s3Service: S3Service
  ) {}
  async handle(
    command: UpdatePromotionalVideoCourseCommand
  ): Promise<Result<string, ErrorResult>> {
    const fetchEntitiesResult = await this.fetchEntities(
      command.idInstructor,
      command.idCourse
    );
    if (fetchEntitiesResult.isErr()) {
      return err(fetchEntitiesResult.error);
    }
    const { courseDomain } = fetchEntitiesResult.value;

    const s3Key = S3KeyBuilder.buildCourseKey(
      'instructorid',
      S3FileType.VIDEO,
      'courseid',
      'video' + courseDomain.properties.title
    );

    const resultSetVideoS3Key = courseDomain.promotionalVideoS3KeySet(s3Key);
    if (resultSetVideoS3Key.isErr()) {
      return err(resultSetVideoS3Key.error);
    }

    try {
      // Upload image to S3
      const fileUrl = await this._s3Service.uploadFile(
        s3Key,
        command.file.buffer,
        command.file.mimetype
      );

      await this._unitOfWork.startTransaction();
      await this._courseRepository.modify(courseDomain);
      await this._unitOfWork.commit();

      return ok(fileUrl);
    } catch (error) {
      // await this._unitOfWork.rollback();
      return err(
        new ErrorResult(
          'Error uploading image or updating course',
          `${error}`,
          500
        )
      );
    }
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
export default UpdatePromotionalVideoCourseCommandHandler;
