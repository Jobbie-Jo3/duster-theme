import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { getStoreWhoami } from '@/lib/api-client';
import { ProductsGrid } from '@/components/home/products-grid';

async function HomePage() {
  const store = await getStoreWhoami();

  return (
    <div className="min-h-screen">

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="texture-plate relative overflow-hidden border-b border-steel/60">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-salt-orange/10 blur-[120px]" />
          <div className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-salt-orange/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-6 py-24 text-center sm:py-32">

          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-salt-orange/30 bg-salt-orange/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-salt-orange-bright">
            <Sparkles className="h-4 w-4" />
            Official #SALT Webshop
          </div>

          <h1 className="font-black uppercase leading-[1.05] tracking-tight text-white">
            <span className="block text-5xl sm:text-7xl lg:text-8xl">
              <span className="text-salt-orange-bright glow-text">
                #SALT
              </span>{' '}
              WEBSHOP
            </span>

            <span className="mt-4 block text-xl font-bold tracking-[0.22em] text-neutral-300 sm:text-2xl">
              ARK: SURVIVAL ASCENDED
            </span>
          </h1>

          <div
            className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-neutral-400 sm:text-base"
            dangerouslySetInnerHTML={{
              __html:
                store?.description ||
                'Support #SALT and browse VIP, points, loot boxes and other server extras.',
            }}
          />

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="salt-button min-w-[180px]"
            >
              Browse Shop
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="https://saltark.tip4serv.com/"
              className="salt-button-outline min-w-[180px]"
            >
              Main #SALT Website
            </a>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-salt-orange-bright" />
              Official #SALT Store
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-salt-orange-bright" />
              Secure Checkout
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-salt-orange-bright" />
              Instant Server Support
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PRODUCTS */}
      {/* ========================================================= */}

      <section className="mx-auto max-w-[1600px] px-6 py-16">

        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-salt-orange-bright">
            #SALT Store
          </p>

          <h2 className="mt-2 font-black uppercase tracking-tight text-white text-3xl sm:text-4xl">
            Featured Products
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
            Browse popular #SALT products, VIP options, points and server extras.
          </p>
        </div>

        <ProductsGrid />
      </section>

      {/* ========================================================= */}
      {/* CTA */}
      {/* ========================================================= */}

      <section className="border-t border-steel/60 bg-charcoal-light/30 py-16">
        <div className="mx-auto max-w-[1200px] px-6">

          <div className="relative overflow-hidden rounded-lg border border-salt-orange/25 bg-charcoal p-8 text-center sm:p-12">

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-salt-orange/10 blur-[100px]" />

            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-salt-orange-bright">
                #SALT Webshop
              </p>

              <h2 className="mt-3 font-black uppercase text-white text-3xl sm:text-4xl">
                Ready To Browse?
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-400">
                Browse the full #SALT store and find VIP, points, loot boxes and other server extras.
              </p>

              <Link
                href="/shop"
                className="salt-button mt-7 min-w-[180px]"
              >
                Explore Shop
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