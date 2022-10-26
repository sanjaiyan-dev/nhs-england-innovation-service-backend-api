import type { AzureFunction, HttpRequest } from '@azure/functions';
import { mapOpenApi3_1 as openApi } from '@aaronpowell/azure-functions-nodejs-openapi';

import { JwtDecoder } from '@innovations/shared/decorators';
import { JoiHelper, ResponseHelper } from '@innovations/shared/helpers';
import { type AuthorizationServiceType, AuthorizationServiceSymbol } from '@innovations/shared/services';
import type { CustomContextType } from '@innovations/shared/types';

import { container } from '../_config';
import { type InnovationSupportsServiceType, InnovationSupportsServiceSymbol } from '../_services/interfaces';

import { type ParamsType, ParamsSchema, type QueryParamsType, QueryParamsSchema } from './validation.schemas';
import type { ResponseDTO } from './transformation.dtos';


class V1InnovationSupportsList {

  @JwtDecoder()
  static async httpTrigger(context: CustomContextType, request: HttpRequest): Promise<void> {

    const authorizationService = container.get<AuthorizationServiceType>(AuthorizationServiceSymbol);
    const innovationSupportsService = container.get<InnovationSupportsServiceType>(InnovationSupportsServiceSymbol);

    try {

      const params = JoiHelper.Validate<ParamsType>(ParamsSchema, request.params);
      const queryParams = JoiHelper.Validate<QueryParamsType>(QueryParamsSchema, request.query);

      await authorizationService.validate(context.auth.user.identityId)
        .setInnovation(params.innovationId)
        .checkAssessmentType()
        .checkAccessorType()
        .checkInnovatorType()
        .checkInnovation()
        .verify();

      const result = await innovationSupportsService.getInnovationSupportsList(params.innovationId, queryParams);
      context.res = ResponseHelper.Ok<ResponseDTO>(result.map(item => ({
        id: item.id,
        status: item.status,
        organisation: {
          id: item.organisation.id, name: item.organisation.name, acronym: item.organisation.acronym!,
          unit: { id: item.organisation.unit.id, name: item.organisation.unit.name, acronym: item.organisation.unit.acronym! }
        },
        ...(item.engagingAccessors === undefined ? {} : { engagingAccessors: item.engagingAccessors })
      })));
      return;

    } catch (error) {
      context.res = ResponseHelper.Error(error);
      return;
    }

  }

}

export default openApi(V1InnovationSupportsList.httpTrigger as AzureFunction, '/v1/{innovationId}/supports', {
  get: {
    description: `Get a list with all Innovation's Supports.`,
    operationId: 'v1-innovations-supports-list',
    tags: ['Innovation Support'],
    parameters: [
      {
        in: 'path',
        name: 'innovationId',
        required: true,
        schema: {
          type: 'string',
        }
      }, {
        in: 'query',
        name: 'status',
        required: false,
        schema: {
          type: 'string',
        }
      }],
    responses: {
      200: {
        description: 'Success',
      },
      404: {
        description: 'Not found',
      }
    },
  },
})
