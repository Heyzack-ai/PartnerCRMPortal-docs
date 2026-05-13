import { crmFrSource } from '@/lib/crm-fr-source'
import { createFromSource } from 'fumadocs-core/search/server'

export const { GET } = createFromSource(crmFrSource, {
  language: 'english',
})
