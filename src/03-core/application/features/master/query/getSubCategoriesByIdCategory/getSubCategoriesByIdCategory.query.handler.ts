import CommonApplicationError from '@application/errors/common-application-error';
import TYPES from '@config/inversify/identifiers';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import { Result, err, ok } from 'neverthrow';
import ICourseRepository from '@domain/courses-aggregate/root/repositories/ICourse.repository';
import GetSubCategoriesByIdCategoryQuery from './getSubCategoriesByIdCategory';
import SubCategoryDomain, {
  SubCategoryDomainProperties,
} from '@domain/courses-aggregate/sub-category/sub-category.domain';

@injectable()
@requestHandler(GetSubCategoriesByIdCategoryQuery)
class GetSubCategoriesByIdCategoryQueryHandler
  implements
    IRequestHandler<
      GetSubCategoriesByIdCategoryQuery,
      Result<SubCategoryDomainProperties[], ErrorResult>
    >
{
  constructor(
    @inject(TYPES.ICourseRepository)
    private _courseRepository: ICourseRepository
  ) {}

  async handle(
    query: GetSubCategoriesByIdCategoryQuery
  ): Promise<Result<SubCategoryDomainProperties[], ErrorResult>> {
    const fetchEntitiesResult = await this.fetchEntities(query.idCategory);
    if (fetchEntitiesResult.isErr()) {
      return err(fetchEntitiesResult.error);
    }

    const { subCategoriesDomain } = fetchEntitiesResult.value;
    return ok(subCategoriesDomain.map((x) => x.properties));
  }

  private async fetchEntities(idCategory: string): Promise<
    Result<
      {
        subCategoriesDomain: SubCategoryDomain[];
      },
      ErrorResult
    >
  > {
    const [subCategoriesDomainResult] = await Promise.all([
      this._courseRepository.getSubCategoryByIdCategory(idCategory),
    ]);

    if (subCategoriesDomainResult.isErr()) {
      return err(subCategoriesDomainResult.error);
    }

    const subCategoriesDomains = subCategoriesDomainResult.value;
    if (!subCategoriesDomains || subCategoriesDomains.length == 0) {
      return err(CommonApplicationError.notFound('SubCategory', []));
    }

    return ok({
      subCategoriesDomain: subCategoriesDomains,
    });
  }
}
export default GetSubCategoriesByIdCategoryQueryHandler;
