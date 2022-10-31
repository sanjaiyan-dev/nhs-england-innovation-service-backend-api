import type { AzureFunction, HttpRequest } from '@azure/functions';
import { mapOpenApi3_1 as openApi } from '@aaronpowell/azure-functions-nodejs-openapi';

import { JwtDecoder } from '@innovations/shared/decorators';
import { JoiHelper, ResponseHelper } from '@innovations/shared/helpers';
import { AuthorizationServiceType, AuthorizationServiceSymbol } from '@innovations/shared/services';
import type { CustomContextType } from '@innovations/shared/types';

import { container } from '../_config';
import { InnovationActionsServiceType, InnovationActionsServiceSymbol } from '../_services/interfaces';

import { QueryParamsType, QueryParamsSchema } from './validation.schemas';
import type { ResponseDTO } from './transformation.dtos';


class V1InnovationActionsList {

  @JwtDecoder()
  static async httpTrigger(context: CustomContextType, request: HttpRequest): Promise<void> {

    const authorizationService = container.get<AuthorizationServiceType>(AuthorizationServiceSymbol);
    const innovationActionsService = container.get<InnovationActionsServiceType>(InnovationActionsServiceSymbol);

    try {

      const queryParams = JoiHelper.Validate<QueryParamsType>(QueryParamsSchema, request.query);
      const { skip, take, order, ...filters } = queryParams;

      const authInstance = await authorizationService.validate(context.auth.user.identityId)
        .checkAssessmentType()
        .checkAccessorType()
        .checkInnovatorType()
        .verify();
      const requestUser = authInstance.getUserInfo();

      const result = await innovationActionsService.getActionsList(
        {
          id: requestUser.id,
          type: requestUser.type,
          ...(requestUser.organisations[0]?.id ? { organisationId: requestUser.organisations[0].id } : {}),
          ...(requestUser.organisations[0]?.organisationUnits[0]?.id ? { organizationUnitId: requestUser.organisations[0].organisationUnits[0].id } : {}),
          ...(requestUser.organisations[0]?.role ? { organisationRole: requestUser.organisations[0]?.role } : {})
        },
        filters,
        { skip, take, order }
      );

      context.res = ResponseHelper.Ok<ResponseDTO>({
        count: result.count,
        data: result.data.map(item => ({
          id: item.id,
          displayId: item.displayId,
          status: item.status,
          description: item.description,
          innovation: { id: item.innovation.id, name: item.innovation.name },
          section: item.section,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          ...(item.notifications === undefined ? {} : { notifications: item.notifications })
        }))
      });
      return;

    } catch (error) {
      context.res = ResponseHelper.Error(context, error);
      return;
    }
  }
}

export default openApi(V1InnovationActionsList.httpTrigger as AzureFunction, '/v1/actions', {
  get: {
    description: 'Get a list of innovation actions.',
    operationId: 'v1-innovation-actions-list',
    parameters: [
      {
        name: 'skip',
        in: 'query',
        required: false,
        description: 'The number of records to skip.',
        schema: {
          type: 'integer',
          minimum: 0
        }
      },
      {
        name: 'take',
        in: 'query',
        required: false,
        description: 'The number of records to take.',
        schema: {
          type: 'integer',
          minimum: 1,
          maximum: 100
        }
      },
      {
        name: 'order',
        in: 'query',
        required: false,
        description: 'The order of the records.',
        schema: {
          type: 'string',
        }
      },
      {
        name: 'status',
        in: 'query',
        required: false,
        description: 'The status of the action.',
        schema: {
          type: 'string',
        }
      },
      {
        name: 'section',
        in: 'query',
        required: false,
        description: 'The section of the action.',
        schema: {
          type: 'string',
        }
      },
      {
        name: 'innovationId',
        in: 'query',
        required: false,
        description: 'The innovation id of the action.',
        schema: {
          type: 'string',
        }
      },
      {
        name: 'innovationName',
        in: 'query',
        required: false,
        description: 'The innovation name of the action.',
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      200: {
        description: 'The list of innovation actions.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                count: {
                  type: 'integer',
                  description: 'The total number of records.'
                },
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        description: 'The id of the action.'
                      },
                      displayId: {
                        type: 'string',
                        description: 'The display id of the action.'
                      },
                      status: {
                        type: 'string',
                        description: 'The status of the action.'
                      },
                      description: {
                        type: 'string',
                        description: 'The description of the action.'
                      },
                      section: {
                        type: 'string',
                        description: 'The section of the action.'
                      },
                      createdAt: {
                        type: 'string',
                        description: 'The date the action was created.'
                      },
                      updatedAt: {
                        type: 'string',
                        description: 'The date the action was last updated.'
                      },
                      innovation: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                            description: 'The id of the innovation.'
                          },
                          name: {
                            type: 'string',
                            description: 'The name of the innovation.'
                          }
                        }
                      },
                      notifications: {
                        type: 'object',
                        properties: {
                          count: {
                            type: 'integer',
                            description: 'The number of notifications for the action.'
                          }
                        }
                      }
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
});
