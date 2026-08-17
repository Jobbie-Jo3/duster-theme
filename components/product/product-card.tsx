'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  Zap,
  Check,
  ArrowRight,
  Star,
} from 'lucide-react';
import type { ProductGeneral } from '@/lib/schemas';
import { useCart } from '@/hooks/use-cart';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useProduct } from '@/hooks/use-api';
import { CustomFieldsModal } from './custom-fields-modal';
import { useRouter } from 'next/navigation';

type ProductCardProps = {
  product: ProductGeneral;
  hideFeaturedBadge?: boolean;
};

export function ProductCard({
  product,
  hideFeaturedBadge = false,
}: ProductCardProps) {
  const cart = useCart();
  const router = useRouter();

  const [added, setAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [needsCustomFields, setNeedsCustomFields] = useState(false);

  const { data: detailedProduct } = useProduct(product.slug);

  const isOutOfStock =
    typeof product.stock === 'number' && product.stock === 0;

  useEffect(() => {
    if (detailedProduct) {
      const hasCustomFields =
        'custom_fields' in detailedProduct &&
        detailedProduct.custom_fields &&
        detailedProduct.custom_fields.length > 0;

      const isSubscriptionWithChoice =
        detailedProduct.subscription &&
        detailedProduct.onetime_sub === true;

      const isDonation =
        'donation' in detailedProduct &&
        detailedProduct.donation === true;

      const hasServerChoice =
        'server_choice' in detailedProduct &&
        detailedProduct.server_choice === true;

      setNeedsCustomFields(
        Boolean(
          hasCustomFields ||
            isSubscriptionWithChoice ||
            isDonation ||
            hasServerChoice
        )
      );
    }
  }, [detailedProduct]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (
      typeof product.stock === 'number' &&
      product.stock === 0
    ) {
      return;
    }

    if (needsCustomFields && detailedProduct) {
      setShowModal(true);
      return;
    }

    const subscriptionType = product.subscription
      ? 'recurring'
      : undefined;

    const currentInCart =
      cart.items.find(
        (item) => item.product.id === product.id
      )?.quantity || 0;

    if (
      typeof product.stock === 'number' &&
      currentInCart + 1 > product.stock
    ) {
      setAdded(false);
      return;
    }

    cart.addItem(
      product,
      1,
      {},
      subscriptionType
    );

    if (
      product.subscription &&
      !needsCustomFields
    ) {
      router.push('/cart');
      return;
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const CardContent = (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-lg border bg-charcoal transition-all duration-300 ${
        isOutOfStock
          ? 'cursor-not-allowed border-steel opacity-60 grayscale'
          : 'border-steel/80 hover:-translate-y-1 hover:border-salt-orange/60 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35),0_0_25px_rgba(250,73,0,0.06)]'
      }`}
    >
      {/* ORANGE TOP ACCENT */}

      <div
        className={`h-[2px] w-full transition-opacity ${
          isOutOfStock
            ? 'bg-steel'
            : 'bg-gradient-to-r from-transparent via-salt-orange to-transparent opacity-40 group-hover:opacity-100'
        }`}
      />

      {/* BADGES */}

      <div className="absolute right-3 top-4 z-20 flex flex-col items-end gap-2">

        {product.featured && !hideFeaturedBadge ? (
          <span className="flex items-center gap-1.5 rounded-md border border-salt-orange/40 bg-void/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-salt-orange-bright backdrop-blur">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </span>
        ) : null}

        {product.percent_off &&
        product.percent_off > 0 &&
        product.price > 0 ? (
          <span className="rounded-md border border-salt-orange/40 bg-salt-orange px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-black">
            -{product.percent_off}%
          </span>
        ) : null}

        {typeof product.stock === 'number' ? (
          <span
            className={`rounded-md border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider backdrop-blur ${
              product.stock === 0
                ? 'border-red-500/40 bg-red-950/80 text-red-400'
                : 'border-steel-light bg-void/90 text-neutral-400'
            }`}
          >
            {product.stock === 0
              ? 'Out of Stock'
              : `Stock ${product.stock}`}
          </span>
        ) : null}

      </div>

      {/* IMAGE */}

      <div className="relative h-52 w-full overflow-hidden border-b border-steel/60 bg-void/70">

        <div className="grid-pattern absolute inset-0 opacity-30" />

        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-salt-orange/5 blur-[55px] transition-all duration-300 group-hover:bg-salt-orange/10" />

        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`relative z-10 object-contain p-4 transition-transform duration-300 ${
              isOutOfStock
                ? ''
                : 'group-hover:scale-[1.04]'
            }`}
            unoptimized
          />
        ) : (
          <div className="relative z-10 flex h-full w-full items-center justify-center">
            <Zap className="h-14 w-14 text-salt-orange/20" />
          </div>
        )}
      </div>

      {/* CONTENT */}

      <div className="flex flex-1 flex-col p-5">

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-salt-orange-bright">
            #SALT Webshop
          </p>

          <h3
            className={`mt-2 line-clamp-2 min-h-[48px] text-lg font-black uppercase leading-tight tracking-wide text-white transition-colors ${
              isOutOfStock
                ? ''
                : 'group-hover:text-salt-orange-bright'
            }`}
          >
            {product.name}
          </h3>

          <div className="mt-3 min-h-[42px] text-sm leading-relaxed text-neutral-500">
            {product.small_description ? (
              <p className="line-clamp-2">
                {stripHtml(product.small_description)}
              </p>
            ) : (
              <span className="invisible">
                Product description
              </span>
            )}
          </div>
        </div>

        {/* PRICE / CART */}

        <div className="mt-auto pt-5">

          <div className="mb-4 h-px bg-steel/60" />

          <div className="flex items-end justify-between gap-3">

            <div className="min-w-0">

              <p className="mb-1 text-[9px] font-black uppercase tracking-[0.18em] text-neutral-600">
                Price
              </p>

              <div className="flex flex-wrap items-baseline gap-2">

                <span className="text-2xl font-black text-salt-orange-bright">
                  {product.price > 0
                    ? `£${product.price.toFixed(2)}`
                    : 'Free'}
                </span>

                {product.subscription &&
                product.recurring_discount === false &&
                product.old_price &&
                product.old_price > product.price ? (
                  <>
                    <span className="text-xs text-neutral-600">
                      then
                    </span>

                    <span className="text-xs text-neutral-500">
                      £{product.old_price.toFixed(2)}
                    </span>

                    {product.period_num &&
                    product.duration_periodicity ? (
                      <span className="text-xs text-neutral-600">
                        /{' '}
                        {product.period_num > 1
                          ? `${product.period_num} `
                          : ''}
                        {product.duration_periodicity}
                        {product.period_num > 1
                          ? 's'
                          : ''}
                      </span>
                    ) : null}
                  </>
                ) : (
                  <>
                    {product.subscription &&
                    product.period_num &&
                    product.duration_periodicity ? (
                      <span className="text-xs text-neutral-500">
                        /{' '}
                        {product.period_num > 1
                          ? `${product.period_num} `
                          : ''}
                        {product.duration_periodicity}
                        {product.period_num > 1
                          ? 's'
                          : ''}
                      </span>
                    ) : null}

                    {product.old_price &&
                    product.old_price > 0 &&
                    product.old_price > product.price ? (
                      <span className="text-xs text-neutral-600 line-through">
                        £{product.old_price.toFixed(2)}
                      </span>
                    ) : null}
                  </>
                )}

              </div>
            </div>

            <motion.button
              onClick={handleAddToCart}
              whileTap={
                isOutOfStock
                  ? undefined
                  : { scale: 0.9 }
              }
              animate={
                added
                  ? { scale: [1, 1.15, 1] }
                  : {}
              }
              transition={{ duration: 0.3 }}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border transition-all ${
                isOutOfStock
                  ? 'cursor-not-allowed border-steel bg-steel/30 text-neutral-600'
                  : added
                    ? 'border-green-500 bg-green-500 text-black'
                    : 'cursor-pointer border-salt-orange bg-salt-orange text-black hover:border-salt-orange-bright hover:bg-salt-orange-bright hover:shadow-[0_0_20px_rgba(250,73,0,0.25)]'
              }`}
              aria-label={
                product.subscription &&
                !needsCustomFields
                  ? 'Subscribe'
                  : 'Add to cart'
              }
              disabled={isOutOfStock}
            >
              {added ? (
                <Check className="h-5 w-5" />
              ) : product.subscription &&
                !needsCustomFields ? (
                <ArrowRight className="h-5 w-5" />
              ) : (
                <ShoppingCart className="h-5 w-5" />
              )}
            </motion.button>

          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className="h-full"
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      {isOutOfStock ? (
        CardContent
      ) : (
        <Link
          href={`/product/${product.slug}`}
          className="block h-full"
        >
          {CardContent}
        </Link>
      )}

      {needsCustomFields &&
      detailedProduct ? (
        <CustomFieldsModal
          product={detailedProduct}
          isOpen={showModal}
          onClose={() =>
            setShowModal(false)
          }
        />
      ) : null}
    </motion.div>
  );
}