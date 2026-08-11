import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const exampleRecords = [
  {
    firstName: 'Jane',
    middleName: 'c',
    lastName: 'Doe',
    sourceSystemId: '1234',
    sourceSystem: 'DELIUS',
  },
  {
    firstName: 'John',
    middleName: 'd',
    lastName: 'Smith',
    sourceSystemId: '4321',
    sourceSystem: 'NOMIS',
  },
]

export default {
  stubPing: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/person-record-api/health/ping',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
      },
    }),
  stubPersonRecordGetAdminClusters: (
    { httpStatus, page, isLastPage } = { httpStatus: 200, page: 1, isLastPage: false },
  ): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/person-record-api/admin/clusters\\?page=${page}`,
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          content: [
            {
              uuid: 'e98d8c39-df1e-42a5-baef-2e76b0aa9e68',
              recordComposition: [
                {
                  sourceSystem: 'COMMON_PLATFORM',
                  count: 2,
                },
                {
                  sourceSystem: 'DELIUS',
                  count: 0,
                },
                {
                  sourceSystem: 'LIBRA',
                  count: 0,
                },
                {
                  sourceSystem: 'NOMIS',
                  count: 0,
                },
              ],
            },
            {
              uuid: '2904b95e-ffa6-4e01-a393-23e9615ded19',
              recordComposition: [
                {
                  sourceSystem: 'COMMON_PLATFORM',
                  count: 0,
                },
                {
                  sourceSystem: 'DELIUS',
                  count: 0,
                },
                {
                  sourceSystem: 'LIBRA',
                  count: 2,
                },
                {
                  sourceSystem: 'NOMIS',
                  count: 0,
                },
              ],
            },
          ],
          pagination: {
            isLastPage,
            count: 20,
            page,
            perPage: 20,
            totalCount: 202,
            totalPages: 11,
          },
        },
      },
    }),
  stubPersonRecordGetAdminClusterByUUID: (
    { httpStatus, uuid } = { httpStatus: 200, uuid: '1234' },
  ): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/person-record-api/admin/cluster/${uuid}`,
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          uuid: `${uuid}`,
          records: exampleRecords,
          clusterSpec: {},
        },
      },
    }),
  stubPersonRecordGetAdminClusterByCRN: ({ httpStatus, crn } = { httpStatus: 200, crn: 'X12345' }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/person-record-api/admin/cluster/probation/${crn}`,
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          uuid: '123456',
          records: exampleRecords,
          clusterSpec: {},
        },
      },
    }),
  stubPersonRecordGetAdminClusterByPrisonNumber: (
    { httpStatus, prisonNumber } = { httpStatus: 200, prisonNumber: 'A12345' },
  ): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/person-record-api/admin/cluster/prison/${prisonNumber}`,
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          uuid: '123456',
          records: exampleRecords,
          clusterSpec: {},
        },
      },
    }),
  stubPersonRecordGetAdminEventLog: ({ httpStatus, uuid } = { httpStatus: 200, uuid: '1234' }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/person-record-api/admin/event-log/${uuid}`,
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          uuid: `${uuid}`,
          eventLogs: [
            {
              uuidStatusType: 'ACTIVE',
              firstName: 'John',
              firstNameAliases: ['jon', 'jonny'],
              middleNames: 'c',
              lastName: 'Doe',
              lastNameAliases: ['Doe', 'Dow'],
              dateOfBirth: '1970-Jan-01',
              dateOfBirthAliases: ['1970-Feb-01', '1970-Mar'],
              postcodes: ['SW1', 'SW2'],
              pncs: ['123', '456'],
              cros: ['abc', 'def'],
              sourceSystem: 'DELIUS',
              sourceSystemId: '1234',
              masterDefendantId: '6639fd43-9d01-450a-87be-557bd3bcf48e',
              eventType: 'CPR_RECORD_CREATED',
              recordMergedTo: 'abc-123',
              eventTimestamp: '2025-05-12T10:37:56.087296',
              sentenceDates: ['2025-Jan-01', '20205-Mar-01'],
              overrideMarker: '6639fd43-9d01-450a-87be-557bd3bcf47d',
              overrideScopes: ['123', '321'],
            },
            {
              uuidStatusType: 'NEEDS_ATTENTION',
              firstName: 'Johnny',
              firstNameAliases: ['john'],
              middleNames: 'd',
              lastName: 'Dow',
              lastNameAliases: ['Doe', 'Dow'],
              dateOfBirth: '1971-Jan-01',
              dateOfBirthAliases: ['1971-Feb-01', '1971-Mar'],
              postcodes: ['SW1', 'SW2'],
              pncs: ['789'],
              cros: ['ghi'],
              sourceSystem: 'NOMIS',
              sourceSystemId: '5678',
              eventType: 'CPR_RECORD_UPDATED',
              recordMergedTo: 'abc-456',
              eventTimestamp: '2025-06-12T10:37:56.087296',
              sentenceDates: ['2025-Feb-01'],
              overrideMarker: '6639fd43-9d01-450a-87be-557bd3bcf47d',
              overrideScopes: ['456'],
            },
          ],
        },
      },
    }),
}
