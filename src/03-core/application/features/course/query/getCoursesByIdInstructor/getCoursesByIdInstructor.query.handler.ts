import CommonApplicationError from '@application/errors/common-application-error';
import TYPES from '@config/inversify/identifiers';
import { ErrorResult } from '@domain/abstract/result-abstract';
import IInstructorRepository from '@domain/intructor-aggregate/root/repository/instructor.repository';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import { Result, err, ok } from 'neverthrow';
import GetCoursesByIdInstructorQuery from './getCoursesByIdInstructor.query';
import CourseDomain, {
  CourseDomainProperties,
} from '@domain/courses-aggregate/root/course.domain';
import InstructorDomain from '@domain/intructor-aggregate/root/instructor.domain';
import ICourseRepository from '@domain/courses-aggregate/root/repositories/ICourse.repository';
import courseEntity from '@persistence/entities/courses-aggregate/course.entity';
import S3Service from '@service/s3.service';

@injectable()
@requestHandler(GetCoursesByIdInstructorQuery)
class GetCoursesByIdInstructorQueryHandler
  implements
    IRequestHandler<
      GetCoursesByIdInstructorQuery,
      Result<CourseDomainProperties[], ErrorResult>
    >
{
  constructor(
    @inject(TYPES.InstructorRepository)
    private _instructorRepository: IInstructorRepository,
    @inject(TYPES.ICourseRepository)
    private _courseRepository: ICourseRepository,
    @inject(TYPES.IS3Service) private readonly _s3Service: S3Service
  ) {}

  async handle(
    query: GetCoursesByIdInstructorQuery
  ): Promise<Result<CourseDomainProperties[], ErrorResult>> {
    const fetchEntitiesResult = await this.fetchEntities(query.idInstructor);
    if (fetchEntitiesResult.isErr()) {
      return err(fetchEntitiesResult.error);
    }

    const { coursesDomain } = fetchEntitiesResult.value;
    const coursesWithSignedUrls = await this.asignSignedUrl(coursesDomain);
    if (coursesWithSignedUrls.isErr()) {
      return err(coursesWithSignedUrls.error);
    }
    return ok(coursesWithSignedUrls.value.map((x) => x.properties));
  }

  private async fetchEntities(idInstructor: string): Promise<
    Result<
      {
        instructorDomain: InstructorDomain;
        coursesDomain: CourseDomain[];
      },
      ErrorResult
    >
  > {
    const [instructorDomainResult, coursesDomainResult] = await Promise.all([
      this._instructorRepository.getInstructorById(idInstructor),
      this._courseRepository.getCoursesByIdInstructor(idInstructor),
    ]);

    if (instructorDomainResult.isErr()) {
      return err(instructorDomainResult.error);
    }
    if (coursesDomainResult.isErr()) {
      return err(coursesDomainResult.error);
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

    return ok({
      instructorDomain: instructorDomain,
      coursesDomain: coursesDomainResult.value,
    });
  }
  private async asignSignedUrl(
    coursesDomain: CourseDomain[]
  ): Promise<Result<CourseDomain[], ErrorResult>> {
    try {
      // Generar las URLs firmadas para todos los cursos en paralelo
      const coursesWithSignedUrls = await Promise.all([
        ...coursesDomain.map(async (courseDomain) => {
          console.log('courseDomain.imgS3Key', courseDomain.imgS3Key);

          if (courseDomain.imgS3Key === null) {
            return courseDomain;
          }
          const signedUrl = await this._s3Service.getFileUrl(
            courseDomain.imgS3Key
          );
          if (signedUrl === null) {
            return courseDomain;
          }
          courseDomain.imgUrl = signedUrl;
          return courseDomain;
        }),
        ...coursesDomain.map(async (courseDomain) => {
          if (courseDomain.promotionalVideoS3Key === null) {
            return courseDomain;
          }
          const signedUrl = await this._s3Service.getFileUrl(
            courseDomain.promotionalVideoS3Key
          );
          if (signedUrl === null) {
            return courseDomain;
          }
          courseDomain.promotionalVideoUrl = signedUrl;
          return courseDomain;
        }),
      ]);

      return ok(coursesWithSignedUrls);
    } catch (error) {
      return err(
        new ErrorResult('Error generating signed URLs', `${error}`, 500)
      );
    }
  }
}
export default GetCoursesByIdInstructorQueryHandler;
