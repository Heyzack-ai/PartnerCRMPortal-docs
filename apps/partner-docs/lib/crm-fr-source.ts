import { crmFr } from '../.source/server'
import { loader } from 'fumadocs-core/source'

export const crmFrSource = loader({
  baseUrl: '/docs/crm/fr',
  source: crmFr.toFumadocsSource(),
})
