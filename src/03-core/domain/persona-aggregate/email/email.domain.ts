import BaseDomain from '@domain/abstract/BaseDomain';
import { ErrorResult } from '@domain/abstract/result-abstract';
import Email from '@domain/user-aggregate/root/value-object/email.value-object';
import { Result, err, ok } from 'neverthrow';
import { v4 as uuidv4 } from 'uuid';
import EmailId from './value-object/email-id.value-object';

export type EmailDomainProperties = {
  id: string;
  email_address: string;
  is_primary: boolean;
  is_verified: boolean;
};

export type EmailDomainCreateArg = {
  id?: string;
  email_address: string;
  is_primary?: boolean;
  is_verified?: boolean;
};

type EmailDomainConstructor = {
  id: EmailId;
  email_address: Email;
  is_primary?: boolean;
  is_verified?: boolean;
};

class EmailDomain extends BaseDomain<EmailId> {
  private _email_address: Email;
  private _is_primary: boolean;
  private _is_verified: boolean;

  private constructor(properties: EmailDomainConstructor) {
    super(properties.id);
    this._email_address = properties.email_address;
    this._is_primary = properties.is_primary || false;
    this._is_verified = properties.is_verified || false;
  }

  public static create(
    args: EmailDomainCreateArg
  ): Result<EmailDomain, ErrorResult> {
    const resultId = EmailId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }
    const resultEmail = Email.create(args.email_address);
    if (resultEmail.isErr()) {
      return err(resultEmail.error);
    }
    const id = resultId.value;
    const email = resultEmail.value;

    const emailDomain = new EmailDomain({
      id,
      email_address: email,
      is_primary: args.is_primary,
      is_verified: args.is_verified,
    });

    return ok(emailDomain);
  }
  public verify() {
    this._is_verified = true;
  }
  get properties(): EmailDomainProperties {
    return {
      id: this._id.value,
      email_address: this._email_address.value,
      is_primary: this._is_primary,
      is_verified: this._is_verified,
    };
  }
}

export default EmailDomain;
