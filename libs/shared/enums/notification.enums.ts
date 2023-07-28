export enum NotificationContextTypeEnum {
  NEEDS_ASSESSMENT = 'NEEDS_ASSESSMENT',
  INNOVATION = 'INNOVATION',
  SUPPORT = 'SUPPORT',
  ACTION = 'ACTION',
  THREAD = 'THREAD',
  DATA_SHARING = 'DATA_SHARING',
  COMMENT = 'COMMENT' // TODO: Deprecated!
}

export enum NotificationContextDetailEnum {
  LOCK_USER = 'LOCK_USER',
  THREAD_CREATION = 'THREAD_CREATION',
  THREAD_MESSAGE_CREATION = 'THREAD_MESSAGE_CREATION',
  COMMENT_CREATION = 'COMMENT_CREATION', // TODO: Deprecated!
  COMMENT_REPLY = 'COMMENT_REPLY', // TODO: Deprecated!
  ACTION_CREATION = 'ACTION_CREATION',
  ACTION_UPDATE = 'ACTION_UPDATE',
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
  INNOVATION_ORGANISATION_SUGGESTION_NOT_SHARED = 'INNOVATION_ORGANISATION_SUGGESTION_NOT_SHARED'
}

// TODO MJS this is no longer a enum so move it out of here
export const EmailNotificationType = ['ACTION', 'MESSAGE', 'SUPPORT'] as const;
export type EmailNotificationType = typeof EmailNotificationType[number];

export enum EmailNotificationPreferenceEnum {
  NEVER = 'NEVER',
  INSTANTLY = 'INSTANTLY',
  DAILY = 'DAILY'
}

export enum NotificationLogTypeEnum {
  QA_A_IDLE_SUPPORT = 'QA_A_IDLE_SUPPORT'
}
