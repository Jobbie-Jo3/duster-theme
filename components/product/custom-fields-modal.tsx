'use client';

import { useState, useEffect } from 'react';
import {
  X,
  ShoppingCart,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import {
  motion,
  AnimatePresence,
} from 'framer-motion';
import type {
  ProductDetailed,
  CustomField,
} from '@/lib/schemas';
import { useCart } from '@/hooks/use-cart';
import {
  validateCustomRules,
  getCustomRulesErrorMessage,
} from '@/lib/custom-rules-utils';
import {
  calculateNumberRangeCharge,
} from '@/lib/cart-utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type CustomFieldsModalProps = {
  product: ProductDetailed;
  isOpen: boolean;
  onClose: () => void;
};

export function CustomFieldsModal({
  product,
  isOpen,
  onClose,
}: CustomFieldsModalProps) {
  const cart = useCart();
  const router = useRouter();

  const [quantity, setQuantity] =
    useState(1);

  const [
    customFields,
    setCustomFields,
  ] = useState<Record<string, any>>({});

  const [error, setError] =
    useState<string | null>(null);

  const [
    subscriptionType,
    setSubscriptionType,
  ] = useState<
    'onetime' | 'recurring'
  >('recurring');

  const [
    serverSelection,
    setServerSelection,
  ] = useState<number | undefined>(
    undefined
  );

  const [
    donationAmount,
    setDonationAmount,
  ] = useState<number | undefined>(
    undefined
  );

  const isSubscription =
    product.subscription;

  const canChooseOnetimeSubscription =
    isSubscription &&
    product.onetime_sub === true;

  const isFieldVisible = (
    field: CustomField
  ): boolean => {
    if (!field.parent) {
      return true;
    }

    const parentField =
      product.custom_fields?.find(
        (item) =>
          item.id ===
          field.parent?.customFieldId
      );

    const parentKey =
      parentField?.marker ||
      field.parent.customFieldId.toString();

    return !!customFields[parentKey];
  };

  const handleCustomFieldChange = (
    field: CustomField,
    value: any
  ) => {
    const key =
      field.marker ||
      field.id.toString();

    setCustomFields((prev) => {
      const newState = {
        ...prev,
        [key]: value,
      };

      if (
        field.type === 'checkbox' &&
        !value &&
        product.custom_fields
      ) {
        product.custom_fields.forEach(
          (childField) => {
            if (
              childField.parent
                ?.customFieldId === field.id
            ) {
              delete newState[
                childField.marker ||
                  childField.id.toString()
              ];
            }
          }
        );
      }

      return newState;
    });
  };

  useEffect(() => {
    if (
      !serverSelection &&
      product.server_options?.length
    ) {
      setServerSelection(
        product.server_options[0].id
      );
    }
  }, [product, serverSelection]);

  useEffect(() => {
    if (
      product.donation &&
      product.min_donation &&
      !donationAmount
    ) {
      setDonationAmount(
        product.min_donation
      );
    }
  }, [product, donationAmount]);

  useEffect(() => {
    if (!product.custom_fields) {
      return;
    }

    const defaults: Record<
      string,
      any
    > = {};

    product.custom_fields.forEach(
      (field) => {
        const key =
          field.marker ||
          field.id.toString();

        if (
          (
            field.type === 'number' ||
            field.type === 'range'
          ) &&
          customFields[key] === undefined
        ) {
          const defaultVal =
            field.default_value ??
            field.minimum ??
            0;

          defaults[key] =
            typeof defaultVal ===
            'string'
              ? parseFloat(defaultVal)
              : defaultVal;
        }
      }
    );

    if (
      Object.keys(defaults).length > 0
    ) {
      setCustomFields((prev) => ({
        ...defaults,
        ...prev,
      }));
    }
  }, [product]);

  const calculateTotalPrice = () => {
    if (
      product.donation &&
      donationAmount
    ) {
      return donationAmount;
    }

    let total = product.price;

    if (product.custom_fields) {
      product.custom_fields.forEach(
        (field) => {
          if (
            !isFieldVisible(field)
          ) {
            return;
          }

          const key =
            field.marker ||
            field.id.toString();

          const value =
            customFields[key];

          if (
            field.type === 'checkbox' &&
            value
          ) {
            total += field.price || 0;
          } else if (
            (
              field.type === 'select' ||
              field.type ===
                'selection' ||
              field.type ===
                'dropdown' ||
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
              total +=
                selectedOption.price ||
                0;
            }
          } else if (
            field.type === 'number' ||
            field.type === 'range'
          ) {
            total +=
              calculateNumberRangeCharge(
                field,
                value
              );
          }
        }
      );
    }

    return total * quantity;
  };

  const calculateThenPrice = () => {
    let total =
      product.old_price ||
      product.price;

    if (product.custom_fields) {
      product.custom_fields.forEach(
        (field) => {
          if (
            !isFieldVisible(field)
          ) {
            return;
          }

          const key =
            field.marker ||
            field.id.toString();

          const value =
            customFields[key];

          if (
            field.type === 'checkbox' &&
            value
          ) {
            total += field.price || 0;
          } else if (
            (
              field.type === 'select' ||
              field.type ===
                'selection' ||
              field.type ===
                'dropdown' ||
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
              total +=
                selectedOption.price ||
                0;
            }
          } else if (
            field.type === 'number' ||
            field.type === 'range'
          ) {
            total +=
              calculateNumberRangeCharge(
                field,
                value
              );
          }
        }
      );
    }

    return total * quantity;
  };

  const handleAddToCart = () => {
    const currentInCart =
      cart.items.find(
        (item) =>
          item.product.id ===
          product.id
      )?.quantity || 0;

    const totalWillBe =
      currentInCart + quantity;

    if (
      typeof product.stock ===
        'number' &&
      product.stock === 0
    ) {
      setError(
        'This product is out of stock'
      );

      setTimeout(
        () => setError(null),
        5000
      );

      return;
    }

    if (
      typeof product.stock ===
        'number' &&
      totalWillBe >
        product.stock
    ) {
      const remaining =
        product.stock -
        currentInCart;

      setError(
        `You already have ${currentInCart} in cart. Only ${remaining} more item${
          remaining !== 1 ? 's' : ''
        } available in stock`
      );

      setTimeout(
        () => setError(null),
        5000
      );

      return;
    }

    if (product.custom_fields) {
      const missingRequired =
        product.custom_fields.some(
          (field) => {
            if (
              !isFieldVisible(
                field
              ) ||
              !field.required
            ) {
              return false;
            }

            const value =
              customFields[
                field.marker ||
                  field.id.toString()
              ];

            if (
              field.type ===
                'number' ||
              field.type ===
                'range'
            ) {
              return (
                value === undefined ||
                value === null
              );
            }

            return !value;
          }
        );

      if (missingRequired) {
        setError(
          'Please fill in all required fields'
        );

        setTimeout(
          () => setError(null),
          5000
        );

        return;
      }
    }

    if (
      product.custom_rules &&
      product.custom_rules.length > 0
    ) {
      const ruleValidations =
        validateCustomRules(
          product.custom_rules,
          customFields,
          product.custom_fields
        );

      if (
        !ruleValidations.every(
          (validation) =>
            validation.isValid
        )
      ) {
        const errorMessage =
          getCustomRulesErrorMessage(
            ruleValidations
          );

        setError(
          errorMessage ||
            'Custom field rules validation failed'
        );

        setTimeout(
          () => setError(null),
          5000
        );

        return;
      }
    }

    if (
      product.server_choice &&
      product.server_options?.length &&
      !serverSelection
    ) {
      setError(
        'Please select a server'
      );

      setTimeout(
        () => setError(null),
        5000
      );

      return;
    }

    if (
      product.donation &&
      (
        !donationAmount ||
        donationAmount <
          (product.min_donation ||
            0)
      )
    ) {
      setError(
        `Donation must be at least £${
          product.min_donation || 0
        }`
      );

      setTimeout(
        () => setError(null),
        5000
      );

      return;
    }

    setError(null);

    const typeToPass =
      product.subscription
        ? subscriptionType
        : undefined;

    cart.addItem(
      product,
      quantity,
      customFields,
      typeToPass
    );

    if (serverSelection) {
      cart.updateServerSelection(
        product.id,
        serverSelection,
        customFields
      );
    }

    if (
      donationAmount &&
      donationAmount > 0
    ) {
      cart.updateDonationAmount(
        product.id,
        donationAmount,
        customFields
      );
    }

    onClose();

    if (
      product.subscription &&
      subscriptionType ===
        'recurring'
    ) {
      router.push('/cart');
    }

    setQuantity(1);
    setCustomFields({});
    setSubscriptionType(
      'recurring'
    );
    setDonationAmount(undefined);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          {/* BACKDROP */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* MODAL */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
              y: 16,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              y: 16,
            }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) =>
                e.stopPropagation()
              }
              className="texture-plate flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-md border border-steel bg-charcoal shadow-2xl"
            >

              {/* HEADER */}

              <div className="border-b border-steel/60">

                <div className="h-[2px] w-full bg-salt-orange" />

                <div className="flex items-start gap-4 p-6">

                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-steel-light bg-void">

                    {(() => {
                      const imageSrc =
                        product.image ||
                        product.gallery?.[0];

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
                          alt={product.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      );
                    })()}

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-salt-orange-bright">
                      #SALT Webshop
                    </p>

                    <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-wide text-white">
                      {product.name}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-baseline gap-2">

                      <p className="font-display text-3xl font-black text-salt-orange-bright">
                        {calculateTotalPrice() >
                        0
                          ? `£${calculateTotalPrice().toFixed(
                              2
                            )}`
                          : 'Free'}
                      </p>

                      {product.subscription &&
                      product.recurring_discount ===
                        false &&
                      product.old_price &&
                      product.old_price >
                        product.price ? (
                        <>
                          <span className="text-xs text-neutral-600">
                            then
                          </span>

                          <span className="text-sm text-neutral-500">
                            £
                            {calculateThenPrice().toFixed(
                              2
                            )}
                          </span>

                          {product.period_num &&
                          product.duration_periodicity ? (
                            <span className="text-xs text-neutral-600">
                              /{' '}
                              {product.period_num >
                              1
                                ? `${product.period_num} `
                                : ''}
                              {
                                product.duration_periodicity
                              }
                              {product.period_num >
                              1
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
                              {product.period_num >
                              1
                                ? `${product.period_num} `
                                : ''}
                              {
                                product.duration_periodicity
                              }
                              {product.period_num >
                              1
                                ? 's'
                                : ''}
                            </span>
                          ) : null}

                          {product.old_price &&
                          product.old_price >
                            product.price &&
                          product.price >
                            0 ? (
                            <span className="text-sm text-neutral-600 line-through">
                              £
                              {(
                                product.old_price *
                                quantity
                              ).toFixed(2)}
                            </span>
                          ) : null}
                        </>
                      )}

                    </div>

                  </div>

                  <button
                    onClick={onClose}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-steel-light bg-void text-neutral-400 transition-colors hover:border-salt-orange/50 hover:text-white"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>

                </div>

              </div>

              {/* CONTENT */}

              <div className="flex-1 space-y-6 overflow-y-auto p-6">

                {/* DONATION */}

                {product.donation ? (
                  <div className="space-y-2">

                    <label className="font-display text-xs font-bold uppercase tracking-wider text-neutral-300">
                      Donation Amount{' '}
                      {product.min_donation
                        ? `(Minimum: £${product.min_donation})`
                        : ''}
                    </label>

                    <input
                      type="number"
                      min={
                        product.min_donation ||
                        0
                      }
                      step="0.01"
                      value={
                        donationAmount ??
                        ''
                      }
                      onChange={(e) =>
                        setDonationAmount(
                          e.target.value
                            ? Number(
                                e.target
                                  .value
                              )
                            : undefined
                        )
                      }
                      placeholder={`Enter donation amount${
                        product.min_donation
                          ? ` (minimum £${product.min_donation})`
                          : ''
                      }`}
                      className="w-full rounded-md border border-steel-light bg-void px-4 py-3 text-sm text-white placeholder:text-neutral-700 transition-colors focus:border-salt-orange"
                    />

                  </div>
                ) : null}

                {/* SERVER */}

                {product.server_choice &&
                product.server_options &&
                product.server_options
                  .length > 0 ? (
                  <div className="space-y-2">

                    <label className="font-display text-xs font-bold uppercase tracking-wider text-neutral-300">
                      Select Server
                    </label>

                    <select
                      value={
                        serverSelection ??
                        ''
                      }
                      onChange={(e) =>
                        setServerSelection(
                          Number(
                            e.target
                              .value
                          )
                        )
                      }
                      className="w-full cursor-pointer rounded-md border border-steel-light bg-void px-4 py-3 text-sm text-white transition-colors focus:border-salt-orange"
                    >
                      <option
                        value=""
                        disabled
                      >
                        Choose a server
                      </option>

                      {product.server_options.map(
                        (server) => (
                          <option
                            key={
                              server.id
                            }
                            value={
                              server.id
                            }
                          >
                            {
                              server.name
                            }
                          </option>
                        )
                      )}
                    </select>

                  </div>
                ) : null}

                {/* CUSTOM FIELDS */}

                {product.custom_fields &&
                product.custom_fields
                  .length > 0 ? (
                  <div className="space-y-4">

                    <div>

                      <p className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-salt-orange-bright">
                        Product Options
                      </p>

                      <h3 className="mt-1 font-display text-xl font-bold uppercase text-white">
                        Customize Your Order
                      </h3>

                    </div>

                    {product.custom_fields
                      .sort(
                        (a, b) =>
                          a.order -
                          b.order
                      )
                      .filter((field) =>
                        isFieldVisible(
                          field
                        )
                      )
                      .map((field) => {
                        const key =
                          field.marker ||
                          field.id.toString();

                        return (
                          <div
                            key={
                              field.id
                            }
                            className="space-y-2"
                          >

                            {field.type !==
                              'number' &&
                            field.type !==
                              'range' ? (
                              <label className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-neutral-300">

                                {
                                  field.name
                                }

                                {field.required ? (
                                  <span className="text-salt-orange-bright">
                                    *
                                  </span>
                                ) : null}

                                {field.instruction ? (
                                  <div className="group relative">

                                    <HelpCircle className="h-4 w-4 cursor-help text-neutral-600 transition-colors hover:text-salt-orange-bright" />

                                    <div className="absolute bottom-full left-0 z-30 mb-2 hidden w-64 group-hover:block">

                                      <div className="rounded-md border border-steel bg-void p-3 text-xs font-normal normal-case tracking-normal text-neutral-400 shadow-xl">
                                        {
                                          field.instruction
                                        }
                                      </div>

                                    </div>

                                  </div>
                                ) : null}

                                {field.price &&
                                field.price >
                                  0 &&
                                field.type !==
                                  'selection' ? (
                                  <span className="text-xs text-salt-orange-bright">
                                    +£
                                    {field.price.toFixed(
                                      2
                                    )}
                                  </span>
                                ) : null}

                              </label>
                            ) : null}

                            {/* CHECKBOX */}

                            {field.type ===
                            'checkbox' ? (
                              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-steel bg-void p-4 transition-colors hover:border-salt-orange/40">

                                <input
                                  type="checkbox"
                                  checked={
                                    customFields[
                                      key
                                    ] ||
                                    false
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    handleCustomFieldChange(
                                      field,
                                      e
                                        .target
                                        .checked
                                    )
                                  }
                                  className="mt-0.5 h-5 w-5 accent-salt-orange"
                                />

                                <div className="flex-1">

                                  <div className="flex items-center justify-between gap-4">

                                    <span className="text-sm font-semibold text-white">
                                      {
                                        field.name
                                      }
                                    </span>

                                    {field.price &&
                                    field.price >
                                      0 ? (
                                      <span className="text-sm font-semibold text-salt-orange-bright">
                                        +£
                                        {field.price.toFixed(
                                          2
                                        )}
                                      </span>
                                    ) : null}

                                  </div>

                                </div>

                              </label>
                            ) : null}

                            {/* TEXT */}

                            {field.type ===
                            'text' ? (
                              <input
                                type="text"
                                value={
                                  customFields[
                                    key
                                  ] ||
                                  ''
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleCustomFieldChange(
                                    field,
                                    e.target
                                      .value
                                  )
                                }
                                placeholder={
                                  field.default_value?.toString() ||
                                  ''
                                }
                                required={
                                  field.required
                                }
                                className="w-full rounded-md border border-steel-light bg-void px-4 py-3 text-sm text-white placeholder:text-neutral-700 transition-colors focus:border-salt-orange"
                              />
                            ) : null}

                            {/* TEXTAREA */}

                            {field.type ===
                            'textarea' ? (
                              <textarea
                                value={
                                  customFields[
                                    key
                                  ] ||
                                  ''
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleCustomFieldChange(
                                    field,
                                    e.target
                                      .value
                                  )
                                }
                                placeholder={
                                  field.default_value?.toString() ||
                                  ''
                                }
                                required={
                                  field.required
                                }
                                rows={4}
                                className="w-full resize-none rounded-md border border-steel-light bg-void px-4 py-3 text-sm text-white placeholder:text-neutral-700 transition-colors focus:border-salt-orange"
                              />
                            ) : null}

                            {/* NUMBER / RANGE */}

                            {field.type ===
                              'number' ||
                            field.type ===
                              'range' ? (
                              <>

                                <div className="mb-2 flex items-center justify-between">

                                  <span className="font-display text-xs font-bold uppercase tracking-wider text-neutral-400">
                                    {
                                      field.name
                                    }
                                  </span>

                                  <span className="font-display text-sm font-bold text-white">
                                    {customFields[
                                      key
                                    ] !==
                                    undefined
                                      ? customFields[
                                          key
                                        ]
                                      : field.default_value ??
                                        field.minimum ??
                                        0}
                                  </span>

                                </div>

                                {field.number_type ===
                                'range' ? (
                                  <>

                                    <input
                                      type="range"
                                      min={
                                        field.minimum ||
                                        0
                                      }
                                      max={
                                        field.maximum ||
                                        100
                                      }
                                      step={
                                        field.step ||
                                        1
                                      }
                                      value={
                                        customFields[
                                          key
                                        ] ??
                                        field.default_value ??
                                        field.minimum ??
                                        0
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        handleCustomFieldChange(
                                          field,
                                          parseFloat(
                                            e
                                              .target
                                              .value
                                          )
                                        )
                                      }
                                      className="w-full accent-salt-orange"
                                    />

                                    <div className="flex justify-between text-xs text-neutral-600">

                                      <span>
                                        {field.minimum ||
                                          0}
                                      </span>

                                      <span>
                                        {field.maximum ||
                                          100}
                                      </span>

                                    </div>

                                  </>
                                ) : (
                                  <input
                                    type="number"
                                    min={
                                      field.minimum
                                    }
                                    max={
                                      field.maximum
                                    }
                                    step={
                                      field.step ||
                                      1
                                    }
                                    value={
                                      customFields[
                                        key
                                      ] ??
                                      ''
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      handleCustomFieldChange(
                                        field,
                                        parseFloat(
                                          e
                                            .target
                                            .value
                                        )
                                      )
                                    }
                                    placeholder={
                                      field.default_value?.toString() ||
                                      ''
                                    }
                                    required={
                                      field.required
                                    }
                                    className="w-full rounded-md border border-steel-light bg-void px-4 py-3 text-sm text-white transition-colors focus:border-salt-orange"
                                  />
                                )}

                              </>
                            ) : null}

                            {/* SELECT */}

                            {(
                              field.type ===
                                'select' ||
                              field.type ===
                                'selection' ||
                              field.type ===
                                'dropdown' ||
                              field.type ===
                                'choice'
                            ) &&
                            field.options &&
                            field.options
                              .length >
                              0 ? (
                              <select
                                value={
                                  customFields[
                                    key
                                  ] ||
                                  ''
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleCustomFieldChange(
                                    field,
                                    e.target
                                      .value
                                  )
                                }
                                required={
                                  field.required
                                }
                                className="w-full cursor-pointer rounded-md border border-steel-light bg-void px-4 py-3 text-sm text-white transition-colors focus:border-salt-orange"
                              >
                                <option
                                  value=""
                                  disabled
                                >
                                  Choose your{' '}
                                  {field.name.toLowerCase()}
                                </option>

                                {field.options
                                  .sort(
                                    (
                                      a,
                                      b
                                    ) =>
                                      a.order -
                                      b.order
                                  )
                                  .map(
                                    (
                                      option
                                    ) => (
                                      <option
                                        key={
                                          option.id
                                        }
                                        value={option.id.toString()}
                                      >
                                        {
                                          option.name
                                        }
                                        {option.price !==
                                          undefined &&
                                        option.price !==
                                          null &&
                                        option.price >
                                          0
                                          ? ` (+£${option.price.toFixed(
                                              2
                                            )})`
                                          : ''}
                                      </option>
                                    )
                                  )}
                              </select>
                            ) : null}

                          </div>
                        );
                      })}

                  </div>
                ) : null}

                {/* RULES */}

                {product.custom_rules &&
                product.custom_rules
                  .length > 0 ? (
                  <div className="space-y-3">

                    <h3 className="font-display text-lg font-bold uppercase text-white">
                      Field Limits
                    </h3>

                    {validateCustomRules(
                      product.custom_rules,
                      customFields,
                      product.custom_fields
                    ).map(
                      (validation) => {
                        const {
                          rule,
                          total,
                          isValid,
                        } =
                          validation;

                        return (
                          <div
                            key={
                              rule.id
                            }
                            className={`rounded-md border p-4 ${
                              isValid
                                ? 'border-emerald-500/30 bg-emerald-500/10'
                                : 'border-red-500/30 bg-red-500/10'
                            }`}
                          >
                            <p
                              className={`text-sm font-semibold ${
                                isValid
                                  ? 'text-emerald-400'
                                  : 'text-red-400'
                              }`}
                            >
                              Total{' '}
                              {
                                rule.name
                              }
                              :{' '}
                              <span className="font-bold">
                                {
                                  total
                                }
                              </span>
                            </p>

                            {rule.min !==
                              undefined ||
                            rule.max !==
                              undefined ? (
                              <p className="mt-1 text-xs text-neutral-500">
                                {rule.min !==
                                  undefined &&
                                rule.max !==
                                  undefined
                                  ? `Between ${rule.min} and ${rule.max}`
                                  : rule.min !==
                                    undefined
                                    ? `Minimum: ${rule.min}`
                                    : `Maximum: ${rule.max}`}
                              </p>
                            ) : null}

                          </div>
                        );
                      }
                    )}

                  </div>
                ) : null}

                {/* SUBSCRIPTION TYPE */}

                {canChooseOnetimeSubscription ? (
                  <div className="space-y-3">

                    <label className="font-display text-xs font-bold uppercase tracking-wider text-neutral-300">
                      Subscription Type
                    </label>

                    <div className="grid grid-cols-2 gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          setSubscriptionType(
                            'onetime'
                          )
                        }
                        className={`rounded-md border px-4 py-3 font-display text-xs font-bold uppercase tracking-wider transition-colors ${
                          subscriptionType ===
                          'onetime'
                            ? 'border-salt-orange bg-salt-orange/10 text-salt-orange-bright'
                            : 'border-steel bg-void text-neutral-400 hover:border-salt-orange/40'
                        }`}
                      >
                        One-Time
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setSubscriptionType(
                            'recurring'
                          )
                        }
                        className={`rounded-md border px-4 py-3 font-display text-xs font-bold uppercase tracking-wider transition-colors ${
                          subscriptionType ===
                          'recurring'
                            ? 'border-salt-orange bg-salt-orange/10 text-salt-orange-bright'
                            : 'border-steel bg-void text-neutral-400 hover:border-salt-orange/40'
                        }`}
                      >
                        Subscribe
                      </button>

                    </div>

                    {product.period_num &&
                    product.duration_periodicity ? (
                      <p className="text-xs text-neutral-500">
                        {subscriptionType ===
                        'onetime'
                          ? `One-time purchase with interval: ${
                              product.period_num >
                              1
                                ? `${product.period_num} `
                                : ''
                            }${product.duration_periodicity}${
                              product.period_num >
                              1
                                ? 's'
                                : ''
                            }`
                          : `Renews every ${
                              product.period_num >
                              1
                                ? `${product.period_num} `
                                : ''
                            }${product.duration_periodicity}${
                              product.period_num >
                              1
                                ? 's'
                                : ''
                            }`}
                      </p>
                    ) : null}

                  </div>
                ) : null}

                {/* QUANTITY */}

                {product.quantity ? (
                  <div className="space-y-2">

                    <label className="font-display text-xs font-bold uppercase tracking-wider text-neutral-300">
                      Quantity
                    </label>

                    <div className="flex items-center gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(
                            Math.max(
                              1,
                              quantity -
                                1
                            )
                          )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-md border border-steel-light bg-void text-white transition-colors hover:border-salt-orange/50"
                      >
                        -
                      </button>

                      <input
                        type="number"
                        value={
                          quantity
                        }
                        onChange={(
                          e
                        ) => {
                          const newQuantity =
                            parseInt(
                              e.target
                                .value
                            ) || 1;

                          const maxQuantity =
                            typeof product.stock ===
                            'number'
                              ? product.stock
                              : newQuantity;

                          setQuantity(
                            Math.max(
                              1,
                              Math.min(
                                newQuantity,
                                maxQuantity
                              )
                            )
                          );
                        }}
                        min={1}
                        max={
                          typeof product.stock ===
                          'number'
                            ? product.stock
                            : undefined
                        }
                        className="h-10 w-20 rounded-md border border-steel-light bg-void text-center font-display font-bold text-white"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const maxQuantity =
                            typeof product.stock ===
                            'number'
                              ? product.stock
                              : quantity +
                                1;

                          setQuantity(
                            Math.min(
                              quantity +
                                1,
                              maxQuantity
                            )
                          );
                        }}
                        disabled={
                          typeof product.stock ===
                            'number' &&
                          quantity >=
                            product.stock
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-md border border-steel-light bg-void text-white transition-colors hover:border-salt-orange/50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>

                    </div>

                    {typeof product.stock ===
                    'number' ? (
                      <p className="text-xs text-neutral-600">
                        Max available:{' '}
                        {
                          product.stock
                        }
                      </p>
                    ) : null}

                  </div>
                ) : null}

              </div>

              {/* FOOTER */}

              <div className="space-y-3 border-t border-steel/60 bg-void/40 p-6">

                {error ? (
                  <div className="flex items-start gap-3 rounded-md border border-red-500/30 bg-red-500/10 p-3">

                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

                    <p className="text-sm font-medium text-red-400">
                      {error}
                    </p>

                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={
                    handleAddToCart
                  }
                  className="salt-button w-full py-4"
                >
                  {product.subscription &&
                  subscriptionType ===
                    'recurring' ? (
                    <ArrowRight className="h-4 w-4" />
                  ) : (
                    <ShoppingCart className="h-4 w-4" />
                  )}

                  {product.subscription &&
                  subscriptionType ===
                    'recurring'
                    ? 'Subscribe Now'
                    : 'Add To Cart'}

                  {' — '}

                  {calculateTotalPrice() >
                  0
                    ? `£${calculateTotalPrice().toFixed(
                        2
                      )}`
                    : 'Free'}

                  {product.subscription &&
                  subscriptionType ===
                    'recurring' &&
                  product.period_num &&
                  product.duration_periodicity ? (
                    <span>
                      /{' '}
                      {product.period_num >
                      1
                        ? `${product.period_num} `
                        : ''}
                      {
                        product.duration_periodicity
                      }
                      {product.period_num >
                      1
                        ? 's'
                        : ''}
                    </span>
                  ) : null}

                </button>

              </div>

            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}