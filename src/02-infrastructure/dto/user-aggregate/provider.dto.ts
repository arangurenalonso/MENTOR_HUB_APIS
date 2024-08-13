import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import AuthProviderEntity from '@persistence/entities/user-aggregate/user-auth-provider.entity';
import AuthProviderDomain, {
  AuthProviderDomainProperties,
} from '@domain/user-aggregate/provider/auth-provider.domain';

class ProviderDTO {
  public static toDomain(
    entity: AuthProviderEntity
  ): Result<AuthProviderDomain, ErrorResult> {
    const result = AuthProviderDomain.create({
      id: entity.id,
      provider: entity.provider,
      uid: entity.uidProvider,
    });
    if (result.isErr()) {
      return err(result.error);
    }
    return ok(result.value);
  }
  public static toDomainArray(
    entities?: AuthProviderEntity[] | null
  ): Result<AuthProviderDomain[], ErrorResult> {
    if (entities === undefined || entities === null) {
      return ok([]);
    }

    const domainArray: AuthProviderDomain[] = [];
    for (const entity of entities) {
      const entityResult = this.toDomain(entity);
      if (entityResult.isErr()) {
        return err(entityResult.error);
      }
      domainArray.push(entityResult.value);
    }
    return ok(domainArray);
  }

  public static toEntity(
    idUser: string,
    domain: AuthProviderDomainProperties
  ): AuthProviderEntity {
    const entity = new AuthProviderEntity();
    entity.id = domain.id;
    entity.provider = domain.provider;
    entity.uidProvider = domain.uid;
    entity.idUser = idUser;
    return entity;
  }

  public static toEntityArray(
    idUser: string,
    domainArray: AuthProviderDomainProperties[] = []
  ): AuthProviderEntity[] {
    return domainArray.map((domain) => this.toEntity(idUser, domain));
  }
}
export default ProviderDTO;
