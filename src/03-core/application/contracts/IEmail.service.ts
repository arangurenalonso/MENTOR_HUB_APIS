interface IEmailService {
  sendEmail(
    to: string | string[],
    subject: string,
    htmlBody: string,
    attachments?: {
      filename: string;
      path: string;
    }[]
  ): Promise<boolean>;
}
export default IEmailService;
