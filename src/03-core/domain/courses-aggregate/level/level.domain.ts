import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import BaseDomain from '@domain/abstract/BaseDomain';
import LevelId from './value-object/level-id.value-object';
import LevelDescription from './value-object/Level-descripcion.value-object';

export type LevelDomainProperties = {
  id: string;
  description: string;
};
export type LevelDomainArgs = {
  id?: string;
  description: string;
};

type LevelDomainConstructor = {
  id: LevelId;
  description: LevelDescription;
  idRelation?: string;
};

class LevelDomain extends BaseDomain<LevelId> {
  private _description: LevelDescription;
  private _idRelation?: string;

  private constructor(properties: LevelDomainConstructor) {
    super(properties.id);
    this._description = properties.description;
    this._idRelation = properties.idRelation;
  }

  public static create(
    args: LevelDomainArgs
  ): Result<LevelDomain, ErrorResult> {
    const resultId = LevelId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }
    const resultDescription = LevelDescription.create(args.description);
    if (resultDescription.isErr()) {
      return err(resultDescription.error);
    }

    const id = resultId.value;
    const description = resultDescription.value;

    const role = new LevelDomain({
      id,
      description,
    });
    return ok(role);
  }

  get properties(): LevelDomainProperties {
    return {
      id: this._id.value,
      description: this._description.value,
    };
  }
}

export default LevelDomain;
