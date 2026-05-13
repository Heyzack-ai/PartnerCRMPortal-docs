'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SearchTrigger } from './search-dialog'
import { ThemeToggle } from './theme-toggle'
import { MobileSidebar } from './mobile-sidebar'
import { DocsSwitcher } from './docs-switcher'
import { LanguageSwitcher } from './language-switcher'
import { siteConfig } from '@/lib/theme-config'
import type { Root } from 'fumadocs-core/page-tree'

interface DocsHeaderProps {
  tree: Root
  /** Fumadocs search endpoint for this doc set */
  searchApi?: string
}

export function DocsHeader({ tree, searchApi = '/api/search' }: DocsHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const openMobileMenu = useCallback(() => setIsMobileMenuOpen(true), [])
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-2">
              {/* Mobile menu button */}
              <button
                onClick={openMobileMenu}
                className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
              >
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                {siteConfig.logo.src && (
                  <Image
                    src={siteConfig.logo.src}
                    alt={siteConfig.logo.alt}
                    width={siteConfig.logo.width}
                    height={siteConfig.logo.height}
                    className="dark:invert w-auto h-auto"
                  />
                )}
                <span className="font-semibold text-lg hidden sm:inline">{siteConfig.name}</span>
              </Link>
            </div>

            {/* Center: Search */}
            <div className="flex-1 flex justify-center px-2 sm:px-4">
              <SearchTrigger searchApi={searchApi} />
            </div>

            {/* Right: Docs switcher + links */}
            <div className="flex items-center gap-1 sm:gap-2">
              <DocsSwitcher className="hidden sm:flex shrink-0" />
              <LanguageSwitcher className="hidden sm:flex shrink-0" />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      <MobileSidebar
        tree={tree}
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />
    </>
  )
}
