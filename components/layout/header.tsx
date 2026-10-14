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
    <span className={`relative block shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:brightness-125 ${mobile ? 'w-[170px]' : 'w-[124px] xl:w-[145px]'}`}>
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

          {/* BRAND */}

          <Link
            href="/"
            className="group flex min-w-0 items-center gap-2.5"
          >
            {store?.logo ? (
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-sm border border-salt-orange/30 bg-charcoal">
                <Image
                  src={store.logo}
                  alt={store.title || '#SALT'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-salt-orange/30 bg-salt-orange/10 font-display text-lg font-black text-salt-orange-bright">
                #
              </div>
            )}

            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-lg font-black uppercase tracking-wide text-salt-orange-bright">
                #SALT
              </span>

              <span className="font-display text-lg font-black uppercase tracking-wide text-white">
                NO-WIPE
              </span>
            </div>
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
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-steel-light bg-charcoal text-neutral-300 transition-colors hover:border-salt-orange/50 hover:text-white lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* MOBILE NAV */}

        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.nav
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: 'auto',
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="overflow-hidden border-t border-steel/60 lg:hidden"
            >
              <div className="space-y-1 py-3">

                <Link
                  href="/"
                  onClick={() => {
                    localStorage.removeItem('salt-selected-cluster-v1');
                    setMobileMenuOpen(false);
                  }}
                  className={`block rounded-sm px-3 py-2.5 font-display text-xs font-bold uppercase tracking-wider ${
                    isActive('/')
                      ? 'bg-salt-orange/10 text-salt-orange-bright'
                      : 'text-neutral-400 hover:bg-charcoal hover:text-white'
                  }`}
                >
                  <span className="group inline-block"><NavigationArtwork src="/salt-nav/SALT_SWITCH_CLUSTER.webp" label="Switch Cluster" mobile /></span>
                </Link>

                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-sm px-3 py-2.5 font-display text-xs font-bold uppercase tracking-wider ${
                    isActive('/shop') || isActive('/product')
                      ? 'bg-salt-orange/10 text-salt-orange-bright'
                      : 'text-neutral-400 hover:bg-charcoal hover:text-white'
                  }`}
                >
                  <span className="group inline-block"><NavigationArtwork src="/salt-nav/SALT_SHOP.webp" label="Shop" mobile /></span>
                </Link>

                {store?.menu_links?.map((menuLink, index) => (
                  <a
                    key={index}
                    href={menuLink.link.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-sm px-3 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-neutral-400 hover:bg-charcoal hover:text-white"
                  >
                    {menuArtwork(menuLink.title, index) ? (
                      <span className="group inline-block"><NavigationArtwork src={menuArtwork(menuLink.title, index)!} label={menuLink.title} mobile /></span>
                    ) : menuLink.title}
                  </a>
                ))}

                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-sm border px-3 py-2.5 font-display text-xs font-bold uppercase tracking-wider ${
                    isActive('/cart') || isActive('/checkout')
                      ? 'border-salt-orange bg-salt-orange text-black'
                      : 'border-salt-orange/40 bg-charcoal text-salt-orange-bright'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="group inline-block"><NavigationArtwork src="/salt-nav/SALT_CART.webp" label="Cart" mobile /></span>
                  </div>

                  {mounted && cartItemCount > 0 ? (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-salt-orange px-1 text-[9px] font-black text-black">
                      {cartItemCount}
                    </span>
                  ) : null}
                </Link>

              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}