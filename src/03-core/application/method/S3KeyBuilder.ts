export enum S3FileType {
  IMAGE = 'images',
  VIDEO = 'videos',
  DOCUMENT = 'documents',
}

class S3KeyBuilder {
  static buildProfileKey(
    userId: string,
    fileType: S3FileType,
    fileName: string
  ): string {
    this.validateInputs(userId, fileName);
    return `users/${userId}/profile/${fileType}/${this.sanitizeFileName(
      fileName
    )}`;
  }

  static buildCourseKey(
    userId: string,
    fileType: S3FileType,
    courseId: string,
    fileName: string
  ): string {
    this.validateInputs(userId, fileName, courseId);
    return `users/${userId}/courses/${courseId}/${fileType}/${this.sanitizeFileName(
      fileName
    )}`;
  }

  private static sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
  }

  private static validateInputs(...inputs: string[]): void {
    inputs.forEach((input) => {
      if (!input || input.trim().length === 0) {
        throw new Error('Input cannot be empty or whitespace');
      }
    });
  }
}

export default S3KeyBuilder;
