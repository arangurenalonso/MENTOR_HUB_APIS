import { CronJob } from 'cron';
import { injectable } from 'inversify';

type CronTime = string | Date;
type OnTick = () => void;

@injectable()
class CronService {
  constructor() {}
  createJob(cronTime: CronTime, onTick: OnTick): CronJob {
    const job = new CronJob(cronTime, onTick);
    job.start();
    return job;
  }
}

export default CronService;
