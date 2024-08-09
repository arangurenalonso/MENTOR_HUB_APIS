import { ErrorResult } from '@domain/abstract/result-abstract';

class CommonInfrastructureError {
  static missingField(field: string, entity?: string): ErrorResult {
    const context = entity ? ` in the entity '${entity}'` : '';
    return new ErrorResult(
      `${field}Missing`,
      `The required field "${field}" was not found${context}. This might be due to a missing join or an incomplete data fetch.`,
      500
    );
  }
  static missingIds(missingIds: string[], entity: string): ErrorResult {
    return new ErrorResult(
      `${entity}IdsMissing`,
      `The following IDs were not found or are inactive in the entity '${entity}': ${missingIds.join(
        ', '
      )}`,
      404
    );
  }
}

export default CommonInfrastructureError;
