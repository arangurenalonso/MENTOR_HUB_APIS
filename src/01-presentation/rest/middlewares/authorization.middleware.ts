import { NextFunction, Request, Response } from 'express';

class AuthorizationMiddleware {
  constructor() {}
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
