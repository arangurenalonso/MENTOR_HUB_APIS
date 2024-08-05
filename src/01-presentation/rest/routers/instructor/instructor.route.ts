import TYPES from '@config/inversify/identifiers';
import asyncHandlerMiddleware from '@rest/middlewares/asyncHandler.middleware';
import ValidatorMiddleware from '@rest/middlewares/validator.middleware';
import { Router } from 'express';
import { injectable, inject } from 'inversify';
import LoginValidation from '../auth/validator/login.validator';
import InstructorController from '@rest/controller/instructor.controller';
import AuthenticationMiddleware from '@rest/middlewares/authentication.middleware';
import AuthorizationMiddleware from '@rest/middlewares/authorization.middleware';

@injectable()
export class InstructorRoutes {
  constructor(
    @inject(TYPES.Router) private readonly _router: Router,
    @inject(TYPES.InstructorController)
    private readonly _instructorController: InstructorController,
    @inject(TYPES.AuthorizationMiddleware)
    private readonly _authorizationMiddleware: AuthorizationMiddleware,
    @inject(TYPES.AuthenticationMiddleware)
    private readonly _authenticationMiddleware: AuthenticationMiddleware
  ) {
    this.initRoutes();
    this._router = this._router.bind(this);
  }

  private initRoutes(): void {
    this._router.post(
      '/profile',
      this._authenticationMiddleware.use,
      asyncHandlerMiddleware(this._instructorController.createProfile)
    );
  }
  get router(): Router {
    return this._router;
  }
}
export default InstructorRoutes;