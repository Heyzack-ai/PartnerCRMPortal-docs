'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

function stripFrenchLocale(path: string): string {
  if (path === '/docs/fr') return '/docs'
  if (path.startsWith('/docs/fr/')) return '/docs' + path.slice('/docs/fr'.length)
  if (path === '/docs/crm/fr') return '/docs/crm'
  if (path.startsWith('/docs/crm/fr/')) return '/docs/crm' + path.slice('/docs/crm/fr'.length)
  return path
}

function withFrenchLocale(path: string): string {
  if (path.startsWith('/docs/fr') || path.startsWith('/docs/crm/fr')) return path
  if (path === '/docs') return '/docs/fr'
  if (path === '/docs/crm') return '/docs/crm/fr'
  if (path.startsWith('/docs/crm/')) {
    return '/docs/crm/fr' + path.slice('/docs/crm'.length)
  }
  if (path.startsWith('/docs/')) {
    return '/docs/fr' + path.slice('/docs'.length)
  }
  return '/docs/fr'
}

interface LanguageSwitcherProps {
  className?: string
  variant?: 'header' | 'mobile'
}

/**
 * Toggle English / French while keeping the same doc path under `/docs/...` or `/docs/crm/...`.
 */
export function LanguageSwitcher({ className, variant = 'header' }: LanguageSwitcherProps) {
  const pathname = usePathname() || '/docs'
  const inDocs = pathname.startsWith('/docs')
  const base = inDocs ? pathname : '/docs'
  const isFr = base.startsWith('/docs/fr') || base.startsWith('/docs/crm/fr')
  const enPath = stripFrenchLocale(base)
  const frPath = withFrenchLocale(stripFrenchLocale(base))

  const wrap =
    'flex items-center rounded-md border border-border bg-muted/40 p-0.5 text-xs sm:text-sm'
  const inactive =
    'px-2 py-1.5 rounded sm:px-2.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
  const active = 'px-2 py-1.5 rounded sm:px-2.5 font-medium bg-background text-foreground shadow-sm'

  const enLabel = variant === 'mobile' ? 'English' : 'EN'
  const frLabel = variant === 'mobile' ? 'Français' : 'FR'

  return (
    <nav
      className={cn(wrap, className)}
      aria-label="Documentation language"
    >
      {!isFr ? (
        <span className={active} title="English">
          {enLabel}
        </span>
      ) : (
        <Link href={enPath} className={inactive} title="Switch to English">
          {enLabel}
        </Link>
      )}
      <span className="text-muted-foreground/50 px-0.5 select-none" aria-hidden>
        |
      </span>
      {isFr ? (
        <span className={active} title="Français">
          {frLabel}
        </span>
      ) : (
        <Link href={frPath} className={inactive} title="Passer en français">
          {frLabel}
        </Link>
      )}
    </nav>
  )
}
