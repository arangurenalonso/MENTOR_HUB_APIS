import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import BaseDomain from '@domain/abstract/BaseDomain';
import IntendedLearnerDescription from './value-object/intended-learner-descripcion.value-object';
import IntendedLearnerId from './value-object/intended-learner-id.value-object';

export type IntendedLearnerDomainProperties = {
  id: string;
  description: string;
};
export type IntendedLearnerDomainArgs = {
  id?: string | null;
  description: string;
};

type IntendedLearnerDomainConstructor = {
  id: IntendedLearnerId;
  description: IntendedLearnerDescription;
};

class IntendedLearnerDomain extends BaseDomain<IntendedLearnerId> {
  private _description: IntendedLearnerDescription;

  private constructor(properties: IntendedLearnerDomainConstructor) {
    super(properties.id);
    this._description = properties.description;
  }

  public static create(
    args: IntendedLearnerDomainArgs
  ): Result<IntendedLearnerDomain, ErrorResult> {
    const resultId = IntendedLearnerId.create(args.id);
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

    const role = new IntendedLearnerDomain({
      id,
      description,
    });
    return ok(role);
  }

  get properties(): IntendedLearnerDomainProperties {
    return {
      id: this._id.value,
      description: this._description.value,
    };
  }
}

export default IntendedLearnerDomain;
