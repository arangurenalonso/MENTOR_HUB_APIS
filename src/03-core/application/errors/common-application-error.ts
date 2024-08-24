import { ErrorResult } from '@domain/abstract/result-abstract';

class CommonApplicationError {
  static notFound(
    entity: string,
    searchCriteria: { property: string; value: string | number }[]
  ): ErrorResult {
    let criteriaDescription = 'no specific criteria';
    if (searchCriteria.length > 0) {
      criteriaDescription = searchCriteria
        .map((criteria) => `${criteria.property}: '${criteria.value}'`)
        .join(', ');
    }

    return new ErrorResult(
      `${entity}NotFound`,
      `No records were found for the entity '${entity}' with the following criteria: ${criteriaDescription}.`,
      404
    );
  }
}

export default CommonApplicationError;
