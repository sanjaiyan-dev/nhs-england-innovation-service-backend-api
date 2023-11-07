export enum NotifierTypeEnum {
  INNOVATOR_ACCOUNT_CREATION = 'INNOVATOR_ACCOUNT_CREATION',
  INNOVATOR_ACCOUNT_DELETION_WITH_PENDING_TRANSFER = 'INNOVATOR_ACCOUNT_DELETION_WITH_PENDING_TRANSFER',
  INNOVATION_SUBMITED = 'INNOVATION_SUBMITED', // Old one with typo
  INNOVATION_SUBMITTED = 'INNOVATION_SUBMITTED',
  NEEDS_ASSESSMENT_STARTED = 'NEEDS_ASSESSMENT_STARTED',
  NEEDS_ASSESSMENT_COMPLETED = 'NEEDS_ASSESSMENT_COMPLETED',
  NEEDS_ASSESSMENT_ASSESSOR_UPDATE = 'NEEDS_ASSESSMENT_ASSESSOR_UPDATE',
  INNOVATION_SUPPORT_STATUS_UPDATE = 'INNOVATION_SUPPORT_STATUS_UPDATE', // TODO: Delete this one
  INNOVATION_ORGANISATION_UNITS_SUGGESTION = 'INNOVATION_ORGANISATION_UNITS_SUGGESTION',

  INNOVATION_WITHDRAWN = 'INNOVATION_WITHDRAWN',
  INNOVATION_TRANSFER_OWNERSHIP_CREATION = 'INNOVATION_TRANSFER_OWNERSHIP_CREATION',
  INNOVATION_TRANSFER_OWNERSHIP_COMPLETED = 'INNOVATION_TRANSFER_OWNERSHIP_COMPLETED',
  INNOVATION_TRANSFER_OWNERSHIP_EXPIRATION = 'INNOVATION_TRANSFER_OWNERSHIP_EXPIRATION',
  INNOVATION_TRANSFER_OWNERSHIP_REMINDER = 'INNOVATION_TRANSFER_OWNERSHIP_REMINDER',
  INNOVATION_SUPPORT_STATUS_CHANGE_REQUEST = 'INNOVATION_SUPPORT_STATUS_CHANGE_REQUEST',
  INNOVATION_STOP_SHARING = 'INNOVATION_STOP_SHARING',
  INNOVATION_REASSESSMENT_REQUEST = 'INNOVATION_REASSESSMENT_REQUEST',
  INNOVATION_COLLABORATOR_INVITE = 'INNOVATION_COLLABORATOR_INVITE',
  INNOVATION_COLLABORATOR_UPDATE = 'INNOVATION_COLLABORATOR_UPDATE',

  // Admin module.
  ACCESSOR_UNIT_CHANGE = 'ACCESSOR_UNIT_CHANGE',
  UNIT_INACTIVATION_SUPPORT_COMPLETED = 'UNIT_INACTIVATION_SUPPORT_COMPLETED',

  // Recurrent notifications.
  DAILY_DIGEST = 'DAILY_DIGEST',
  INCOMPLETE_INNOVATION_RECORD = 'INCOMPLETE_INNOVATION_RECORD',
  IDLE_SUPPORT = 'IDLE_SUPPORT',

  // Updated
  INNOVATION_DOCUMENT_UPLOADED = 'INNOVATION_DOCUMENT_UPLOADED',

  TASK_CREATION = 'TASK_CREATION',
  TASK_UPDATE = 'TASK_UPDATE',

  THREAD_CREATION = 'THREAD_CREATION',
  THREAD_ADD_FOLLOWERS = 'THREAD_ADD_FOLLOWERS',
  THREAD_MESSAGE_CREATION = 'THREAD_MESSAGE_CREATION',

  SUPPORT_STATUS_UPDATE = 'SUPPORT_STATUS_UPDATE',
  SUPPORT_NEW_ASSIGN_ACCESSORS = 'SUPPORT_NEW_ASSIGN_ACCESSORS',

  SUPPORT_SUMMARY_UPDATE = 'SUPPORT_SUMMARY_UPDATE',

  ORGANISATION_UNITS_SUGGESTION = 'ORGANISATION_UNITS_SUGGESTION',
  INNOVATION_DELAYED_SHARE = 'INNOVATION_DELAYED_SHARED',

  UNIT_KPI = 'UNIT_KPI',

  EXPORT_REQUEST_SUBMITTED = 'EXPORT_REQUEST_SUBMITTED',
  EXPORT_REQUEST_FEEDBACK = 'EXPORT_REQUEST_FEEDBACK',

  LOCK_USER = 'LOCK_USER',
  UNIT_INACTIVATED = 'UNIT_INACTIVATED',

  ACCOUNT_CREATION = 'ACCOUNT_CREATION'
}
