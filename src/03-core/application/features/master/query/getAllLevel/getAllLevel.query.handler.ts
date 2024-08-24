import CommonApplicationError from '@application/errors/common-application-error';
import TYPES from '@config/inversify/identifiers';
import { ErrorResult } from '@domain/abstract/result-abstract';
import InstructorDomain, {
  InstructorDomainProperties,
} from '@domain/intructor-aggregate/root/instructor.domain';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import { Result, err, ok } from 'neverthrow';
import GetAllLevelQuery from './getAllLevel.query';
import ICourseRepository from '@domain/courses-aggregate/root/repositories/ICourse.repository';
import LevelDomain, {
  LevelDomainProperties,
} from '@domain/courses-aggregate/level/level.domain';

@injectable()
@requestHandler(GetAllLevelQuery)
class GetAllLevelQueryHandler
  implements
    IRequestHandler<
      GetAllLevelQuery,
      Result<LevelDomainProperties[], ErrorResult>
    >
{
  constructor(
    @inject(TYPES.ICourseRepository)
    private _courseRepository: ICourseRepository
  ) {}

  async handle(
    query: GetAllLevelQuery
  ): Promise<Result<LevelDomainProperties[], ErrorResult>> {
    const fetchEntitiesResult = await this.fetchEntities();
    if (fetchEntitiesResult.isErr()) {
      return err(fetchEntitiesResult.error);
    }

    const { levelDomains } = fetchEntitiesResult.value;
    return ok(levelDomains.map((x) => x.properties));
  }

  private async fetchEntities(): Promise<
    Result<
      {
        levelDomains: LevelDomain[];
      },
      ErrorResult
    >
  > {
    const [levelDomainsResult] = await Promise.all([
      this._courseRepository.getAllLevelOfCourse(),
    ]);

    if (levelDomainsResult.isErr()) {
      return err(levelDomainsResult.error);
    }

    const levelDomains = levelDomainsResult.value;
    if (!levelDomains || levelDomains.length == 0) {
      return err(CommonApplicationError.notFound('Level', []));
    }

    return ok({
      levelDomains: levelDomains,
    });
  }
}
export default GetAllLevelQueryHandler;
