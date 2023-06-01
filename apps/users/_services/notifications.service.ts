import { inject, injectable } from 'inversify';
import type { EntityManager } from 'typeorm';

import {
  NotificationEntity,
  NotificationPreferenceEntity,
  NotificationUserEntity,
  UserEntity
} from '@users/shared/entities';
import {
  EmailNotificationPreferenceEnum,
  EmailNotificationType,
  InnovationStatusEnum,
  NotificationContextDetailEnum,
  NotificationContextTypeEnum,
  UserStatusEnum
} from '@users/shared/enums';
import { GenericErrorsEnum, NotFoundError, UnprocessableEntityError, UserErrorsEnum } from '@users/shared/errors';
import type { PaginationQueryParamsType } from '@users/shared/helpers';
import type { IdentityProviderService } from '@users/shared/services';
import SHARED_SYMBOLS from '@users/shared/services/symbols';
import type { DomainContextType } from '@users/shared/types';

import { BaseService } from './base.service';

@injectable()
export class NotificationsService extends BaseService {
  constructor(
    @inject(SHARED_SYMBOLS.IdentityProviderService) private identityProviderService: IdentityProviderService
  ) {
    super();
  }

  /**
   * gets the user active notifications counters
   * @param userId the user id
   * @param entityManager optional entity manager to run the query (for transactions)
   * @returns the total
   */
  public async getUserActiveNotificationsCounter(roleId: string, entityManager?: EntityManager): Promise<number> {
    const em = entityManager ?? this.sqlConnection.manager;

    const query = em
      .createQueryBuilder(NotificationUserEntity, 'notificationUser')
      .innerJoin('notificationUser.notification', 'notification')
      .where('notificationUser.user_role_id = :id', { id: roleId })
      .andWhere('notificationUser.readAt IS NULL');

    return await query.getCount();
  }

  /**
   * gets the user notifications
   * @param userId the user id
   * @param filters optional filters to apply
   * - contextTypes: the context types to filter by
   * - unreadOnly: if true, only returns the unread notifications
   * @param pagination the pagination params
   * @param entityManager optional entity manager to run the query (for transactions)
   * @returns the total and the notifications
   */
  public async getUserNotifications(
    domainContext: DomainContextType,
    filters: {
      contextTypes: NotificationContextTypeEnum[];
      unreadOnly: boolean;
    },
    pagination: PaginationQueryParamsType<'createdAt'>,
    entityManager?: EntityManager
  ): Promise<{
    total: number;
    data: {
      id: string;
      innovation: { id: string; name: string; status: InnovationStatusEnum; ownerName: string };
      contextType: NotificationContextTypeEnum;
      contextDetail: NotificationContextDetailEnum;
      contextId: string;
      createdAt: Date;
      readAt: Date;
      params: Record<string, unknown>;
    }[];
  }> {
    const em = entityManager ?? this.sqlConnection.manager;

    /**
     * Query with withDeleted for the cases where the innovation was withdrawn
     * leftJoin on owner for the cases where the owner was deleted but we still want the notification
     */
    const query = em
      .createQueryBuilder(NotificationUserEntity, 'notificationUser')
      .innerJoin('notificationUser.notification', 'notification')
      .withDeleted()
      .innerJoin('notification.innovation', 'innovation')
      .leftJoin('innovation.owner', 'innovationOwner')
      .where('notificationUser.user_role_id = :roleId', { roleId: domainContext.currentRole.id });

    // optional filters
    if (filters.unreadOnly) {
      query.andWhere('notificationUser.readAt IS NULL');
    }

    if (filters.contextTypes.length > 0) {
      query.andWhere('notification.contextType IN (:...contextTypes)', {
        contextTypes: filters.contextTypes
      });
    }

    // Pagination
    query.skip(pagination.skip);
    query.take(pagination.take);
    for (const [key, order] of Object.entries(pagination.order)) {
      let field: string;
      switch (key) {
        case 'createdAt':
        default:
          field = 'notification.createdAt';
          break;
      }
      query.addOrderBy(field, order);
    }

    // For some reason the the query builder requires the select in the end or it has issues with the select distinct generated by the pagination
    query.select([
      'notificationUser.id',
      'notificationUser.readAt',
      'innovationOwner.identityId',
      'innovationOwner.status',
      'notification.id',
      'notification.contextType',
      'notification.contextDetail',
      'notification.contextId',
      'notification.createdAt',
      'notification.params',
      'innovation.id',
      'innovation.status',
      'innovation.name'
    ]);

    const [notifications, count] = await query.getManyAndCount();

    const userIds = notifications
      .filter(n => n.notification.innovation.owner && n.notification.innovation.owner.status !== UserStatusEnum.DELETED)
      .map(n => n.notification.innovation.owner!.identityId); // We are filtering before, so it will exist

    const innovationOwners = await this.identityProviderService.getUsersMap(userIds);

    return {
      total: count,
      data: notifications.map(n => ({
        id: n.notification.id,
        innovation: {
          id: n.notification.innovation.id,
          name: n.notification.innovation.name,
          status: n.notification.innovation.status,
          ownerName: innovationOwners.get(n.notification.innovation.owner?.identityId ?? '')?.displayName ?? ''
        },
        contextType: n.notification.contextType,
        contextDetail: n.notification.contextDetail,
        contextId: n.notification.contextId,
        createdAt: n.notification.createdAt,
        readAt: n.readAt,
        params: n.notification.params
      }))
    };
  }

  /**
   * deletes a user notification
   * @param userId the user id
   * @param notificationId the notification id
   * @param entityManager optional entity manager to run the query (for transactions)
   */
  async deleteUserNotification(roleId: string, notificationId: string, entityManager?: EntityManager): Promise<void> {
    const em = entityManager ?? this.sqlConnection.manager;

    await em.update(
      NotificationUserEntity,
      { userRole: roleId, notification: notificationId },
      { deletedAt: new Date().toISOString() }
    );
  }

  /**
   * dismisses the user notifications by the given conditions (cumulative)
   * @param userId the user id
   * @param conditions the conditions to apply
   * - notificationIds: the notification ids to dismiss
   * - contextIds: the context ids to dismiss
   * - contextTypes: the context types to dismiss
   * - dismissAll: if true, dismisses all the notifications
   * @param entityManager
   * @returns the number of affected rows
   */
  async dismissUserNotifications(
    domainContext: DomainContextType,
    conditions: {
      notificationIds: string[];
      contextIds: string[];
      contextTypes: NotificationContextTypeEnum[];
      dismissAll: boolean;
    },
    entityManager?: EntityManager
  ): Promise<number> {
    const em = entityManager ?? this.sqlConnection.manager;

    if (
      !conditions.dismissAll &&
      conditions.notificationIds.length === 0 &&
      conditions.contextTypes.length === 0 &&
      conditions.contextIds.length === 0
    ) {
      throw new UnprocessableEntityError(GenericErrorsEnum.INVALID_PAYLOAD, {
        message:
          'Either dismissAll is true or at least one of the following fields must have elements: notificationIds, contextTypes, contextIds'
      });
    }

    const params: {
      roleId: string;
      notificationIds?: string[];
      contextIds?: string[];
      contextTypes?: string[];
    } = { roleId: domainContext.currentRole.id };
    const query = em
      .createQueryBuilder(NotificationUserEntity, 'user')
      .update()
      .set({ readAt: new Date().toISOString() })
      .where('user_role_id = :roleId')
      .andWhere('deleted_at IS NULL')
      .andWhere('read_at IS NULL');

    if (!conditions.dismissAll) {
      const notificationQuery = em
        .createQueryBuilder(NotificationEntity, 'notification')
        .innerJoin('notification.notificationUsers', 'user')
        .select('notification.id')
        .andWhere('user.user_role_id = :roleId', { roleId: domainContext.currentRole.id })
        .andWhere('user.read_at IS NULL');

      if (conditions.notificationIds.length > 0) {
        notificationQuery.andWhere('notification.id IN (:...notificationIds)');
        params.notificationIds = conditions.notificationIds;
      }
      if (conditions.contextIds.length > 0) {
        notificationQuery.andWhere('notification.contextId IN (:...contextIds)');
        params.contextIds = conditions.contextIds;
      }
      if (conditions.contextTypes.length > 0) {
        notificationQuery.andWhere('notification.contextType IN (:...contextTypes)');
        params.contextTypes = conditions.contextTypes;
      }

      query.andWhere('notification_id IN ( ' + notificationQuery.getQuery() + ' )');
    }

    const res = await query.setParameters(params).execute();
    return res.affected ?? 0;
  }

  /**
   * returns the user role email notification preferences
   * @param userRoleId the user role id
   * @param entityManager optional entity manager to run the query (for transactions)
   * @returns array of notification types and preferences
   */
  async getUserRoleEmailPreferences(
    userRoleId: string,
    entityManager?: EntityManager
  ): Promise<
    {
      notificationType: EmailNotificationType;
      preference: EmailNotificationPreferenceEnum;
    }[]
  > {
    const em = entityManager ?? this.sqlConnection.manager;

    const userPreferences = await em
      .createQueryBuilder(NotificationPreferenceEntity, 'preference')
      .where('preference.user_role_id = :userRoleId', { userRoleId })
      .getMany();

    const userPreferencesMap = new Map(userPreferences.map(p => [p.notificationType, p.preference]));
    return [
      {
        notificationType: 'ACTION',
        preference: userPreferencesMap.get('ACTION') ?? EmailNotificationPreferenceEnum.INSTANTLY
      },
      {
        notificationType: 'SUPPORT',
        preference: userPreferencesMap.get('SUPPORT') ?? EmailNotificationPreferenceEnum.INSTANTLY
      },
      {
        notificationType: 'MESSAGE',
        preference: userPreferencesMap.get('MESSAGE') ?? EmailNotificationPreferenceEnum.INSTANTLY
      }
    ];
  }

  /**
   * upserts the user email notification preferences
   * @param userId the user id
   * @param preferences the preferences array to upsert
   * @param entityManager optional entity manager to run the query (for transactions)
   */
  async upsertUserEmailPreferences(
    userRoleId: string,
    preferences: {
      notificationType: EmailNotificationType;
      preference: EmailNotificationPreferenceEnum;
    }[],
    entityManager?: EntityManager
  ): Promise<void> {
    const em = entityManager ?? this.sqlConnection.manager;

    const dbUser = await em
      .createQueryBuilder(UserEntity, 'user')
      .innerJoin('user.serviceRoles', 'serviceRoles')
      .where('serviceRoles.id = :userRoleId', { userRoleId })
      .getOne();

    if (!dbUser) {
      throw new NotFoundError(UserErrorsEnum.USER_SQL_NOT_FOUND);
    }

    const now = new Date();

    const saveData = preferences.map(p => ({
      userRoleId: userRoleId,
      notificationType: p.notificationType,
      preference: p.preference,
      createdBy: dbUser.id, // this is only for the first time as BaseEntity defines it as update: false
      createdAt: now,
      updatedBy: dbUser.id,
      updatedAt: now
    }));
    await em.save(NotificationPreferenceEntity, saveData);
  }
}
