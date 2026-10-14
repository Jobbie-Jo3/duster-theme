
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Users } from "lucide-react";
import { useProducts } from "@/hooks/use-api";

const STORAGE_KEY = "salt-selected-cluster-v1";

const clusters = [
  { id: "2man", name: "2-MAN", subtitle: "Duos Cluster", active: false },
  { id: "4man", name: "4-MAN", subtitle: "Four Player Cluster", active: false },
  { id: "6man", name: "6-MAN", subtitle: "Original #SALT Cluster", active: true },
];

export default function HomePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && clusters.some((c) => c.id === saved)) {
      setSelected(saved);
    }
    setLoaded(true);
  }, []);

  function chooseCluster(id: string) {
    localStorage.setItem(STORAGE_KEY, id);
    setSelected(id);

    }

  function switchCluster() {
    localStorage.removeItem(STORAGE_KEY);
    setSelected(null);
  }

  if (!loaded) {
    return <main className="min-h-screen" />;
  }

  if (selected === "6man") {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-3xl font-bold text-white">
        6-Man Cluster Selected
      </h1>

      <p className="text-neutral-400">
        Your selected cluster is the original #SALT 6-Man shop.
      </p>

      <button
        onClick={() => router.push("/shop")}
        className="salt-button"
      >
        Enter 6-Man Shop
      </button>

      <button
        onClick={switchCluster}
        className="text-salt-orange-bright underline"
      >
        Switch Cluster
      </button>
    </main>
  );
}

  if (selected === "2man") {
    return <TwoManPointsPreview onSwitch={switchCluster} />;
  }

  if (selected && selected !== "6man") {
    return (
      <main className="min-h-screen px-6 py-24 text-center">
        <p className="text-salt-orange-bright font-bold">#SALT WEBSHOP</p>
        <h1 className="mt-4 text-5xl font-black text-white">
          {selected === "2man" ? "2-MAN" : "4-MAN"} SHOP
        </h1>
        <p className="mt-6 text-neutral-400">
          This cluster's products and checkout are being configured.
          Purchases are not available yet.
        </p>
        <button onClick={switchCluster} className="salt-button mt-10">
          Switch Cluster
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-salt-orange-bright">
            #SALT NO-WIPE
          </p>

          <h1 className="mt-4 font-display text-4xl font-black uppercase text-white sm:text-6xl">
            Choose Your Cluster
          </h1>

          <p className="mt-5 text-neutral-400">
            Select the ARK: Survival Ascended cluster you want to shop for.
            Your choice will be remembered.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {clusters.map((cluster) => (
            <div
              key={cluster.id}
              className="flex flex-col rounded-lg border border-steel bg-charcoal p-8"
            >
              <Users className="mb-7 h-10 w-10 text-salt-orange-bright" />

              <h2 className="font-display text-4xl font-black text-white">
                {cluster.name}
              </h2>

              <p className="mt-3 flex-1 text-neutral-400">
                {cluster.subtitle}
              </p>

              <button
                onClick={() => chooseCluster(cluster.id)}
                className="salt-button mt-8 flex items-center justify-center gap-2"
              >
                {cluster.active ? "Enter Shop" : "View Cluster"}
                <ArrowRight className="h-4 w-4" />
              </button>

              {!cluster.active && (
                <p className="mt-4 text-center text-xs text-neutral-500">
                  Purchases currently disabled
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}






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
