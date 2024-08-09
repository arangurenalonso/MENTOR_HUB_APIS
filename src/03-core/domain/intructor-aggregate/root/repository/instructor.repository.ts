import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import InstructorDomain from '../instructor.domain';
import DayOfWeekDomain from '@domain/intructor-aggregate/availability/day-of-week.domain';
import TimeOptionDomain from '@domain/intructor-aggregate/availability/time-option.domain';

interface IInstructorRepository {
  getInstructorById(
    id: string
  ): Promise<Result<InstructorDomain | null, ErrorResult>>;
  getDayOfWeekByIdArray(
    ids: string[]
  ): Promise<Result<DayOfWeekDomain[], ErrorResult>>;
  getTimeOptionsByIdArray(
    ids: string[]
  ): Promise<Result<TimeOptionDomain[], ErrorResult>>;

  register(instructor: InstructorDomain): Promise<void>;
}
export default IInstructorRepository;
