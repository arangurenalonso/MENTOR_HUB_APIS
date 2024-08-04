import AuthenticationResult from '@application/models/AuthenticationResult';

import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { IRequest } from 'mediatr-ts';

class LoginCommand
  implements IRequest<Result<AuthenticationResult, ErrorResult>>
{
  constructor(
    public readonly username: string,
    public readonly email: string,
    public readonly password: string
  ) {}
}

export default LoginCommand;
