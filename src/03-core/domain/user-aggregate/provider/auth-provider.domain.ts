import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import BaseDomain from '@domain/abstract/BaseDomain';
import AuthProviderId from './value-object/auth-provider-id.value-object';
import Provider from './value-object/provider.value-object';
import ProviderUid from './value-object/provider-id.value-object';

export type AuthProviderDomainProperties = {
  id: string;
  provider: string;
  uid: string;
};
export type AuthProviderDomainArgs = {
  id?: string;
  provider: string;
  uid: string;
};

type AuthProviderDomainConstructor = {
  id: AuthProviderId;
  provider: Provider;
  uid: ProviderUid;
};

class AuthProviderDomain extends BaseDomain<AuthProviderId> {
  private _provider: Provider;
  private _uid: ProviderUid;
  private constructor(properties: AuthProviderDomainConstructor) {
    super(properties.id);
    this._provider = properties.provider;
    this._uid = properties.uid;
  }

  public static create(
    args: AuthProviderDomainArgs
  ): Result<AuthProviderDomain, ErrorResult> {
    const resultId = AuthProviderId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }
    const resultProvider = Provider.create(args.provider);
    if (resultProvider.isErr()) {
      return err(resultProvider.error);
    }
    const resultUid = ProviderUid.create(args.uid);
    if (resultUid.isErr()) {
      return err(resultUid.error);
    }

    const id = resultId.value;
    const provider = resultProvider.value;
    const uid = resultUid.value;

    const role = new AuthProviderDomain({
      id,
      provider,
      uid,
    });
    return ok(role);
  }

  get properties(): AuthProviderDomainProperties {
    return {
      id: this._id.value,
      provider: this._provider.value,
      uid: this._uid.value,
    };
  }
}

export default AuthProviderDomain;
