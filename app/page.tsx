import { ArrowUpRight, BadgeCheck, Boxes, ChevronRight, CircleDot, Gamepad2, ShieldCheck, ShoppingBag, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { getStoreWhoami } from '@/lib/api-client';
import { ProductsGrid } from '@/components/home/products-grid';

export default async function HomePage() {
  const store = await getStoreWhoami();
  return (
    <div className="min-h-screen">
      <section className="salt-hero relative isolate overflow-hidden">
        <div className="salt-hero-grid" />
        <div className="salt-hero-glow" />
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.15fr_.85fr] lg:px-10 lg:py-32">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#FA4B00]/40 bg-[#FA4B00]/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[.22em] text-[#ff7640]"><span className="h-2 w-2 animate-pulse rounded-full bg-[#FA4B00]" /> Official SALT Store</div>
            <p className="mb-3 font-display text-sm font-bold uppercase tracking-[.38em] text-white/50">ARK: Survival Ascended</p>
            <h1 className="font-display text-7xl font-black uppercase leading-[.82] tracking-[-.055em] text-white sm:text-8xl lg:text-[112px]"><span className="block text-[#FA4B00]">#SALT</span><span className="mt-3 block">SURVIVE.</span><span className="block text-white/55">THRIVE.</span></h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-white/65 sm:text-lg">Gear up, unlock more and support the cluster. Everything you need for your next adventure, all in one place.</p>
            {store?.description ? <div className="mt-4 max-w-xl text-sm leading-7 text-white/50" dangerouslySetInnerHTML={{ __html: store.description }} /> : null}
            <div className="mt-9 flex flex-wrap gap-3"><Link href="/shop" className="salt-button !rounded-full !px-7 !py-4">Explore the shop <ArrowUpRight className="h-4 w-4" /></Link><a href="https://discord.gg/wWKmveZvdk" target="_blank" rel="noopener noreferrer" className="salt-button-outline !rounded-full !px-7 !py-4">Join our Discord</a></div>
            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-[10px] font-bold uppercase tracking-[.18em] text-white/40"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#FA4B00]"/> Secure checkout</span><span className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#FA4B00]"/> Fast delivery</span><span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#FA4B00]"/> Official SALT store</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute inset-8 rounded-full bg-[#FA4B00]/20 blur-[90px]" />
            <div className="salt-hero-emblem relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-[#101010]/80 p-5 shadow-[0_30px_100px_rgba(0,0,0,.55)]">
              <div className="absolute inset-0 opacity-40" style={{backgroundImage:'linear-gradient(135deg,transparent 48%,rgba(250,75,0,.18) 49%,transparent 50%),linear-gradient(45deg,transparent 48%,rgba(255,255,255,.05) 49%,transparent 50%)',backgroundSize:'42px 42px'}} />
              <div className="relative flex h-full flex-col justify-between rounded-[1.4rem] border border-[#FA4B00]/25 p-7 sm:p-10">
                <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-[.3em] text-white/40">Built for players with lives.</span><CircleDot className="h-5 w-5 text-[#FA4B00]"/></div>
                <div className="text-center"><div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-3xl border border-[#FA4B00]/40 bg-[#FA4B00]/10 shadow-[0_0_70px_rgba(250,75,0,.16)] sm:h-36 sm:w-36"><span className="font-display text-7xl font-black tracking-tighter text-[#FA4B00] sm:text-8xl">#</span></div><div className="font-display text-6xl font-black uppercase tracking-[-.06em] text-white sm:text-7xl">SALT</div><p className="mt-3 text-[10px] font-bold uppercase tracking-[.35em] text-[#FA4B00]">No scheduled wipes</p></div>
                <div className="flex items-center justify-between border-t border-white/10 pt-5 text-[9px] font-bold uppercase tracking-[.2em] text-white/35"><span>ARK: Survival Ascended</span><span>Est. for survivors</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-[3px] bg-gradient-to-r from-transparent via-[#FA4B00] to-transparent" />
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5"><div><p className="mb-2 text-[10px] font-black uppercase tracking-[.3em] text-[#FA4B00]">The SALT Supply Drop</p><h2 className="font-display text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">Shop essentials<span className="text-[#FA4B00]">.</span></h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/45">Browse the latest VIP packages, points, loot and server extras.</p></div><Link href="/shop" className="group inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.15em] text-white/65 transition hover:text-[#FA4B00]">View all products <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1"/></Link></div>
        <ProductsGrid />
      </section>

      <section className="border-y border-white/[.07] bg-[#0d0d0d]">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-12 sm:grid-cols-3 lg:px-10">
          {[{icon:Gamepad2,title:'Made for SALT',copy:'Items and perks for your adventures across the cluster.'},{icon:ShoppingBag,title:'Simple checkout',copy:'A straightforward checkout experience, powered by Tip4Serv.'},{icon:Boxes,title:'Delivered in-game',copy:'Follow the purchase instructions and get back to surviving.'}].map(({icon:Icon,title,copy})=><div key={title} className="flex gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#FA4B00]/25 bg-[#FA4B00]/10 text-[#FA4B00]"><Icon className="h-5 w-5"/></div><div><h3 className="font-display text-lg font-bold uppercase text-white">{title}</h3><p className="mt-1 text-sm leading-6 text-white/45">{copy}</p></div></div>)}
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10"><div className="relative overflow-hidden rounded-3xl border border-[#FA4B00]/25 bg-[#111] px-7 py-12 text-center sm:px-12"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,75,0,.15),transparent_60%)]"/><div className="relative"><Sparkles className="mx-auto h-6 w-6 text-[#FA4B00]"/><p className="mt-4 text-[10px] font-black uppercase tracking-[.3em] text-[#FA4B00]">Your next adventure starts here</p><h2 className="mt-3 font-display text-3xl font-black uppercase text-white sm:text-5xl">Ready to drop in?</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/50">Head to the store, find what you need and we’ll see you out there.</p><Link href="/shop" className="salt-button relative mt-7 !rounded-full !px-8 !py-4">Browse the webshop <ArrowUpRight className="h-4 w-4"/></Link></div></div></section>
    </div>
  );
}
