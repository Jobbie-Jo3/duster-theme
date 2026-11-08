'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useStore } from '@/hooks/use-api';
import { useCart } from '@/hooks/use-cart';
import type { Store } from '@/lib/schemas';

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

              <span className="font-display text-[10px] font-extrabold uppercase tracking-[.22em] text-white/45">
                OFFICIAL STORE
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-2 lg:flex" aria-label="Main navigation">
            <Link href="/" className={`rounded-full px-5 py-3 text-[11px] font-extrabold uppercase tracking-[.16em] transition ${isActive('/') ? 'bg-white/[.08] text-white' : 'text-white/55 hover:bg-white/[.05] hover:text-white'}`} aria-current={isActive('/') ? 'page' : undefined}>Home</Link>
            <Link href="/shop" className={`rounded-full px-5 py-3 text-[11px] font-extrabold uppercase tracking-[.16em] transition ${isActive('/shop') || isActive('/product') ? 'bg-[#FA4B00] text-black' : 'text-white/65 hover:bg-[#FA4B00]/10 hover:text-[#FA4B00]'}`} aria-current={isActive('/shop') ? 'page' : undefined}>Shop</Link>
            {store?.menu_links?.map((menuLink, index) => (
              <a key={index} href={menuLink.link.trim()} target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-3 text-[11px] font-extrabold uppercase tracking-[.13em] text-white/50 transition hover:text-[#FA4B00]">{menuLink.title}</a>
            ))}
            <Link href="/cart" className="relative ml-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[.04] text-white transition hover:border-[#FA4B00]/50 hover:text-[#FA4B00]" aria-label="Cart" aria-current={isActive('/cart') || isActive('/checkout') ? 'page' : undefined}>
              <ShoppingBag className="h-4 w-4" />
              {mounted && cartItemCount > 0 ? <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FA4B00] px-1 text-[9px] font-black text-black">{cartItemCount}</span> : null}
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

                <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`block rounded-xl px-4 py-3 text-xs font-extrabold uppercase tracking-wider ${isActive('/') ? 'bg-white/[.08] text-white' : 'text-neutral-400 hover:bg-charcoal hover:text-white'}`}>Home</Link>

                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-sm px-3 py-2.5 font-display text-xs font-bold uppercase tracking-wider ${
                    isActive('/shop') || isActive('/product')
                      ? 'bg-salt-orange/10 text-salt-orange-bright'
                      : 'text-neutral-400 hover:bg-charcoal hover:text-white'
                  }`}
                >
                  Shop
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
                    {NAV_ART[menuLink.title.trim().toLowerCase()] ? (
                      <span className="group inline-block"><NavigationArtwork src={NAV_ART[menuLink.title.trim().toLowerCase()]} label={menuLink.title} mobile /></span>
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
                    Cart
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