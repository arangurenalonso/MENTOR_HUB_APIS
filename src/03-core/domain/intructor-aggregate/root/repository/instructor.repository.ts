import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import InstructorDomain from '../instructor.domain';

interface IInstructorRepository {
  getById(id: string): Promise<Result<InstructorDomain | null, ErrorResult>>;
  register(instructor: InstructorDomain): Promise<void>;
}
export default IInstructorRepository;
