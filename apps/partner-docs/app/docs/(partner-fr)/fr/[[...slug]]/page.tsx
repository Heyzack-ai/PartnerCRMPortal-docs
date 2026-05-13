import { partnerFrSource } from '@/lib/partner-fr-source'
import { notFound } from 'next/navigation'
import { DocsTOC } from '../../../../components/docs/docs-toc'
import { DocsPager } from '../../../../components/docs/docs-pager'
import { getMDXComponents } from '../../../../components/docs/mdx'
import { findNeighbour } from 'fumadocs-core/page-tree'
import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/theme-config'
import { findSectionName } from '@/lib/docs-tree-utils'

interface PageProps {
  params: Promise<{ slug?: string[] }>
}

export default async function PartnerFrDocsPage({ params }: PageProps) {
  const { slug } = await params
  const page = partnerFrSource.getPage(slug)

  if (!page) notFound()

  const MDXContent = page.data.body
  const toc = page.data.toc

  const tree = partnerFrSource.pageTree
  const neighbours = findNeighbour(tree, page.url)

  const sectionName = findSectionName(tree, page.url, 'Documentation')

  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0 max-w-3xl">
        <header className="mb-8 pb-6 border-b border-border">
          <p className="text-sm text-[var(--accent)] font-medium mb-2">
            {sectionName}
          </p>
          <h1 className="text-3xl font-bold text-foreground">
            {page.data.title}
          </h1>
          {page.data.description && (
            <p className="mt-3 text-base text-muted-foreground">
              {page.data.description}
            </p>
          )}
        </header>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <MDXContent components={getMDXComponents('/docs/fr')} />
        </div>

        <DocsPager
          previous={neighbours.previous ? {
            name: typeof neighbours.previous.name === 'string' ? neighbours.previous.name : 'Précédent',
            url: neighbours.previous.url
          } : undefined}
          next={neighbours.next ? {
            name: typeof neighbours.next.name === 'string' ? neighbours.next.name : 'Suivant',
            url: neighbours.next.url
          } : undefined}
        />
      </article>

      <DocsTOC toc={toc} />
    </div>
  )
}

export async function generateStaticParams() {
  return partnerFrSource.generateParams()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = partnerFrSource.getPage(slug)

  if (!page) return {}

  const tree = partnerFrSource.pageTree
  const section = findSectionName(tree, page.url, 'Documentation')
  const title = page.data.title
  const description = page.data.description

  const baseUrl = getSiteUrl()
  const ogImageUrl = new URL(`${baseUrl}/api/og`)
  ogImageUrl.searchParams.set('title', title)
  ogImageUrl.searchParams.set('section', section)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${baseUrl}${page.url}`,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl.toString()],
    },
  }
}
