import azureFunction from '.';

import { InnovationFileContextTypeEnum, ServiceRoleEnum } from '@innovations/shared/enums';
import { AzureHttpTriggerBuilder, TestsHelper } from '@innovations/shared/tests';
import type { TestUserType } from '@innovations/shared/tests/builders/user.builder';
import type { ErrorResponseType } from '@innovations/shared/types';
import {
  randCompanyName,
  randFileExt,
  randFileName,
  randFullName,
  randNumber,
  randRecentDate,
  randText,
  randUrl,
  randUuid
} from '@ngneat/falso';
import { omit } from 'lodash';
import { InnovationFileService } from '../_services/innovation-file.service';
import type { ResponseDTO } from './transformation.dtos';
import type { ParamsType } from './validation.schemas';

jest.mock('@innovations/shared/decorators', () => ({
  JwtDecoder: jest.fn().mockImplementation(() => (_: any, __: string, descriptor: PropertyDescriptor) => {
    return descriptor;
  }),
  Audit: jest.fn().mockImplementation(() => (_: any, __: string, descriptor: PropertyDescriptor) => {
    return descriptor;
  })
}));

const testsHelper = new TestsHelper();
const scenario = testsHelper.getCompleteScenario();

beforeAll(async () => {
  await testsHelper.init();
});

const expected = {
  count: 2,
  data: [
    {
      id: randUuid(),
      storageId: randText(),
      context: { id: randUuid(), type: InnovationFileContextTypeEnum.INNOVATION, name: randText() },
      name: randText(),
      description: randText(),
      createdAt: randRecentDate(),
      createdBy: {
        name: randFullName(),
        role: ServiceRoleEnum.ACCESSOR,
        isOwner: false,
        orgUnitName: randCompanyName()
      },
      file: { name: randFileName(), size: randNumber(), extension: randFileExt(), url: randUrl() }
    },
    {
      id: randUuid(),
      storageId: randText(),
      context: { id: randUuid(), type: InnovationFileContextTypeEnum.INNOVATION, name: randText() },
      name: randText(),
      description: randText(),
      createdAt: randRecentDate(),
      createdBy: {
        name: randFullName(),
        role: ServiceRoleEnum.ACCESSOR,
        isOwner: false,
        orgUnitName: randCompanyName()
      },
      file: { name: randFileName(), size: randNumber(), extension: randFileExt(), url: randUrl() }
    }
  ]
};
const mock = jest.spyOn(InnovationFileService.prototype, 'getFilesList').mockResolvedValue(expected);

afterEach(() => {
  jest.clearAllMocks();
});

describe('v1-innovation-file-list Suite', () => {
  describe('200', () => {
    it('should return the files list', async () => {
      const result = await new AzureHttpTriggerBuilder()
        .setAuth(scenario.users.johnInnovator)
        .setParams<ParamsType>({
          innovationId: scenario.users.johnInnovator.innovations.johnInnovation.id
        })
        .call<ResponseDTO>(azureFunction);

      expect(result.body).toMatchObject({
        count: expected.count,
        data: expected.data.map(item => omit(item, 'storageId'))
      });
      expect(result.status).toBe(200);
      expect(mock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Access', () => {
    it.each([
      ['Admin', 200, scenario.users.allMighty],
      ['QA', 200, scenario.users.aliceQualifyingAccessor],
      ['NA', 200, scenario.users.paulNeedsAssessor],
      ['Innovator owner', 200, scenario.users.johnInnovator],
      ['Innovator other', 403, scenario.users.ottoOctaviusInnovator]
    ])('access with user %s should give %i', async (_role: string, status: number, user: TestUserType) => {
      const result = await new AzureHttpTriggerBuilder()
        .setAuth(user)
        .setParams<ParamsType>({
          innovationId: scenario.users.johnInnovator.innovations.johnInnovation.id
        })
        .call<ErrorResponseType>(azureFunction);

      expect(result.status).toBe(status);
    });
  });
});
