'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface DocsSwitcherProps {
  className?: string
  /** Wider labels on desktop */
  variant?: 'header' | 'mobile'
}

function useFrenchLocale(): boolean {
  const pathname = usePathname() || ''
  return pathname.startsWith('/docs/fr') || pathname.startsWith('/docs/crm/fr')
}

function partnerBasePath(isFr: boolean): string {
  return isFr ? '/docs/fr' : '/docs'
}

function crmBasePath(isFr: boolean): string {
  return isFr ? '/docs/crm/fr' : '/docs/crm'
}

/**
 * Switch between Partner and CRM documentation on the same origin.
 * Preserves French locale when switching (`/docs/fr` ↔ `/docs/crm/fr`).
 */
export function DocsSwitcher({ className, variant = 'header' }: DocsSwitcherProps) {
  const pathname = usePathname() || ''
  const isFr = useFrenchLocale()

  const partnerHref = partnerBasePath(isFr)
  const crmHref = crmBasePath(isFr)

  const onCrmFr = pathname.startsWith('/docs/crm/fr')
  const onCrmEn =
    (pathname === '/docs/crm' || pathname.startsWith('/docs/crm/')) && !onCrmFr
  const onCrm = onCrmFr || onCrmEn

  const onPartnerFr = pathname.startsWith('/docs/fr')
  const onPartnerEn =
    pathname.startsWith('/docs') && !pathname.startsWith('/docs/crm') && !pathname.startsWith('/docs/fr')
  const onPartner = onPartnerFr || onPartnerEn

  const partnerText = variant === 'mobile' ? 'Partner Portal' : 'Partner'
  const crmText = variant === 'mobile' ? 'HeyZack CRM' : 'CRM'

  const base =
    'flex items-center rounded-md border border-border bg-muted/40 p-0.5 text-xs sm:text-sm'
  const inactive =
    'px-2.5 py-1.5 rounded sm:px-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
  const active = 'px-2.5 py-1.5 rounded sm:px-3 font-medium bg-background text-foreground shadow-sm'

  return (
    <nav
      className={cn(base, className)}
      aria-label="Switch documentation site"
    >
      {onPartner ? (
        <span className={active} title="Partner Portal documentation">
          {partnerText}
        </span>
      ) : (
        <Link href={partnerHref} className={inactive} title="Open Partner Portal documentation">
          {partnerText}
        </Link>
      )}
      <span className="text-muted-foreground/50 px-0.5 select-none" aria-hidden>
        |
      </span>
      {onCrm ? (
        <span className={active} title="HeyZack CRM documentation">
          {crmText}
        </span>
      ) : (
        <Link href={crmHref} className={inactive} title="Open HeyZack CRM documentation">
          {crmText}
        </Link>
      )}
    </nav>
  )
}
