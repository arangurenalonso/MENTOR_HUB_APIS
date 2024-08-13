import AuthenticationResult from '@application/models/AuthenticationResult';
import { IRequest } from 'mediatr-ts';

class AuthenticationResultQuery implements IRequest<AuthenticationResult> {
  constructor(public readonly idUser: string) {}
}
export default AuthenticationResultQuery;
