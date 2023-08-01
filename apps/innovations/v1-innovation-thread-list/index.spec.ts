import azureFunction from '.';

import { ServiceRoleEnum } from '@innovations/shared/enums';
import { AzureHttpTriggerBuilder, TestsHelper } from '@innovations/shared/tests';
import type { TestUserType } from '@innovations/shared/tests/builders/user.builder';
import type { ErrorResponseType } from '@innovations/shared/types';
import {
  randAbbreviation,
  randBoolean,
  randCompanyName,
  randFullName,
  randNumber,
  randPastDate,
  randText,
  randUuid
} from '@ngneat/falso';
import { omit } from 'lodash';
import { InnovationThreadsService } from '../_services/innovation-threads.service';
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
      subject: randText(),
      messageCount: randNumber(),
      createdAt: randPastDate(),
      isNew: randBoolean(),
      lastMessage: {
        id: randUuid(),
        createdAt: randPastDate(),
        createdBy: {
          id: randUuid(),
          name: randFullName(),
          organisationUnit: { id: randUuid(), name: randCompanyName(), acronym: randAbbreviation() },
          role: ServiceRoleEnum.ACCESSOR,
          isOwner: false
        }
      }
    },
    {
      id: randUuid(),
      subject: randText(),
      messageCount: randNumber(),
      createdAt: randPastDate(),
      isNew: randBoolean(),
      lastMessage: {
        id: randUuid(),
        createdAt: randPastDate(),
        createdBy: {
          id: randUuid(),
          name: randFullName(),
          organisationUnit: null,
          role: ServiceRoleEnum.INNOVATOR,
          isOwner: true
        }
      }
    }
  ]
};

const mock = jest.spyOn(InnovationThreadsService.prototype, 'getInnovationThreads').mockResolvedValue(expected);

afterEach(() => {
  jest.clearAllMocks();
});

describe('v1-innovation-thread-list Suite', () => {
  describe('200', () => {
    it('should return the threads list', async () => {
      const result = await new AzureHttpTriggerBuilder()
        .setAuth(scenario.users.aliceQualifyingAccessor)
        .setParams<ParamsType>({
          innovationId: scenario.users.johnInnovator.innovations.johnInnovation.id
        })
        .call<ResponseDTO>(azureFunction);

      expect(result.body).toStrictEqual({
        count: expected.count,
        data: expected.data.map(thread => ({
          ...thread,
          lastMessage: {
            ...thread.lastMessage,
            createdBy: {
              ...omit(thread.lastMessage.createdBy, 'role'),
              type: thread.lastMessage.createdBy.role,
              ...(thread.lastMessage.createdBy.organisationUnit
                ? { organisationUnit: thread.lastMessage.createdBy.organisationUnit }
                : {
                    organisationUnit: {
                      id: '',
                      name: '',
                      acronym: ''
                    }
                  })
            }
          }
        }))
      });
      expect(result.status).toBe(200);
      expect(mock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Access', () => {
    it.each([
      ['Admin', 200, scenario.users.allMighty],
      ['QA', 200, scenario.users.aliceQualifyingAccessor],
      ['A', 200, scenario.users.ingridAccessor],
      ['NA', 200, scenario.users.paulNeedsAssessor],
      ['Innovator owner', 200, scenario.users.johnInnovator],
      ['Innovator collaborator', 200, scenario.users.janeInnovator],
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
