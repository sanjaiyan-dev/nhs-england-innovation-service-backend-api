export enum InnovationStatusEnum {
  CREATED = 'CREATED',
  WAITING_NEEDS_ASSESSMENT = 'WAITING_NEEDS_ASSESSMENT',
  NEEDS_ASSESSMENT = 'NEEDS_ASSESSMENT',
  IN_PROGRESS = 'IN_PROGRESS',
  // NEEDS_ASSESSMENT_REVIEW = 'NEEDS_ASSESSMENT_REVIEW', // Not it use nowadays.
  ARCHIVED = 'ARCHIVED',
  COMPLETE = 'COMPLETE',
}

export enum InnovationActionStatusEnum {
  REQUESTED = 'REQUESTED',
  STARTED = 'STARTED',
  CONTINUE = 'CONTINUE',
  IN_REVIEW = 'IN_REVIEW',
  DELETED = 'DELETED',
  DECLINED = 'DECLINED',
  COMPLETED = 'COMPLETED',
}

export enum InnovationSectionStatusEnum {
  NOT_STARTED = 'NOT_STARTED',
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
}

export enum InnovationSupportStatusEnum {
  UNASSIGNED = 'UNASSIGNED',
  FURTHER_INFO_REQUIRED = 'FURTHER_INFO_REQUIRED',
  WAITING = 'WAITING',
  NOT_YET = 'NOT_YET',
  ENGAGING = 'ENGAGING',
  UNSUITABLE = 'UNSUITABLE',
  WITHDRAWN = 'WITHDRAWN',
  COMPLETE = 'COMPLETE',
}

export enum InnovationTransferStatusEnum {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  DECLINED = 'DECLINED',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
}

export enum InnovationSectionCatalogueEnum {
  INNOVATION_DESCRIPTION = 'INNOVATION_DESCRIPTION',
  VALUE_PROPOSITION = 'VALUE_PROPOSITION',
  UNDERSTANDING_OF_NEEDS = 'UNDERSTANDING_OF_NEEDS',
  UNDERSTANDING_OF_BENEFITS = 'UNDERSTANDING_OF_BENEFITS',
  EVIDENCE_OF_EFFECTIVENESS = 'EVIDENCE_OF_EFFECTIVENESS',
  MARKET_RESEARCH = 'MARKET_RESEARCH',
  INTELLECTUAL_PROPERTY = 'INTELLECTUAL_PROPERTY',
  REGULATIONS_AND_STANDARDS = 'REGULATIONS_AND_STANDARDS',
  CURRENT_CARE_PATHWAY = 'CURRENT_CARE_PATHWAY',
  TESTING_WITH_USERS = 'TESTING_WITH_USERS',
  COST_OF_INNOVATION = 'COST_OF_INNOVATION',
  COMPARATIVE_COST_BENEFIT = 'COMPARATIVE_COST_BENEFIT',
  REVENUE_MODEL = 'REVENUE_MODEL',
  IMPLEMENTATION_PLAN = 'IMPLEMENTATION_PLAN',
}

export enum InnovationSectionAliasCatalogueEnum {
  INNOVATION_DESCRIPTION = 'ID',
  VALUE_PROPOSITION = 'VP',
  UNDERSTANDING_OF_NEEDS = 'UN',
  UNDERSTANDING_OF_BENEFITS = 'UB',
  EVIDENCE_OF_EFFECTIVENESS = 'EE',
  MARKET_RESEARCH = 'MR',
  INTELLECTUAL_PROPERTY = 'IP',
  REGULATIONS_AND_STANDARDS = 'RS',
  CURRENT_CARE_PATHWAY = 'CP',
  TESTING_WITH_USERS = 'TU',
  COST_OF_INNOVATION = 'CI',
  COMPARATIVE_COST_BENEFIT = 'CB',
  REVENUE_MODEL = 'RM',
  IMPLEMENTATION_PLAN = 'IM',
}

export enum InnovationSupportLogTypeEnum {
  STATUS_UPDATE = 'STATUS_UPDATE',
  ACCESSOR_SUGGESTION = 'ACCESSOR_SUGGESTION',
}

export enum ThreadContextTypeEnum {
  NEEDS_ASSESSMENT = 'NEEDS_ASSESSMENT',
  SUPPORT = 'SUPPORT',
  ACTION = 'ACTION'
}
