import AuthenticationResult from '@application/models/AuthenticationResult';
import { IRequest } from 'mediatr-ts';

class RegisterCommand implements IRequest<AuthenticationResult> {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly timeZoneIdString: string
  ) {}
}
export default RegisterCommand;
