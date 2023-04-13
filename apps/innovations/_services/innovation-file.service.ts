import { inject, injectable } from 'inversify';
import { basename, extname } from 'path';

import type { EntityManager } from 'typeorm';

import { InnovationFileEntity } from '@innovations/shared/entities';
import { FileStorageServiceSymbol, FileStorageServiceType } from '@innovations/shared/services';

import { BaseService } from './base.service';

@injectable()
export class InnovationFileService extends BaseService {

  constructor(@inject(FileStorageServiceSymbol) private fileStorageService: FileStorageServiceType) {
    super();
  }
  
  /**
   * uploads a file to the innovation
   * @param userId the user identifier making the request
   * @param innovationId the innovation identifier
   * @param filename the file name
   * @param context optional context for the file
   * @param em optional entity manager to use for the transaction
   * @returns the created file and the url to upload the file to
   */
  async uploadInnovationFile(
    userId: string,
    innovationId: string, 
    filename: string, 
    context: null | string, 
    entityManager?: EntityManager
  ): Promise<{id: string, displayFileName: string, url: string}> {
    
    const connection = entityManager ?? this.sqlConnection.manager;
    const extension = extname(filename);
    const filenameWithoutExtension = basename(filename, extension);
    
    const file = await connection.save(InnovationFileEntity, {
      createdBy: userId,
      displayFileName: filenameWithoutExtension.substring(0, 99-extension.length) + extension, // failsafe to avoid filename too long (100 chars max)
      innovation: { id: innovationId },
      context,
    });

    return {
      id: file.id,
      displayFileName: file.displayFileName,
      url: this.fileStorageService.getUploadUrl(file.id, filename)
    };
  }
}