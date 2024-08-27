import { inject, injectable } from 'inversify';
import { DataSource, EntityManager, Repository } from 'typeorm';
import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import BaseRepository from './commun/BaseRepository';
import LevelDomain from '@domain/courses-aggregate/level/level.domain';
import ICourseRepository from '@domain/courses-aggregate/root/repositories/ICourse.repository';
import LevelEntity from '@persistence/entities/courses-aggregate/level.entity';
import LevelDTO from '@infrastructure/dto/course-aggregate/level.dto';
import CategoryEntity from '@persistence/entities/courses-aggregate/category.entity';
import CategoryDomain from '@domain/courses-aggregate/category/category.domain';
import CategoryDTO from '@infrastructure/dto/course-aggregate/category.dto';
import SubCategoryEntity from '@persistence/entities/courses-aggregate/sub-category.entity';
import SubCategoryDomain from '@domain/courses-aggregate/sub-category/sub-category.domain';
import SubCategoryDTO from '@infrastructure/dto/course-aggregate/sub-category.dto';

@injectable()
class CourseRepository
  extends BaseRepository<LevelEntity>
  implements ICourseRepository
{
  private _repository: Repository<LevelEntity>;
  private _levelRepository: Repository<LevelEntity>;
  private _categoryRepository: Repository<CategoryEntity>;
  private _subCategoryRepository: Repository<SubCategoryEntity>;
  constructor(
    @inject(TYPES.DataSource)
    private readonly _dataSourceOrEntityManager: DataSource | EntityManager
  ) {
    super();
    if (this._dataSourceOrEntityManager instanceof DataSource) {
      console.log('instance of DataSource');
    } else if (this._dataSourceOrEntityManager instanceof EntityManager) {
      console.log('instance of EntityManager');
    } else {
      throw new Error('Invalid constructor argument');
    }
    this._repository =
      this._dataSourceOrEntityManager.getRepository(LevelEntity);
    this._levelRepository =
      this._dataSourceOrEntityManager.getRepository(LevelEntity);
    this._categoryRepository =
      this._dataSourceOrEntityManager.getRepository(CategoryEntity);
    this._subCategoryRepository =
      this._dataSourceOrEntityManager.getRepository(SubCategoryEntity);
  }
  async getAllLevelOfCourse(): Promise<
    Result<LevelDomain[] | null, ErrorResult>
  > {
    const levelEntities = await this._levelRepository.find({
      where: { active: true },
    });

    if (!levelEntities || levelEntities.length === 0) {
      return ok(null);
    }

    const levelDomains = LevelDTO.toDomainList(levelEntities);
    if (levelDomains.isErr()) {
      return err(levelDomains.error);
    }

    return ok(levelDomains.value);
  }
  async getAllCategoryOfCourse(): Promise<
    Result<CategoryDomain[] | null, ErrorResult>
  > {
    const categoriesEntities = await this._categoryRepository.find({
      where: { active: true },
    });

    if (!categoriesEntities || categoriesEntities.length === 0) {
      return ok(null);
    }

    const categoriesDomain = CategoryDTO.toDomainList(categoriesEntities);
    if (categoriesDomain.isErr()) {
      return err(categoriesDomain.error);
    }

    return ok(categoriesDomain.value);
  }

  async getSubCategoryByIdCategory(
    idCategory: string
  ): Promise<Result<SubCategoryDomain[] | null, ErrorResult>> {
    // const subCategoriesEntities = await this._subCategoryRepository.find({
    //   where: { active: true, idCategory: idCategory },
    // });
    const subCategoriesEntities = await this._subCategoryRepository
      .createQueryBuilder('subCategory')
      .leftJoinAndSelect('subCategory.category', 'category')
      .where('subCategory.active = :subCategoryActive', {
        subCategoryActive: true,
      })
      .andWhere('subCategory.idCategory = :idCategory', { idCategory })
      .getMany();

    if (!subCategoriesEntities || subCategoriesEntities.length === 0) {
      return ok(null);
    }

    const categoriesDomain = SubCategoryDTO.toDomainList(subCategoriesEntities);
    if (categoriesDomain.isErr()) {
      return err(categoriesDomain.error);
    }

    return ok(categoriesDomain.value);
  }
  protected get repository(): Repository<LevelEntity> {
    return this._repository;
  }
}
export default CourseRepository;
