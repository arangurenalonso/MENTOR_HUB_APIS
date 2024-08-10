import { rolesType } from '@application/models/TokenPayload.model';
import { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';
@injectable()
class AuthorizationMiddleware {
  constructor() {
    this.build = this.build.bind(this);
  }
  //Funcion que devuelve una funcion middleware
  public build(
    rolesAllowed: string[]
  ): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    const use = async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const roles: rolesType[] = res.locals.roles;

        const rolesString = roles.map((x) =>
          x.description.trim().toUpperCase()
        );

        for (const roleAllowed of rolesAllowed) {
          if (rolesString.includes(roleAllowed.trim().toUpperCase())) {
            return next();
          }
        }

        res.status(403).json({ message: 'Forbidden' });
      } catch (error) {
        res.status(403).json({ message: `${error}` });
      }
    };
    return use;
  }
}

export default AuthorizationMiddleware;
