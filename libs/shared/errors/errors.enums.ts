export enum GenericErrorsEnum {
  SERVICE_SQL_UNAVAILABLE = 'GEN.0001',
  SERVICE_NOSQL_UNAVAILABLE = 'GEN.0002',
  SERVICE_IDENTIY_UNAVAILABLE = 'GEN.0003',
  SERVICE_IDENTIY_UNAUTHORIZED = 'GEN.0004',
  SERVICE_EMAIL_UNAVAILABLE = 'GEN.0005',

  SERVICE_FILE_STORAGE_ERROR = 'GEN.0006',

  INVALID_PAYLOAD = 'GEN.0100',

  SLS_AUTHORIZATION = 'GEN.0200',

  INTERNAL_CONFIGURATION_ERROR = 'GEN.0300',

  UNKNOWN_ERROR = 'ERR.1000',
  NOT_IMPLEMENTED_ERROR = 'ERR.1001'
}

export enum UserErrorsEnum {
  REQUEST_USER_INVALID_TOKEN = 'U.0001',
  USER_IDENTITY_PROVIDER_NOT_FOUND = 'U.0002',
  USER_SQL_NOT_FOUND = 'U.0003',
  USER_INFO_EMPTY_INPUT = 'U.0004',
  USER_ALREADY_EXISTS = 'U.0005',
  USER_TYPE_INVALID = 'U.0006',
  USER_TERMS_OF_USE_NOT_FOUND = 'U.0007',
  USER_TERMS_OF_USE_INVALID = 'U.0008'
}

export enum OrganisationErrorsEnum {
  ORGANISATION_NOT_FOUND = 'O.0001',
  ORGANISATIONS_NOT_FOUND = 'O.0002',
  ORGANISATION_UNIT_NOT_FOUND = 'O.0003',
  ORGANISATION_UNITS_NOT_FOUND = 'O.0004'
}

export enum InnovationErrorsEnum {
  INNOVATION_INFO_EMPTY_INPUT = 'I.0001',
  INNOVATION_NOT_FOUND = 'I.0002',
  INNOVATION_ALREADY_EXISTS = 'I.0003',

  INNOVATION_WITH_INVALID_ASSESSMENTS = 'I.0004',

  INNOVATION_ARCHIVE_ERROR = 'I.0010',

  INNOVATION_TRANSFER_ALREADY_EXISTS = 'I.0020',
  INNOVATION_TRANSFER_REQUESTED_FOR_SELF = 'I.0021',
  INNOVATION_TRANSFER_NOT_FOUND = 'I.0022',

  INNOVATION_NO_SECTIONS = 'I.0030',
  INNOVATION_SECTION_NOT_FOUND = 'I.0031',
  INNOVATION_SECTION_WITH_UNPROCESSABLE_STATUS = 'I.0032',
  INNOVATION_SECTIONS_INCOMPLETE = 'I.0033',
  INNOVATION_SECTIONS_CONFIG_UNAVAILABLE = 'I.0034',
  INNOVATION_SECTIONS_CONFIG_LOOKUP_NOT_ARRAY = 'I.0035',

  INNOVATION_SUPPORT_NOT_FOUND = 'I.0040',
  INNOVATION_SUPPORT_ALREADY_EXISTS = 'I.0041',
  INNOVATION_SUPPORT_LOG_ERROR = 'I.0042',

  INNOVATION_FILE_DELETE_ERROR = 'I.0050',

  INNOVATION_EVIDENCE_NOT_FOUND = 'I.0060',

  INNOVATION_ACTIVITY_LOG_ERROR = 'IAL.0070',
  INNOVATION_ACTIVITY_LOG_INVALID_ITEM = 'IAL.0071',

  INNOVATION_ASSESSMENT_NOT_FOUND = 'IA.0080',
  INNOVATION_ASSESSMENT_ALREADY_EXISTS = 'IA.0081',

  INNOVATION_THREAD_NOT_FOUND = 'IT.0001',
  INNOVATION_THREAD_CREATION_FAILED = 'IT.0003',

  INNOVATION_THREAD_MESSAGE_NOT_FOUND = 'ITM.0001',
  INNOVATION_THREAD_MESSAGE_NOT_EDITABLE = 'ITM.0002',
  INNOVATION_THREAD_MESSAGE_EDIT_UNAUTHORIZED = 'ITM.0003',

  INNOVATION_COMMENT_INVALID_PARAMETERS = 'IC.0001', // TODO: Deprecated!
  INNOVATION_COMMENT_CREATE_ERROR = 'IC.0002', // TODO: Deprecated!
  INNOVATION_COMMENT_NOT_FOUND = 'IC.0003', // TODO: Deprecated!

  INNOVATION_ACTION_NOT_FOUND = 'IA.0090',
  INNOVATION_ACTION_FORBIDDEN_ACCESS = 'IA.0091',

  INNOVATION_SHARING_PREFERENCES_UPDATE = 'ISP.0001',

  INNOVATION_SURVEY_ID_NOT_FOUND = 'ISU.0001',
}

export enum EmailErrorsEnum {
  EMAIL_TEMPLATE_NOT_FOUND = 'EM.0001',
  EMAIL_TEMPLATE_WITH_INVALID_PROPERTIES = 'EM.0002',
  EMAIL_BAD_API_KEY = 'EM.0003',
}
