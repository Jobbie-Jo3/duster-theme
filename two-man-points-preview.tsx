"use client";

import { useProducts } from "@/hooks/use-api";
import { useState } from "react";

const isTwoMan = (name: string) => /\(\s*2\s*[- ]?\s*man\s*\)/i.test(name);

export function TwoManPointsPreview({ onSwitch }: { onSwitch: () => void }) {
  const { data, isLoading, error } = useProducts({ page: 1, maxPage: 100, onlyEnabled: false });
  const [search, setSearch] = useState("");
  const packs = (data?.products ?? []).filter((p) => isTwoMan(p.name) && p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="min-h-screen mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-start justify-between gap-5 border-b border-steel pb-8">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-widest text-salt-orange-bright">#SALT NO-WIPE</p>
          <h1 className="mt-3 font-display text-4xl font-black uppercase text-white">2-Man Points Shop</h1>
          <p className="mt-3 text-neutral-400">Preview only — purchasing is disabled until delivery to the 2-Man server is verified.</p>
        </div>
        <button onClick={onSwitch} className="salt-button-outline">Switch Cluster</button>
      </div>
      <div className="mt-8 max-w-md">
        <label htmlFor="two-man-search" className="block text-sm text-neutral-300 mb-2">Search 2-Man packs</label>
        <input id="two-man-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search points packs..." className="w-full rounded-md border border-steel bg-charcoal p-3 text-white" />
      </div>
      {isLoading ? <p className="mt-10 text-neutral-400">Loading Tip4Serv packs...</p> : null}
      {error ? <p className="mt-10 text-red-400">Unable to load Tip4Serv products. Check the API response.</p> : null}
      {!isLoading && !error && packs.length === 0 ? <p className="mt-10 text-neutral-400">No 2-Man packs found in the API results. Confirm their names include (2-man).</p> : null}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {packs.map((p) => (
          <div key={p.id} className="texture-plate rounded-md border border-steel bg-charcoal p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-salt-orange-bright">2-Man Points</p>
            <h2 className="mt-3 text-xl font-bold text-white">{p.name}</h2>
            <p className="mt-5 text-2xl font-bold text-white">£{p.price.toFixed(2)}</p>
            <p className="mt-2 text-xs text-neutral-400">Product ID: {p.id} · {p.status ? "Enabled" : "Disabled in Tip4Serv"}</p>
            <div className="mt-6 rounded-md border border-steel p-3 text-center text-sm font-bold uppercase text-neutral-400">Preview Only — Cannot Purchase</div>
          </div>
        ))}
      </div>
    </main>
  );
}
