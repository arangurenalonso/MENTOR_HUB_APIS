import TokenPayload, {
  rolesType,
} from '@application/models/TokenPayload.model';
import { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';
import sharp from 'sharp';

@injectable()
class AuthorizeModificationMiddleware {
  constructor() {
    this.build = this.build.bind(this);
  }

  public build(
    rolesAllowedForUnrestrictedModification: string[],
    id: string
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

        // Verificar si el usuario tiene un rol que le permite modificar sin restricciones
        const hasPermissionToEditOthers =
          rolesAllowedForUnrestrictedModification.some((roleAllowed) =>
            rolesString.includes(roleAllowed.trim().toUpperCase())
          );

        if (hasPermissionToEditOthers) {
          return next();
        }

        // Obtener el ID del usuario conectado y el ID del parámetro de la ruta
        const connectedUser = res.locals.user as TokenPayload;
        const paramId = req.params[id];

        if (!connectedUser.idUser || !paramId) {
          res.status(400).json({ message: 'Invalid request, missing ID' });
          return;
        }

        // Verificar si el ID del usuario conectado coincide con el ID del parámetro
        if (connectedUser.idUser !== paramId) {
          res
            .status(403)
            .json({ message: 'Forbidden: You can only modify your own data' });
          return;
        }

        next();
      } catch (error) {
        res.status(403).json({ message: `Forbidden: ${error}` });
      }
    };
    return use;
  }
}

export default AuthorizeModificationMiddleware;
