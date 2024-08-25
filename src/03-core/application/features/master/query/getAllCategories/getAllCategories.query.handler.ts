import CommonApplicationError from '@application/errors/common-application-error';
import TYPES from '@config/inversify/identifiers';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import { Result, err, ok } from 'neverthrow';
import ICourseRepository from '@domain/courses-aggregate/root/repositories/ICourse.repository';
import CategoryDomain, {
  CategoryDomainProperties,
} from '@domain/courses-aggregate/category/category.domain';
import GetAllCategoriesQuery from './getAllCategoriesquery';

@injectable()
@requestHandler(GetAllCategoriesQuery)
class GetAllCategoriesQueryHandler
  implements
    IRequestHandler<
      GetAllCategoriesQuery,
      Result<CategoryDomainProperties[], ErrorResult>
    >
{
  constructor(
    @inject(TYPES.ICourseRepository)
    private _courseRepository: ICourseRepository
  ) {}

  async handle(
    query: GetAllCategoriesQuery
  ): Promise<Result<CategoryDomainProperties[], ErrorResult>> {
    const fetchEntitiesResult = await this.fetchEntities();
    if (fetchEntitiesResult.isErr()) {
      return err(fetchEntitiesResult.error);
    }

    const { categoriesDomain } = fetchEntitiesResult.value;
    return ok(categoriesDomain.map((x) => x.properties));
  }

  private async fetchEntities(): Promise<
    Result<
      {
        categoriesDomain: CategoryDomain[];
      },
      ErrorResult
    >
  > {
    const [categoriesDomainResult] = await Promise.all([
      this._courseRepository.getAllCategoryOfCourse(),
    ]);

    if (categoriesDomainResult.isErr()) {
      return err(categoriesDomainResult.error);
    }

    const categoriesDomains = categoriesDomainResult.value;
    if (!categoriesDomains || categoriesDomains.length == 0) {
      return err(CommonApplicationError.notFound('Level', []));
    }

    return ok({
      categoriesDomain: categoriesDomains,
    });
  }
}
export default GetAllCategoriesQueryHandler;
