/** True when viewing French partner or CRM doc routes. */
export function isFrenchDocsPath(pathname: string): boolean {
  return pathname.startsWith('/docs/fr') || pathname.startsWith('/docs/crm/fr')
}

/** Partner or CRM docs home for the current locale (matches language switcher paths). */
export function getDocsHomeHref(pathname: string): string {
  if (pathname.startsWith('/docs/crm/fr')) return '/docs/crm/fr'
  if (pathname.startsWith('/docs/crm')) return '/docs/crm'
  if (pathname.startsWith('/docs/fr')) return '/docs/fr'
  return '/docs'
}

/** Quick-link labels in the docs sidebar / mobile drawer. */
export function getDocsQuickNavLabels(pathname: string): {
  documentation: string
  support: string
  docsHomeHref: string
} {
  const fr = isFrenchDocsPath(pathname)
  return {
    documentation: 'Documentation',
    support: fr ? 'Assistance' : 'Support',
    docsHomeHref: getDocsHomeHref(pathname),
  }
}
