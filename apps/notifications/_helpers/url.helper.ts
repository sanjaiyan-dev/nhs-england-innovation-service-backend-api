import { ServiceRoleEnum } from '@notifications/shared/enums';
import { UrlModel } from '@notifications/shared/models';
import { ENV } from '../_config';

export const innovationOverviewUrl = (role: ServiceRoleEnum, innovationId: string): string => {
  const baseUrl = frontendBaseUrl(role);
  return new UrlModel(ENV.webBaseTransactionalUrl)
    .addPath(':baseUrl/innovations/:innovationId/overview')
    .setPathParams({ baseUrl, innovationId })
    .buildUrl();
};

export const innovationRecordUrl = (role: ServiceRoleEnum, innovationId: string): string => {
  const baseUrl = frontendBaseUrl(role);
  return new UrlModel(ENV.webBaseTransactionalUrl)
    .addPath(':baseUrl/innovations/:innovationId/record')
    .setPathParams({ baseUrl, innovationId })
    .buildUrl();
};

export const howToProceedUrl = (role: ServiceRoleEnum.INNOVATOR, innovationId: string): string => {
  const baseUrl = frontendBaseUrl(role);
  return new UrlModel(ENV.webBaseTransactionalUrl)
    .addPath(':baseUrl/innovations/:innovationId/how-to-proceed')
    .setPathParams({ baseUrl, innovationId })
    .buildUrl();
};

export const manageInnovationUrl = (role: ServiceRoleEnum.INNOVATOR, innovationId: string): string => {
  const baseUrl = frontendBaseUrl(role);
  return new UrlModel(ENV.webBaseTransactionalUrl)
    .addPath(':baseUrl/innovations/:innovationId/manage/innovation')
    .setPathParams({ baseUrl, innovationId })
    .buildUrl();
};

export const assessmentUrl = (role: ServiceRoleEnum, innovationId: string, assessmentId: string): string => {
  const baseUrl = frontendBaseUrl(role);
  return new UrlModel(ENV.webBaseTransactionalUrl)
    .addPath(':baseUrl/innovations/:innovationId/assessments/:assessmentId')
    .setPathParams({ baseUrl, innovationId, assessmentId })
    .buildUrl();
};

export const taskUrl = (role: ServiceRoleEnum, innovationId: string, taskId: string): string => {
  const baseUrl = frontendBaseUrl(role);
  return new UrlModel(ENV.webBaseTransactionalUrl)
    .addPath(':baseUrl/innovations/:innovationId/tasks/:taskId')
    .setPathParams({ baseUrl, innovationId, taskId })
    .buildUrl();
};

export const threadsUrl = (role: ServiceRoleEnum, innovationId: string): string => {
  const baseUrl = frontendBaseUrl(role);
  return new UrlModel(ENV.webBaseTransactionalUrl)
    .addPath(':baseUrl/innovations/:innovationId/threads')
    .setPathParams({ baseUrl, innovationId })
    .buildUrl();
};

export const threadUrl = (role: ServiceRoleEnum, innovationId: string, threadId: string): string => {
  const baseUrl = frontendBaseUrl(role);
  return new UrlModel(ENV.webBaseTransactionalUrl)
    .addPath(':baseUrl/innovations/:innovationId/threads/:threadId')
    .setPathParams({ baseUrl, innovationId, threadId })
    .buildUrl();
};

export const documentUrl = (role: ServiceRoleEnum, innovationId: string, documentId: string): string => {
  const baseUrl = frontendBaseUrl(role);
  return new UrlModel(ENV.webBaseTransactionalUrl)
    .addPath(':baseUrl/innovations/:innovationId/documents/:documentId')
    .setPathParams({ baseUrl, innovationId, documentId })
    .buildUrl();
};

export const supportStatusUrl = (
  role: ServiceRoleEnum.ACCESSOR | ServiceRoleEnum.QUALIFYING_ACCESSOR,
  innovationId: string,
  supportId: string
): string => {
  const baseUrl = frontendBaseUrl(role);
  return new UrlModel(ENV.webBaseTransactionalUrl)
    .addPath(':baseUrl/innovations/:innovationId/support/:supportId')
    .setPathParams({ baseUrl, innovationId, supportId })
    .buildUrl();
};

export const supportSummaryUrl = (role: ServiceRoleEnum, innovationId: string, unitId?: string): string => {
  const baseUrl = frontendBaseUrl(role);
  const urlModel = new UrlModel(ENV.webBaseTransactionalUrl)
    .addPath(':baseUrl/innovations/:innovationId/support-summary')
    .setPathParams({ baseUrl, innovationId });

  if (unitId) {
    urlModel.setQueryParams({ unitId });
  }

  return urlModel.buildUrl();
};

export const dataSharingPreferencesUrl = (role: ServiceRoleEnum, innovationId: string): string => {
  const baseUrl = frontendBaseUrl(role);
  return new UrlModel(ENV.webBaseTransactionalUrl)
    .addPath(':baseUrl/innovations/:innovationId/support')
    .setPathParams({ baseUrl, innovationId })
    .buildUrl();
};

export const exportRequestUrl = (role: ServiceRoleEnum, innovationId: string, requestId: string): string => {
  const baseUrl = frontendBaseUrl(role);
  return new UrlModel(ENV.webBaseTransactionalUrl)
    .addPath(':baseUrl/innovations/:innovationId/record/export-requests/:requestId')
    .setPathParams({ baseUrl, innovationId, requestId })
    .buildUrl();
};

export const collaboratorInfoUrl = (role: ServiceRoleEnum, innovationId: string, collaboratorId: string): string => {
  const baseUrl = frontendBaseUrl(role);
  return new UrlModel(ENV.webBaseTransactionalUrl)
    .addPath(':baseUrl/innovations/:innovationId/collaborations/:collaboratorId')
    .setPathParams({ baseUrl, innovationId, collaboratorId })
    .buildUrl();
};

export const manageCollaboratorsUrl = (innovationId: string): string => {
  const baseUrl = frontendBaseUrl(ServiceRoleEnum.INNOVATOR);
  return new UrlModel(ENV.webBaseTransactionalUrl)
    .addPath(':baseUrl/innovations/:innovationId/manage/innovation/collaborators')
    .setPathParams({ baseUrl, innovationId })
    .buildUrl();
};

export const dashboardUrl = (role: ServiceRoleEnum): string => {
  const baseUrl = frontendBaseUrl(role);
  return new UrlModel(ENV.webBaseTransactionalUrl).addPath(':baseUrl').setPathParams({ baseUrl }).buildUrl();
};

export const createAccountUrl = (): string => {
  return new UrlModel(ENV.webBaseTransactionalUrl).addPath('signup').buildUrl();
};

export const unsubscribeUrl = new UrlModel(ENV.webBaseTransactionalUrl)
  .addPath('account/email-notifications')
  .buildUrl();

export const frontendBaseUrl = (role: ServiceRoleEnum): string => {
  switch (role) {
    case ServiceRoleEnum.ASSESSMENT:
      return 'assessment';
    case ServiceRoleEnum.ACCESSOR:
    case ServiceRoleEnum.QUALIFYING_ACCESSOR:
      return 'accessor';
    case ServiceRoleEnum.INNOVATOR:
      return 'innovator';
    case ServiceRoleEnum.ADMIN:
      return 'admin';
    default: {
      const x: never = role;
      throw new Error(`Unknown role: ${x}`); // never happens
    }
  }
};
