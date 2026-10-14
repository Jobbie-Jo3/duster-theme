"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Package, ShieldAlert, ArrowLeft, Zap } from "lucide-react";
import { useProducts } from "@/hooks/use-api";
import type { ProductGeneral } from "@/lib/schemas";

const isFourMan = (name: string) => /\(\s*4\s*[- ]?\s*man\s*\)/i.test(name);
const cleanName = (name: string) => name.replace(/\s*\(\s*4\s*[- ]?\s*man\s*\)/ig, "").trim();

type Tab = "all" | "points" | "vip" | "loot" | "other";
function productGroup(product: ProductGeneral): Exclude<Tab, "all"> {
  // Tip4Serv product.category is a numeric ID, confirmed against the live API:
  // 1 = Points, 2 = VIP, 3 = Loot Boxes.
  const id = Number(product.category);
  if (id === 1) return "points";
  if (id === 2) return "vip";
  if (id === 3) return "loot";

  // For future categories, support readable names and Unicode-styled product titles.
  const name = product.name.normalize("NFKC").toLowerCase();
  if (/\bvip\b|membership|subscription/.test(name)) return "vip";
  if (/loot\s*box|lootbox|loot\s*crate/.test(name)) return "loot";
  if (/\bpoints?\b|credits?/.test(name)) return "points";
  return "other";
}

function PreviewCard({ product }: { product: ProductGeneral }) {
  return (
    <article className="texture-plate flex h-full flex-col overflow-hidden rounded-md border border-steel bg-charcoal">
      <div className="h-[2px] bg-salt-orange/70" />
      <div className="relative h-52 overflow-hidden border-b border-steel/60 bg-void">
        <div className="absolute inset-0 texture-plate opacity-50" />
        {product.image ? (
          <Image src={product.image} alt={product.name} fill unoptimized className="object-contain p-5" />
        ) : (
          <div className="relative flex h-full items-center justify-center"><Zap className="h-14 w-14 text-salt-orange/30" /></div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-[9px] font-bold uppercase tracking-[0.22em] text-salt-orange-bright">#SALT 4-Man</p>
        <h3 className="mt-2 min-h-[46px] font-display text-lg font-bold uppercase leading-tight text-white">{cleanName(product.name)}</h3>
        <div className="mt-3 min-h-[42px] text-sm text-neutral-500">{product.small_description?.replace(/<[^>]*>/g, "").slice(0, 140) || "For the #SALT 4-Man cluster"}</div>
        <div className="mt-auto pt-5">
          <div className="mb-4 h-px bg-steel/60" />
          <p className="font-display text-[9px] font-bold uppercase tracking-widest text-neutral-500">Price</p>
          <p className="mt-1 font-display text-2xl font-black text-salt-orange-bright">{product.price > 0 ? `£${product.price.toFixed(2)}` : "Free"}</p>
          <div className="mt-4 rounded-sm border border-steel bg-void px-3 py-3 text-center font-display text-xs font-bold uppercase tracking-wider text-neutral-400">Preview Only — Purchases Disabled</div>
        </div>
      </div>
    </article>
  );
}

export default function FourManShopPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const { data, isLoading, error, refetch } = useProducts({ page: 1, maxPage: 100, onlyEnabled: false });
  const all = useMemo(() => (data?.products ?? []).filter((p) => isFourMan(p.name)), [data]);
  const filtered = all.filter((p) => (tab === "all" || productGroup(p) === tab) && cleanName(p.name).toLowerCase().includes(search.toLowerCase()));
  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "All Products" }, { id: "points", label: "Points" },
    { id: "vip", label: "VIP" }, { id: "loot", label: "Loot Boxes" }, { id: "other", label: "Other" },
  ];
  return (
    <main className="min-h-screen">
      <section className="texture-plate relative overflow-hidden border-b border-steel/60">
        <div className="relative mx-auto max-w-[1600px] px-6 py-16 sm:py-20">
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-salt-orange-bright">#SALT Webshop</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">4-Man Shop</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">Points, VIP and loot boxes for the #SALT 4-Man cluster.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" onClick={() => localStorage.removeItem("salt-selected-cluster-v1")} className="salt-button-outline inline-flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Switch Cluster</Link>
            <span className="inline-flex items-center gap-2 rounded-sm border border-steel bg-charcoal px-4 py-2 text-xs font-bold uppercase text-neutral-300"><ShieldAlert className="h-4 w-4 text-salt-orange-bright" /> Testing — Checkout Disabled</span>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1600px] px-6 py-12 sm:py-16">
        <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-salt-orange-bright">Find Products</p>
        <h2 className="mt-1 font-display text-2xl font-bold uppercase text-white">Search Webshop</h2>
        <div className="relative mt-5 max-w-3xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search 4-Man products..." className="w-full rounded-md border border-steel bg-charcoal py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-neutral-600 focus:border-salt-orange/70" />
        </div>
        <div className="mt-9 flex flex-wrap gap-3 border-b border-steel/60 pb-7">
          {tabs.map((item) => <button key={item.id} onClick={() => setTab(item.id)} className={`rounded-md border px-4 py-3 font-display text-xs font-bold uppercase tracking-wider ${tab === item.id ? "border-salt-orange bg-salt-orange text-black" : "border-steel bg-charcoal text-neutral-300 hover:border-salt-orange/50"}`}>{item.label}</button>)}
        </div>
        <div className="mb-6 mt-8 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold uppercase text-white">{tabs.find((item) => item.id === tab)?.label}</h2>
          {!isLoading && !error && <span className="text-xs uppercase text-neutral-500">{filtered.length} Products</span>}
        </div>
        {(isLoading) && <p className="py-12 text-neutral-400">Loading 4-Man products...</p>}
        {error && <div className="rounded-md border border-red-500/30 bg-red-950/10 p-6 text-red-400">Could not load products. <button onClick={() => refetch()} className="underline">Retry</button></div>}
        {!isLoading && !error && filtered.length === 0 && <div className="texture-plate rounded-md border border-steel bg-charcoal py-20 text-center"><Package className="mx-auto h-12 w-12 text-neutral-600" /><p className="mt-5 text-neutral-400">No 4-Man products found in this category yet.</p></div>}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((product) => <PreviewCard key={product.id} product={product} />)}</div>
      </section>
    </main>
  );
}
