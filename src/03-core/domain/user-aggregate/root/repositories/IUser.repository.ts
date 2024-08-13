import { Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import UserDomain from '../user.domain';
import TimeZoneDomain from '@domain/user-aggregate/timezone/time-zone.domain';
interface IUserRepository {
  getUserByEmail(
    email?: string
  ): Promise<Result<UserDomain | null, ErrorResult>>;
  getUserById(id: string): Promise<Result<UserDomain | null, ErrorResult>>;
  register(user: UserDomain): Promise<void>;
  modify(user: UserDomain): Promise<void>;
  getTimeZoneById(
    id: string
  ): Promise<Result<TimeZoneDomain | null, ErrorResult>>;
  getIdUserByUidProvider(
    uid: string
  ): Promise<Result<UserDomain | null, ErrorResult>>;
}
export default IUserRepository;
