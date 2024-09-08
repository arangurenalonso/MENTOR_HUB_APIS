import { Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import LevelDomain from '@domain/courses-aggregate/level/level.domain';
import CategoryDomain from '@domain/courses-aggregate/category/category.domain';
import SubCategoryDomain from '@domain/courses-aggregate/sub-category/sub-category.domain';
import CourseDomain from '../course.domain';
interface ICourseRepository {
  getAllLevelOfCourse(): Promise<Result<LevelDomain[] | null, ErrorResult>>;
  getLevelById(
    idLevel: string
  ): Promise<Result<LevelDomain | null, ErrorResult>>;
  getAllCategoryOfCourse(): Promise<
    Result<CategoryDomain[] | null, ErrorResult>
  >;
  getSubCategoryById(
    id: string
  ): Promise<Result<SubCategoryDomain | null, ErrorResult>>;
  getSubCategoryByIdCategory(
    idCategory: string
  ): Promise<Result<SubCategoryDomain[] | null, ErrorResult>>;

  getCourseById(id: string): Promise<Result<CourseDomain | null, ErrorResult>>;
  getCoursesByIdInstructor(
    idInstructor: string
  ): Promise<Result<CourseDomain[], ErrorResult>>;
  register(courseDomain: CourseDomain): Promise<string>;
  modify(courseDomain: CourseDomain): Promise<void>;
}
export default ICourseRepository;
