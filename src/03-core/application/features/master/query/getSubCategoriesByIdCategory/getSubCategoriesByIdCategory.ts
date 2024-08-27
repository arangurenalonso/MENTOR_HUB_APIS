import { ErrorResult } from '@domain/abstract/result-abstract';
import { SubCategoryDomainProperties } from '@domain/courses-aggregate/sub-category/sub-category.domain';
import { IRequest } from 'mediatr-ts';
import { Result } from 'neverthrow';

class GetSubCategoriesByIdCategoryQuery
  implements IRequest<Result<SubCategoryDomainProperties[], ErrorResult>>
{
  constructor(public readonly idCategory: string) {}
}

export default GetSubCategoriesByIdCategoryQuery;
