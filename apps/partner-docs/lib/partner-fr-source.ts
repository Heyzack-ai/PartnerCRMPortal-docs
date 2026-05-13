import { partnerFr } from '../.source/server'
import { loader } from 'fumadocs-core/source'

export const partnerFrSource = loader({
  baseUrl: '/docs/fr',
  source: partnerFr.toFumadocsSource(),
})
