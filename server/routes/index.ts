import { Router } from 'express'

import type { Services } from '../services'
import { Page } from '../services/auditService'

import buildNeedsAttentionTable from '../builders/needsAttentionTable.builder'
import buildPagination from '../builders/pagination.builder'
import { SEARCH_TABS } from '../domain/ids/clusterPageIds'

export default function routes({ auditService, personRecordService }: Services): Router {
  const router = Router()

  router.get('/', async (req, res, _next) => {
    const { username } = res.locals.user
    const currentPage = parseInt(req.query.page as string, 10) || 1
    const { content, pagination } = await personRecordService.getClusters(username, currentPage)

    const needsAttentionTableData = buildNeedsAttentionTable(content)
    const needsAttentionPagination = buildPagination('/', currentPage, pagination)
    const search = req.query.error ? { errorText: 'No results found' } : {}

    await auditService.logPageView(Page.INDEX_PAGE, { who: res.locals.user.username, correlationId: req.id })

    return res.render('pages/index', {
      needsAttentionTableData,
      needsAttentionPagination,
      search,
      SEARCH_TABS,
    })
  })

  return router
}
