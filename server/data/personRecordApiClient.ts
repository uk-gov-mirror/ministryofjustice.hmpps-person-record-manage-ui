import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { ClustersSummaryResponse } from './model/clustersSummaryResponse'
import { ClusterDetailResponse, Record } from './model/clusterDetailResponse'
import { CanonicalRecordResponse } from './model/canonicalRecordResponse'
import { EventLogResponse } from './model/eventLogResponse'

export default class PersonRecordApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Person Record API', config.apis.personRecordApi, logger, authenticationClient)
  }

  async getClusters(username: string, page: number): Promise<ClustersSummaryResponse> {
    return this.get({ path: '/admin/clusters', query: { page } }, asSystem(username))
  }

  async getClusterFromUUID(username: string, uuid: string): Promise<ClusterDetailResponse> {
    return this.getCluster(`/admin/cluster/${uuid}`, username)
  }

  async getClusterFromCRN(username: string, crn: string): Promise<ClusterDetailResponse> {
    return this.getCluster(`/admin/cluster/probation/${crn}`, username)
  }

  async getClusterFromPrisonNumber(username: string, prisonNumber: string): Promise<ClusterDetailResponse> {
    return this.getCluster(`/admin/cluster/prison/${prisonNumber}`, username)
  }

  async getEventLog(username: string, uuid: string): Promise<EventLogResponse> {
    return this.get({ path: `/admin/event-log/${uuid}` }, asSystem(username))
  }

  async getCanonicalRecord(username: string, uuid: string): Promise<CanonicalRecordResponse> {
    return this.get({ path: `/canonical-record/${uuid}` }, asSystem(username))
  }

  private async getCluster(path: string, username: string): Promise<ClusterDetailResponse> {
    return this.get(
      {
        path,
        errorHandler: (_, __, error) => {
          if (error.responseStatus !== 404) throw error
          return { uuid: '', status: '', records: [] as Record[], clusterSpec: {} }
        },
      },
      asSystem(username),
    )
  }
}
