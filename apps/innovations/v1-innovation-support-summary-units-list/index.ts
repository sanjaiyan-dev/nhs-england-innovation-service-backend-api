import { mapOpenApi3 as openApi } from '@aaronpowell/azure-functions-nodejs-openapi';
import type { AzureFunction, HttpRequest } from '@azure/functions';

import { JwtDecoder } from '@innovations/shared/decorators';
import { JoiHelper, ResponseHelper, SwaggerHelper } from '@innovations/shared/helpers';
import type { AuthorizationService } from '@innovations/shared/services';
import SHARED_SYMBOLS from '@innovations/shared/services/symbols';
import type { CustomContextType } from '@innovations/shared/types';

import { container } from '../_config';

import { InnovationSupportStatusEnum } from '@innovations/shared/enums';
import type { InnovationSupportsService } from '../_services/innovation-supports.service';
import SYMBOLS from '../_services/symbols';
import type { ResponseDTO } from './transformation.dtos';
import { ParamsSchema, ParamsType, QueryParamsSchema, QueryParamsType } from './validation.schemas';

class V1InnovationSupportSummaryUnitsList {
  @JwtDecoder()
  static async httpTrigger(context: CustomContextType, request: HttpRequest): Promise<void> {
    const authorizationService = container.get<AuthorizationService>(SHARED_SYMBOLS.AuthorizationService);
    const innovationSupportsService = container.get<InnovationSupportsService>(SYMBOLS.InnovationSupportsService);

    try {
      await authorizationService
        .validate(context)
        .checkAssessmentType()
        .checkAccessorType()
        .checkInnovatorType()
        .checkAdminType()
        .verify();

      const params = JoiHelper.Validate<ParamsType>(ParamsSchema, request.params);
      const queryParams = JoiHelper.Validate<QueryParamsType>(QueryParamsSchema, request.query);

      const result = await innovationSupportsService.getSupportSummariesList(params.innovationId, queryParams.type);

      context.res = ResponseHelper.Ok<ResponseDTO>(
        result.map(r => ({
          id: r.id,
          name: r.name,
          support: { status: r.support.status, start: r.support.start, end: r.support.end }
        }))
      );
      return;
    } catch (error) {
      context.res = ResponseHelper.Error(context, error);
      return;
    }
  }
}

export default openApi(
  V1InnovationSupportSummaryUnitsList.httpTrigger as AzureFunction,
  '/v1/{innovationId}/support-summary/units',
  {
    get: {
      operationId: 'v1-innovation-support-summary-units-list',
      description: 'Get support summary units list',
      tags: ['[v1] Innovation Support Summary'],
      parameters: SwaggerHelper.paramJ2S({ path: ParamsSchema, query: QueryParamsSchema }),
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    support: {
                      type: 'object',
                      properties: {
                        status: {
                          type: 'string',
                          enum: Object.values(InnovationSupportStatusEnum)
                        },
                        start: { type: 'string' },
                        end: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'The request is invalid.'
        },
        401: {
          description: 'The user is not authenticated.'
        },
        403: {
          description: 'The user is not authorized to access this resource.'
        },
        500: {
          description: 'An error occurred while processing the request.'
        }
      }
    }
  }
);
