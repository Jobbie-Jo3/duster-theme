'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingCart } from 'lucide-react';
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
        <div className="flex h-[58px] items-center justify-between gap-6">

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

          {/* DESKTOP NAV */}

          <nav className="hidden items-center gap-1 lg:flex">

            <Link
              href="/"
              className={`rounded-sm px-3 py-2 font-display text-[11px] font-bold uppercase tracking-wider transition-colors ${
                isActive('/')
                  ? 'text-salt-orange-bright'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Home
            </Link>

            <Link
              href="/shop"
              className={`rounded-sm px-3 py-2 font-display text-[11px] font-bold uppercase tracking-wider transition-colors ${
                isActive('/shop') || isActive('/product')
                  ? 'text-salt-orange-bright'
                  : 'text-neutral-400 hover:text-white'
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
                className="rounded-sm px-3 py-2 font-display text-[11px] font-bold uppercase tracking-wider text-neutral-400 transition-colors hover:text-white"
              >
                {menuLink.title}
              </a>
            ))}

            {/* CART */}

            <Link
              href="/cart"
              className="relative ml-2"
            >
              <div
                className={`flex items-center gap-2 rounded-sm border px-3.5 py-2 font-display text-[11px] font-bold uppercase tracking-wider transition-all ${
                  isActive('/cart') || isActive('/checkout')
                    ? 'border-salt-orange bg-salt-orange text-black'
                    : 'border-salt-orange/50 bg-charcoal text-salt-orange-bright hover:border-salt-orange hover:bg-salt-orange/10'
                }`}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Cart
              </div>

              <AnimatePresence>
                {mounted && cartItemCount > 0 ? (
                  <motion.span
                    key={cartItemCount}
                    initial={{ scale: 0 }}
                    animate={{
                      scale: animateCart ? [1, 1.4, 1] : 1,
                    }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-void bg-salt-orange px-1 text-[9px] font-black text-black"
                  >
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
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-sm px-3 py-2.5 font-display text-xs font-bold uppercase tracking-wider ${
                    isActive('/')
                      ? 'bg-salt-orange/10 text-salt-orange-bright'
                      : 'text-neutral-400 hover:bg-charcoal hover:text-white'
                  }`}
                >
                  Home
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
                    {menuLink.title}
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
                    <ShoppingCart className="h-4 w-4" />
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