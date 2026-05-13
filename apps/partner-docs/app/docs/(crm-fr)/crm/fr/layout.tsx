import { crmFrSource } from '@/lib/crm-fr-source'
import { DocsShell } from '../../../../components/docs/docs-shell'

export default function CrmFrDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tree = crmFrSource.pageTree

  return <DocsShell tree={tree} searchApi="/api/search/crm/fr">{children}</DocsShell>
}
