interface IS3Service {
  uploadFile(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<string>;
  deleteFile(fileName: string): Promise<void>;
  getFileUrl(fileName: string): Promise<string | null>;
}
export default IS3Service;
