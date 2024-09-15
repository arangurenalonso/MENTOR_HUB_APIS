import { inject, injectable } from 'inversify';
import {
  Brackets,
  DataSource,
  EntityManager,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
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
import CourseDomain from '@domain/courses-aggregate/root/course.domain';
import CourseEntity from '@persistence/entities/courses-aggregate/course.entity';
import CourseDTO from '@infrastructure/dto/course-aggregate/course.dto';
import LearningObjectiveEntity from '@persistence/entities/courses-aggregate/learning-objective.entity';
import RequirementEntity from '@persistence/entities/courses-aggregate/requirement.entity';
import IntendedLearnerEntity from '@persistence/entities/courses-aggregate/intended-learners.entity';
import LearningObjectiveDTO from '@infrastructure/dto/course-aggregate/learning-objective.dto';
import IntendedLearnerDTO from '@infrastructure/dto/course-aggregate/intended-learner.dto';
import RequirementDTO from '@infrastructure/dto/course-aggregate/requirement.dto';

@injectable()
class CourseRepository
  extends BaseRepository<CourseEntity>
  implements ICourseRepository
{
  private _repository: Repository<CourseEntity>;
  private _levelRepository: Repository<LevelEntity>;
  private _categoryRepository: Repository<CategoryEntity>;
  private _subCategoryRepository: Repository<SubCategoryEntity>;
  private _learningObjectivRepository: Repository<LearningObjectiveEntity>;
  private _requirementRepository: Repository<RequirementEntity>;
  private _intendedLearnerRepository: Repository<IntendedLearnerEntity>;
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
      this._dataSourceOrEntityManager.getRepository(CourseEntity);
    this._levelRepository =
      this._dataSourceOrEntityManager.getRepository(LevelEntity);
    this._categoryRepository =
      this._dataSourceOrEntityManager.getRepository(CategoryEntity);
    this._subCategoryRepository =
      this._dataSourceOrEntityManager.getRepository(SubCategoryEntity);
    this._learningObjectivRepository =
      this._dataSourceOrEntityManager.getRepository(LearningObjectiveEntity);
    this._requirementRepository =
      this._dataSourceOrEntityManager.getRepository(RequirementEntity);
    this._intendedLearnerRepository =
      this._dataSourceOrEntityManager.getRepository(IntendedLearnerEntity);
  }

  courseQueryBuilderWithRelations = (
    where:
      | Brackets
      | string
      | ((qb: this) => string)
      | ObjectLiteral
      | ObjectLiteral[],
    parameters?: ObjectLiteral
  ): SelectQueryBuilder<CourseEntity> => {
    const userEntity = this._repository
      .createQueryBuilder('course')
      .leftJoinAndSelect(
        'course.requirements',
        'requirements',
        'requirements.active = :isActive',
        { isActive: true }
      )
      .leftJoinAndSelect(
        'course.learningObjectives',
        'learningObjectives',
        'learningObjectives.active = :isActive',
        { isActive: true }
      )
      .leftJoinAndSelect(
        'course.intendedLearners',
        'intendedLearners',
        'intendedLearners.active = :isActive',
        { isActive: true }
      )
      .leftJoinAndSelect('course.level', 'level')
      .leftJoinAndSelect('course.subCategory', 'subCategory')
      .leftJoinAndSelect('subCategory.category', 'category')
      .innerJoinAndSelect('course.instructor', 'instructor')
      .innerJoinAndSelect('instructor.naturalPerson', 'naturalPerson')
      .where(where, parameters)
      .andWhere('course.active = :isActive', { isActive: true });
    // .andWhere(
    //   '(requirements.active = :isActiveRequirement OR requirements.active IS NULL)',
    //   {
    //     isActiveRequirement: true,
    //   }
    // )
    // .andWhere(
    //   '(intendedLearners.active = :isActiveIntendedLearners  OR intendedLearners.active IS NULL)',
    //   { isActiveIntendedLearners: true }
    // )
    // .andWhere(
    //   '(learningObjectives.active = :isActiveLearningObjective OR learningObjectives.active IS NULL)',
    //   { isActiveLearningObjective: true }
    // );

    return userEntity;
  };

  async getCourseById(
    idCourse: string
  ): Promise<Result<CourseDomain | null, ErrorResult>> {
    const courseEntity = await this.courseQueryBuilderWithRelations(
      'course.id = :courseId',
      {
        courseId: idCourse,
      }
    ).getOne();

    if (!courseEntity) {
      return ok(null);
    }

    const courseDomain = CourseDTO.toDomain(courseEntity);
    if (courseDomain.isErr()) {
      return err(courseDomain.error);
    }

    return ok(courseDomain.value);
  }
  async getCoursesByIdInstructor(
    idInstructor: string
  ): Promise<Result<CourseDomain[], ErrorResult>> {
    const coursesEntity = await this.courseQueryBuilderWithRelations(
      'course.idInstructor = :idInstructor',
      {
        idInstructor: idInstructor,
      }
    ).getMany();
    console.log('coursesEntity', coursesEntity);

    const coursesDomain = CourseDTO.toDomainList(coursesEntity);
    if (coursesDomain.isErr()) {
      return err(coursesDomain.error);
    }

    return ok(coursesDomain.value);
  }

  async getLevelById(
    idLevel: string
  ): Promise<Result<LevelDomain | null, ErrorResult>> {
    const levelEntity = await this._levelRepository
      .createQueryBuilder('level')
      .where('level.id = :idLevel', { idLevel })
      .andWhere('level.active = :active', {
        active: true,
      })
      .getOne();

    if (!levelEntity) {
      return ok(null);
    }

    const levelDomains = LevelDTO.toDomain(levelEntity);
    if (levelDomains.isErr()) {
      return err(levelDomains.error);
    }

    return ok(levelDomains.value);
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

  async getSubCategoryById(
    id: string
  ): Promise<Result<SubCategoryDomain | null, ErrorResult>> {
    const subCategoryEntity = await this._subCategoryRepository
      .createQueryBuilder('subCategory')
      .leftJoinAndSelect('subCategory.category', 'category')
      .where('subCategory.id = :id', { id })
      .andWhere('subCategory.active = :active', {
        active: true,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('category.active is null').orWhere(
            'category.active = :categoryActive',
            {
              categoryActive: true,
            }
          );
        })
      )
      .getOne();
    if (!subCategoryEntity) {
      return ok(null);
    }
    const subCategoryDomainResult = SubCategoryDTO.toDomain(subCategoryEntity);
    if (subCategoryDomainResult.isErr()) {
      return err(subCategoryDomainResult.error);
    }
    const subCategory = subCategoryDomainResult.value;
    return ok(subCategory);
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

  async register(courseDomain: CourseDomain): Promise<string> {
    const courseEntity = CourseDTO.toEntity(courseDomain);

    const learningObjectives = LearningObjectiveDTO.toEntityArray(
      courseDomain.properties.id,
      courseDomain.properties.learningObjectives
    );
    const intendedLearners = IntendedLearnerDTO.toEntityArray(
      courseDomain.properties.id,
      courseDomain.properties.intendedLearners
    );
    const requirements = RequirementDTO.toEntityArray(
      courseDomain.properties.id,
      courseDomain.properties.requirements
    );

    this.create(courseEntity);
    await Promise.all([
      this._learningObjectivRepository.save(learningObjectives),
      this._intendedLearnerRepository.save(intendedLearners),
      this._requirementRepository.save(requirements),
    ]);
    return courseEntity.id!;
  }

  async modify(courseDomain: CourseDomain): Promise<void> {
    const courseEntity = CourseDTO.toEntity(courseDomain);

    const learningObjectives = LearningObjectiveDTO.toEntityArray(
      courseDomain.properties.id,
      courseDomain.properties.learningObjectives
    );
    const intendedLearners = IntendedLearnerDTO.toEntityArray(
      courseDomain.properties.id,
      courseDomain.properties.intendedLearners
    );
    const requirements = RequirementDTO.toEntityArray(
      courseDomain.properties.id,
      courseDomain.properties.requirements
    );
    await Promise.all([
      this.repository.save(courseEntity),
      this.updateEntities<LearningObjectiveEntity>(
        learningObjectives,
        this._learningObjectivRepository,
        { idCourse: courseDomain.properties.id }
      ),
      this.updateEntities<IntendedLearnerEntity>(
        intendedLearners,
        this._intendedLearnerRepository,
        { idCourse: courseDomain.properties.id }
      ),
      this.updateEntities<RequirementEntity>(
        requirements,
        this._requirementRepository,
        { idCourse: courseDomain.properties.id }
      ),
    ]);
  }
  protected get repository(): Repository<CourseEntity> {
    return this._repository;
  }
}
export default CourseRepository;
