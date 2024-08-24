import { Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import LevelDomain from '@domain/courses-aggregate/level/level.domain';
interface ICourseRepository {
  getAllLevelOfCourse(): Promise<Result<LevelDomain[] | null, ErrorResult>>;
}
export default ICourseRepository;
