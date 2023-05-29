import { TEXTAREA_LENGTH_LIMIT } from '@innovations/shared/constants';
import { InnovationSupportLogTypeEnum } from '@innovations/shared/enums';
import Joi from 'joi';

export type ParamsType = {
  innovationId: string;
};
export const ParamsSchema = Joi.object<ParamsType>({
  innovationId: Joi.string().guid().required()
}).required();

export type BodyType = {
  type: Exclude<InnovationSupportLogTypeEnum, 'ACCESSOR_SUGGESTION' | 'STATUS_UPDATE'>;
  description: string;
  organisationUnits: string[];
};
export const BodySchema = Joi.object<BodyType>({
  type: Joi.string()
    .valid(InnovationSupportLogTypeEnum.ACCESSOR_SUGGESTION, InnovationSupportLogTypeEnum.STATUS_UPDATE)
    .required(),
  description: Joi.string().max(TEXTAREA_LENGTH_LIMIT.xl).allow(null).allow('').trim().required(),
  organisationUnits: Joi.array().items(Joi.string()).optional()
}).required();
