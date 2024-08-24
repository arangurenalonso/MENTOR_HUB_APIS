import TYPES from '@config/inversify/identifiers';
import { Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Mediator } from 'mediatr-ts';
import GetAllLevelQuery from '@application/features/master/query/getAllLevel/getAllLevel.query';
import { LevelDomainProperties } from '@domain/courses-aggregate/level/level.domain';

@injectable()
class MasterController {
  constructor(@inject(TYPES.Mediator) private _mediator: Mediator) {
    this.getLevel = this.getLevel.bind(this);
  }

  public async getLevel(req: Request, res: Response) {
    // const connectedUser = res.locals.user as TokenPayload;
    const query = new GetAllLevelQuery();
    const result: Result<LevelDomainProperties, ErrorResult> =
      await this._mediator.send(query);
    return result;
  }
}

export default MasterController;
