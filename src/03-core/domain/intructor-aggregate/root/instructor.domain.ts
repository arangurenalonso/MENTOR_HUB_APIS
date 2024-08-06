import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import BaseDomain from '@domain/abstract/BaseDomain';
import InstructorId from './value-object/instructor-id.value-object';
import NaturalPersonDomain from '@domain/persona-aggregate/natural-person/natural-person.domain';
import SocialMediaDomain, {
  SocialMediaDomainProperties,
} from '../social-media/social-media.domain';
import WebsiteURL from './value-object/website_url.value-object';
import Heading from './value-object/heading.value-object';
import AboutMe from './value-object/about-me.value-object';

type InstructorDomainProperties = {
  id: string;
  websideURL: string | null;
  headline: string | null;
  socialMedia: SocialMediaDomainProperties[];
  naturalPerson: NaturalPersonDomain | null;
  introductionText: string;
  teachingExperienceText: string;
  motivationText: string;
};

type InstructorDomainCreateArg = {
  id: string;
  websideURL?: string;
  headline?: string | null;
  socialMedia?: SocialMediaDomain | null | SocialMediaDomain[];
  naturalPerson?: NaturalPersonDomain | null;
  introductionText?: string | null;
  teachingExperienceText?: string | null;
  motivationText?: string | null;
};

type InstructorDomainConstructor = {
  id: InstructorId;
  websideURL: WebsiteURL | null;
  headline: Heading | null;
  socialMedia: SocialMediaDomain[];
  naturalPerson?: NaturalPersonDomain | null;
  aboutMe: AboutMe;
};

class InstructorDomain extends BaseDomain<InstructorId> {
  private _websideURL: WebsiteURL | null;
  private _naturalPerson: NaturalPersonDomain | null;
  private _socialMedia: SocialMediaDomain[] = [];
  private _headline: Heading | null;
  private _aboutMe: AboutMe;

  private constructor(properties: InstructorDomainConstructor) {
    super(properties.id);
    this._websideURL = properties.websideURL || null;
    this._naturalPerson = properties.naturalPerson || null;
    this._socialMedia = properties.socialMedia || [];
    this._headline = properties.headline;
    this._aboutMe = properties.aboutMe;
  }

  public static create(
    args: InstructorDomainCreateArg
  ): Result<InstructorDomain, ErrorResult> {
    const resultId = InstructorId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }
    const resultWebSiteURL = WebsiteURL.create(args.websideURL);
    if (resultWebSiteURL.isErr()) {
      return err(resultWebSiteURL.error);
    }
    const resultHeading = Heading.create(args.headline);
    if (resultHeading.isErr()) {
      return err(resultHeading.error);
    }
    const resultAboutMe = AboutMe.create(
      args.introductionText,
      args.teachingExperienceText,
      args.motivationText
    );

    if (resultAboutMe.isErr()) {
      return err(resultAboutMe.error);
    }
    const aboutMe = resultAboutMe.value;
    const id = resultId.value;
    const websideURL = resultWebSiteURL.value;
    const naturalPerson = args.naturalPerson;
    let socialMedia: SocialMediaDomain[] = [];
    if (args.socialMedia) {
      if (Array.isArray(args.socialMedia)) {
        socialMedia = args.socialMedia.flat();
      } else {
        socialMedia = [args.socialMedia];
      }
    }
    const headline = resultHeading.value;

    const instructorDomain = new InstructorDomain({
      id,
      websideURL,
      naturalPerson,
      socialMedia,
      headline,
      aboutMe,
    });
    return ok(instructorDomain);
  }

  get properties(): InstructorDomainProperties {
    return {
      id: this._id.value,
      websideURL: this._websideURL?.value || null,
      headline: this._headline?.value || null,
      socialMedia: this._socialMedia.map(
        (socialMedia) => socialMedia.properties
      ),
      naturalPerson: this._naturalPerson,
      introductionText: this._aboutMe.introduction.value,
      teachingExperienceText: this._aboutMe.teachingExperience.value,
      motivationText: this._aboutMe.motivation.value,
    };
  }
}

export default InstructorDomain;

// country of birth
// languages youspeak
// phone number
// photoURL
