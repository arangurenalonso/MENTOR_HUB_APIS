import { Repository, ObjectLiteral } from 'typeorm';
import { injectable } from 'inversify';
import IBaseRepository from '@domain/abstract/repository/IBaseRepository';

@injectable()
abstract class BaseRepository<T extends ObjectLiteral>
  implements IBaseRepository<T>
{
  protected abstract get repository(): Repository<T>;
  // constructor(dataSource: DataSource, entity: new () => T) {
  //   this.repository = dataSource.getRepository(entity);
  // }

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
