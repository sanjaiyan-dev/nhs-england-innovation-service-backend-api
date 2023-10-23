import type { Context } from '@azure/functions';
import type { NotificationCategoryEnum, NotifierTypeEnum } from '@notifications/shared/enums';
import { MocksHelper } from '@notifications/shared/tests';
import type { DomainContextType, NotifierTemplatesType } from '@notifications/shared/types';
import type { EmailTemplatesType } from '../_config';
import type { InAppTemplatesType } from '../_config/inapp.config';
import type { BaseHandler } from '../_handlers';
import type { EmailRecipientType } from '../_handlers/base.handler';
import type { RecipientType } from '../_services/recipients.service';

export const testEmails = async <
  InputDataType extends NotifierTypeEnum,
  T extends new (a: DomainContextType, b: any, c: Context) => BaseHandler<InputDataType, any>,
  Notifications extends InstanceType<T>['emails'][number]['templateId']
>(
  handlerClass: T,
  template: Notifications,
  data: {
    notificationPreferenceType: NotificationCategoryEnum;
    requestUser: DomainContextType;
    inputData: NotifierTemplatesType[InputDataType];
    recipients: (EmailRecipientType | RecipientType)[];
    outputData: EmailTemplatesType[Notifications] | EmailTemplatesType[Notifications][];
    options?: { includeLocked?: boolean; ignorePreferences?: boolean; includeSelf?: boolean };
  }
): Promise<void> => {
  if (Array.isArray(data.outputData) && data.recipients.length !== data.outputData.length) {
    fail();
  }

  const handler = new handlerClass(data.requestUser, data.inputData, MocksHelper.mockContext());
  await handler.run();

  handler.emails.filter(e => e.templateId === template);
  expect(handler.emails.length).toBe(data.recipients.length);
  expect(handler.emails).toEqual(
    data.recipients.map((r, i) => ({
      templateId: template,
      notificationPreferenceType: data.notificationPreferenceType,
      to: r,
      params: Array.isArray(data.outputData) ? data.outputData[i] : data.outputData,
      ...(data.options && { options: data.options })
    }))
  );
};

export const testInApps = async <
  InputDataType extends NotifierTypeEnum,
  T extends new (a: DomainContextType, b: any, c: Context) => BaseHandler<InputDataType, any>,
  Notifications extends InstanceType<T>['inApp'][number]['context']['detail']
>(
  handlerClass: T,
  template: Notifications,
  data: {
    innovationId: string;
    context: {
      type: NotificationCategoryEnum;
      id: string;
    };
    requestUser: DomainContextType;
    inputData: NotifierTemplatesType[InputDataType];
    recipients: RecipientType[];
    outputData: InAppTemplatesType[Notifications];
    options?: { includeSelf?: boolean };
  }
): Promise<void> => {
  const handler = new handlerClass(data.requestUser, data.inputData, MocksHelper.mockContext());
  await handler.run();

  handler.inApp.filter(a => a.context.detail === template);
  expect(handler.inApp.length).toBe(1); // maybe this will change in the future
  expect(handler.inApp).toEqual([
    {
      innovationId: data.innovationId,
      context: {
        type: data.context.type,
        detail: template,
        id: data.context.id
      },
      userRoleIds: data.recipients.map(r => r.roleId),
      params: data.outputData,
      ...(data.options && { options: data.options })
    }
  ]);
};
