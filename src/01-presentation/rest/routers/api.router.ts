import { Router } from 'express';
import AuthRoutes from './auth/auth.router';
import { inject, injectable } from 'inversify';
import TYPES from '@config/inversify/identifiers';
import InstructorRoutes from './instructor/instructor.route';

@injectable()
class ApiRouter {
  constructor(
    @inject(TYPES.Router) private readonly _router: Router,
    @inject(TYPES.AuthRoutes) private readonly _authRoutes: AuthRoutes,
    @inject(TYPES.InstructorRoutes)
    private readonly _instructorRoutes: InstructorRoutes
  ) {
    this.init();
    this._router = this._router.bind(this);
  }

  private init(): void {
    this._router.use('/auth', this._authRoutes.router);
    this._router.use('/instructor', this._instructorRoutes.router);
  }
  get router(): Router {
    return this._router;
  }
}

export default ApiRouter;
