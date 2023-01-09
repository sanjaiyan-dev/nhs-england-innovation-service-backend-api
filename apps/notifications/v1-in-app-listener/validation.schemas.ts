import Joi from 'joi';

import { NotificationContextDetailEnum, NotificationContextTypeEnum } from '@notifications/shared/enums';
import { DomainContextSchema, DomainContextType } from '@notifications/shared/types';


export type MessageType = {
  data: {
    requestUser: { id: string },
    domainContext: DomainContextType,
    innovationId: string,
    context: { type: NotificationContextTypeEnum, detail: NotificationContextDetailEnum, id: string },
    userIds: string[];
    params: { [key: string]: string | number | string[] }
  }
}

export const MessageSchema = Joi.object<MessageType>({

  data: Joi.object<MessageType['data']>({

    requestUser: Joi.object<MessageType['data']['requestUser']>({
      id: Joi.string().guid().required()
    }).required(),

    domainContext: DomainContextSchema.optional(),

    innovationId: Joi.string().guid().required(),

    context: Joi.object<MessageType['data']['context']>({
      type: Joi.string().valid(...Object.values(NotificationContextTypeEnum)).required(),
      detail: Joi.string().valid(...Object.values(NotificationContextDetailEnum)).required(),
      id: Joi.string().guid().required()
    }).required(),

    userIds: Joi.array().items(Joi.string().guid()).required(),

    params: Joi.object().required()

  }).required()

}).required();
