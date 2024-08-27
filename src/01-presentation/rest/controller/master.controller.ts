import TYPES from '@config/inversify/identifiers';
import { Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Mediator } from 'mediatr-ts';
import GetAllLevelQuery from '@application/features/master/query/getAllLevel/getAllLevel.query';
import { LevelDomainProperties } from '@domain/courses-aggregate/level/level.domain';
import GetAllCategoriesQuery from '@application/features/master/query/getAllCategories/getAllCategoriesquery';
import { CategoryDomainProperties } from '@domain/courses-aggregate/category/category.domain';
import GetSubCategoriesByIdCategoryQuery from '@application/features/master/query/getSubCategoriesByIdCategory/getSubCategoriesByIdCategory';
import { SubCategoryDomainProperties } from '@domain/courses-aggregate/sub-category/sub-category.domain';

@injectable()
class MasterController {
  constructor(@inject(TYPES.Mediator) private _mediator: Mediator) {
    this.getLevel = this.getLevel.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.getSubCategoryByIdCategory =
      this.getSubCategoryByIdCategory.bind(this);
  }

  public async getCategory(req: Request, res: Response) {
    // const connectedUser = res.locals.user as TokenPayload;
    const query = new GetAllCategoriesQuery();
    const result: Result<CategoryDomainProperties, ErrorResult> =
      await this._mediator.send(query);
    return result;
  }
  public async getSubCategoryByIdCategory(req: Request, res: Response) {
    // const connectedUser = res.locals.user as TokenPayload;
    const idCategory = req.params.idCategory;
    const query = new GetSubCategoriesByIdCategoryQuery(idCategory);
    const result: Result<SubCategoryDomainProperties, ErrorResult> =
      await this._mediator.send(query);
    return result;
  }
  public async getLevel(req: Request, res: Response) {
    // const connectedUser = res.locals.user as TokenPayload;
    const query = new GetAllLevelQuery();
    const result: Result<LevelDomainProperties, ErrorResult> =
      await this._mediator.send(query);
    return result;
  }
}

export default MasterController;
