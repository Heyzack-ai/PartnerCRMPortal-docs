'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/theme-config'
import { getDocsQuickNavLabels } from '@/lib/docs-nav-locale'
import type { Root, Node } from 'fumadocs-core/page-tree'

interface DocsSidebarProps {
  tree: Root
}

export function DocsSidebar({ tree }: DocsSidebarProps) {
  const pathname = usePathname()
  const { documentation, support, docsHomeHref } = getDocsQuickNavLabels(pathname)

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto pb-10 pr-4">
        {/* Quick links */}
        <div className="mb-6 pb-5 border-b border-border">
          <ul className="space-y-2">
            <li>
              <Link
                href={docsHomeHref}
                className="flex items-center gap-3 py-1 text-sm text-[var(--accent)] font-medium hover:opacity-80 transition-opacity"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-md bg-[var(--accent-muted)]">
                  <svg aria-hidden="true" className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                {documentation}
              </Link>
            </li>
            {siteConfig.links.support && (
              <li>
                <a
                  href={siteConfig.links.support}
                  className="flex items-center gap-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-800">
                    <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  {support}
                </a>
              </li>
            )}
          </ul>
        </div>

        <SidebarNodes nodes={tree.children} pathname={pathname} level={0} />
      </nav>
    </aside>
  )
}

interface SidebarNodesProps {
  nodes: Node[]
  pathname: string
  level: number
}

function SidebarNodes({ nodes, pathname, level }: SidebarNodesProps) {
  return (
    <div className="space-y-1">
      {nodes.map((node, index) => (
        <SidebarNode key={index} node={node} pathname={pathname} level={level} />
      ))}
    </div>
  )
}

interface SidebarNodeProps {
  node: Node
  pathname: string
  level: number
}

function SidebarNode({ node, pathname, level }: SidebarNodeProps) {
  if (node.type === 'separator') {
    return (
      <div className="pt-4 first:pt-0">
        <h5 className="text-sm font-semibold text-foreground mb-1.5">
          {node.name}
        </h5>
      </div>
    )
  }

  if (node.type === 'folder') {
    return (
      <div>
        <span className="block py-1 text-sm font-medium text-muted-foreground">
          {node.name}
        </span>
        {node.children && (
          <ul className="ml-3 mt-1 space-y-0.5 border-l border-border pl-3">
            {node.children.map((child, index) => (
              <SidebarNode key={index} node={child} pathname={pathname} level={level + 1} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  const isActive = pathname === node.url

  return (
    <li className="list-none">
      <Link
        href={node.url}
        className={cn(
          'flex items-center gap-2 py-1 px-2 text-sm transition-colors rounded-md',
          isActive
            ? 'text-[var(--accent)] font-medium bg-[var(--accent-muted)]'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <span>{node.name}</span>
      </Link>
    </li>
  )
}
