interface IPasswordService {
  encrypt(password: string): Promise<string>;
  decrypt(password: string, textHashed: string): Promise<boolean>;
}
export default IPasswordService;
