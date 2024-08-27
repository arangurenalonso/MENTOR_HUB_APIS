import { Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import LevelDomain from '@domain/courses-aggregate/level/level.domain';
import CategoryDomain from '@domain/courses-aggregate/category/category.domain';
import SubCategoryDomain from '@domain/courses-aggregate/sub-category/sub-category.domain';
interface ICourseRepository {
  getAllLevelOfCourse(): Promise<Result<LevelDomain[] | null, ErrorResult>>;
  getAllCategoryOfCourse(): Promise<
    Result<CategoryDomain[] | null, ErrorResult>
  >;
  getSubCategoryByIdCategory(
    idCategory: string
  ): Promise<Result<SubCategoryDomain[] | null, ErrorResult>>;
}
export default ICourseRepository;
