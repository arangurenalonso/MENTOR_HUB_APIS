import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import BaseDomain from '@domain/abstract/BaseDomain';
import InstructorId from './value-object/instructor-id.value-object';
import SocialMediaDomain, {
  SocialMediaDomainProperties,
} from '../social-media/social-media.domain';
import WebsiteURL from './value-object/website_url.value-object';
import Heading from './value-object/heading.value-object';
import AboutMe from './value-object/about-me.value-object';
import InstructorAvailabilityDomain, {
  InstructorAvailabilityDomainProperties,
} from '../availability/instructor-availability.domain';
import InstructorAvailabilityDomainErrors from '../availability/error/instructor.domain.error';

export type InstructorDomainProperties = {
  id: string;
  websideURL: string | null;
  headline: string | null;
  socialMedia: SocialMediaDomainProperties[];
  // naturalPerson: NaturalPersonDomainProperties | null;
  introductionText: string | null;
  teachingExperienceText: string | null;
  motivationText: string | null;
  availability: InstructorAvailabilityDomainProperties[];
};

type InstructorDomainCreateArg = {
  id: string;
  websideURL?: string;
  headline?: string | null;
  socialMedia?: SocialMediaDomain | null | SocialMediaDomain[];
  // naturalPerson?: NaturalPersonDomain | null;
  introductionText?: string | null;
  teachingExperienceText?: string | null;
  motivationText?: string | null;
  availability?: InstructorAvailabilityDomain[];
};

type InstructorDomainConstructor = {
  id: InstructorId;
  websideURL: WebsiteURL | null;
  headline: Heading | null;
  socialMedia: SocialMediaDomain[];
  // naturalPerson?: NaturalPersonDomain | null;
  aboutMe: AboutMe | null;
  availability: InstructorAvailabilityDomain[];
};

class InstructorDomain extends BaseDomain<InstructorId> {
  private _websideURL: WebsiteURL | null;
  // private _naturalPerson: NaturalPersonDomain | null;
  private _socialMedia: SocialMediaDomain[] = [];
  private _headline: Heading | null;
  private _aboutMe: AboutMe | null;
  private _availability: InstructorAvailabilityDomain[];

  private constructor(properties: InstructorDomainConstructor) {
    super(properties.id);
    this._websideURL = properties.websideURL || null;
    // this._naturalPerson = properties.naturalPerson || null;
    this._socialMedia = properties.socialMedia || [];
    this._headline = properties.headline;
    this._aboutMe = properties.aboutMe;
    this._availability = properties.availability;
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
    // const naturalPerson = args.naturalPerson;
    let socialMedia: SocialMediaDomain[] = [];
    if (args.socialMedia) {
      if (Array.isArray(args.socialMedia)) {
        socialMedia = args.socialMedia.flat();
      } else {
        socialMedia = [args.socialMedia];
      }
    }
    const headline = resultHeading.value;
    const availability = args.availability || [];

    const overlapCheck =
      InstructorDomain.checkAvailabilityOverlap(availability);
    if (overlapCheck.isErr()) {
      return err(overlapCheck.error);
    }

    const instructorDomain = new InstructorDomain({
      id,
      websideURL,
      // naturalPerson,
      socialMedia,
      headline,
      aboutMe,
      availability,
    });
    return ok(instructorDomain);
  }

  profile(
    heading: string,
    introduction?: string,
    teachingExperience?: string,
    motivation?: string
  ): Result<void, ErrorResult> {
    const resultAboutMe = AboutMe.create(
      introduction,
      teachingExperience,
      motivation
    );

    if (resultAboutMe.isErr()) {
      return err(resultAboutMe.error);
    }
    const headingResult = Heading.create(heading);
    if (headingResult.isErr()) {
      return err(headingResult.error);
    }
    this._aboutMe = resultAboutMe.value;
    this._headline = headingResult.value;

    return ok(undefined);
  }
  updateAvailability(
    availability: InstructorAvailabilityDomain[]
  ): Result<void, ErrorResult> {
    const overlapCheck =
      InstructorDomain.checkAvailabilityOverlap(availability);
    if (overlapCheck.isErr()) {
      return err(overlapCheck.error);
    }
    this._availability = availability;
    return ok(undefined);
  }
  private static checkAvailabilityOverlap(
    availability: InstructorAvailabilityDomain[]
  ): Result<void, ErrorResult> {
    const availabilityByDay: { [key: number]: InstructorAvailabilityDomain[] } =
      {};

    availability.forEach((a) => {
      const dayIndex = a.properties.dayOfWeek.dayIndex;
      if (!availabilityByDay[dayIndex]) {
        availabilityByDay[dayIndex] = [];
      }
      availabilityByDay[dayIndex].push(a);
    });

    // Comprobar solapamientos dentro de cada día
    for (const dayIndex in availabilityByDay) {
      const dayAvailabilities = availabilityByDay[dayIndex];

      if (dayAvailabilities.length == 0 || dayAvailabilities.length == 1) {
        continue;
      }
      // Ordenar las disponibilidades por hora de inicio para simplificar la comprobación
      dayAvailabilities.sort(
        (a, b) => a.properties.startTime.index - b.properties.startTime.index
      );
      for (let i = 0; i < dayAvailabilities.length - 1; i++) {
        const current = dayAvailabilities[i];
        const next = dayAvailabilities[i + 1];

        if (
          current.properties.finalTime.index > next.properties.startTime.index
        ) {
          return err(
            InstructorAvailabilityDomainErrors.OVERLAPPING_TIME(
              current.properties.dayOfWeek.dayName,
              current.properties.startTime.value,
              current.properties.finalTime.value,
              next.properties.startTime.value,
              next.properties.finalTime.value
            )
          );
        }
      }
    }

    return ok(undefined);
  }
  get id(): InstructorId {
    return this._id;
  }
  get properties(): InstructorDomainProperties {
    return {
      id: this._id.value,
      websideURL: this._websideURL?.value || null,
      headline: this._headline?.value || null,
      socialMedia: this._socialMedia.map(
        (socialMedia) => socialMedia.properties
      ),
      // naturalPerson: this._naturalPerson?.properties || null,
      introductionText:
        JSON.stringify(this._aboutMe?.introduction.value) || null,
      teachingExperienceText:
        JSON.stringify(this._aboutMe?.teachingExperience.value) || null,
      motivationText: JSON.stringify(this._aboutMe?.motivation.value) || null,
      availability: this._availability.map(
        (availability) => availability.properties
      ),
    };
  }
}

export default InstructorDomain;

// country of birth
// languages youspeak
// phone number
// photoURL
