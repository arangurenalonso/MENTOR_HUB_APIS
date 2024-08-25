import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import BaseDomain from '@domain/abstract/BaseDomain';
import CategoryDescription from './value-object/category-descripcion.value-object';
import CategoryId from './value-object/category-id.value-object';

export type CategoryDomainProperties = {
  id: string;
  description: string;
};
export type CategoryDomainArgs = {
  id?: string;
  description: string;
};

type CategoryDomainConstructor = {
  id: CategoryId;
  description: CategoryDescription;
};

class CategoryDomain extends BaseDomain<CategoryId> {
  private _description: CategoryDescription;

  private constructor(properties: CategoryDomainConstructor) {
    super(properties.id);
    this._description = properties.description;
  }

  public static create(
    args: CategoryDomainArgs
  ): Result<CategoryDomain, ErrorResult> {
    const resultId = CategoryId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }
    const resultDescription = CategoryDescription.create(args.description);
    if (resultDescription.isErr()) {
      return err(resultDescription.error);
    }

    const id = resultId.value;
    const description = resultDescription.value;

    const role = new CategoryDomain({
      id,
      description,
    });
    return ok(role);
  }

  get properties(): CategoryDomainProperties {
    return {
      id: this._id.value,
      description: this._description.value,
    };
  }
}

export default CategoryDomain;
