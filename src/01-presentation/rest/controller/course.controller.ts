import TYPES from '@config/inversify/identifiers';
import { Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Mediator } from 'mediatr-ts';
import TokenPayload from '@application/models/TokenPayload.model';
import CreateCourseCommand from '@application/features/course/command/createCourse/createCourse.command';
import UpdatePhotoCourseCommand from '@application/features/course/command/updatePhotoCourse/updatePhotoCourse.command';
import UpdatePromotionalVideoCourseCommand from '@application/features/course/command/updatePromotionalVideoCourse/updatePromotionalVideoCourse.command';
import GetCoursesByIdInstructorQuery from '@application/features/course/query/getCoursesByIdInstructor/getCoursesByIdInstructor.query';
import { CourseDomainProperties } from '@domain/courses-aggregate/root/course.domain';
import UpdateCourseInformationCommand from '@application/features/course/command/updateCourseInformation/updateCourseInformation.command';
import UpdateCourseEntrollmentCriteriaCommand from '@application/features/course/command/updateCourseEntrollmentCriteria/updateCourseEntrollmentCriteria.command';
import RequirementRequestDTO from '@application/features/course/command/updateCourseEntrollmentCriteria/requirement.request.dto';
import IntendedLearnersRequestDTO from '@application/features/course/command/updateCourseEntrollmentCriteria/intendedLearners.request.dto';
import LearningObjectivesRequestDTO from '@application/features/course/command/updateCourseEntrollmentCriteria/learningObjectives.request.dto';
import UpdatePublishCourseCommand from '@application/features/course/command/updatePublishCourse/updatePublishCourse.command';
import { title } from 'process';

@injectable()
class CourseController {
  constructor(@inject(TYPES.Mediator) private _mediator: Mediator) {
    this.create = this.create.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.updatePromotionalVideo = this.updatePromotionalVideo.bind(this);
    this.getCoursesByConnectedInstructor =
      this.getCoursesByConnectedInstructor.bind(this);
    this.updateCourseEnrollmentCriteria =
      this.updateCourseEnrollmentCriteria.bind(this);
    this.updateCourseInformation = this.updateCourseInformation.bind(this);
    this.publishCourse = this.publishCourse.bind(this);
  }

  public async getCoursesByConnectedInstructor(req: Request, res: Response) {
    const connectedUser = res.locals.user as TokenPayload;
    const command = new GetCoursesByIdInstructorQuery(connectedUser.idUser);
    const result: Result<CourseDomainProperties[], ErrorResult> =
      await this._mediator.send(command);
    return result;
  }
  public async create(req: Request, res: Response) {
    const connectedUser = res.locals.user as TokenPayload;
    const { title, description, idSubCategory, idLevel } = req.body as {
      title: string;
      description: string;
      idSubCategory: string;
      idLevel: string;
    };

    const command = new CreateCourseCommand(
      connectedUser,
      idSubCategory,
      idLevel,
      title,
      description
    );
    const result: Result<string, ErrorResult> = await this._mediator.send(
      command
    );
    return result;
  }

  public async publishCourse(req: Request, res: Response) {
    const connectedUser = res.locals.user as TokenPayload;

    const idCourse = req.params.idCourse;

    const command = new UpdatePublishCourseCommand(
      idCourse,
      connectedUser.idUser
    );
    const result: Result<void, ErrorResult> = await this._mediator.send(
      command
    );
    return result;
  }

  public async updateCourseInformation(req: Request, res: Response) {
    const connectedUser = res.locals.user as TokenPayload;

    const idCourse = req.params.idCourse;
    const { title, description, idSubCategory, idLevel } = req.body as {
      title: string;
      description: string;
      idSubCategory: string;
      idLevel: string;
    };

    const command = new UpdateCourseInformationCommand(
      idCourse,
      connectedUser.idUser,
      idSubCategory,
      idLevel,
      title,
      description
    );
    const result: Result<void, ErrorResult> = await this._mediator.send(
      command
    );
    return result;
  }

  public async updateCourseEnrollmentCriteria(req: Request, res: Response) {
    const connectedUser = res.locals.user as TokenPayload;

    const idCourse = req.params.idCourse;

    const requirements = req.body.requirements.map(
      (item: any) => new RequirementRequestDTO(item.description, item.id)
    );
    const intendedLearners = req.body.intendedLearners.map(
      (item: any) => new IntendedLearnersRequestDTO(item.description, item.id)
    );
    const learningObjectives = req.body.learningObjectives.map(
      (item: any) => new LearningObjectivesRequestDTO(item.description, item.id)
    );

    const command = new UpdateCourseEntrollmentCriteriaCommand(
      idCourse,
      connectedUser.idUser,
      requirements,
      intendedLearners,
      learningObjectives
    );
    const result: Result<void, ErrorResult> = await this._mediator.send(
      command
    );
    return result;
  }

  public async updateImage(req: Request, res: Response) {
    const idCourse = req.params.idCourse;
    const connectedUser = res.locals.user as TokenPayload;
    const file = req.file!;

    const command = new UpdatePhotoCourseCommand(
      file,
      idCourse,
      connectedUser.idUser
    );
    const result: Result<string, ErrorResult> = await this._mediator.send(
      command
    );
    return result;
  }
  public async updatePromotionalVideo(req: Request, res: Response) {
    const idCourse = req.params.idCourse;
    const connectedUser = res.locals.user as TokenPayload;
    const file = req.file!;

    const command = new UpdatePromotionalVideoCourseCommand(
      file,
      idCourse,
      connectedUser.idUser
    );
    const result: Result<string, ErrorResult> = await this._mediator.send(
      command
    );
    return result;
  }
}

export default CourseController;
