import AuthController from '@rest/controller/auth.controller';
import { Router } from 'express';
import LoginValidation from './validator/login.validator';
import RegisterValidation from './validator/register.validator';
import { inject, injectable } from 'inversify';
import TYPES from '@config/inversify/identifiers';
import asyncHandlerMiddleware from '@rest/middlewares/asyncHandler.middleware';
import ValidatorMiddleware from '@rest/middlewares/validator.middleware';
import GoogleSignUpValidation from './validator/social-provider-google';
@injectable()
export class AuthRoutes {
  constructor(
    @inject(TYPES.Router) private readonly _router: Router,
    @inject(TYPES.AuthController)
    private readonly _authController: AuthController
  ) {
    this.initRoutes();
    this._router = this._router.bind(this);
  }

  private initRoutes(): void {
    this._router.post(
      '/login',
      LoginValidation,
      ValidatorMiddleware.validate,
      asyncHandlerMiddleware(this._authController.login)
    );
    this._router.post(
      '/register',
      RegisterValidation,
      ValidatorMiddleware.validate,
      asyncHandlerMiddleware(this._authController.register)
    );
    this._router.post(
      '/social-provider/:provider',
      GoogleSignUpValidation,
      ValidatorMiddleware.validate,
      asyncHandlerMiddleware(this._authController.socialProvider)
    );
  }
  get router(): Router {
    return this._router;
  }
}
export default AuthRoutes;
