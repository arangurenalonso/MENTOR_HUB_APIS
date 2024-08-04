import TokenPayload from '@application/models/TokenPayload.model';

interface ITokenService {
  generateToken(userDetails: TokenPayload): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload>;
}

export default ITokenService;
