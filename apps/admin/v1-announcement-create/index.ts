import { mapOpenApi3 as openApi } from '@aaronpowell/azure-functions-nodejs-openapi';
import type { AzureFunction, HttpRequest } from '@azure/functions';

import { JwtDecoder } from '@admin/shared/decorators';
import { JoiHelper, ResponseHelper, SwaggerHelper } from '@admin/shared/helpers';
import { AuthorizationServiceSymbol, AuthorizationServiceType } from '@admin/shared/services';
import type { CustomContextType } from '@admin/shared/types';

import { container } from '../_config';
import SYMBOLS from '../_services/symbols';
import type { AnnouncementsService } from '../_services/announcements.service';

import { BodySchema, BodyType } from './validation.schemas';
import type { ResponseDTO } from './transformation.dtos';

class V1AnnouncementsCreate {
  @JwtDecoder()
  static async httpTrigger(context: CustomContextType, request: HttpRequest): Promise<void> {

    const authorizationService = container.get<AuthorizationServiceType>(AuthorizationServiceSymbol);
    const announcementsService = container.get<AnnouncementsService>(SYMBOLS.AnnouncementsService);

    try {

      const body = JoiHelper.Validate<BodyType>(BodySchema, request.body);

      const auth = await authorizationService.validate(context).checkAdminType().verify();

      const result = await announcementsService.createAnnouncement(auth.getContext(), body);
      context.res = ResponseHelper.Ok<ResponseDTO>({ id: result.id });
      return;

    } catch (error) {
      context.res = ResponseHelper.Error(context, error);
      return;
    }
  }
}

export default openApi(V1AnnouncementsCreate.httpTrigger as AzureFunction, '/v1/announcements', {
  post: {
    description: 'Create an announcement.',
    operationId: 'v1-announcement-create',
    requestBody: SwaggerHelper.bodyJ2S(BodySchema),
    responses: {
      '200': {
        description: 'Announcement created.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: { type: 'string' }
              }
            }
          }
        }
      },
      '400': { description: 'Bad request' },
      '401': { description: 'Not authorized' },
      '500': { description: 'An error occurred' }
    }
  }
});
