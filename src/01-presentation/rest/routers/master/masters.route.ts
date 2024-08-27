import TYPES from '@config/inversify/identifiers';
import asyncHandlerMiddleware from '@rest/middlewares/asyncHandler.middleware';
import { Router } from 'express';
import { injectable, inject } from 'inversify';
import MasterController from '@rest/controller/master.controller';

@injectable()
export class MasterRoutes {
  constructor(
    @inject(TYPES.Router) private readonly _router: Router,
    @inject(TYPES.MasterController)
    private readonly _masterController: MasterController
  ) {
    this.initRoutes();
    this._router = this._router.bind(this);
  }

  private initRoutes(): void {
    this._router.get(
      '/level',
      asyncHandlerMiddleware(this._masterController.getLevel)
    );
    this._router.get(
      '/category',
      asyncHandlerMiddleware(this._masterController.getCategory)
    );
    this._router.get(
      '/category/:idCategory/sub-categories',
      asyncHandlerMiddleware(this._masterController.getSubCategoryByIdCategory)
    );
  }

  get router(): Router {
    return this._router;
  }
}
export default MasterRoutes;
