import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import RoleId from './value-object/role-id.value-object';
import BaseDomain from '@domain/abstract/BaseDomain';
import RoleDescription from './value-object/role-descripcion.value-object';

export type RoleDomainProperties = {
  id: string;
  description: string;
};
export type RoleDomainArgs = {
  id?: string;
  description: string;
};

type RoleDomainConstructor = {
  id: RoleId;
  description: RoleDescription;
};

class RoleDomain extends BaseDomain<RoleId> {
  private _description: RoleDescription;

  private constructor(properties: RoleDomainConstructor) {
    super(properties.id);
    this._description = properties.description;
  }

  public static create(args: RoleDomainArgs): Result<RoleDomain, ErrorResult> {
    const resultId = RoleId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }
    const resultDescription = RoleDescription.create(args.description);
    if (resultDescription.isErr()) {
      return err(resultDescription.error);
    }

    const id = resultId.value;
    const description = resultDescription.value;

    const role = new RoleDomain({ id, description });
    return ok(role);
  }

  get properties(): RoleDomainProperties {
    return {
      id: this._id.value,
      description: this._description.value,
    };
  }
}

export default RoleDomain;
