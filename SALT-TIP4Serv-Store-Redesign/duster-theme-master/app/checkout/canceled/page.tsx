'use client';

import { XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';

export default function CheckoutCanceledPage() {
  const clearCart = useCart((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 14,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
        className="texture-plate w-full max-w-2xl overflow-hidden rounded-md border border-steel bg-charcoal"
      >

        {/* TOP ACCENT */}

        <div className="h-[2px] w-full bg-red-500/80" />

        <div className="p-8 text-center sm:p-12">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md border border-red-500/40 bg-red-500/10 text-red-400">
            <XCircle className="h-8 w-8" />
          </div>

          <p className="mt-6 font-display text-xs font-bold uppercase tracking-[0.25em] text-salt-orange-bright">
            #SALT Webshop
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
            Payment Canceled
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">
            Your payment was canceled and no charges were made.
          </p>

          <div className="mt-8 rounded-md border border-steel bg-void/60 p-5">

            <p className="text-sm leading-relaxed text-neutral-500">
              If you ran into an issue during checkout, you can try again or contact #SALT support for help.
            </p>

          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/cart"
              className="salt-button min-w-[170px]"
            >
              Return To Cart
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/shop"
              className="salt-button-outline min-w-[170px]"
            >
              Continue Shopping
            </Link>

          </div>

        </div>
      </motion.div>
    </div>
  );
}