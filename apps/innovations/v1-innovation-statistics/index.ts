import type { HttpRequest } from '@azure/functions';

import { JwtDecoder } from '@innovations/shared/decorators';
import { JoiHelper, ResponseHelper } from '@innovations/shared/helpers';
import { type AuthorizationServiceType, AuthorizationServiceSymbol } from '@innovations/shared/services';

import type { CustomContextType } from '@innovations/shared/types';

import { container } from '../_config';
import type { InnovationStatisticsTemplateType } from '../_config/statistics.config';
import type { InnovationStatisticsEnum } from '../_enums/innovation.enums';
import { StatisticsHandlersHelper } from '../_helpers/handlers.helper';
import type { ResponseDTO } from './transformation.dtos';
import { ParamsSchema, ParamsType, QuerySchema, QueryType } from './validation.schemas';


class GetInnovationStatistics {

  @JwtDecoder()
  static async httpTrigger(context: CustomContextType, request: HttpRequest): Promise<void> {

    const authorizationService = container.get<AuthorizationServiceType>(AuthorizationServiceSymbol);
    
    try {

      const params = JoiHelper.Validate<ParamsType>(ParamsSchema, request.params);

      const query = JoiHelper.Validate<QueryType>(QuerySchema, request.query);

      const auth = await authorizationService.validate(context.auth.user.identityId)
        .setInnovation(params.innovationId)
        .checkAssessmentType()
        .checkAccessorType()
        .checkInnovatorType()
        .checkInnovation()
        .verify();

      const requestUser = auth.getUserInfo();

        const stats = await StatisticsHandlersHelper.runHandler(
          { id: requestUser.id, identityId: requestUser.identityId, type: requestUser.type },
          query.statistics,
          { innovationId: params.innovationId }
        ); 
    
      context.res = ResponseHelper.Ok<ResponseDTO>(stats);
      return;

    } catch (error) {
      context.res = ResponseHelper.Error(context, error);
      return;
    }

  }

}

export default GetInnovationStatistics.httpTrigger;
