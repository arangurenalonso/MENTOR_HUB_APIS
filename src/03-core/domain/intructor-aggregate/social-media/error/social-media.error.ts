import { ErrorResult } from '@domain/abstract/result-abstract';

class SocialMediaErrors {
  static readonly INVALID_ID = (id?: string): ErrorResult => {
    const idMessage = id ? ` "${id}"` : '';
    return new ErrorResult(
      'SOCIAL_MEDIA.ID',
      `Social Media ID${idMessage} is not a valid ID`,
      400
    );
  };
  static readonly INVALID_DESCRIPTION = (reasons: string[]): ErrorResult => {
    return new ErrorResult(
      'SOCIAL_MEDIA.DESCRIPTION',
      `SOCIAL_MEDIA description is invalid: ${reasons.join(', ')}`,
      400
    );
  };

  static readonly INVALID_URL_PROFILE = (
    socialMediaBaseURL: string
  ): ErrorResult => {
    return new ErrorResult(
      'SOCIAL_MEDIA.URL_PROFILE',
      `The provided URL does not start with the expected social media base URL: ${socialMediaBaseURL}. Please ensure the URL is correctly formatted.`,
      400
    );
  };
  static readonly URL_PROFILE_REQUIRED = new ErrorResult(
    'SOCIAL_MEDIA.URL_PROFILE',
    `The provided URL is required.`,
    400
  );

  static readonly INVALID_BASE_URL = (reasons: string[]): ErrorResult => {
    const reasonsMessage = reasons.join('; ');
    return new ErrorResult(
      'SOCIAL_MEDIA.BaseURL',
      `Social Media base url is not valid: ${reasonsMessage}`,
      400
    );
  };
}

export default SocialMediaErrors;
