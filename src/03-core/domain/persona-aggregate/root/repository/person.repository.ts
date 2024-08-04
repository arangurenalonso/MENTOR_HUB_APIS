import { ErrorResult } from '@domain/abstract/result-abstract';
import NaturalPersonDomain from '@domain/persona-aggregate/natural-person/natural-person.domain';
import { Result } from 'neverthrow';

interface IPersonRepository {
  getPersonById(
    id: string
  ): Promise<Result<NaturalPersonDomain | null, ErrorResult>>;

  register(
    naturalPersonDomain: NaturalPersonDomain
  ): Promise<Result<void, ErrorResult>>;
}
export default IPersonRepository;
