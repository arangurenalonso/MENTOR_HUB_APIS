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

@injectable()
class CourseController {
  constructor(@inject(TYPES.Mediator) private _mediator: Mediator) {
    this.create = this.create.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.updatePromotionalVideo = this.updatePromotionalVideo.bind(this);
    this.getCoursesByConnectedInstructor =
      this.getCoursesByConnectedInstructor.bind(this);
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
