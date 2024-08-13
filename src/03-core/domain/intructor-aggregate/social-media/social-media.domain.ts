import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import BaseDomain from '@domain/abstract/BaseDomain';
import SocialMediaId from './value-object/social-media-id.value-object';
import SocialMediaDescription from './value-object/social-media-description.value-object';
import SocialMediaURLProfile from './value-object/social-media-url.value-object';
import BaseURL from './value-object/base-url.value-object';
import ImageURL from './value-object/image-url.value-object';

export type SocialMediaDomainArgs = {
  id?: string;
  description: string;
  baseUrl: string;
  urlmage?: string;
  urlProfile: string;
  idRelation?: string;
};

export type SocialMediaDomainProperties = {
  id: string;
  description: string;
  baseUrl: string;
  urlmage: string | null;
  urlProfile: string;
  idRelation: string | null;
};

type SocialMediaDomainConstructor = {
  id: SocialMediaId;
  description: SocialMediaDescription;
  baseURL: BaseURL;
  urlmage: ImageURL | null;
  urlProfile: SocialMediaURLProfile;
  idRelation: string | null;
};

class SocialMediaDomain extends BaseDomain<SocialMediaId> {
  private _description: SocialMediaDescription;
  private _baseURL: BaseURL;
  private _urlmage: ImageURL | null;
  private _urlProfile: SocialMediaURLProfile;
  private _idRelation: string | null;

  private constructor(properties: SocialMediaDomainConstructor) {
    super(properties.id);
    this._description = properties.description;
    this._urlProfile = properties.urlProfile;
    this._baseURL = properties.baseURL;
    this._urlmage = properties.urlmage;
    this._idRelation = properties.idRelation;
  }

  public static create(
    args: SocialMediaDomainArgs
  ): Result<SocialMediaDomain, ErrorResult> {
    const resultId = SocialMediaId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }

    const resultDescription = SocialMediaDescription.create(args.description);
    if (resultDescription.isErr()) {
      return err(resultDescription.error);
    }
    const resultBaseURL = BaseURL.create(args.baseUrl);
    if (resultBaseURL.isErr()) {
      return err(resultBaseURL.error);
    }
    const resultUrlProfile = SocialMediaURLProfile.create(
      args.urlProfile,
      args.baseUrl
    );
    if (resultUrlProfile.isErr()) {
      return err(resultUrlProfile.error);
    }
    const resultUrlmage = ImageURL.create(args.urlmage);
    if (resultUrlmage.isErr()) {
      return err(resultUrlmage.error);
    }

    const id = resultId.value;
    const description = resultDescription.value;
    const baseURL = resultBaseURL.value;
    const urlProfile = resultUrlProfile.value;
    const urlmage = resultUrlmage.value;

    const socialMedia = new SocialMediaDomain({
      id,
      description,
      baseURL,
      urlProfile,
      urlmage,
      idRelation: args.idRelation || null,
    });
    return ok(socialMedia);
  }

  get properties(): SocialMediaDomainProperties {
    return {
      id: this._id.value,
      description: this._description.value,
      baseUrl: this._baseURL.value,
      urlProfile: this._urlProfile.value,
      urlmage: this._urlmage?.value || null,
      idRelation: this._idRelation,
    };
  }
}

export default SocialMediaDomain;
