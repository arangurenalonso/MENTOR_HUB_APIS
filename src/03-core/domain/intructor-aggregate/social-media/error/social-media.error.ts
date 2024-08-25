import { ErrorResult } from '@domain/abstract/result-abstract';

class SocialMediaErrors {
  static readonly INVALID_URL_PROFILE = (
    socialMediaBaseURL: string
  ): ErrorResult => {
    return new ErrorResult(
      'SOCIAL_MEDIA.URL_PROFILE',
      `The provided URL does not start with the expected social media base URL: ${socialMediaBaseURL}. Please ensure the URL is correctly formatted.`,
      400
    );
  };
}

export default SocialMediaErrors;
