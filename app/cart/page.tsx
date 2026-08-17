'use client';

import { useCart } from '@/hooks/use-cart';
import {
  calculateNumberRangeCharge,
  formatCustomFieldsForDisplay,
} from '@/lib/cart-utils';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStore } from '@/hooks/use-api';
import {
  openTip4ServCheckout,
  type Tip4ServProductSimple,
} from '@/lib/tip4serv';

export default function CartPage() {
  const cart = useCart();
  const router = useRouter();
  const { data: store } = useStore();

  const [handleCustomerIdentification, setHandleCustomerIdentification] =
    useState(false);

  const [flagsLoaded, setFlagsLoaded] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [precheckoutError, setPrecheckoutError] = useState<string | null>(null);

  useEffect(() => {
    cart.clearIfExpired();
  }, []);

  useEffect(() => {
    const loadFlags = async () => {
      try {
        const res = await fetch('/api/config');

        if (res.ok) {
          const data = await res.json();

          setHandleCustomerIdentification(
            !!data.handleCustomerIdentification
          );
        }
      } catch (err) {
        console.error('Failed to load feature flags', err);
      } finally {
        setFlagsLoaded(true);
      }
    };

    loadFlags();
  }, []);

  const handleCheckout = async () => {
    if (!flagsLoaded || !store?.id) {
      return;
    }

    if (handleCustomerIdentification) {
      router.push('/checkout');
      return;
    }

    setPrecheckoutError(null);
    setIsCheckingOut(true);

    const tip4servProducts: Tip4ServProductSimple[] = cart.items.map(
      (item) => {
        const product: Tip4ServProductSimple = {
          product: item.product.id,
          quantity: item.quantity,
        };

        if (
          item.product.subscription &&
          item.subscriptionType === 'onetime'
        ) {
          product.subscription = false;
        }

        if (
          item.customFields &&
          Object.keys(item.customFields).length > 0
        ) {
          product.customFields = item.customFields;
        }

        if (
          item.serverSelection !== undefined &&
          item.serverSelection !== null
        ) {
          product.serverSelection = item.serverSelection;
        }

        if (
          item.donationAmount !== undefined &&
          item.donationAmount !== null &&
          item.donationAmount > 0
        ) {
          product.donationAmount = item.donationAmount;
        }

        return product;
      }
    );

    try {
      await openTip4ServCheckout({
        storeId: store.id,
        products: tip4servProducts,
        successUrl: `${window.location.origin}/checkout/success`,
      });
    } catch (error) {
      console.error('Tip4Serv checkout error:', error);

      setIsCheckingOut(false);

      if (error instanceof Error) {
        if (error.message === 'Checkout cancelled') {
          return;
        }

        setPrecheckoutError(error.message);
      } else {
        setPrecheckoutError(
          'Failed to start checkout. Please try again.'
        );
      }
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen">

        <section className="texture-plate border-b border-steel/60">
          <div className="mx-auto max-w-[1600px] px-6 py-16 sm:py-20">

            <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-salt-orange-bright">
              #SALT Webshop
            </p>

            <h1 className="mt-2 font-display text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
              Shopping Cart
            </h1>

            <p className="mt-3 text-sm text-neutral-400">
              Review your #SALT store purchases before checkout.
            </p>

          </div>
        </section>

        <section className="mx-auto max-w-[900px] px-6 py-20">

          <div className="texture-plate rounded-md border border-steel bg-charcoal px-6 py-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md border border-salt-orange/30 bg-salt-orange/10 text-salt-orange-bright">
              <ShoppingCart className="h-7 w-7" />
            </div>

            <h2 className="mt-6 font-display text-2xl font-bold uppercase text-white">
              Your Cart Is Empty
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-neutral-500">
              You haven&apos;t added any products to your cart yet.
            </p>

            <Link
              href="/shop"
              className="salt-button mt-7"
            >
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {/* HEADER */}

      <section className="texture-plate border-b border-steel/60">
        <div className="mx-auto max-w-[1600px] px-6 py-16 sm:py-20">

          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-salt-orange-bright">
            #SALT Webshop
          </p>

          <h1 className="mt-2 font-display text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
            Shopping Cart
          </h1>

          <p className="mt-3 text-sm text-neutral-400">
            {cart.getItemCount()} item
            {cart.getItemCount() !== 1 ? 's' : ''} in your cart
          </p>

        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-12 sm:py-16">

        {precheckoutError ? (
          <div className="mb-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
            {precheckoutError}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* CART ITEMS */}

          <div className="space-y-4 lg:col-span-2">

            {cart.items.map((item, index) => {
              const duplicateCount = cart.items.filter(
                (cartItem) => cartItem.product.id === item.product.id
              ).length;

              const showCustomFieldsDetail = duplicateCount > 1;

              const customFieldsDisplay =
                showCustomFieldsDetail &&
                item.customFields &&
                'custom_fields' in item.product
                  ? formatCustomFieldsForDisplay(
                      item.customFields,
                      item.product.custom_fields || []
                    )
                  : '';

              const itemUnitPrice = (() => {
                if (
                  'donation' in item.product &&
                  item.product.donation &&
                  item.donationAmount !== undefined
                ) {
                  return item.donationAmount;
                }

                let price = item.product.price;

                if (
                  item.customFields &&
                  'custom_fields' in item.product &&
                  item.product.custom_fields
                ) {
                  item.product.custom_fields.forEach((field) => {
                    const key =
                      field.marker || field.id.toString();

                    const value =
                      item.customFields?.[key];

                    if (
                      field.type === 'checkbox' &&
                      value
                    ) {
                      price += field.price || 0;
                    } else if (
                      (
                        field.type === 'select' ||
                        field.type === 'selection' ||
                        field.type === 'dropdown' ||
                        field.type === 'choice'
                      ) &&
                      value &&
                      field.options
                    ) {
                      const selectedOption =
                        field.options.find(
                          (option) =>
                            option.id.toString() ===
                            value.toString()
                        );

                      if (selectedOption) {
                        price += selectedOption.price || 0;
                      }
                    } else if (
                      field.type === 'number' ||
                      field.type === 'range'
                    ) {
                      price += calculateNumberRangeCharge(
                        field,
                        value
                      );
                    }
                  });
                }

                return price;
              })();

              return (
                <div
                  key={`${item.product.id}-${index}`}
                  className="texture-plate flex gap-4 rounded-md border border-steel bg-charcoal p-4"
                >

                  {/* IMAGE */}

                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-steel-light bg-void">

                    {(() => {
                      const imageSrc =
                        item.product.image ||
                        ('gallery' in item.product
                          ? item.product.gallery?.[0]
                          : undefined);

                      if (!imageSrc) {
                        return (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-salt-orange/25" />
                          </div>
                        );
                      }

                      return (
                        <Image
                          src={imageSrc}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      );
                    })()}

                  </div>

                  {/* DETAILS */}

                  <div className="min-w-0 flex-1">

                    <Link
                      href={`/product/${item.product.slug}`}
                    >
                      <h3 className="truncate font-display text-lg font-bold uppercase tracking-wide text-white transition-colors hover:text-salt-orange-bright">
                        {item.product.name}
                      </h3>
                    </Link>

                    <p className="mt-1 text-2xl font-black text-salt-orange-bright">
                      £{itemUnitPrice.toFixed(2)}
                    </p>

                    {item.product.subscription &&
                    item.subscriptionType === 'recurring' ? (
                      <p className="mt-2 text-xs text-neutral-500">
                        Subscription — Renews every{' '}
                        {item.product.period_num}{' '}
                        {item.product.duration_periodicity}
                        {item.product.period_num &&
                        item.product.period_num > 1
                          ? 's'
                          : ''}
                      </p>
                    ) : null}

                    {item.product.subscription &&
                    item.subscriptionType === 'onetime' ? (
                      <p className="mt-2 text-xs text-neutral-500">
                        One-time purchase —{' '}
                        {item.product.period_num}{' '}
                        {item.product.duration_periodicity}
                        {item.product.period_num &&
                        item.product.period_num > 1
                          ? 's'
                          : ''}
                      </p>
                    ) : null}

                    {customFieldsDisplay ? (
                      <p className="mt-2 text-xs italic text-salt-orange-bright/70">
                        {customFieldsDisplay}
                      </p>
                    ) : null}

                  </div>

                  {/* CONTROLS */}

                  <div className="flex flex-col items-end justify-between">

                    <button
                      onClick={() =>
                        cart.removeItemByIndex(index)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-red-500/20 text-red-400 transition-colors hover:border-red-500/50 hover:bg-red-500/10"
                      aria-label="Remove from cart"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-2">

                      <button
                        onClick={() =>
                          cart.updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.customFields
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-steel-light bg-void text-neutral-300 transition-colors hover:border-salt-orange/50 hover:text-white"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      <span className="w-8 text-center font-display text-sm font-bold text-white">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => {
                          const maxQuantity =
                            typeof item.product.stock ===
                            'number'
                              ? item.product.stock
                              : item.quantity + 1;

                          if (
                            item.quantity <
                            maxQuantity
                          ) {
                            cart.updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.customFields
                            );
                          }
                        }}
                        disabled={
                          typeof item.product.stock ===
                            'number' &&
                          item.quantity >=
                            item.product.stock
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-steel-light bg-void text-neutral-300 transition-colors hover:border-salt-orange/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

          {/* ORDER SUMMARY */}

          <div className="lg:col-span-1">

            <div className="texture-plate sticky top-20 rounded-md border border-steel bg-charcoal p-6">

              <p className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-salt-orange-bright">
                Checkout
              </p>

              <h2 className="mt-1 font-display text-2xl font-bold uppercase text-white">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                {cart.items.map((item, index) => {
                  const duplicateCount =
                    cart.items.filter(
                      (cartItem) =>
                        cartItem.product.id ===
                        item.product.id
                    ).length;

                  const showCustomFieldsDetail =
                    duplicateCount > 1;

                  const customFieldsDisplay =
                    showCustomFieldsDetail &&
                    item.customFields &&
                    'custom_fields' in item.product
                      ? formatCustomFieldsForDisplay(
                          item.customFields,
                          item.product.custom_fields || []
                        )
                      : '';

                  const itemTotal = (() => {
                    if (
                      'donation' in item.product &&
                      item.product.donation &&
                      item.donationAmount !== undefined
                    ) {
                      return (
                        item.donationAmount *
                        item.quantity
                      );
                    }

                    let price = item.product.price;

                    if (
                      item.customFields &&
                      'custom_fields' in
                        item.product &&
                      item.product.custom_fields
                    ) {
                      item.product.custom_fields.forEach(
                        (field) => {
                          const key =
                            field.marker ||
                            field.id.toString();

                          const value =
                            item.customFields?.[key];

                          if (
                            field.type ===
                              'checkbox' &&
                            value
                          ) {
                            price +=
                              field.price || 0;
                          } else if (
                            (
                              field.type ===
                                'select' ||
                              field.type ===
                                'selection' ||
                              field.type ===
                                'dropdown' ||
                              field.type ===
                                'choice'
                            ) &&
                            value &&
                            field.options
                          ) {
                            const selectedOption =
                              field.options.find(
                                (option) =>
                                  option.id.toString() ===
                                  value.toString()
                              );

                            if (selectedOption) {
                              price +=
                                selectedOption.price ||
                                0;
                            }
                          } else if (
                            field.type === 'number' ||
                            field.type === 'range'
                          ) {
                            price +=
                              calculateNumberRangeCharge(
                                field,
                                value
                              );
                          }
                        }
                      );
                    }

                    return price * item.quantity;
                  })();

                  return (
                    <div
                      key={`${item.product.id}-${index}`}
                      className="flex flex-col gap-1"
                    >
                      <div className="flex justify-between gap-4 text-sm">

                        <span className="truncate text-neutral-500">
                          {item.product.name} x
                          {item.quantity}
                        </span>

                        <span className="whitespace-nowrap font-semibold text-white">
                          £{itemTotal.toFixed(2)}
                        </span>

                      </div>

                      {customFieldsDisplay ? (
                        <span className="ml-2 text-xs italic text-salt-orange-bright/60">
                          {customFieldsDisplay}
                        </span>
                      ) : null}

                    </div>
                  );
                })}

              </div>

              <div className="mt-6 border-t border-steel/60 pt-6">

                <div className="flex items-end justify-between gap-4">

                  <span className="font-display text-lg font-bold uppercase text-neutral-300">
                    Total
                  </span>

                  <span className="font-display text-3xl font-black text-salt-orange-bright">
                    £{cart.getTotal().toFixed(2)}
                  </span>

                </div>

                <button
                  onClick={handleCheckout}
                  disabled={
                    isCheckingOut ||
                    !flagsLoaded
                  }
                  className="salt-button mt-6 w-full py-4 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed To Checkout
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>
    </div>
  );
}