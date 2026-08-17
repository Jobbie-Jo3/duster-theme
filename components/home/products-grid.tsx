'use client';

import { useProducts } from '@/hooks/use-api';
import { ProductCard } from '@/components/product/product-card';
import { ArrowRight, Flame } from 'lucide-react';
import Link from 'next/link';

export function ProductsGrid() {
  const { data: products, isLoading } = useProducts({
    maxPage: 12,
    onlyEnabled: true,
  });

  const featuredProducts =
    products?.products.filter((product) => product.featured) || [];

  const allProducts = products?.products || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="h-[380px] animate-pulse rounded-lg border border-steel/70 bg-charcoal"
          />
        ))}
      </div>
    );
  }

  if (allProducts.length === 0) {
    return (
      <div className="rounded-lg border border-steel/70 bg-charcoal p-12 text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-neutral-500">
          No products are currently available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-14">

      {/* FEATURED PRODUCTS */}

      {featuredProducts.length > 0 ? (
        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">

            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-salt-orange-bright" />

                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-salt-orange-bright">
                  Popular Picks
                </p>
              </div>

              <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">
                Featured
              </h3>
            </div>

            <Link
              href="/shop"
              className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-500 transition-colors hover:text-salt-orange-bright"
            >
              View Full Shop
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                hideFeaturedBadge
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* ALL PRODUCTS */}

      <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-salt-orange-bright">
              #SALT Webshop
            </p>

            <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">
              All Products
            </h3>
          </div>

          <Link
            href="/shop"
            className="flex items-center gap-2 rounded-md border border-steel-light bg-charcoal px-4 py-2.5 text-xs font-black uppercase tracking-wider text-neutral-400 transition-all hover:border-salt-orange/60 hover:text-salt-orange-bright"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              hideFeaturedBadge
            />
          ))}
        </div>
      </section>

    </div>
  );
}