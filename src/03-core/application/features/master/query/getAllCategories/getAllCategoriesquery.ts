import { ErrorResult } from '@domain/abstract/result-abstract';
import { CategoryDomainProperties } from '@domain/courses-aggregate/category/category.domain';
import { IRequest } from 'mediatr-ts';
import { Result } from 'neverthrow';

class GetAllCategoriesQuery
  implements IRequest<Result<CategoryDomainProperties[], ErrorResult>>
{
  constructor() {}
}

export default GetAllCategoriesQuery;
