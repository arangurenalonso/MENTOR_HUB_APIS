import { ErrorResult } from '@domain/abstract/result-abstract';
import { LevelDomainProperties } from '@domain/courses-aggregate/level/level.domain';
import { IRequest } from 'mediatr-ts';
import { Result } from 'neverthrow';

class GetAllLevelQuery
  implements IRequest<Result<LevelDomainProperties[], ErrorResult>>
{
  constructor() {}
}

export default GetAllLevelQuery;
