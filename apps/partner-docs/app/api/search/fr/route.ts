import { partnerFrSource } from '@/lib/partner-fr-source'
import { createFromSource } from 'fumadocs-core/search/server'

export const { GET } = createFromSource(partnerFrSource, {
  language: 'english',
})
