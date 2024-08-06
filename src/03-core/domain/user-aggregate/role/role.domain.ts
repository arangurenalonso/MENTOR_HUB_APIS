import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import RoleId from './value-object/role-id.value-object';
import BaseDomain from '@domain/abstract/BaseDomain';
import RoleDescription from './value-object/role-descripcion.value-object';

export type RoleDomainProperties = {
  id: string;
  description: string;
  idRelation?: string;
};
export type RoleDomainArgs = {
  id?: string;
  description: string;
  idRelation?: string;
};

type RoleDomainConstructor = {
  id: RoleId;
  description: RoleDescription;
  idRelation?: string;
};

class RoleDomain extends BaseDomain<RoleId> {
  private _description: RoleDescription;
  private _idRelation?: string;

  private constructor(properties: RoleDomainConstructor) {
    super(properties.id);
    this._description = properties.description;
    this._idRelation = properties.idRelation;
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

    const role = new RoleDomain({
      id,
      description,
      idRelation: args.idRelation,
    });
    return ok(role);
  }

  get properties(): RoleDomainProperties {
    return {
      id: this._id.value,
      description: this._description.value,
      idRelation: this._idRelation,
    };
  }
}

export default RoleDomain;
