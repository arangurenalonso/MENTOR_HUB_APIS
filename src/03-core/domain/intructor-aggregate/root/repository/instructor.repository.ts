import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import RoleDomain from '@domain/user-aggregate/role/role.domain';

interface IInstructorRepository {
  getById(id: string): Promise<Result<RoleDomain | null, ErrorResult>>;
}
export default IInstructorRepository;
