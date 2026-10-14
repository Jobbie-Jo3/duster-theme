'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useStore } from '@/hooks/use-api';
import { useCart } from '@/hooks/use-cart';
import type { Store } from '@/lib/schemas';

const NAV_ART: Record<string, string> = {
  discord: '/salt-nav/SALT_DISCORD.webp',
  support: '/salt-nav/SALT_SUPPORT.webp',
  'terms of service': '/salt-nav/SALT_TERMS_OF_SERVICE.webp',
  terms: '/salt-nav/SALT_TERMS_OF_SERVICE.webp',
  tos: '/salt-nav/SALT_TERMS_OF_SERVICE.webp',
};

// Tip4Serv menu labels can differ from the artwork names. Preserve URLs,
// but use the three configured link positions as a fallback.
const MENU_ART_ORDER = [NAV_ART.discord, NAV_ART.support, NAV_ART['terms of service']];
function menuArtwork(title: string, index: number): string | undefined {
  const label = title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  if (label.includes('discord')) return NAV_ART.discord;
  if (label.includes('support') || label.includes('help') || label.includes('contact')) return NAV_ART.support;
  if (label.includes('terms') || label.includes('tos') || label.includes('service')) return NAV_ART['terms of service'];
  return MENU_ART_ORDER[index];
}

function NavigationArtwork({ src, label, mobile = false }: { src: string; label: string; mobile?: boolean }) {
  return (
    <span className={`relative block shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:brightness-125 ${mobile ? 'w-full max-w-[185px]' : 'w-[124px] xl:w-[145px]'}`}>
      <Image src={src} alt={label} width={2132} height={800} className="h-auto w-full object-contain" unoptimized />
    </span>
  );
}

interface HeaderProps {
  initialStore?: Store | null;
}

export function Header({ initialStore }: HeaderProps) {
  const { data: fetchedStore } = useStore();
  const store = fetchedStore || initialStore;

  const cart = useCart();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  const [animateCart, setAnimateCart] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemCount = cart.getItemCount();

  useEffect(() => {
    if (mounted && cartItemCount > prevCount) {
      setAnimateCart(true);

      const timer = setTimeout(() => {
        setAnimateCart(false);
      }, 600);

      setPrevCount(cartItemCount);

      return () => clearTimeout(timer);
    }

    setPrevCount(cartItemCount);
  }, [cartItemCount, mounted, prevCount]);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }

    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-steel/70 bg-void/95 backdrop-blur-xl">
      {/* TOP ACCENT */}
      <div className="h-[2px] w-full bg-salt-orange" />

      <div className="mx-auto max-w-[1600px] px-6">
        <div className="flex min-h-[74px] items-center justify-between gap-3 py-2">

          {/* BRAND — custom #SALT NO-WIPE artwork */}
          <Link href="/" className="group flex shrink-0 items-center" aria-label="#SALT NO-WIPE home">
            <Image
              src="/salt-nav/SALT_NO_WIPE.webp"
              alt="#SALT NO-WIPE"
              width={2048}
              height={682}
              className="h-auto w-[155px] sm:w-[175px] xl:w-[195px] object-contain transition-[filter] duration-200 group-hover:brightness-125"
              unoptimized
              priority
            />
          </Link>

          {/* DESKTOP NAV — custom supplied #SALT artwork */}
          <nav className="hidden items-center gap-0 xl:gap-1 lg:flex" aria-label="Main navigation">
            <Link href="/" onClick={() => localStorage.removeItem('salt-selected-cluster-v1')} className="group rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-salt-orange" aria-label="Switch Cluster" aria-current={isActive('/') ? 'page' : undefined}>
              <NavigationArtwork src="/salt-nav/SALT_SWITCH_CLUSTER.webp" label="Switch Cluster" />
            </Link>
            <Link href="/shop" className="group rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-salt-orange" aria-label="Shop" aria-current={isActive('/shop') ? 'page' : undefined}>
              <NavigationArtwork src="/salt-nav/SALT_SHOP.webp" label="Shop" />
            </Link>
            {store?.menu_links?.map((menuLink, index) => {
              const title = menuLink.title.trim();
              const artwork = menuArtwork(title, index);
              return (
                <a key={index} href={menuLink.link.trim()} target="_blank" rel="noopener noreferrer" className="group rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-salt-orange" aria-label={title}>
                  {artwork ? <NavigationArtwork src={artwork} label={title} /> : <span className="px-2 text-xs font-bold uppercase tracking-wide text-neutral-300 hover:text-salt-orange-bright">{title}</span>}
                </a>
              );
            })}
            <Link href="/cart" className="group relative rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-salt-orange" aria-label="Cart" aria-current={isActive('/cart') || isActive('/checkout') ? 'page' : undefined}>
              <NavigationArtwork src="/salt-nav/SALT_CART.webp" label="Cart" />
              <AnimatePresence>
                {mounted && cartItemCount > 0 ? (
                  <motion.span key={cartItemCount} initial={{ scale: 0 }} animate={{ scale: animateCart ? [1, 1.4, 1] : 1 }} exit={{ scale: 0 }} transition={{ duration: 0.3 }} className="absolute right-1 top-0 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-void bg-salt-orange px-1 text-[9px] font-black text-black">
                    {cartItemCount}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </Link>
          </nav>

          {/* MOBILE BUTTON */}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-[#FA4900]/60 bg-[#0a0a0a] text-white transition-colors hover:border-[#FA4900] hover:bg-[#181818] lg:hidden"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* MOBILE NAV — compact artwork grid, no brown active-state boxes */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-[#FA4900]/30 lg:hidden"
              aria-label="Mobile navigation"
            >
              <div className="grid grid-cols-2 gap-x-3 gap-y-3 bg-[#080808] px-1 py-5 sm:grid-cols-3">
                <Link href="/" onClick={() => { localStorage.removeItem('salt-selected-cluster-v1'); setMobileMenuOpen(false); }} className="group flex min-w-0 items-center justify-center rounded-md border border-transparent bg-transparent p-1 transition-colors hover:border-[#FA4900]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FA4900]" aria-label="Switch Cluster">
                  <NavigationArtwork src="/salt-nav/SALT_SWITCH_CLUSTER.webp" label="Switch Cluster" mobile />
                </Link>
                <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="group flex min-w-0 items-center justify-center rounded-md border border-transparent bg-transparent p-1 transition-colors hover:border-[#FA4900]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FA4900]" aria-label="Shop">
                  <NavigationArtwork src="/salt-nav/SALT_SHOP.webp" label="Shop" mobile />
                </Link>
                {store?.menu_links?.map((menuLink, index) => {
                  const artwork = menuArtwork(menuLink.title, index);
                  return (
                    <a key={index} href={menuLink.link.trim()} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="group flex min-w-0 items-center justify-center rounded-md border border-transparent bg-transparent p-1 transition-colors hover:border-[#FA4900]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FA4900]" aria-label={menuLink.title}>
                      {artwork ? <NavigationArtwork src={artwork} label={menuLink.title} mobile /> : <span className="text-center text-xs font-bold uppercase text-white">{menuLink.title}</span>}
                    </a>
                  );
                })}
                <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="group relative flex min-w-0 items-center justify-center rounded-md border border-transparent bg-transparent p-1 transition-colors hover:border-[#FA4900]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FA4900]" aria-label="Cart">
                  <NavigationArtwork src="/salt-nav/SALT_CART.webp" label="Cart" mobile />
                  {mounted && cartItemCount > 0 && <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FA4900] px-1 text-[10px] font-black text-black">{cartItemCount}</span>}
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}