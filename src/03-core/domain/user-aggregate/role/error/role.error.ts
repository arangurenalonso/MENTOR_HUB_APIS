import { ErrorResult } from '@domain/abstract/result-abstract';

class RoleErrors {
  static readonly ROLE_INVALID_ID = (id?: string): ErrorResult => {
    const idMessage = id ? ` "${id}"` : '';
    return new ErrorResult(
      'ROLE.ID',
      `Role ID${idMessage} is not a valid ID`,
      400
    );
  };
  static readonly ROLE_INVALID_DESCRIPTION = (
    reasons: string[]
  ): ErrorResult => {
    return new ErrorResult(
      'ROLE.DESCRIPTION',
      `Role description is invalid: ${reasons.join(', ')}`,
      400
    );
  };
}

export default RoleErrors;
