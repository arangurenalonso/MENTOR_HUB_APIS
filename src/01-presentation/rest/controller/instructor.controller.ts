import AuthenticationResult from '@application/models/AuthenticationResult';
import TYPES from '@config/inversify/identifiers';
import { Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Mediator } from 'mediatr-ts';
import TokenPayload from '@application/models/TokenPayload.model';
import CreateInstructorProfileCommand from '@application/features/instructor/command/createProfile/create-profile.command';
import UpdateInstructorAvailabilityCommand from '@application/features/instructor/command/updateAvailability/updateAvailability.command';
import AvailabilityRequestDTO from '@application/features/instructor/command/updateAvailability/availability.request.dto';
import UpdateAboutCommand from '@application/features/instructor/command/updateAbout/updateAbout.command';
import GetInstructorByIdQuery from '@application/features/instructor/query/getInstructorById/getInstructorById.query';
import { InstructorDomainProperties } from '@domain/intructor-aggregate/root/instructor.domain';

@injectable()
class InstructorController {
  constructor(@inject(TYPES.Mediator) private _mediator: Mediator) {
    this.createProfile = this.createProfile.bind(this);
    this.updateAvailability = this.updateAvailability.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.getConnectedInstructor = this.getConnectedInstructor.bind(this);
  }

  public async getConnectedInstructor(req: Request, res: Response) {
    const connectedUser = res.locals.user as TokenPayload;
    const command = new GetInstructorByIdQuery(connectedUser.idUser);
    const result: Result<InstructorDomainProperties, ErrorResult> =
      await this._mediator.send(command);
    return result;
  }

  public async createProfile(req: Request, res: Response) {
    const connectedUser = res.locals.user as TokenPayload;

    const command = new CreateInstructorProfileCommand(connectedUser);
    const result: Result<AuthenticationResult, ErrorResult> =
      await this._mediator.send(command);
    return result;
  }

  public async updateAvailability(req: Request, res: Response) {
    const idInstructor = req.params.idInstructor;
    const connectedUser = res.locals.user as TokenPayload;
    const availability = req.body.availability.map(
      (item: any) =>
        new AvailabilityRequestDTO(
          item.idDayOfWeek,
          item.idStartTime,
          item.idFinalTime,
          item.id
        )
    );

    const command = new UpdateInstructorAvailabilityCommand(
      idInstructor,
      availability,
      connectedUser
    );
    const result: Result<void, ErrorResult> = await this._mediator.send(
      command
    );
    return result;
  }

  public async updateProfile(req: Request, res: Response) {
    const connectedUser = res.locals.user as TokenPayload;

    const { headline, introduction, teachingExperience, motivation } =
      req.body as {
        headline: string;
        introduction: string;
        teachingExperience: string;
        motivation: string;
      };

    const idInstructor = req.params.idInstructor;

    const command = new UpdateAboutCommand(
      idInstructor,
      headline,
      introduction,
      teachingExperience,
      motivation
    );

    const result: Result<void, ErrorResult> = await this._mediator.send(
      command
    );

    return result;
  }
}

export default InstructorController;
