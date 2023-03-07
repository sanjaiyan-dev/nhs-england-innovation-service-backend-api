import type { InnovationSectionEnum, InnovationSectionStatusEnum } from '@innovations/shared/enums';
import type { DateISOType } from '@innovations/shared/types';


export type ResponseDTO = {
  id: null | string,
  section: InnovationSectionEnum,
  status: InnovationSectionStatusEnum,
  submittedAt: null | DateISOType,
  submittedBy: null | {
    name: string,
    isOwner: boolean,
  },
  data: null | { [key: string]: any },
  actionsIds?: string[]
}
