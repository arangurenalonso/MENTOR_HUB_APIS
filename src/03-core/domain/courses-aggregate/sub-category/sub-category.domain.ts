import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import BaseDomain from '@domain/abstract/BaseDomain';
import SubCategoryId from './value-object/sub-category-id.value-object';
import SubCategoryDescription from './value-object/sub-category-descripcion.value-object';
import CategoryDomain, {
  CategoryDomainProperties,
} from '../category/category.domain';

export type SubCategoryDomainProperties = {
  id: string;
  description: string;
  category: CategoryDomainProperties;
};
export type SubCategoryDomainArgs = {
  id?: string;
  description: string;
  category: CategoryDomain;
};

type SubCategoryDomainConstructor = {
  id: SubCategoryId;
  description: SubCategoryDescription;
  category: CategoryDomain;
};

class SubCategoryDomain extends BaseDomain<SubCategoryId> {
  private _description: SubCategoryDescription;
  private _category: CategoryDomain;

  private constructor(properties: SubCategoryDomainConstructor) {
    super(properties.id);
    this._description = properties.description;
    this._category = properties.category;
  }

  public static create(
    args: SubCategoryDomainArgs
  ): Result<SubCategoryDomain, ErrorResult> {
    const resultId = SubCategoryId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }
    const resultDescription = SubCategoryDescription.create(args.description);
    if (resultDescription.isErr()) {
      return err(resultDescription.error);
    }

    const id = resultId.value;
    const description = resultDescription.value;

    const role = new SubCategoryDomain({
      id,
      description,
      category: args.category,
    });
    return ok(role);
  }

  get properties(): SubCategoryDomainProperties {
    return {
      id: this._id.value,
      description: this._description.value,
      category: this._category.properties,
    };
  }
}

export default SubCategoryDomain;
