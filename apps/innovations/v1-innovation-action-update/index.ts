import { mapOpenApi3 as openApi } from '@aaronpowell/azure-functions-nodejs-openapi';
import type { AzureFunction, HttpRequest } from '@azure/functions';

import { JwtDecoder } from '@innovations/shared/decorators';
import { ServiceRoleEnum } from '@innovations/shared/enums';
import { BadRequestError, GenericErrorsEnum } from '@innovations/shared/errors';
import { JoiHelper, ResponseHelper } from '@innovations/shared/helpers';
import type { AuthorizationService } from '@innovations/shared/services';
import SHARED_SYMBOLS from '@innovations/shared/services/symbols';
import type { CustomContextType } from '@innovations/shared/types';

import { container } from '../_config';

import type { InnovationActionsService } from '../_services/innovation-actions.service';
import SYMBOLS from '../_services/symbols';
import type { ResponseDTO } from './transformation.dtos';
import { BodySchema, BodyType, ParamsSchema, ParamsType } from './validation.schemas';

class V1InnovationActionUpdate {
  @JwtDecoder()
  static async httpTrigger(context: CustomContextType, request: HttpRequest): Promise<void> {
    const authorizationService = container.get<AuthorizationService>(SHARED_SYMBOLS.AuthorizationService);
    const innovationActionsService = container.get<InnovationActionsService>(SYMBOLS.InnovationActionsService);

    try {
      const params = JoiHelper.Validate<ParamsType>(ParamsSchema, request.params);

      const auth = await authorizationService
        .validate(context)
        .setInnovation(params.innovationId)
        .checkAccessorType()
        .checkInnovatorType()
        .checkAssessmentType()
        .checkInnovation()
        .verify();
      const requestUser = auth.getUserInfo();
      const domainContext = auth.getContext();

      const body = JoiHelper.Validate<BodyType>(BodySchema, request.body, {
        userRole: domainContext.currentRole
      });

      if (
        domainContext.currentRole.role === ServiceRoleEnum.ACCESSOR ||
        domainContext.currentRole.role === ServiceRoleEnum.QUALIFYING_ACCESSOR
      ) {
        const accessorResult = await innovationActionsService.updateActionAsAccessor(
          domainContext,
          params.innovationId,
          params.actionId,
          { status: body.status }
        );

        context.res = ResponseHelper.Ok<ResponseDTO>({ id: accessorResult.id });
        return;
      }

      if (domainContext.currentRole.role === ServiceRoleEnum.ASSESSMENT) {
        const assessmentResult = await innovationActionsService.updateActionAsNeedsAccessor(
          domainContext,
          params.innovationId,
          params.actionId,
          { status: body.status }
        );

        context.res = ResponseHelper.Ok<ResponseDTO>({ id: assessmentResult.id });
        return;
      }

      if (domainContext.currentRole.role === ServiceRoleEnum.INNOVATOR) {
        const innovatorResult = await innovationActionsService.updateActionAsInnovator(
          domainContext,
          params.innovationId,
          params.actionId,
          { status: body.status, message: body.message ?? '' } // Joi will make sure that message is never empty for an innovator.
        );

        context.res = ResponseHelper.Ok<ResponseDTO>({ id: innovatorResult.id });
        return;
      }

      throw new BadRequestError(GenericErrorsEnum.INVALID_PAYLOAD);
    } catch (error) {
      context.res = ResponseHelper.Error(context, error);
      return;
    }
  }
}

export default openApi(V1InnovationActionUpdate.httpTrigger as AzureFunction, '/v1/{innovationId}/actions/{actionId}', {
  put: {
    description: 'Update an innovation action.',
    operationId: 'v1-innovation-action-update',
    tags: ['[v1] Innovation Actions'],
    parameters: [
      {
        name: 'innovationId',
        in: 'path',
        description: 'The innovation id.',
        required: true,
        schema: {
          type: 'string'
        }
      },
      {
        name: 'actionId',
        in: 'path',
        description: 'The innovation action id.',
        required: true,
        schema: {
          type: 'string'
        }
      }
    ],
    requestBody: {
      description: 'The innovation action data.',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The name of the action.'
              },
              description: {
                type: 'string',
                description: 'The description of the action.'
              },
              status: {
                type: 'string',
                description: 'The status of the action.'
              },
              assignee: {
                type: 'string',
                description: 'The assignee of the action.'
              },
              dueDate: {
                type: 'string',
                description: 'The due date of the action.'
              },
              comment: {
                type: 'string',
                description: 'The comment of the action.'
              }
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: 'The innovation action has been updated.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'The innovation action id.'
                },
                name: {
                  type: 'string',
                  description: 'The name of the action.'
                },
                description: {
                  type: 'string',
                  description: 'The description of the action.'
                },
                status: {
                  type: 'string',
                  description: 'The status of the action.'
                },
                assignee: {
                  type: 'string',
                  description: 'The assignee of the action.'
                },
                dueDate: {
                  type: 'string',
                  description: 'The due date of the action.'
                },
                comment: {
                  type: 'string',
                  description: 'The comment of the action.'
                },
                createdAt: {
                  type: 'string',
                  description: 'The date when the action was created.'
                },
                updatedAt: {
                  type: 'string',
                  description: 'The date when the action was updated.'
                }
              }
            }
          }
        }
      },
      '400': {
        description: 'The innovation action data is invalid.'
      },
      '401': {
        description: 'The user is not authorized to update the innovation action.'
      },
      '404': {
        description: 'The innovation action does not exist.'
      },
      '500': {
        description: 'An error occurred while updating the innovation action.'
      }
    }
  }
});
