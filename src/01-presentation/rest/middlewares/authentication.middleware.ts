import ITokenService from '@application/contracts/IToken.service';
import TokenPayload from '@application/models/TokenPayload.model';
import TYPES from '@config/inversify/identifiers';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { resolve } from 'path';

@injectable()
class AuthenticationMiddleware {
  constructor(
    @inject(TYPES.ITokenService) private _tokenService: ITokenService
  ) {
    this.use = this.use.bind(this);
  }

  public async use(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        res.status(401).json({ message: 'Token not provided' });
        return;
      }

      if (!authorization.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Invalid Bearer token' });
        return;
      }
      const tokensParts = authorization.split(' ');
      if (tokensParts?.length !== 2 || tokensParts[0] !== 'Bearer') {
        res.status(401).json({ message: 'Token malformatted' });
        return;
      }
      const token = tokensParts.at(1) || '';

      const tokenValidationResult =
        await this._tokenService.verifyToken<TokenPayload>(token);

      if (tokenValidationResult.isErr()) {
        res.status(401).json({
          message: `${tokenValidationResult.error.type} ${tokenValidationResult.error.message}`,
        });
        return;
      }
      const tokenDecoded = tokenValidationResult.value;
      res.locals.user = tokenDecoded;
      res.locals.roles = tokenDecoded.roles;
      next();
    } catch (error) {
      console.log('error', error);

      res.status(401).json({ message: 'Invalid token', error: error });
    }
  }
}
export default AuthenticationMiddleware;
