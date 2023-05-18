import { inject, injectable } from 'inversify';

import {
  InnovationEntity,
  NotificationEntity,
  NotificationUserEntity,
  UserRoleEntity
} from '@notifications/shared/entities';
import type {
  NotificationContextDetailEnum,
  NotificationContextTypeEnum,
  NotificationLogTypeEnum
} from '@notifications/shared/enums';

import type { EmailTemplatesType, EmailTypeEnum } from '../_config';

import { BaseService } from './base.service';
import type { EmailService } from './email.service';
import SYMBOLS from './symbols';

@injectable()
export class DispatchService extends BaseService {
  constructor(
    @inject(SYMBOLS.EmailService)
    private emailService: EmailService
  ) {
    super();
  }

  async sendEmail<T extends EmailTypeEnum>(
    type: EmailTypeEnum,
    to: string,
    params: EmailTemplatesType[T],
    log?: {
      type: NotificationLogTypeEnum;
      params: Record<string, string | number>;
    }
  ): Promise<boolean> {
    return this.emailService.sendEmail(type, to, params, log);
  }

  async saveInAppNotification(
    requestUser: { id: string },
    innovationId: string,
    context: {
      type: NotificationContextTypeEnum;
      detail: NotificationContextDetailEnum;
      id: string;
    },
    userRoleIds: string[],
    params: Record<string, unknown>
  ): Promise<{ id: string }> {
    return this.sqlConnection.transaction(async transactionManager => {
      const dbNotification = await transactionManager.save(
        NotificationEntity,
        NotificationEntity.new({
          contextType: context.type,
          contextDetail: context.detail,
          contextId: context.id,
          innovation: InnovationEntity.new({ id: innovationId }),
          params: params,
          createdBy: requestUser.id
        })
      );

      if (userRoleIds.length > 0) {
        await transactionManager.save(
          NotificationUserEntity,
          userRoleIds.map(roleId =>
            NotificationUserEntity.new({
              notification: dbNotification,
              createdBy: requestUser.id,
              userRole: UserRoleEntity.new({ id: roleId })
            })
          )
        );
      }

      return { id: dbNotification.id };
    });
  }
}
