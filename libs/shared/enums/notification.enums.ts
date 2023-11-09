export const NotificationTypes = {
  TASK: [
    'TA01_TASK_CREATION_TO_INNOVATOR',
    'TA02_TASK_RESPONDED_TO_OTHER_INNOVATORS',
    'TA03_TASK_DONE_TO_ACCESSOR_OR_ASSESSMENT',
    'TA04_TASK_DECLINED_TO_ACCESSOR_OR_ASSESSMENT',
    'TA05_TASK_CANCELLED_TO_INNOVATOR',
    'TA06_TASK_REOPEN_TO_INNOVATOR'
  ] as const,
  DOCUMENT: ['DC01_UPLOADED_DOCUMENT_TO_INNOVATOR'] as const,
  MESSAGES: ['ME01_THREAD_CREATION', 'ME02_THREAD_ADD_FOLLOWERS', 'ME03_THREAD_MESSAGE_CREATION'] as const,
  SUPPORT: [
    'ST01_SUPPORT_STATUS_TO_ENGAGING',
    'ST02_SUPPORT_STATUS_TO_OTHER',
    'ST03_SUPPORT_STATUS_TO_WAITING',
    'ST04_SUPPORT_NEW_ASSIGNED_ACCESSORS_TO_INNOVATOR',
    'ST05_SUPPORT_NEW_ASSIGNED_ACCESSOR_TO_NEW_QA',
    'ST06_SUPPORT_NEW_ASSIGNED_ACCESSOR_TO_OLD_QA'
  ] as const,
  NEEDS_ASSESSMENT: [
    'NA01_INNOVATOR_SUBMITS_FOR_NEEDS_ASSESSMENT_TO_INNOVATOR',
    'NA02_INNOVATOR_SUBMITS_FOR_NEEDS_ASSESSMENT_TO_ASSESSMENT',
    'NA03_NEEDS_ASSESSMENT_STARTED_TO_INNOVATOR',
    'NA04_NEEDS_ASSESSMENT_COMPLETE_TO_INNOVATOR',
    'NA06_NEEDS_ASSESSOR_REMOVED',
    'NA07_NEEDS_ASSESSOR_ASSIGNED'
  ] as const,
  SUPPORT_SUMMARY: [
    'SS01_SUPPORT_SUMMARY_UPDATE_TO_INNOVATORS',
    'SS02_SUPPORT_SUMMARY_UPDATE_TO_OTHER_ENGAGING_ACCESSORS'
  ] as const,
  ORGANISATION_SUGGESTIONS: [
    'OS01_UNITS_SUGGESTION_TO_SUGGESTED_UNITS_QA',
    'OS02_UNITS_SUGGESTION_NOT_SHARED_TO_INNOVATOR',
    'OS03_INNOVATION_DELAYED_SHARED_SUGGESTION'
  ] as const,
  INNOVATION: [
    'RE01_EXPORT_REQUEST_SUBMITTED',
    'RE02_EXPORT_REQUEST_APPROVED',
    'RE03_EXPORT_REQUEST_REJECTED',
    'WI01_INNOVATION_WITHDRAWN',
    'SH01_INNOVATION_STOPPED_SHARED_TO_ASSIGNED_USERS',
    'SH03_INNOVATION_STOPPED_SHARED_TO_SELF'
  ] as const,
  ADMIN: [
    'AP02_INNOVATOR_LOCKED_TO_ASSIGNED_USERS',
    'AP03_USER_LOCKED_TO_LOCKED_USER',
    'AP07_UNIT_INACTIVATED_TO_ENGAGING_INNOVATIONS'
  ] as const,
  ACCOUNT: ['CA01_ACCOUNT_CREATION_OF_INNOVATOR', 'CA02_ACCOUNT_CREATION_OF_COLLABORATOR'] as const,
  AUTOMATIC: [
    'AU01_INNOVATOR_INCOMPLETE_RECORD',
    'AU02_ACCESSOR_IDLE_ENGAGING_SUPPORT',
    'AU03_INNOVATOR_IDLE_SUPPORT',
    'AU04_SUPPORT_KPI_REMINDER',
    'AU05_SUPPORT_KPI_OVERDUE',
    'AU06_ACCESSOR_IDLE_WAITING',
    'AU07_TRANSFER_ONE_WEEK_REMINDER_NEW_USER',
    'AU08_TRANSFER_ONE_WEEK_REMINDER_EXISTING_USER',
    'AU09_TRANSFER_EXPIRED'
  ] as const,
  MIGRATION_OLD: ['MIGRATION_OLD'] as const
};
export type NotificationTypes = typeof NotificationTypes;
export const FlatNotificationTypes = Object.values(NotificationTypes).flatMap(v => v.map(v => v));
export type FlatNotificationTypes = NotificationTypes[keyof NotificationTypes][number];

/**
 * @deprecated Use `NotificationCategoryEnum` instead.
 */
export enum NotificationContextTypeEnum {
  NEEDS_ASSESSMENT = 'NEEDS_ASSESSMENT',
  INNOVATION = 'INNOVATION',
  SUPPORT = 'SUPPORT',
  TASK = 'TASK',
  THREAD = 'THREAD',
  DATA_SHARING = 'DATA_SHARING',
  COMMENT = 'COMMENT' // TODO: Deprecated!
}

// TODO this is likely going to be keyof NotificationTypes
export enum NotificationCategoryEnum {
  // GENERALS
  // A are only composed by GENERAL ones (not all)
  TASK = 'TASK',
  MESSAGE = 'MESSAGE',
  INNOVATION_MANAGEMENT = 'INNOVATION_MANAGEMENT',
  SUPPORT = 'SUPPORT',
  EXPORT_REQUEST = 'EXPORT_REQUEST',
  ACCOUNT = 'ACCOUNT',
  REMINDER = 'REMINDER',
  // NA
  INNOVATOR_SUBMIT_IR = 'INNOVATOR_SUBMIT_IR', // INNOVATIONS - all related
  ASSIGN_NA = 'ASSIGN_NA', // ASSESSMENTS - all related
  // QA
  SUGGEST_SUPPORT = 'SUGGEST_SUPPORT',
  // I
  DOCUMENT = 'DOCUMENT',

  // OTHER BUCKET (THIS NEEDS TO BE REVISED)
  INNOVATION = 'INNOVATION',
  NEEDS_ASSESSMENT = 'NEEDS_ASSESSMENT',
  SUPPORT_SUMMARY = 'SUPPORT_SUMMARY',
  AUTOMATIC = 'AUTOMATIC',
  ADMIN = 'ADMIN'
}

export enum NotificationPreferenceEnum {
  YES = 'YES',
  NO = 'NO'
}

// TODO This is likely going to be the flatNotificationTypes
export enum NotificationContextDetailEnum {
  LOCK_USER = 'LOCK_USER',
  THREAD_CREATION = 'THREAD_CREATION',
  THREAD_MESSAGE_CREATION = 'THREAD_MESSAGE_CREATION',
  COMMENT_CREATION = 'COMMENT_CREATION', // TODO: Deprecated!
  COMMENT_REPLY = 'COMMENT_REPLY', // TODO: Deprecated!
  TASK_CREATION = 'TASK_CREATION',
  TASK_UPDATE = 'TASK_UPDATE',
  NEEDS_ASSESSMENT_STARTED = 'NEEDS_ASSESSMENT_STARTED',
  NEEDS_ASSESSMENT_COMPLETED = 'NEEDS_ASSESSMENT_COMPLETED',
  NEEDS_ASSESSMENT_COMPLETED_TO_INNOVATOR = 'NEEDS_ASSESSMENT_COMPLETED_TO_INNOVATOR',
  NEEDS_ASSESSMENT_ORGANISATION_SUGGESTION = 'NEEDS_ASSESSMENT_ORGANISATION_SUGGESTION',
  INNOVATION_SUBMISSION = 'INNOVATION_SUBMISSION',
  INNOVATION_SUBMISSION_TO_INNOVATORS = 'INNOVATION_SUBMISSION_TO_INNOVATORS',
  INNOVATION_SUBMISSION_REASSESSMENT = 'INNOVATION_SUBMISSION_REASSESSMENT',
  SUPPORT_STATUS_UPDATE = 'SUPPORT_STATUS_UPDATE',
  SUPPORT_SUMMARY_UPDATE = 'SUPPORT_SUMMARY_UPDATE',
  INNOVATION_REASSESSMENT_REQUEST = 'INNOVATION_REASSESSMENT_REQUEST',
  INNOVATION_STOP_SHARING = 'INNOVATION_STOP_SHARING',
  INNOVATION_WITHDRAWN = 'INNOVATION_WITHDRAWN',
  COLLABORATOR_INVITE = 'COLLABORATOR_INVITE',
  COLLABORATOR_UPDATE = 'COLLABORATOR_UPDATE',
  TRANSFER_PENDING = 'TRANSFER_PENDING',
  TRANSFER_EXPIRED = 'TRANSFER_EXPIRED',
  TRANSFER_REMINDER = 'TRANSFER_REMINDER',
  INNOVATION_ORGANISATION_SUGGESTION_NOT_SHARED = 'INNOVATION_ORGANISATION_SUGGESTION_NOT_SHARED',
  INNOVATION_DELAYED_SHARED_SUGGESTION = 'INNOVATION_DELAYED_SHARED_SUGGESTION'
}

/**
 * @deprecated Use `NotificationCategoryEnum` instead.
 */
export const EmailNotificationType = ['TASK', 'MESSAGE', 'SUPPORT'] as const;
/**
 * @deprecated Use `NotificationCategoryEnum` instead.
 */
export type EmailNotificationType = (typeof EmailNotificationType)[number];

export enum EmailNotificationPreferenceEnum {
  NEVER = 'NEVER',
  INSTANTLY = 'INSTANTLY',
  DAILY = 'DAILY'
}

export enum NotificationLogTypeEnum {
  QA_A_IDLE_SUPPORT = 'QA_A_IDLE_SUPPORT'
}
