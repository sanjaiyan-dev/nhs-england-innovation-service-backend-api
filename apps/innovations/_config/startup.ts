import fs from 'fs';
import type { Container } from 'inversify';
import { join } from 'path';
import YAML from 'yaml';

import type { HttpService, LoggerService } from '@innovations/shared/services';
import SHARED_SYMBOLS from '@innovations/shared/services/symbols';

export const startup = async (container: Container): Promise<void> => {
  console.log('Initializing Innovations app function');

  const httpService = container.get<HttpService>(SHARED_SYMBOLS.HttpService);
  const logger = container.get<LoggerService>(SHARED_SYMBOLS.LoggerService);

  try {
    logger.log('Initialization complete');

    if (process.env['LOCAL_MODE'] ?? false) {
      console.group('Generating documentation...');

      const response = await httpService.getHttpInstance().get(`http://localhost:7072/api/swagger.json`);
      console.log('Saving swagger file');
      fs.writeFileSync(
        `${join(__dirname, '../../../..')}/apps/innovations/.apim/swagger.yaml`,
        YAML.stringify(response.data)
      );
      console.log('Documentation generated successfully');
      console.groupEnd();
    }
  } catch (error) {
    // TODO: Treat this error! Should we end the process?
    logger.error('Innovations app function was UNABLE to start', { error });
  }
};
