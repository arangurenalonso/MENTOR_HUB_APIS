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
        const roles = res.locals.roles;
        // console.log("roles: ", roles);
        // console.log("rolesAllowed: ", rolesAllowed);

        for (const roleAllowed of rolesAllowed) {
          if (roles.includes(roleAllowed)) {
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
