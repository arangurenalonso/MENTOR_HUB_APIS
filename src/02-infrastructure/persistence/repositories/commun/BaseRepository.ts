import { Repository, ObjectLiteral, FindOptionsWhere, In, Not } from 'typeorm';
import { injectable } from 'inversify';
import IBaseRepository from '@domain/abstract/repository/IBaseRepository';
import BaseEntity from '@persistence/entities/abstrations/base.entity';

@injectable()
abstract class BaseRepository<T extends ObjectLiteral>
  implements IBaseRepository<T>
{
  protected abstract get repository(): Repository<T>;
  // constructor(dataSource: DataSource, entity: new () => T) {
  //   this.repository = dataSource.getRepository(entity);
  // }
  async updateEntities<T extends BaseEntity>(
    entities: T[],
    repository: Repository<T>,

    additionalWhere: FindOptionsWhere<T> = {}
  ): Promise<void> {
    const entityIds = entities.map((entity) => entity.id);
    const entitiesToDeactivate = await repository.find({
      where: {
        ...additionalWhere,
        id: Not(In(entityIds)),
        active: true,
      } as FindOptionsWhere<T>,
    });

    entitiesToDeactivate.forEach((entity) => {
      entity.active = false;
    });

    await repository.save(entitiesToDeactivate);
    await repository.save(entities);
  }
  async getAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async create(entity: T): Promise<T> {
    const newEntity = this.repository.create(entity);
    return await this.repository.save(newEntity);
  }

  async createMultiple(entities: T[]): Promise<T[]> {
    const newEntities = entities.map((entity) =>
      this.repository.create(entity)
    );
    return await this.repository.save(newEntities);
  }

  async update(entity: T): Promise<void> {
    await this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export default BaseRepository;
