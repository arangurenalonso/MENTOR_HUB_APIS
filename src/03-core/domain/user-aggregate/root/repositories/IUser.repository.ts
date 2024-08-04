import { Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import UserDomain from '../user.domain';
interface IUserRepository {
  getUserByEmail(
    email?: string
  ): Promise<Result<UserDomain | null, ErrorResult>>;
  getUserById(id: string): Promise<Result<UserDomain | null, ErrorResult>>;
  register(user: UserDomain): Promise<void>;
}
export default IUserRepository;
