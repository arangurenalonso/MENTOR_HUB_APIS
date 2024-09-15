import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import BaseDomain from '@domain/abstract/BaseDomain';
import LearningObjectiveId from './value-object/intended-learner-id.value-object';
import LearningObjectiveDescription from './value-object/learning-objective-descripcion.value-object';

export type LearningObjectiveDomainProperties = {
  id: string;
  description: string;
};
export type LearningObjectiveDomainArgs = {
  id?: string | null;
  description: string;
};

type LearningObjectiveDomainConstructor = {
  id: LearningObjectiveId;
  description: LearningObjectiveDescription;
};

class LearningObjectiveDomain extends BaseDomain<LearningObjectiveId> {
  private _description: LearningObjectiveDescription;

  private constructor(properties: LearningObjectiveDomainConstructor) {
    super(properties.id);
    this._description = properties.description;
  }

  public static create(
    args: LearningObjectiveDomainArgs
  ): Result<LearningObjectiveDomain, ErrorResult> {
    const resultId = LearningObjectiveId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }
    const resultDescription = LearningObjectiveDescription.create(
      args.description
    );
    if (resultDescription.isErr()) {
      return err(resultDescription.error);
    }

    const id = resultId.value;
    const description = resultDescription.value;

    const role = new LearningObjectiveDomain({
      id,
      description,
    });
    return ok(role);
  }

  get properties(): LearningObjectiveDomainProperties {
    return {
      id: this._id.value,
      description: this._description.value,
    };
  }
}

export default LearningObjectiveDomain;
