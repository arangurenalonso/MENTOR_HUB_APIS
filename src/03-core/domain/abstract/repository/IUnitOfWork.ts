import { EntityManager } from 'typeorm';
import IUserRepository from '@domain/user-aggregate/root/repositories/IUser.repository';
import BaseDomain from '@domain/abstract/BaseDomain';
import IUserRoleRepository from '@domain/user-aggregate/root/repositories/IUserRole.repository';
import IRoleRepository from '@domain/user-aggregate/role/repositories/IRole.repository';
import IPersonRepository from '@domain/persona-aggregate/root/repository/person.repository';

interface IUnitOfWork {
  startTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  get entityManager(): EntityManager | null;

  get userRepository(): IUserRepository;
  get roleRepository(): IRoleRepository;
  get personRepository(): IPersonRepository;

  collectDomainEvents(domains: BaseDomain<any>[]): void;
}

export default IUnitOfWork;
