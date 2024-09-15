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
      const coursesWithSignedUrls = await Promise.all(
        coursesDomain.map(async (courseDomain) => {
          // Procesar la imagen del curso
          if (courseDomain.imgS3Key !== null) {
            const signedImgUrl = await this._s3Service.getFileUrl(
              courseDomain.imgS3Key
            );

            if (signedImgUrl !== null) {
              courseDomain.imgUrl = signedImgUrl;
            }
          }

          // Procesar el video promocional del curso
          if (courseDomain.promotionalVideoS3Key !== null) {
            const signedVideoUrl = await this._s3Service.getFileUrl(
              courseDomain.promotionalVideoS3Key
            );
            if (signedVideoUrl !== null) {
              courseDomain.promotionalVideoUrl = signedVideoUrl;
            }
          }

          return courseDomain; // Retornar el curso con las URLs asignadas
        })
      );

      return ok(coursesWithSignedUrls);
    } catch (error) {
      return err(
        new ErrorResult('Error generating signed URLs', `${error}`, 500)
      );
    }
  }
}
export default GetCoursesByIdInstructorQueryHandler;
