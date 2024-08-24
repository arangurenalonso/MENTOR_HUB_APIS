import CommonApplicationError from '@application/errors/common-application-error';
import TYPES from '@config/inversify/identifiers';
import { ErrorResult } from '@domain/abstract/result-abstract';
import InstructorDomain, {
  InstructorDomainProperties,
} from '@domain/intructor-aggregate/root/instructor.domain';
import IInstructorRepository from '@domain/intructor-aggregate/root/repository/instructor.repository';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import { Result, err, ok } from 'neverthrow';
import GetInstructorByIdQuery from './getInstructorById.query';

@injectable()
@requestHandler(GetInstructorByIdQuery)
class GetInstructorByIdQueryHandler
  implements
    IRequestHandler<
      GetInstructorByIdQuery,
      Result<InstructorDomainProperties, ErrorResult>
    >
{
  constructor(
    @inject(TYPES.InstructorRepository)
    private _instructorRepository: IInstructorRepository
  ) {}

  async handle(
    query: GetInstructorByIdQuery
  ): Promise<Result<InstructorDomainProperties, ErrorResult>> {
    const fetchEntitiesResult = await this.fetchEntities(query.idInstructor);
    if (fetchEntitiesResult.isErr()) {
      return err(fetchEntitiesResult.error);
    }

    const { instructorDomain } = fetchEntitiesResult.value;
    instructorDomain.properties;
    return ok(instructorDomain.properties);
  }

  private async fetchEntities(idInstructor: string): Promise<
    Result<
      {
        instructorDomain: InstructorDomain;
      },
      ErrorResult
    >
  > {
    const [instructorDomainResult] = await Promise.all([
      this._instructorRepository.getInstructorById(idInstructor),
    ]);

    if (instructorDomainResult.isErr()) {
      return err(instructorDomainResult.error);
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
    });
  }
}
export default GetInstructorByIdQueryHandler;
