
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Users } from "lucide-react";

const STORAGE_KEY = "salt-selected-cluster-v1";

const clusters = [
  {
    id: "2man",
    name: "2-MAN",
    subtitle: "Duos Cluster",
    active: false,
  },
  {
    id: "4man",
    name: "4-MAN",
    subtitle: "Four Player Cluster",
    active: false,
  },
  {
    id: "6man",
    name: "6-MAN",
    subtitle: "Original #SALT Cluster",
    active: true,
  },
];

export default function HomePage() {
  const router = useRouter();

  const [selected, setSelected] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved && clusters.some((cluster) => cluster.id === saved)) {
      setSelected(saved);
    }

    setLoaded(true);
  }, []);

  // Automatically open the 2-Man catalogue when remembered.
  useEffect(() => {
    if (loaded && selected === "2man") {
      router.replace("/shop/2man");
    }
  }, [loaded, selected, router]);

  function chooseCluster(id: string) {
    localStorage.setItem(STORAGE_KEY, id);
    setSelected(id);

    if (id === "2man") {
      router.push("/shop/2man");
    }
  }

  function switchCluster() {
    localStorage.removeItem(STORAGE_KEY);
    setSelected(null);
  }

  if (!loaded) {
    return <main className="min-h-screen" />;
  }

  // 2-Man: redirect to the separate catalogue.
  if (selected === "2man") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <p className="text-neutral-400">
          Opening your 2-Man shop...
        </p>

        <button
          onClick={switchCluster}
          className="text-salt-orange-bright underline"
        >
          Switch Cluster
        </button>
      </main>
    );
  }

  // 6-Man: preserve the existing shop.
  if (selected === "6man") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
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

  // 4-Man: purchases remain disabled.
  if (selected === "4man") {
    return (
      <main className="min-h-screen px-6 py-24 text-center">
        <p className="font-bold text-salt-orange-bright">
          #SALT WEBSHOP
        </p>

        <h1 className="mt-4 text-5xl font-black text-white">
          4-MAN SHOP
        </h1>

        <p className="mt-6 text-neutral-400">
          This cluster's products and checkout are being configured.
          Purchases are not available yet.
        </p>

        <button
          onClick={switchCluster}
          className="salt-button mt-10"
        >
          Switch Cluster
        </button>
      </main>
    );
  }

  // First visit: choose a cluster.
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
            Select the ARK: Survival Ascended cluster you want
            to shop for. Your choice will be remembered.
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
