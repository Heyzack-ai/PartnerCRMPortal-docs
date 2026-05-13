import { partnerFrSource } from '@/lib/partner-fr-source'
import { DocsShell } from '../../../components/docs/docs-shell'

export default function PartnerFrDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tree = partnerFrSource.pageTree

  return <DocsShell tree={tree} searchApi="/api/search/fr">{children}</DocsShell>
}
