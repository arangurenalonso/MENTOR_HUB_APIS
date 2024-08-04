import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import RoleDomain from '@domain/user-aggregate/role/role.domain';

interface IRoleRepository {
  getRoleById(id: string): Promise<Result<RoleDomain | null, ErrorResult>>;

  getRoleByDescription(
    description: string
  ): Promise<Result<RoleDomain | null, ErrorResult>>;
}
export default IRoleRepository;
