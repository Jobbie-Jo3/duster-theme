import {
  ArrowUpRight,
  BadgeCheck,
  ChevronRight,
  Gamepad2,
  ShieldCheck,
  ShoppingBag,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { getStoreWhoami } from '@/lib/api-client';
import { ProductsGrid } from '@/components/home/products-grid';

export default async function HomePage() {
  const store = await getStoreWhoami();

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* CINEMATIC SALT HERO */}
      <section className="relative isolate min-h-[690px] overflow-hidden border-b border-[#FA4B00]/30 sm:min-h-[760px] lg:min-h-[800px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-cover bg-[center_42%] bg-no-repeat"
          style={{ backgroundImage: "url('/salt-hero.webp')" }}
        />
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-r from-black via-black/75 to-black/10" />
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-t from-[#080808] via-black/10 to-black/35" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(rgba(250,75,0,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(250,75,0,.12)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />

        <div className="mx-auto flex min-h-[690px] max-w-[1600px] flex-col justify-end px-6 pb-14 pt-28 sm:min-h-[760px] sm:px-10 sm:pb-20 lg:min-h-[800px] lg:px-16 lg:pb-24">
          <div className="max-w-[720px]">
            <div className="mb-6 inline-flex items-center gap-3 border border-[#FA4B00]/60 bg-black/65 px-4 py-2 text-[10px] font-black uppercase tracking-[.28em] text-[#ff6b2b] shadow-[0_0_35px_rgba(250,75,0,.12)] backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#FA4B00] shadow-[0_0_12px_#FA4B00]" />
              The official SALT supply drop
            </div>

            <p className="mb-3 text-xs font-black uppercase tracking-[.42em] text-white/65 sm:text-sm">
              ARK: Survival Ascended
            </p>
            <h1 className="font-display text-5xl font-black uppercase leading-[.9] tracking-[-.055em] text-white sm:text-7xl lg:text-[88px]">
              Built for players
              <span className="mt-2 block text-[#FA4B00] [text-shadow:0_5px_35px_rgba(250,75,0,.28)]">
                with lives.
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              Gear up, get back in the fight and support the cluster. Your SALT
              store essentials are all in one place.
            </p>
            {store?.description ? (
              <div
                className="mt-3 max-w-xl text-sm leading-7 text-white/65"
                dangerouslySetInnerHTML={{ __html: store.description }}
              />
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="group inline-flex min-h-14 items-center gap-3 bg-[#FA4B00] px-7 py-4 text-xs font-black uppercase tracking-[.16em] text-black shadow-[0_8px_35px_rgba(250,75,0,.24)] transition hover:-translate-y-1 hover:bg-[#ff6a2b]"
              >
                Enter the shop
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
              <a
                href="https://discord.gg/wWKmveZvdk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center gap-3 border border-white/35 bg-black/55 px-7 py-4 text-xs font-black uppercase tracking-[.16em] text-white backdrop-blur transition hover:border-[#FA4B00] hover:text-[#ff6b2b]"
              >
                <Gamepad2 className="h-4 w-4 text-[#FA4B00]" />
                Join the Discord
              </a>
            </div>
          </div>

          <div className="mt-14 grid max-w-[900px] grid-cols-2 gap-px border border-white/15 bg-white/15 backdrop-blur-md sm:grid-cols-4">
            {[
              { label: 'Platform', value: 'Crossplay' },
              { label: 'Maps', value: 'All maps' },
              { label: 'Wipes', value: 'No scheduled wipes' },
              { label: 'Community', value: 'SALT cluster' },
            ].map((item) => (
              <div key={item.label} className="bg-black/75 px-4 py-4 sm:px-5">
                <p className="text-[9px] font-black uppercase tracking-[.24em] text-white/40">{item.label}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[.08em] text-white sm:text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FA4B00] to-transparent" />
        <div className="pointer-events-none absolute right-7 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] lg:block">
          <span className="text-[9px] font-black uppercase tracking-[.5em] text-white/40">Survive // Thrive // SALT</span>
        </div>
      </section>

      {/* STORE PRODUCTS */}
      <section className="relative mx-auto max-w-[1500px] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[.34em] text-[#FA4B00]">The SALT supply drop</p>
            <h2 className="font-display text-4xl font-black uppercase leading-none tracking-[-.04em] text-white sm:text-6xl">
              Gear up<span className="text-[#FA4B00]">.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/50">
              Browse available packages, points and in-game extras.
            </p>
          </div>
          <Link href="/shop" className="group inline-flex items-center gap-3 border-b border-[#FA4B00]/50 pb-2 text-[10px] font-black uppercase tracking-[.2em] text-white/75 transition hover:text-[#FA4B00]">
            View all products <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
        <ProductsGrid />
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-white/10 bg-[#101010]">
        <div className="mx-auto grid max-w-[1500px] gap-7 px-6 py-10 sm:grid-cols-3 sm:px-10 lg:px-16">
          {[
            { icon: ShieldCheck, title: 'Secure checkout', copy: 'Checkout handled through the TIP4Serv store.' },
            { icon: Zap, title: 'Back in the action', copy: 'Clear purchase instructions to get you back in-game.' },
            { icon: BadgeCheck, title: 'Official SALT store', copy: 'The official place for SALT cluster extras.' },
          ].map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#FA4B00]/35 bg-[#FA4B00]/10 text-[#FA4B00]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-sm font-black uppercase tracking-[.12em] text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/45">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="relative overflow-hidden border border-[#FA4B00]/30 bg-[#101010] px-7 py-12 sm:px-14 sm:py-16">
          <div aria-hidden="true" className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(135deg,transparent_0,transparent_18px,rgba(250,75,0,.18)_19px,transparent_20px)]" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.34em] text-[#FA4B00]">Your next run starts here</p>
              <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-[-.04em] text-white sm:text-5xl">See you out there.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/50">Get what you need, get back to the island and make it count.</p>
            </div>
            <Link href="/shop" className="salt-button !rounded-none !px-8 !py-4">
              Browse the store <ShoppingBag className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
