import type { DateISOType } from '@innovations/shared/types'
import { InnovationStatisticsEnum } from '../_enums/innovation.enums'
import { ActionsToReviewStatisticsHandler } from '../_handlers/statistics/actions-to-review.handler'
import { ActionsToSubmitStatisticsHandler } from '../_handlers/statistics/actions-to-submit.handler'
import { SectionsSubmittedSinceAssessmentStartStatisticsHandler } from '../_handlers/statistics/sections-submitted-since-assessment-start.handler'
import { SectionsSubmittedSinceSupportStartStatisticsHandler } from '../_handlers/statistics/sections-submitted-since-support-start.handler'
import { SectionsSubmittedStatisticsHandler } from '../_handlers/statistics/sections-submitted.handler'
import { UnreadMessagesThreadsInitiatedByStatisticsHandler } from '../_handlers/statistics/unread-messages-initiated-by.handler'
import { UnreadMessagesStatisticsHandler } from '../_handlers/statistics/unread-messages.handler'
import type { InnovationsStatisticsHandler } from '../_types/statistics-handlers.types'


export const INNOVATION_STATISTICS_CONFIG: Record<keyof typeof InnovationStatisticsEnum, {
  handler: { new(...args: any[]): InnovationsStatisticsHandler }
}> = {
  [InnovationStatisticsEnum.ACTIONS_TO_SUBMIT_COUNTER]: {
    handler: ActionsToSubmitStatisticsHandler,
  },
  [InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER]: {
    handler: SectionsSubmittedStatisticsHandler,
  },
  [InnovationStatisticsEnum.UNREAD_MESSAGES_COUNTER]: {
    handler: UnreadMessagesStatisticsHandler,
  },
  [InnovationStatisticsEnum.ACTIONS_TO_REVIEW_COUNTER]: {
    handler: ActionsToReviewStatisticsHandler,
  },
  [InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER]: {
    handler: SectionsSubmittedSinceSupportStartStatisticsHandler,
  },
  [InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_ASSESSMENT_START_COUNTER]: {
    handler: SectionsSubmittedSinceAssessmentStartStatisticsHandler,
  },
  [InnovationStatisticsEnum.UNREAD_MESSAGES_THREADS_INITIATED_BY_COUNTER]: {
    handler: UnreadMessagesThreadsInitiatedByStatisticsHandler,
  },
}

export type InnovationStatisticsTemplateType = {
  [InnovationStatisticsEnum.ACTIONS_TO_SUBMIT_COUNTER]: { count: number; lastSubmittedSection: null | string; lastSubmittedAt: null | DateISOType; },
  [InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER]: { count: number; total: number; lastSubmittedSection: null | string; lastSubmittedAt: null | DateISOType; },
  [InnovationStatisticsEnum.UNREAD_MESSAGES_COUNTER]: { count: number; lastSubmittedAt: null | DateISOType; },
  [InnovationStatisticsEnum.ACTIONS_TO_REVIEW_COUNTER]: { count: number; lastSubmittedSection: null | string; lastSubmittedAt: null | DateISOType; },
  [InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER]: { count: number; total: number; lastSubmittedSection: null | string; lastSubmittedAt: null | DateISOType; },

  [InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_ASSESSMENT_START_COUNTER]: { count: number; total: number; lastSubmittedSection: null | string; lastSubmittedAt: null | DateISOType; },
  [InnovationStatisticsEnum.UNREAD_MESSAGES_THREADS_INITIATED_BY_COUNTER]: { count: number; lastSubmittedAt: null | DateISOType; },
}

export type InnovationStatisticsParamsTemplateType = {
  [InnovationStatisticsEnum.ACTIONS_TO_SUBMIT_COUNTER]: { innovationId: string },
  [InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER]: { innovationId: string },
  [InnovationStatisticsEnum.UNREAD_MESSAGES_COUNTER]: { innovationId: string },
  [InnovationStatisticsEnum.ACTIONS_TO_REVIEW_COUNTER]: { innovationId: string },
  [InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER]: { innovationId: string },

  [InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_ASSESSMENT_START_COUNTER]: { innovationId: string },
  [InnovationStatisticsEnum.UNREAD_MESSAGES_THREADS_INITIATED_BY_COUNTER]: { innovationId: string }
}
