import type { AzureFunction, HttpRequest } from '@azure/functions'
import { mapOpenApi3_1 as openApi } from '@aaronpowell/azure-functions-nodejs-openapi';

import {
  AuthorizationServiceSymbol, AuthorizationServiceType,
} from '@innovations/shared/services';
import {
  JwtDecoder,
} from '@innovations/shared/decorators'

import { container } from '../_config';
import { InnovationTransferServiceSymbol, InnovationTransferServiceType } from '../_services/interfaces';
import { ParamsSchema, ParamsType } from './validation.schemas';
import type { ResponseDTO } from './transformation.dtos';
import type { CustomContextType } from '@innovations/shared/types';
import { JoiHelper, ResponseHelper } from '@innovations/shared/helpers';

class GetInnovationTransfer {

  @JwtDecoder()
  static async httpTrigger(context: CustomContextType, request: HttpRequest): Promise<void> {

    const authorizationService = container.get<AuthorizationServiceType>(AuthorizationServiceSymbol);
    const innovationTransferService = container.get<InnovationTransferServiceType>(InnovationTransferServiceSymbol);

    try {

      const params = JoiHelper.Validate<ParamsType>(ParamsSchema, request.params);

      await authorizationService.validate(context.auth.user.identityId)
        .checkInnovatorType()
        .verify();

      const result = await innovationTransferService.getInnovationTransferInfo(params.transferId);
      context.res = ResponseHelper.Ok<ResponseDTO>({
        id: result.id,
        email: result.email,
        innovation: {
          id: result.innovation.id,
          name: result.innovation.name,
          owner: { name: result.innovation.owner.name }
        }
      });
      return;

    } catch (error) {
      context.res = ResponseHelper.Error(error);
      return;
    }

  }

}

export default openApi(GetInnovationTransfer.httpTrigger as AzureFunction, '/v1/innovation-transfers/{transferId}', {
  get: {
    description: 'Get an innovation transfer',
    operationId: 'getInnovationTransfer',
    parameters: [
      {
        name: 'transferId',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
      404: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  },
});

