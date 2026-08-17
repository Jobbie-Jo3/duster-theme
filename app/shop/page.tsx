'use client';

import { useProducts, useCategories } from '@/hooks/use-api';
import { useCart } from '@/hooks/use-cart';
import { ProductCard } from '@/components/product/product-card';
import {
  Package,
  Filter,
  AlertCircle,
  RefreshCcw,
  Loader2,
  Search,
  X,
} from 'lucide-react';
import Image from 'next/image';
import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import type { Category } from '@/lib/schemas';

export default function ShopPage() {
  const cart = useCart();

  const [selectedCategory, setSelectedCategory] =
    useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [allProducts, setAllProducts] = useState<any[]>([]);

  const [hasMore, setHasMore] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');

  const observerTarget = useRef<HTMLDivElement>(null);

  const processedDataRef = useRef<{
    page: number;
    category: number | null;
    ids: string;
  }>({
    page: 0,
    category: null,
    ids: '',
  });

  useEffect(() => {
    cart.clearIfExpired();
  }, []);

  const {
    data: categories,
    error: categoriesError,
  } = useCategories();

  const {
    data: products,
    isLoading,
    error: productsError,
    refetch,
  } = useProducts({
    page: currentPage,
    maxPage: 50,
    onlyEnabled: true,
    category: selectedCategory ?? undefined,
  });

  const selectedCategoryData =
    categories?.categories.find(
      (category) => category.id === selectedCategory
    );

  const categoriesByParent =
    categories?.categories.reduce(
      (acc, category) => {
        const parentId = category.parent_id ?? 0;

        if (!acc[parentId]) {
          acc[parentId] = [];
        }

        acc[parentId].push(category);

        return acc;
      },
      {} as Record<
        number,
        typeof categories.categories
      >
    );

  useEffect(() => {
    setCurrentPage(1);
    setAllProducts([]);
    setHasMore(true);

    processedDataRef.current = {
      page: 0,
      category: selectedCategory,
      ids: '',
    };
  }, [selectedCategory]);

  const renderCategoryButton = (
    category: Category
  ) => {
    const isSelected =
      selectedCategory === category.id;

    return (
      <button
        key={category.id}
        onClick={() =>
          setSelectedCategory(category.id)
        }
        className={`group flex items-center gap-3 rounded-md border px-3 py-2.5 transition-all ${
          isSelected
            ? 'border-salt-orange bg-salt-orange text-black'
            : 'border-steel bg-charcoal text-neutral-300 hover:border-salt-orange/50 hover:bg-charcoal-light'
        }`}
      >
        <div
          className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-sm border ${
            isSelected
              ? 'border-black/20 bg-black/10'
              : 'border-steel-light bg-void'
          }`}
        >
          {category.image ? (
            <Image
              src={category.image}
              alt={`${category.name} cover`}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className={`absolute inset-0 flex items-center justify-center ${
                isSelected
                  ? 'text-black/70'
                  : 'text-neutral-600'
              }`}
            >
              <Package className="h-4 w-4" />
            </div>
          )}
        </div>

        <span className="font-display text-xs font-bold uppercase tracking-wider">
          {category.name}
        </span>
      </button>
    );
  };

  useEffect(() => {
    if (
      isLoading ||
      productsError ||
      !products?.products
    ) {
      return;
    }

    if (products.products.length === 0) {
      setHasMore(false);
      return;
    }

    const dataIds = products.products
      .map((product) => product.id)
      .join(',');

    const dataSignature = {
      page: currentPage,
      category: selectedCategory,
      ids: dataIds,
    };

    if (
      processedDataRef.current.page ===
        dataSignature.page &&
      processedDataRef.current.category ===
        dataSignature.category &&
      processedDataRef.current.ids ===
        dataSignature.ids
    ) {
      return;
    }

    processedDataRef.current = dataSignature;

    setAllProducts((previous) => {
      if (currentPage === 1) {
        return products.products;
      }

      const existingIds = new Set(
        previous.map((product) => product.id)
      );

      const newProducts =
        products.products.filter(
          (product) =>
            !existingIds.has(product.id)
        );

      if (newProducts.length === 0) {
        return previous;
      }

      return [...previous, ...newProducts];
    });

    setHasMore(
      products.products.length === 50
    );
  }, [
    isLoading,
    productsError,
    products?.products,
    currentPage,
    selectedCategory,
  ]);

  const handleLoadMore = useCallback(() => {
    if (
      !isLoading &&
      !productsError &&
      hasMore
    ) {
      setCurrentPage(
        (previous) => previous + 1
      );
    }
  }, [
    isLoading,
    productsError,
    hasMore,
  ]);

  useEffect(() => {
    if (
      allProducts.length === 0 ||
      !hasMore ||
      isLoading
    ) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            !isLoading &&
            hasMore
          ) {
            handleLoadMore();
          }
        },
        {
          threshold: 0.1,
          rootMargin: '200px',
        }
      );

    const currentTarget =
      observerTarget.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(
          currentTarget
        );
      }
    };
  }, [
    allProducts.length,
    isLoading,
    hasMore,
    handleLoadMore,
  ]);

  const filteredProducts =
    allProducts.filter((product) => {
      const query =
        searchQuery.toLowerCase();

      return (
        product.name
          .toLowerCase()
          .includes(query) ||
        (product.description &&
          product.description
            .toLowerCase()
            .includes(query))
      );
    });

  return (
    <div className="min-h-screen">

      {/* PAGE HEADER */}

      <section className="texture-plate relative overflow-hidden border-b border-steel/60">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-salt-orange/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-6 py-16 sm:py-20">
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-salt-orange-bright">
            #SALT Webshop
          </p>

          <h1 className="mt-2 font-display text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
            Browse Products
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
            Browse VIP, points, loot boxes and
            server extras for the #SALT
            NO-WIPE cluster.
          </p>
        </div>
      </section>

      {/* SHOP */}

      <section className="mx-auto max-w-[1600px] px-6 py-12 sm:py-16">

        {/* CATEGORY ERROR */}

        {categoriesError ? (
          <div className="mb-6 flex items-center gap-3 rounded-md border border-red-500/30 bg-red-950/20 p-4 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />

            <span>
              Could not load categories.
              Showing all products.
            </span>
          </div>
        ) : null}

        {/* SEARCH */}

        <div className="mb-10">
          <div className="mb-4">
            <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-salt-orange-bright">
              Find Products
            </p>

            <h2 className="mt-1 font-display text-2xl font-bold uppercase text-white">
              Search Webshop
            </h2>
          </div>

          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />

            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              className="w-full rounded-md border border-steel bg-charcoal py-3.5 pl-11 pr-12 text-sm text-white placeholder:text-neutral-600 transition-colors focus:border-salt-orange/70"
            />

            {searchQuery ? (
              <button
                type="button"
                onClick={() =>
                  setSearchQuery('')
                }
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-sm text-neutral-500 transition-colors hover:bg-steel hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        {/* CATEGORIES */}

        {categories &&
        categories.categories.length > 0 ? (
          <div className="mb-12">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-salt-orange/30 bg-salt-orange/10 text-salt-orange-bright">
                <Filter className="h-4 w-4" />
              </div>

              <div>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-salt-orange-bright">
                  Filter Products
                </p>

                <h2 className="font-display text-xl font-bold uppercase text-white">
                  Categories
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">

              {/* ALL PRODUCTS */}

              <button
                onClick={() =>
                  setSelectedCategory(null)
                }
                className={`group flex items-center gap-3 rounded-md border px-3 py-2.5 transition-all ${
                  selectedCategory === null
                    ? 'border-salt-orange bg-salt-orange text-black'
                    : 'border-steel bg-charcoal text-neutral-300 hover:border-salt-orange/50 hover:bg-charcoal-light'
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-sm border ${
                    selectedCategory === null
                      ? 'border-black/20 bg-black/10'
                      : 'border-steel-light bg-void text-neutral-600'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                </div>

                <span className="font-display text-xs font-bold uppercase tracking-wider">
                  All Products
                </span>
              </button>

              {(() => {
                const hasSubcategories =
                  selectedCategory !== null &&
                  selectedCategoryData &&
                  categoriesByParent?.[
                    selectedCategory
                  ] &&
                  categoriesByParent[
                    selectedCategory
                  ]!.length > 0;

                const isSubcategory =
                  selectedCategoryData?.parent_id &&
                  selectedCategoryData.parent_id !==
                    0;

                const parentId =
                  isSubcategory
                    ? selectedCategoryData.parent_id
                    : null;

                if (
                  hasSubcategories &&
                  selectedCategory !== null
                ) {
                  return categoriesByParent![
                    selectedCategory
                  ]!
                    .filter(
                      (category) =>
                        !category.hide
                    )
                    .map(
                      renderCategoryButton
                    );
                }

                if (
                  isSubcategory &&
                  parentId &&
                  categoriesByParent?.[
                    parentId
                  ]
                ) {
                  return categoriesByParent[
                    parentId
                  ]!
                    .filter(
                      (category) =>
                        !category.hide
                    )
                    .map(
                      renderCategoryButton
                    );
                }

                return categoriesByParent?.[
                  0
                ]
                  ?.filter(
                    (category) =>
                      !category.hide
                  )
                  .map(
                    renderCategoryButton
                  );
              })()}

            </div>
          </div>
        ) : null}

        {/* DIVIDER / RESULT HEADER */}

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-t border-steel/60 pt-8">

          <div>
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-salt-orange-bright">
              Official Store
            </p>

            <h2 className="mt-1 font-display text-2xl font-bold uppercase text-white">
              {selectedCategoryData
                ? selectedCategoryData.name
                : 'All Products'}
            </h2>
          </div>

          {!isLoading &&
          !productsError &&
          filteredProducts.length > 0 ? (
            <div className="rounded-sm border border-steel bg-charcoal px-3 py-2 font-display text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              {filteredProducts.length}{' '}
              Product
              {filteredProducts.length !== 1
                ? 's'
                : ''}
            </div>
          ) : null}

        </div>

        {/* PRODUCTS */}

        {isLoading &&
        allProducts.length === 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map(
              (_, index) => (
                <div
                  key={index}
                  className="h-96 animate-pulse rounded-md border border-steel bg-charcoal"
                />
              )
            )}
          </div>
        ) : productsError ? (
          <div className="texture-plate rounded-md border border-red-500/30 bg-red-950/10 p-8">

            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="h-5 w-5" />

              <p className="font-display font-bold uppercase">
                Could Not Load Products
              </p>
            </div>

            <p className="mt-3 text-sm text-neutral-500">
              There was a problem loading
              products from the store.
            </p>

            <button
              onClick={() => refetch()}
              className="salt-button-outline mt-5"
            >
              <RefreshCcw className="h-4 w-4" />
              Retry
            </button>

          </div>
        ) : filteredProducts.length >
          0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    hideFeaturedBadge
                  />
                )
              )}
            </div>

            {hasMore ? (
              <div
                ref={observerTarget}
                className="flex justify-center py-12"
              >
                <div className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-wider text-neutral-500">
                  <Loader2 className="h-5 w-5 animate-spin text-salt-orange-bright" />
                  Loading More Products
                </div>
              </div>
            ) : null}
          </>
        ) : searchQuery ? (
          <div className="texture-plate rounded-md border border-steel bg-charcoal py-20 text-center">

            <Package className="mx-auto h-12 w-12 text-neutral-700" />

            <h3 className="mt-5 font-display text-xl font-bold uppercase text-white">
              No Products Found
            </h3>

            <p className="mt-2 text-sm text-neutral-500">
              No products matched &quot;
              {searchQuery}&quot;.
            </p>

            <button
              onClick={() =>
                setSearchQuery('')
              }
              className="salt-button-outline mt-6"
            >
              Clear Search
            </button>

          </div>
        ) : (
          <div className="texture-plate rounded-md border border-steel bg-charcoal py-20 text-center">

            <Package className="mx-auto h-12 w-12 text-neutral-700" />

            <h3 className="mt-5 font-display text-xl font-bold uppercase text-white">
              No Products Found
            </h3>

            <p className="mt-2 text-sm text-neutral-500">
              There are currently no
              products in this category.
            </p>

            <button
              onClick={() =>
                setSelectedCategory(null)
              }
              className="salt-button-outline mt-6"
            >
              Show All Products
            </button>

          </div>
        )}

      </section>
    </div>
  );
}