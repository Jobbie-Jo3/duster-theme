import { ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { getStoreWhoami } from '@/lib/api-client';
import { ProductsGrid } from '@/components/home/products-grid';

async function HomePage() {
  const store = await getStoreWhoami();

  return (
    <div className="min-h-screen">

      {/* HERO */}

      <section className="texture-plate relative overflow-hidden border-b border-steel/60">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-salt-orange/10 blur-[120px]" />
          <div className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-salt-orange/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-6 py-24 text-center sm:py-32">

          <div className="mb-6 inline-flex items-center rounded-md border border-salt-orange/40 bg-salt-orange/5 px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-salt-orange-bright">
            Official #SALT Webshop
          </div>

          <h1 className="font-display text-5xl font-extrabold uppercase leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-8xl">
            <span className="text-salt-orange-bright glow-text">
              #SALT
            </span>{' '}
            WEBSHOP
          </h1>

          <p className="mt-4 font-display text-xl font-bold uppercase tracking-[0.2em] text-neutral-300 sm:text-2xl">
            ARK: Survival Ascended
          </p>

          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.3em] text-salt-orange-bright/80 sm:text-base">
            VIP &bull; POINTS &bull; LOOT BOXES &bull; SERVER EXTRAS
          </p>

          {store?.description ? (
            <div
              className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-neutral-400"
              dangerouslySetInnerHTML={{
                __html: store.description,
              }}
            />
          ) : null}

          <div className="mt-10 flex flex-wrap justify-center gap-3">

            <Link
              href="/shop"
              className="salt-button"
            >
              Browse Shop
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="https://salt-webshop.vercel.app"
              className="salt-button-outline"
            >
              View Webshop
            </a>

          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-3">

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <ShieldCheck className="h-4 w-4 text-salt-orange-bright" />
              Official Store
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <ShieldCheck className="h-4 w-4 text-salt-orange-bright" />
              Secure Checkout
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <ShieldCheck className="h-4 w-4 text-salt-orange-bright" />
              Tip4Serv Delivery
            </div>

          </div>
        </div>
      </section>

      {/* PRODUCTS */}

      <section className="mx-auto max-w-[1600px] px-6 py-20">

        <div className="mb-10">

          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-salt-orange-bright">
            #SALT Webshop
          </p>

          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
            Browse Products
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
            Browse VIP, points, loot boxes and other #SALT server extras.
          </p>

        </div>

        <ProductsGrid />

      </section>

      {/* CTA */}

      <section className="border-t border-steel/60 bg-charcoal-light/40 py-20">

        <div className="mx-auto max-w-[1600px] px-6">

          <div className="texture-plate rounded-md border border-steel/70 bg-charcoal p-8 text-center sm:p-12">

            <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-salt-orange-bright">
              Support #SALT
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold uppercase text-white sm:text-4xl">
              Ready To Drop In?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-400">
              Browse the full #SALT webshop and support the cluster while picking up VIP, points and server extras.
            </p>

            <div className="mt-7">
              <Link
                href="/shop"
                className="salt-button"
              >
                View Full Shop
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default HomePage;