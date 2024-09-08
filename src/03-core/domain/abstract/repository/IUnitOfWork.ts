import { EntityManager } from 'typeorm';
import IUserRepository from '@domain/user-aggregate/root/repositories/IUser.repository';
import BaseDomain from '@domain/abstract/BaseDomain';
import IPersonRepository from '@domain/persona-aggregate/root/repository/person.repository';
import IInstructorRepository from '@domain/intructor-aggregate/root/repository/instructor.repository';
import ICourseRepository from '@domain/courses-aggregate/root/repositories/ICourse.repository';

interface IUnitOfWork {
  startTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  get entityManager(): EntityManager | null;

  get userRepository(): IUserRepository;
  get personRepository(): IPersonRepository;
  get instructorRepository(): IInstructorRepository;
  get courseRepository(): ICourseRepository;

  collectDomainEvents(domains: BaseDomain<any>[]): void;
}

export default IUnitOfWork;
