'use client';

import { Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';

export default function CheckoutPendingPage() {
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

        <div className="h-[2px] w-full bg-salt-orange" />

        <div className="p-8 text-center sm:p-12">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-400">
            <Clock className="h-8 w-8" />
          </div>

          <p className="mt-6 font-display text-xs font-bold uppercase tracking-[0.25em] text-salt-orange-bright">
            #SALT Webshop
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
            Payment Pending
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">
            Your payment is currently being processed. This can sometimes take a few moments.
          </p>

          <div className="mt-8 rounded-md border border-steel bg-void/60 p-5">

            <p className="text-sm leading-relaxed text-neutral-500">
              We&apos;ll send you a confirmation email once the payment has completed. Please avoid refreshing or closing the payment window while it is still processing.
            </p>

          </div>

          <div className="mt-8 flex justify-center">

            <Link
              href="/"
              className="salt-button min-w-[170px]"
            >
              Back To Home
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>
      </motion.div>
    </div>
  );
}