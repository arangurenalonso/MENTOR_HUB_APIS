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

@injectable()
class CourseRepository
  extends BaseRepository<LevelEntity>
  implements ICourseRepository
{
  private _repository: Repository<LevelEntity>;
  private _levelRepository: Repository<LevelEntity>;
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
  }
  async getAllLevelOfCourse(): Promise<
    Result<LevelDomain[] | null, ErrorResult>
  > {
    const levelEntities = await this._levelRepository.find({
      // where: { active: true },
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

  protected get repository(): Repository<LevelEntity> {
    return this._repository;
  }
}
export default CourseRepository;
