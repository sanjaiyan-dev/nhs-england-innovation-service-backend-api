import { mapOpenApi3 as openApi } from '@aaronpowell/azure-functions-nodejs-openapi';
import type { AzureFunction, HttpRequest } from '@azure/functions';

import { Audit, JwtDecoder } from '@innovations/shared/decorators';
import { JoiHelper, ResponseHelper } from '@innovations/shared/helpers';
import { AuthorizationServiceSymbol, AuthorizationServiceType } from '@innovations/shared/services';
import { ActionEnum, TargetEnum } from '@innovations/shared/services/integrations/audit.service';
import type { CustomContextType } from '@innovations/shared/types';

import { container } from '../_config';
import { InnovationsServiceSymbol, InnovationsServiceType } from '../_services/interfaces';

import type { ResponseDTO } from './transformation.dtos';
import { ParamsSchema, ParamsType } from './validation.schemas';


class V1InnovationSubmit {

  @JwtDecoder()
  @Audit({ action: ActionEnum.UPDATE, target: TargetEnum.INNOVATION, identifierParam: 'innovationId' })
  static async httpTrigger(context: CustomContextType, request: HttpRequest): Promise<void> {

    const authorizationService = container.get<AuthorizationServiceType>(AuthorizationServiceSymbol);
    const innovationsService = container.get<InnovationsServiceType>(InnovationsServiceSymbol);

    try {

      const params = JoiHelper.Validate<ParamsType>(ParamsSchema, request.params);

      const auth = await authorizationService.validate(context)
        .setInnovation(params.innovationId)
        .checkInnovatorType()
        .checkInnovation()
        .verify();
      const requestUser = auth.getUserInfo();
      const domainContext = auth.getContext()

      const result = await innovationsService.submitInnovation(
        { id: requestUser.id, identityId: requestUser.identityId, type: requestUser.type },
        domainContext,
        params.innovationId
      );
      context.res = ResponseHelper.Ok<ResponseDTO>({
        id: result.id,
        status: result.status
      });
      return;

    } catch (error) {
      context.res = ResponseHelper.Error(context, error);
      return;
    }

  }

}

export default openApi(V1InnovationSubmit.httpTrigger as AzureFunction, '/v1/{innovationId}/submit', {
  patch: {
    summary: 'Submit an innovation',
    description: 'Submit an innovation for assessment.',
    operationId: 'v1-innovation-submit',
    tags: ['Innovation'],
    parameters: [
      {
        name: 'innovationId',
        in: 'path',
        description: 'Innovation ID',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: {
        description: 'Innovation submitted successfully.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Innovation ID',
                },
                status: {
                  type: 'string',
                  description: 'Innovation status',
                },
              },
            },
          },
        },
      },
      400: {
        description: 'Bad request.',
      },
      401: {
        description: 'Unauthorized.',
      },
      403: {
        description: 'Forbidden.',
      },
      404: {
        description: 'Not found.',
      },
      500: {
        description: 'Internal server error.',
      },
    },
  },
});



