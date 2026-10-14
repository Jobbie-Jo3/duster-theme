
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const STORAGE_KEY = "salt-selected-cluster-v1";

const clusters = [
  { id: "2man", name: "2-MAN", subtitle: "Duos Cluster", active: false },
  { id: "4man", name: "4-MAN", subtitle: "4-Man Cluster", active: false },
  { id: "6man", name: "6-MAN", subtitle: "6-Man Cluster", active: true },
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
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 salt-cluster-background salt-bg-6man">
      <h1 className="text-3xl font-bold text-white">
        6-Man Cluster Selected
      </h1>

      <p className="text-neutral-400">
        Your selected cluster is the #SALT 6-Man shop.
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
    return (
      <main className={`min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center salt-cluster-background salt-bg-${selected}`}>
        <h1 className="font-display text-4xl font-black uppercase text-white">2-Man Cluster Selected</h1>
        <p className="text-neutral-400">Browse the #SALT Duos catalogue. Purchasing remains disabled during testing.</p>
        <button onClick={() => router.push("/shop/2man")} className="salt-button">Enter 2-Man Shop</button>
        <button onClick={switchCluster} className="salt-button-outline">Switch Cluster</button>
      </main>
    );
  }

  if (selected === "4man") {
    return (
      <main className={`min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center salt-cluster-background salt-bg-${selected}`}>
        <h1 className="font-display text-4xl font-black uppercase text-white">4-Man Cluster Selected</h1>
        <p className="text-neutral-400">Browse the #SALT 4-Man catalogue. Purchasing remains disabled during testing.</p>
        <button onClick={() => router.push("/shop/4man")} className="salt-button">Enter 4-Man Shop</button>
        <button onClick={switchCluster} className="salt-button-outline">Switch Cluster</button>
      </main>
    );
  }

  return (
    <main className="salt-cluster-background salt-bg-selector salt-selector-screen salt-selector-bottom-layout">
      <div className="salt-selector-top-label">
        <span>#SALT NO-WIPE</span>
        <h1>CHOOSE YOUR CLUSTER</h1>
      </div>

      <section className="salt-selector-bottom-bar" aria-label="Choose your #SALT cluster">
        <div className="salt-selector-bottom-inner">
          {clusters.map((cluster) => (
            <button
              key={cluster.id}
              type="button"
              onClick={() => chooseCluster(cluster.id)}
              className="salt-selector-cluster-button"
              aria-label={`Select ${cluster.name} cluster`}
            >
              <span className="salt-selector-cluster-copy">
                <span className="salt-selector-cluster-name">{cluster.name}</span>
                <span className="salt-selector-cluster-subtitle">{cluster.subtitle}</span>
                <span className="salt-selector-cluster-status">
                  {cluster.active ? "SHOP AVAILABLE" : "BROWSE ONLY · CHECKOUT DISABLED"}
                </span>
              </span>
              <span className="salt-selector-cluster-action">
                {cluster.active ? "ENTER SHOP" : "VIEW CLUSTER"}
                <ArrowRight size={17} aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
