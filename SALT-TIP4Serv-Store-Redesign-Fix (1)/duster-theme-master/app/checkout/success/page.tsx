'use client';

import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';

export default function CheckoutSuccessPage() {
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

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
            <CheckCircle className="h-8 w-8" />
          </div>

          <p className="mt-6 font-display text-xs font-bold uppercase tracking-[0.25em] text-salt-orange-bright">
            #SALT Webshop
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
            Payment Successful
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">
            Thank you for supporting #SALT. Your order has been confirmed and is now being processed.
          </p>

          <div className="mt-8 rounded-md border border-steel bg-void/60 p-5">

            <p className="text-sm leading-relaxed text-neutral-500">
              You should receive a confirmation email shortly with your order details. If it does not appear within a few minutes, check your spam or junk folder.
            </p>

          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/shop"
              className="salt-button-outline min-w-[170px]"
            >
              Continue Shopping
            </Link>

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