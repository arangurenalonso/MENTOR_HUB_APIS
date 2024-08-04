import ITokenService from '@application/contracts/IToken.service';
import TYPES from '@config/inversify/identifiers';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
class AuthenticationMiddleware {
  constructor(
    @inject(TYPES.ITokenService) private _tokenService: ITokenService
  ) {}

  public async use(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // const authorization = req.header('Authorization');
      const { authorization } = req.headers;
      // if( !authorization ) return res.status(401).json({ error: 'No token provided' });
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
      const tokenValidationResult = await this._tokenService.verifyToken(token);

      // if (tokenValidationResult..isErr()) {
      //   res.status(401).json({
      //     message: `${tokenValidationResult.error.type} ${tokenValidationResult.error.message}`,
      //   });
      //   return;
      // }
      // console.log('res.locals: ', res.locals);
      res.locals.user = tokenValidationResult;
      // res.locals.roles = tokenValidationResult.value.roles;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  }
}
export default AuthenticationMiddleware;
