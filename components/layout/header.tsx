'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useStore } from '@/hooks/use-api';
import { useCart } from '@/hooks/use-cart';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemCount = cart.getItemCount();

  useEffect(() => {
    if (mounted && cartItemCount > prevCount) {
      setAnimate(true);

      const timeout = setTimeout(() => {
        setAnimate(false);
      }, 600);

      setPrevCount(cartItemCount);

      return () => clearTimeout(timeout);
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
      <div className="h-[2px] w-full bg-salt-orange" />

      <div className="mx-auto max-w-[1600px] px-6">
        <div className="flex h-[74px] items-center justify-between gap-6">

          {/* LOGO */}

          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3"
          >
            {store?.logo ? (
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-salt-orange/30 bg-charcoal transition-all duration-200 group-hover:border-salt-orange/70">
                <Image
                  src={store.logo}
                  alt={store.title || '#SALT'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-salt-orange/40 bg-salt-orange/10 font-black text-salt-orange-bright">
                #
              </div>
            )}

            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.28em] text-salt-orange-bright">
                Official Webshop
              </p>

              <p className="truncate font-black uppercase tracking-wide text-white sm:text-lg">
                #SALT NO-WIPE
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}

          <nav className="hidden items-center gap-1 md:flex">

            <Link
              href="/"
              className={`relative rounded-md px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition-all ${
                isActive('/')
                  ? 'bg-salt-orange/10 text-salt-orange-bright'
                  : 'text-neutral-400 hover:bg-white/[0.025] hover:text-white'
              }`}
            >
              Home

              {isActive('/') ? (
                <span className="absolute inset-x-4 -bottom-[17px] h-[2px] bg-salt-orange" />
              ) : null}
            </Link>

            <Link
              href="/shop"
              className={`relative rounded-md px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition-all ${
                isActive('/shop') || isActive('/product')
                  ? 'bg-salt-orange/10 text-salt-orange-bright'
                  : 'text-neutral-400 hover:bg-white/[0.025] hover:text-white'
              }`}
            >
              Shop

              {isActive('/shop') || isActive('/product') ? (
                <span className="absolute inset-x-4 -bottom-[17px] h-[2px] bg-salt-orange" />
              ) : null}
            </Link>

            {store?.menu_links?.map((menuLink, index) => (
              <a
                key={index}
                href={menuLink.link.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-neutral-400 transition-all hover:bg-salt-orange/5 hover:text-white"
              >
                {menuLink.title}
              </a>
            ))}

            <Link
              href="/cart"
              className="relative ml-2"
            >
              <div
                className={`flex items-center gap-2 rounded-md border px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
                  isActive('/cart') || isActive('/checkout')
                    ? 'border-salt-orange bg-salt-orange text-black'
                    : 'border-steel-light bg-charcoal text-neutral-300 hover:border-salt-orange/60 hover:text-white'
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
              </div>

              <AnimatePresence>
                {mounted && cartItemCount > 0 ? (
                  <motion.span
                    key={cartItemCount}
                    initial={{ scale: 0 }}
                    animate={{
                      scale: animate ? [1, 1.45, 1] : 1,
                      rotate: animate ? [0, 10, -10, 0] : 0,
                    }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-void bg-salt-orange px-1 text-[10px] font-black text-black shadow-[0_0_18px_rgba(250,73,0,0.35)]"
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
            className="flex h-10 w-10 items-center justify-center rounded-md border border-steel-light bg-charcoal text-white transition-colors hover:border-salt-orange/60 hover:text-salt-orange-bright md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
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
              className="overflow-hidden border-t border-steel/60 md:hidden"
            >
              <div className="space-y-2 py-4">

                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-md border px-4 py-3 text-xs font-black uppercase tracking-wider transition-all ${
                    isActive('/')
                      ? 'border-salt-orange/40 bg-salt-orange/10 text-salt-orange-bright'
                      : 'border-transparent text-neutral-400 hover:border-steel-light hover:bg-charcoal hover:text-white'
                  }`}
                >
                  Home
                </Link>

                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-md border px-4 py-3 text-xs font-black uppercase tracking-wider transition-all ${
                    isActive('/shop') || isActive('/product')
                      ? 'border-salt-orange/40 bg-salt-orange/10 text-salt-orange-bright'
                      : 'border-transparent text-neutral-400 hover:border-steel-light hover:bg-charcoal hover:text-white'
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
                    className="block rounded-md border border-transparent px-4 py-3 text-xs font-black uppercase tracking-wider text-neutral-400 transition-colors hover:border-steel-light hover:bg-charcoal hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {menuLink.title}
                  </a>
                ))}

                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-md border px-4 py-3 text-xs font-black uppercase tracking-wider transition-all ${
                    isActive('/cart') || isActive('/checkout')
                      ? 'border-salt-orange bg-salt-orange text-black'
                      : 'border-steel-light bg-charcoal text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                  </div>

                  <AnimatePresence>
                    {mounted && cartItemCount > 0 ? (
                      <motion.span
                        key={cartItemCount}
                        initial={{ scale: 0 }}
                        animate={{
                          scale: animate ? [1, 1.45, 1] : 1,
                        }}
                        exit={{ scale: 0 }}
                        className="flex h-6 min-w-6 items-center justify-center rounded-full bg-salt-orange px-1 text-[10px] font-black text-black"
                      >
                        {cartItemCount}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </Link>

              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}