import IPasswordService from '@application/contracts/Ipassword.service';
import Environment from '@config/enviroment';
import TYPES from '@config/inversify/identifiers';
import * as bcrypt from 'bcryptjs';
import { inject, injectable } from 'inversify';

@injectable()
class PasswordService implements IPasswordService {
  constructor(@inject(TYPES.Environment) private readonly _env: Environment) {}

  public async encrypt(password: string): Promise<string> {
    return bcrypt.hash(password, this._env.saltRounds);
  }

  public async decrypt(password: string, textHashed: string): Promise<boolean> {
    return bcrypt.compare(password, textHashed);
  }
}
export default PasswordService;
