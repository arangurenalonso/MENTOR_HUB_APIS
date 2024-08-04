import { ObjectLiteral } from 'typeorm';

interface IBaseRepository<T extends ObjectLiteral> {
  getAll(): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
  createMultiple(entities: T[]): Promise<T[]>;
}

export default IBaseRepository;
