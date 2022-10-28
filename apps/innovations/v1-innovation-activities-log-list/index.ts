import type { AzureFunction, HttpRequest } from '@azure/functions'
import { mapOpenApi3 as openApi } from '@aaronpowell/azure-functions-nodejs-openapi';

import { JwtDecoder } from '@innovations/shared/decorators';
import { JoiHelper, ResponseHelper } from '@innovations/shared/helpers';
import { AuthorizationServiceSymbol, AuthorizationServiceType } from '@innovations/shared/services';
import type { CustomContextType } from '@innovations/shared/types';

import { container } from '../_config';
import { InnovationsServiceSymbol, InnovationsServiceType } from '../_services/interfaces';

import { ParamsSchema, ParamsType, QueryParamsSchema, QueryParamsType } from './validation.schemas';
import type { ResponseDTO } from './transformation.dtos';


class V1InnovationsActivitiesLogList {

  @JwtDecoder()
  static async httpTrigger(context: CustomContextType, request: HttpRequest): Promise<void> {

    const authorizationService = container.get<AuthorizationServiceType>(AuthorizationServiceSymbol);
    const innovationsService = container.get<InnovationsServiceType>(InnovationsServiceSymbol);

    try {

      const params = JoiHelper.Validate<ParamsType>(ParamsSchema, request.params);
      const queryParams = JoiHelper.Validate<QueryParamsType>(QueryParamsSchema, request.query);

      const auth = await authorizationService.validate(context.auth.user.identityId)
        .setInnovation(params.innovationId)
        .checkAssessmentType()
        .checkAccessorType()
        .checkInnovatorType()
        .checkInnovation()
        .verify();

      const innovation = auth.getInnovationInfo();

      const { skip, take, order, ...filters } = queryParams;

      const result = await innovationsService.getInnovationActivitiesLog(
        params.innovationId,
        filters,
        { skip, take, order }
      );

      context.res = ResponseHelper.Ok<ResponseDTO>({
        count: result.count,
        innovation: { id: innovation.id, name: innovation.name },
        data: result.data.map(item => ({
          type: item.type,
          activity: item.activity,
          date: item.date,
          params: item.params
        }))
      })
      return;

    } catch (error) {
      context.res = ResponseHelper.Error(error);
      return;
    }

  }

}


export default openApi(V1InnovationsActivitiesLogList.httpTrigger as AzureFunction, '/v1/{innovationId}/activities', {
  get: {
    operationId: 'v1-innovation-activities-log-list',
    description: 'Get activities log list of an Innovation',
    parameters: [
      {
        name: 'innovationId',
        in: 'path',
        required: true,
        description: 'Innovation Id.',
        schema: {
          type: 'string',
        }
      },
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
        name: 'activityTypes',
        in: 'query',
        required: false,
        description: 'Activity types of the logs.',
        schema: {
          type: 'string',
        }
      },
      {
        name: 'startDate',
        in: 'query',
        required: false,
        description: 'Activity Logs that start after this date.',
        schema: {
          type: 'string',
        }
      },
      {
        name: 'endDate',
        in: 'query',
        required: false,
        description: 'Activity Logs that start before this date.',
        schema: {
          type: 'string',
        }
      }
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                count: {
                  type: 'number',
                },
                innovation: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string'
                    },
                    name: {
                      type: 'string'
                    },
                  }
                },
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      type: {
                        type: 'string',
                      },
                      activity: {
                        type: 'string',
                      },
                      date: {
                        type: 'number',
                      },
                      params: {
                        type: 'object',
                        properties: {
                          actionUserId: {
                            type: 'string',
                          },
                          interveningUserId: {
                            type: 'string',
                          },
                          assessmentId: {
                            type: 'string',
                          },
                          sectionId: {
                            type: 'string',
                          },
                          actionId: {
                            type: 'string',
                          },
                          innovationSupportStatus: {
                            type: 'string',
                          },
                          organisations: {
                            type: 'array',
                            items: {
                              type: 'string',
                            }
                          },
                          organisationUnit: {
                            type: 'string',
                          },
                          comment: {
                            type: 'object',
                            properties: {
                              id: {
                                type: 'string'
                              },
                              value: {
                                type: 'string'
                              }
                            }
                          },
                          totalActions: {
                            type: 'number'
                          },
                          thread: {
                            type: 'object',
                            properties: {
                              id: {
                                type: 'string',
                              },
                              subject: {
                                type: 'string',
                              },
                              messageId: {
                                type: 'string',
                              }
                            },
                          },
                          actionUserName: {
                            type: 'string'
                          },
                          interveningUserName: {
                            type: 'string'
                          }
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      500: {
        description: 'An error occurred while processing the request.'
      }
    },
  },
});
