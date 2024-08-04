import IEmailService from '@application/contracts/IEmail.service';
import Environment from '@config/enviroment';
import TYPES from '@config/inversify/identifiers';
import { injectable, inject } from 'inversify';
import nodeMailer, { Transporter } from 'nodemailer';

@injectable()
class EmailService implements IEmailService {
  private _transporter: Transporter;
  constructor(@inject(TYPES.Environment) private _envs: Environment) {
    this._transporter = nodeMailer.createTransport({
      service: this._envs.mailerService,
      auth: {
        user: this._envs.mailerEmail,
        pass: this._envs.mailerSecretKey,
      },
    });
  }

  async sendEmail(
    to: string | string[],
    subject: string,
    htmlBody: string,
    attachments?: {
      filename: string;
      path: string;
    }[]
  ): Promise<boolean> {
    try {
      const sentInformation = await this._transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachments,
      });
      // console.log(sentInformation);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export default EmailService;
