import AuthenticationResult from '@application/models/AuthenticationResult';
import { ProviderEnum } from '@domain/user-aggregate/provider/enum/provider.enum';
import { IRequest } from 'mediatr-ts';

class SocialProviderCommand implements IRequest<AuthenticationResult> {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly uid: string,
    public readonly provider: ProviderEnum,
    public readonly timeZoneIdString: string,
    public readonly photoURL?: string | null
  ) {}
}
export default SocialProviderCommand;
