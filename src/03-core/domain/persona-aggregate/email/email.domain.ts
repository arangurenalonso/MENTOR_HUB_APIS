import BaseDomain from '@domain/abstract/BaseDomain';
import { ErrorResult } from '@domain/abstract/result-abstract';
import Email from '@domain/user-aggregate/root/value-object/email.value-object';
import { Result, err, ok } from 'neverthrow';
import VerificationToken from './value-object/verification_token.value-object';
import { v4 as uuidv4 } from 'uuid';
import EmailId from './value-object/email-id.value-object';

export type EmailDomainProperties = {
  id: string;
  email_address: string;
  is_primary: boolean;
  is_verified: boolean;
  verification_token: string;
};

export type EmailDomainCreateArg = {
  id?: string;
  email_address: string;
  is_primary?: boolean;
  is_verified?: boolean;
  verification_token?: string;
};

type EmailDomainConstructor = {
  id: EmailId;
  email_address: Email;
  is_primary?: boolean;
  is_verified?: boolean;
  verification_token: VerificationToken;
};

class EmailDomain extends BaseDomain<EmailId> {
  private _email_address: Email;
  private _is_primary: boolean;
  private _is_verified: boolean;
  private _verification_token: VerificationToken;

  private constructor(properties: EmailDomainConstructor) {
    super(properties.id);
    this._email_address = properties.email_address;
    this._is_primary = properties.is_primary || false;
    this._is_verified = properties.is_verified || false;
    this._verification_token = properties.verification_token;
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
    let verificationTokenString = args.verification_token || '';
    if (!args.id) {
      verificationTokenString = uuidv4();
    }
    const verificationTokenResult = VerificationToken.create(
      verificationTokenString
    );
    if (verificationTokenResult.isErr()) {
      return err(verificationTokenResult.error);
    }

    const id = resultId.value;
    const email = resultEmail.value;
    const verificationToken = verificationTokenResult.value;

    const emailDomain = new EmailDomain({
      id,
      email_address: email,
      is_primary: args.is_primary,
      is_verified: args.is_verified,
      verification_token: verificationToken,
    });

    return ok(emailDomain);
  }

  get properties(): EmailDomainProperties {
    return {
      id: this._id.value,
      email_address: this._email_address.value,
      is_primary: this._is_primary,
      is_verified: this._is_verified,
      verification_token: this._verification_token.value,
    };
  }
}

export default EmailDomain;
