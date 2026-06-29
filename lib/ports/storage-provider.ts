export interface StorageProvider {
  uploadPhoto(eventId: string, file: Blob, filename: string): Promise<string>;
}
