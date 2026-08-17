'use client';

import { useCart } from '@/hooks/use-cart';
import {
  useStore,
  useCheckoutIdentifiers,
  useCheckout,
} from '@/hooks/use-api';
import {
  ShoppingCart,
  Loader2,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  useState,
  useEffect,
  useMemo,
  Suspense,
} from 'react';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import type {
  CheckoutUser,
  ProductDetailed,
} from '@/lib/schemas';
import {
  openTip4ServCheckout,
  type Tip4ServProductSimple,
} from '@/lib/tip4serv';
import {
  convertCustomFieldsForApi,
} from '@/lib/cart-utils';

const IDENTIFIER_LABELS: Record<string, string> = {
  email: 'Email Address',
  username: 'Username',
  minecraft_username: 'Minecraft Username',
  minecraft_uid: 'Minecraft Username',
  minecraft_uuid: 'Minecraft Username',
  steam_id: 'Steam ID',
  discord_id: 'Discord ID',
  epic_id: 'Epic Games ID',
  eos_id: 'EOS ID',
  fivem_citizen_id: 'FiveM Citizen ID',
  ingame_username: 'In-Game Username',
  rust_username: 'Rust Username',
};

const IDENTIFIER_FIELD_MAPPING: Record<string, string> = {
  minecraft_uid: 'minecraft_username',
  minecraft_uuid: 'minecraft_username',
};

function CheckoutContent() {
  const cart = useCart();
  const { data: store } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const productIds = useMemo(
    () => cart.items.map((item) => item.product.id),
    [cart.items]
  );

  const storeId = store?.id
    ? store.id.toString()
    : undefined;

  const {
    data: identifiersData,
    isLoading: loadingIdentifiers,
  } = useCheckoutIdentifiers(
    storeId || '',
    productIds
  );

  const [
    handleCustomerIdentification,
    setHandleCustomerIdentification,
  ] = useState(false);

  const [flagsLoaded, setFlagsLoaded] =
    useState(false);

  const checkoutMutation =
    useCheckout(storeId || '');

  const mutation = checkoutMutation;

  const [formData, setFormData] =
    useState<Partial<CheckoutUser>>({
      email: '',
    });

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  const [checkoutError, setCheckoutError] =
    useState<string | null>(null);

  const [isHydrated, setIsHydrated] =
    useState(false);

  const [isRedirecting, setIsRedirecting] =
    useState(false);

  const requiredIdentifiers =
    identifiersData?.identifiers || [];

  useEffect(() => {
    const savedFormData =
      localStorage.getItem(
        'checkout_form_data'
      );

    if (savedFormData) {
      try {
        const parsed =
          JSON.parse(savedFormData);

        setFormData((prev) => ({
          ...prev,
          ...parsed,
        }));
      } catch (e) {
        console.error(
          'Failed to parse saved form data:',
          e
        );
      }
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const discordId =
      searchParams.get('discord_id');

    const steamId =
      searchParams.get('steam_id');

    if (discordId) {
      setFormData((prev) => {
        const updated = {
          ...prev,
          discord_id: discordId,
        };

        localStorage.setItem(
          'checkout_form_data',
          JSON.stringify(updated)
        );

        return updated;
      });

      window.history.replaceState(
        {},
        '',
        '/checkout'
      );
    }

    if (steamId) {
      setFormData((prev) => {
        const updated = {
          ...prev,
          steam_id: steamId,
        };

        localStorage.setItem(
          'checkout_form_data',
          JSON.stringify(updated)
        );

        return updated;
      });

      window.history.replaceState(
        {},
        '',
        '/checkout'
      );
    }
  }, [searchParams, isHydrated]);

  useEffect(() => {
    const loadFlags = async () => {
      try {
        const res =
          await fetch('/api/config');

        if (res.ok) {
          const data = await res.json();

          setHandleCustomerIdentification(
            !!data.handleCustomerIdentification
          );
        }
      } catch (err) {
        console.error(
          'Failed to load feature flags',
          err
        );
      } finally {
        setFlagsLoaded(true);
      }
    };

    loadFlags();
  }, []);

  const handleInputChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      localStorage.setItem(
        'checkout_form_data',
        JSON.stringify(updated)
      );

      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };

        delete newErrors[field];

        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<
      string,
      string
    > = {};

    if (
      !formData.email ||
      !formData.email.includes('@')
    ) {
      newErrors.email =
        'Please enter a valid email address';
    }

    requiredIdentifiers.forEach(
      (identifier) => {
        const fieldKey =
          IDENTIFIER_FIELD_MAPPING[
            identifier
          ] || identifier;

        const value =
          formData[
            fieldKey as keyof CheckoutUser
          ];

        if (
          !value ||
          (typeof value === 'string' &&
            value.trim() === '')
        ) {
          newErrors[identifier] =
            `${
              IDENTIFIER_LABELS[
                identifier
              ] || identifier
            } is required`;
        }
      }
    );

    console.log(
      'Validation errors:',
      newErrors
    );

    console.log(
      'Required identifiers:',
      requiredIdentifiers
    );

    console.log(
      'Form data:',
      formData
    );

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setCheckoutError(null);

    if (!flagsLoaded) {
      setCheckoutError(
        'Loading checkout configuration, please try again.'
      );

      return;
    }

    if (!handleCustomerIdentification) {
      const tip4servProducts:
        Tip4ServProductSimple[] =
        cart.items.map((item) => {
          const product:
            Tip4ServProductSimple = {
            product: item.product.id,
            quantity: item.quantity,
          };

          if (
            item.product.subscription &&
            item.subscriptionType ===
              'onetime'
          ) {
            product.subscription = false;
          }

          if (
            item.customFields &&
            Object.keys(
              item.customFields
            ).length > 0
          ) {
            const productCustomFields =
              'custom_fields' in
              item.product
                ? (
                    item.product as ProductDetailed
                  ).custom_fields
                : undefined;

            product.customFields =
              convertCustomFieldsForApi(
                item.customFields,
                productCustomFields
              );
          }

          if (
            item.serverSelection !==
              undefined &&
            item.serverSelection !== null
          ) {
            product.serverSelection =
              item.serverSelection;
          }

          if (
            item.donationAmount !==
              undefined &&
            item.donationAmount !== null &&
            item.donationAmount > 0
          ) {
            product.donationAmount =
              item.donationAmount;
          }

          return product;
        });

      try {
        setIsRedirecting(true);

        await openTip4ServCheckout({
          storeId: storeId
            ? parseInt(storeId, 10)
            : undefined,

          products: tip4servProducts,

          successUrl:
            `${window.location.origin}/checkout/success`,
        });
      } catch (error) {
        console.error(
          'Tip4Serv checkout error:',
          error
        );

        setIsRedirecting(false);

        if (
          error &&
          typeof error === 'object' &&
          'htmlMessage' in error
        ) {
          setCheckoutError(
            (
              error as {
                htmlMessage: string;
              }
            ).htmlMessage
          );
        } else if (
          error instanceof Error
        ) {
          if (
            error.message ===
            'Checkout cancelled'
          ) {
            return;
          }

          setCheckoutError(
            error.message
          );
        } else {
          setCheckoutError(
            'An error occurred during checkout. Please try again.'
          );
        }
      }

      return;
    }

    if (!validateForm()) {
      return;
    }

    let finalFormData: any = {
      ...formData,
    };

    if (!finalFormData.email) {
      finalFormData.email =
        formData.email || '';
    }

    requiredIdentifiers.forEach(
      (identifier) => {
        const fieldKey =
          IDENTIFIER_FIELD_MAPPING[
            identifier
          ] || identifier;

        if (
          !(fieldKey in finalFormData)
        ) {
          finalFormData[fieldKey] =
            formData[
              fieldKey as keyof CheckoutUser
            ] || '';
        }
      }
    );

    if (
      formData.minecraft_username &&
      requiredIdentifiers.some(
        (id) =>
          id === 'minecraft_uuid' ||
          id === 'minecraft_uid'
      )
    ) {
      try {
        const response = await fetch(
          `/api/minecraft/uuid?username=${encodeURIComponent(
            formData.minecraft_username
          )}`
        );

        if (!response.ok) {
          throw new Error(
            'Minecraft username not found'
          );
        }

        const data =
          await response.json();

        finalFormData.minecraft_uuid =
          data.uuid;

        finalFormData.minecraft_username =
          formData.minecraft_username;
      } catch (error) {
        setCheckoutError(
          'Could not find Minecraft UUID for the provided username. Please check the username and try again.'
        );

        return;
      }
    }

    const checkoutData: any = {
      products: cart.items.map(
        (item) => {
          const product: any = {
            product_id:
              item.product.id,

            type:
              item.product
                .subscription &&
              item.subscriptionType ===
                'recurring'
                ? 'subscribe'
                : 'addtocart',

            quantity: item.quantity,
          };

          if (
            item.customFields &&
            Object.keys(
              item.customFields
            ).length > 0
          ) {
            const productCustomFields =
              'custom_fields' in
              item.product
                ? (
                    item.product as ProductDetailed
                  ).custom_fields
                : undefined;

            product.custom_fields =
              convertCustomFieldsForApi(
                item.customFields,
                productCustomFields
              );
          }

          if (
            item.serverSelection !==
              undefined &&
            item.serverSelection !== null
          ) {
            product.server_selection =
              item.serverSelection;
          }

          if (
            item.donationAmount !==
              undefined &&
            item.donationAmount !== null &&
            item.donationAmount > 0
          ) {
            product.donation_amount =
              item.donationAmount;
          }

          return product;
        }
      ),

      redirect_success_checkout:
        `${window.location.origin}/checkout/success`,

      redirect_canceled_checkout:
        `${window.location.origin}/checkout/canceled`,

      redirect_pending_checkout:
        `${window.location.origin}/checkout/pending`,

      user: finalFormData,
    };

    try {
      setIsRedirecting(true);

      const response =
        await mutation.mutateAsync(
          checkoutData
        );

      if (response.url) {
        window.location.href =
          response.url;

        return;
      }

      setIsRedirecting(false);
    } catch (error) {
      console.error(
        'Checkout error:',
        error
      );

      setIsRedirecting(false);

      if (error instanceof Error) {
        const errorData =
          error.message;

        try {
          const parsed =
            JSON.parse(errorData);

          if (parsed.error) {
            setCheckoutError(
              parsed.error
            );

            return;
          }

          if (parsed.details) {
            setCheckoutError(
              parsed.details
            );

            return;
          }
        } catch (e) {
          // not JSON
        }

        const errorMessage =
          error.message;

        if (
          errorMessage.includes(
            'required'
          )
        ) {
          const fieldsMatch =
            errorMessage.match(
              /(\w+\s+\w+|\w+)\s+is required/gi
            );

          if (fieldsMatch) {
            setCheckoutError(
              `Please provide the following required information: ${fieldsMatch.join(
                ', '
              )}`
            );
          } else {
            setCheckoutError(
              errorMessage
            );
          }
        } else {
          setCheckoutError(
            errorMessage
          );
        }
      } else {
        setCheckoutError(
          'An error occurred during checkout. Please try again.'
        );
      }
    }
  };

  if (isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">

        <div className="texture-plate w-full max-w-xl rounded-md border border-steel bg-charcoal p-10 text-center">

          <Loader2 className="mx-auto h-10 w-10 animate-spin text-salt-orange-bright" />

          <p className="mt-6 font-display text-xs font-bold uppercase tracking-[0.25em] text-salt-orange-bright">
            #SALT Webshop
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold uppercase text-white">
            Preparing Your Purchase
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            Your purchase is being prepared.
            You&apos;ll be redirected to complete
            payment shortly.
          </p>

        </div>

      </div>
    );
  }

  if (cart.items.length === 0) {
    return null;
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
            Checkout
          </h1>

          <p className="mt-3 text-sm text-neutral-400">
            Complete your purchase securely.
          </p>

        </div>

      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-12 sm:py-16">

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* CHECKOUT FORM */}

          <div className="lg:col-span-2">

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div className="texture-plate rounded-md border border-steel bg-charcoal p-6">

                <div className="mb-6 flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-md border border-salt-orange/30 bg-salt-orange/10 text-salt-orange-bright">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>

                    <p className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-salt-orange-bright">
                      Customer Details
                    </p>

                    <h2 className="font-display text-xl font-bold uppercase text-white">
                      Your Information
                    </h2>

                  </div>

                </div>

                {loadingIdentifiers ? (
                  <div className="flex items-center justify-center py-10">

                    <Loader2 className="h-8 w-8 animate-spin text-salt-orange-bright" />

                  </div>
                ) : (
                  <div className="space-y-5">

                    {/* EMAIL */}

                    <div>

                      <label
                        htmlFor="email"
                        className="mb-2 block font-display text-xs font-bold uppercase tracking-wider text-neutral-300"
                      >
                        Email Address{' '}
                        <span className="text-red-500">
                          *
                        </span>
                      </label>

                      <input
                        type="email"
                        id="email"
                        value={
                          formData.email || ''
                        }
                        onChange={(e) =>
                          handleInputChange(
                            'email',
                            e.target.value
                          )
                        }
                        className={`w-full rounded-md border bg-void px-4 py-3 text-sm text-white placeholder:text-neutral-700 transition-colors ${
                          errors.email
                            ? 'border-red-500'
                            : 'border-steel-light focus:border-salt-orange'
                        }`}
                        placeholder="your@email.com"
                      />

                      {errors.email ? (
                        <p className="mt-1.5 text-xs text-red-400">
                          {errors.email}
                        </p>
                      ) : null}

                    </div>

                    {/* REQUIRED IDENTIFIERS */}

                    {requiredIdentifiers.map(
                      (identifier) => {
                        if (
                          identifier ===
                          'email'
                        ) {
                          return null;
                        }

                        if (
                          identifier ===
                            'minecraft_uid' ||
                          identifier ===
                            'minecraft_uuid'
                        ) {
                          return null;
                        }

                        return (
                          <div
                            key={
                              identifier
                            }
                          >

                            <label
                              htmlFor={
                                identifier
                              }
                              className="mb-2 block font-display text-xs font-bold uppercase tracking-wider text-neutral-300"
                            >
                              {IDENTIFIER_LABELS[
                                identifier
                              ] ||
                                identifier}{' '}
                              <span className="text-red-500">
                                *
                              </span>
                            </label>

                            <div className="flex flex-col gap-2 sm:flex-row">

                              <input
                                type="text"
                                id={
                                  identifier
                                }
                                value={
                                  (formData[
                                    identifier as keyof CheckoutUser
                                  ] as string) ||
                                  ''
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleInputChange(
                                    identifier,
                                    e
                                      .target
                                      .value
                                  )
                                }
                                className={`min-w-0 flex-1 rounded-md border bg-void px-4 py-3 text-sm text-white placeholder:text-neutral-700 transition-colors ${
                                  errors[
                                    identifier
                                  ]
                                    ? 'border-red-500'
                                    : 'border-steel-light focus:border-salt-orange'
                                }`}
                                placeholder={`Enter your ${
                                  IDENTIFIER_LABELS[
                                    identifier
                                  ]?.toLowerCase() ||
                                  identifier
                                }`}
                              />

                              {identifier ===
                              'discord_id' ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const clientId =
                                      process
                                        .env
                                        .NEXT_PUBLIC_DISCORD_CLIENT_ID ||
                                      '';

                                    const redirectUri =
                                      `${window.location.origin}/api/oauth/discord/callback`;

                                    const returnPath =
                                      window
                                        .location
                                        .pathname +
                                      window
                                        .location
                                        .search;

                                    const state =
                                      `${window.location.origin}|${returnPath}`;

                                    const discordUrl =
                                      `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
                                        redirectUri
                                      )}&response_type=code&scope=identify&state=${encodeURIComponent(
                                        state
                                      )}`;

                                    window.location.href =
                                      discordUrl;
                                  }}
                                  className="rounded-md border border-[#5865F2]/50 bg-[#5865F2] px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                                >
                                  Connect Discord
                                </button>
                              ) : null}

                              {identifier ===
                              'steam_id' ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const origin =
                                      window
                                        .location
                                        .origin;

                                    const returnUrl =
                                      `${origin}/api/oauth/steam/callback?origin=${encodeURIComponent(
                                        origin
                                      )}`;

                                    const realm =
                                      origin;

                                    const steamUrl =
                                      `https://steamcommunity.com/openid/login?openid.ns=http://specs.openid.net/auth/2.0&openid.mode=checkid_setup&openid.return_to=${encodeURIComponent(
                                        returnUrl
                                      )}&openid.realm=${encodeURIComponent(
                                        realm
                                      )}&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`;

                                    window.location.href =
                                      steamUrl;
                                  }}
                                  className="rounded-md border border-steel-light bg-[#1B2838] px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-salt-orange/50"
                                >
                                  Connect Steam
                                </button>
                              ) : null}

                            </div>

                            {errors[
                              identifier
                            ] ? (
                              <p className="mt-1.5 text-xs text-red-400">
                                {
                                  errors[
                                    identifier
                                  ]
                                }
                              </p>
                            ) : null}

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

              </div>

              {/* ERROR */}

              {(checkoutError ||
                mutation.isError) ? (
                <div className="flex items-start gap-3 rounded-md border border-red-500/30 bg-red-500/10 p-4">

                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

                  <div>

                    <p className="font-display text-sm font-bold uppercase text-red-400">
                      Checkout Failed
                    </p>

                    <p className="mt-1 text-sm text-red-400/80">
                      {checkoutError ||
                        mutation.error
                          ?.message ||
                        'An error occurred during checkout. Please try again.'}
                    </p>

                  </div>

                </div>
              ) : null}

              {/* COMPLETE PURCHASE */}

              <button
                type="submit"
                disabled={isRedirecting}
                className="salt-button w-full py-4 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Complete Purchase
                  </>
                )}
              </button>

            </form>

          </div>

          {/* ORDER SUMMARY */}

          <div className="lg:col-span-1">

            <div className="texture-plate sticky top-20 rounded-md border border-steel bg-charcoal p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-salt-orange/30 bg-salt-orange/10 text-salt-orange-bright">
                  <ShoppingCart className="h-4 w-4" />
                </div>

                <div>

                  <p className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-salt-orange-bright">
                    #SALT Order
                  </p>

                  <h2 className="font-display text-xl font-bold uppercase text-white">
                    Order Summary
                  </h2>

                </div>

              </div>

              <div className="space-y-3">

                {cart.items.map(
                  (item, index) => (
                    <div
                      key={`${item.product.id}-${index}`}
                      className="flex justify-between gap-4 text-sm"
                    >

                      <span className="truncate text-neutral-500">
                        {item.product.name}{' '}
                        x{item.quantity}
                      </span>

                      <span className="whitespace-nowrap font-semibold text-white">
                        £
                        {(
                          item.product.price *
                          item.quantity
                        ).toFixed(2)}
                      </span>

                    </div>
                  )
                )}

              </div>

              <div className="mt-6 border-t border-steel/60 pt-6">

                <div className="flex items-end justify-between gap-4">

                  <span className="font-display text-lg font-bold uppercase text-neutral-300">
                    Total
                  </span>

                  <span className="font-display text-3xl font-black text-salt-orange-bright">
                    £
                    {cart
                      .getTotal()
                      .toFixed(2)}
                  </span>

                </div>

              </div>

              <div className="mt-6 rounded-md border border-salt-orange/20 bg-salt-orange/5 p-4">

                <div className="flex gap-3">

                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-salt-orange-bright" />

                  <p className="text-xs leading-relaxed text-neutral-500">
                    Secure checkout powered by
                    Tip4Serv. Your purchase will
                    be processed through the
                    official #SALT store.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6">

          <div className="texture-plate w-full max-w-xl rounded-md border border-steel bg-charcoal p-10 text-center">

            <Loader2 className="mx-auto h-10 w-10 animate-spin text-salt-orange-bright" />

            <h1 className="mt-5 font-display text-2xl font-bold uppercase text-white">
              Loading Checkout...
            </h1>

          </div>

        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}