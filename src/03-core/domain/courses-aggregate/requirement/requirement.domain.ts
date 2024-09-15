import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import BaseDomain from '@domain/abstract/BaseDomain';
import IntendedLearnerDescription from './value-object/requirement-descripcion.value-object';
import RequirementId from './value-object/requirement-id.value-object';

export type RequirementDomainProperties = {
  id: string;
  description: string;
};
export type RequirementDomainArgs = {
  id?: string | null;
  description: string;
};

type RequirementDomainConstructor = {
  id: RequirementId;
  description: IntendedLearnerDescription;
};

class RequirementDomain extends BaseDomain<RequirementId> {
  private _description: IntendedLearnerDescription;

  private constructor(properties: RequirementDomainConstructor) {
    super(properties.id);
    this._description = properties.description;
  }

  public static create(
    args: RequirementDomainArgs
  ): Result<RequirementDomain, ErrorResult> {
    const resultId = RequirementId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }
    const resultDescription = IntendedLearnerDescription.create(
      args.description
    );
    if (resultDescription.isErr()) {
      return err(resultDescription.error);
    }

    const id = resultId.value;
    const description = resultDescription.value;

    const role = new RequirementDomain({
      id,
      description,
    });
    return ok(role);
  }

  get properties(): RequirementDomainProperties {
    return {
      id: this._id.value,
      description: this._description.value,
    };
  }
}

export default RequirementDomain;
