import Joi from 'joi';

import {
  InnovationGroupedStatusEnum,
  InnovationStatusEnum,
  InnovationSupportStatusEnum
} from '@innovations/shared/enums';
import { JoiHelper, PaginationQueryParamsType } from '@innovations/shared/helpers';

import { CurrentCatalogTypes, CurrentDocumentSchemaMap } from '@innovations/shared/schemas/innovation-record';
import type { TypeFromArray } from '@innovations/shared/types';
import { InnovationLocationEnum } from '../_enums/innovation.enums';

const DateFilterKeys = ['submittedAt'] as const;
const FieldsKeys = ['assessment', 'supports', 'notifications', 'statistics', 'groupedStatus'] as const;
const HasAccessThroughKeys = ['owner', 'collaborator'] as const;

enum orderFields {
  name = 'name',
  location = 'location',
  mainCategory = 'mainCategory',
  submittedAt = 'submittedAt',
  updatedAt = 'updatedAt',
  assessmentStartedAt = 'assessmentStartedAt',
  assessmentFinishedAt = 'assessmentFinishedAt'
}

export type QueryParamsType = PaginationQueryParamsType<orderFields> & {
  name?: string;
  mainCategories?: CurrentCatalogTypes.catalogCategory[];
  locations?: InnovationLocationEnum[];
  status: InnovationStatusEnum[];
  supportStatuses?: InnovationSupportStatusEnum[];
  groupedStatuses?: InnovationGroupedStatusEnum[];
  engagingOrganisations?: string[];
  engagingOrganisationUnits?: string[];
  assignedToMe?: boolean;
  suggestedOnly?: boolean;
  latestWorkedByMe?: boolean;
  hasAccessThrough?: TypeFromArray<typeof HasAccessThroughKeys>[];
  dateFilter?: {
    field: TypeFromArray<typeof DateFilterKeys>;
    startDate?: Date;
    endDate?: Date;
  }[];
  withDeleted?: boolean; // this is only allowed for admin and is true in that case to keep previous behavior
  fields?: TypeFromArray<typeof FieldsKeys>[];
};

export const QueryParamsSchema = JoiHelper.PaginationJoiSchema({
  orderKeys: Object.keys(orderFields)
})
  .append<QueryParamsType>({
    name: JoiHelper.AppCustomJoi().decodeURIString().trim().allow(null, '').optional(),
    mainCategories: JoiHelper.AppCustomJoi().stringArray().items(CurrentDocumentSchemaMap).optional(),
    locations: JoiHelper.AppCustomJoi()
      .stringArray()
      .items(Joi.string().valid(...Object.values(InnovationLocationEnum)))
      .optional(),
    status: Joi.when('$userType', {
      is: 'ASSESSMENT',
      then: JoiHelper.AppCustomJoi()
        .stringArray()
        .items(
          Joi.string().valid(
            InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT,
            InnovationStatusEnum.NEEDS_ASSESSMENT,
            InnovationStatusEnum.IN_PROGRESS
          )
        )
        .required()
    }).when('$userType', {
      is: 'ACCESSOR',
      then: JoiHelper.AppCustomJoi()
        .stringArray()
        .items(Joi.string().valid(InnovationStatusEnum.IN_PROGRESS, InnovationStatusEnum.COMPLETE))
        .required(),
      otherwise: JoiHelper.AppCustomJoi()
        .stringArray()
        .items(Joi.string().valid(...Object.values(InnovationStatusEnum)))
        .optional()
    }),
    engagingOrganisations: JoiHelper.AppCustomJoi().stringArray().items(Joi.string()).optional(),
    supportStatuses: Joi.when('$userType', {
      is: 'ACCESSOR',
      then: JoiHelper.AppCustomJoi()
        .stringArray()
        .items(Joi.string().valid(InnovationSupportStatusEnum.ENGAGING, InnovationSupportStatusEnum.CLOSED))
        .optional(),
      otherwise: JoiHelper.AppCustomJoi()
        .stringArray()
        .items(Joi.string().valid(...Object.values(InnovationSupportStatusEnum)))
        .optional()
    }),
    groupedStatuses: JoiHelper.AppCustomJoi()
      .stringArray()
      .items(Joi.string().valid(...Object.values(InnovationGroupedStatusEnum)))
      .optional(),
    assignedToMe: Joi.boolean().optional().default(false),
    suggestedOnly: Joi.boolean().optional().default(false),
    latestWorkedByMe: Joi.boolean().optional().default(false),
    hasAccessThrough: Joi.when('$userType', {
      is: 'INNOVATOR',
      then: JoiHelper.AppCustomJoi()
        .stringArray()
        .items(Joi.string().valid(...HasAccessThroughKeys))
        .optional()
    }),
    dateFilter: JoiHelper.AppCustomJoi()
      .stringArrayOfObjects()
      .items(
        Joi.object({
          field: Joi.string()
            .valid(...DateFilterKeys)
            .required(),
          startDate: Joi.date().optional(),
          endDate: Joi.date().optional()
        })
      )
      .optional(),
    fields: JoiHelper.AppCustomJoi()
      .stringArray()
      .items(Joi.string().valid(...FieldsKeys))
      .optional()
  })
  // special admin filters
  .when('$userType', {
    is: 'ADMIN',
    then: Joi.object({
      assignedToMe: Joi.forbidden(),
      suggestedOnly: Joi.forbidden(),
      latestWorkedByMe: Joi.forbidden(),
      engagingOrganisationUnits: JoiHelper.AppCustomJoi().stringArray().items(Joi.string().uuid()).optional(),
      withDeleted: JoiHelper.AppCustomJoi().boolean().optional().default(true)
    })
  })
  // make order field forbidden if latestWorkedByMe is true (this would be easier with xor but order has default value)
  .fork('order', schema =>
    Joi.when('latestWorkedByMe', {
      is: true,
      then: schema.forbidden(),
      otherwise: schema.optional()
    })
  )
  .messages({ 'any.unknown': 'order field is not allowed when latestWorkedByMe is true' })
  .required();
