import React, { useEffect, useMemo, useState } from "react";
import { getData, saveData } from "./storage";

/** Data model */
interface Plant {
  id: number;
  name: string;
  frequency: number;   // days
  lastWatered: string; // ISO
}

/** Compute DUE / TODAY / UPCOMING */
function getBadge(next: Date): { text: "DUE" | "TODAY" | "UPCOMING"; color: string; textClass?: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const d = new Date(next);
  d.setHours(0, 0, 0, 0);

  if (d < today) return { text: "DUE", color: "bg-redMain", textClass: "text-white" };
  if (d.getTime() === today.getTime()) return { text: "TODAY", color: "bg-yellowMain", textClass: "text-black" }; // ✅ Yellow today
  return { text: "UPCOMING", color: "bg-greenMain", textClass: "text-white" };
}

/** Utility */
const daysToMs = (days: number) => days * 24 * 60 * 60 * 1000;

const STORAGE_KEY = "plants";

export default function App() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<number>(3);

  // Load plants
  useEffect(() => {
    const stored = getData<Plant[]>(STORAGE_KEY);
    if (stored) setPlants(stored);
  }, []);

  // Persist plants
  useEffect(() => {
    saveData(STORAGE_KEY, plants);
  }, [plants]);

  const addPlant = () => {
    if (!name.trim() || frequency < 1) return;
    const newPlant: Plant = {
      id: Date.now(),
      name: name.trim(),
      frequency,
      lastWatered: new Date().toISOString()
    };
    setPlants((prev) => [newPlant, ...prev]);
    setName("");
    setFrequency(3);
  };

  const markWatered = (id: number) => {
    setPlants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, lastWatered: new Date().toISOString() } : p))
    );
  };

  const deletePlant = (id: number) => {
    setPlants((prev) => prev.filter((p) => p.id !== id));
  };

  const plantCards = useMemo(() => {
    return plants.map((plant) => {
      const last = new Date(plant.lastWatered);
      const next = new Date(last.getTime() + daysToMs(plant.frequency));
      const badge = getBadge(next);

      return (
        <div
          key={plant.id}
          className="p-4 rounded-xl shadow bg-orangeMain text-black flex justify-between items-center gap-4"
        >
          <div className="min-w-0">
            <h2 className="text-xl font-bold truncate">{plant.name}</h2>
            <p className="text-sm">Every {plant.frequency} day{plant.frequency > 1 ? "s" : ""}</p>
            <p className="text-sm">Last watered: {last.toLocaleDateString()}</p>
            <p className="text-sm">Next: {next.toLocaleDateString()}</p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full font-semibold ${badge.color} ${badge.textClass ?? ""}`}
              aria-label={`Status: ${badge.text}`}
              title={`Status: ${badge.text}`}
            >
              {badge.text}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              className="px-3 py-1 rounded bg-greenMain text-white font-semibold hover:opacity-90"
              onClick={() => markWatered(plant.id)}
            >
              Watered
            </button>
            <button
              className="px-3 py-1 rounded bg-redMain text-white hover:opacity-90"
              onClick={() => deletePlant(plant.id)}
            >
              Delete
            </button>
          </div>
        </div>
      );
    });
  }, [plants]);

  return (
    <div className="min-h-screen bg-yellowMain">
      {/* Header */}
      <header className="w-full px-6 py-4 bg-greenMain text-white shadow">
        <h1 className="text-2xl font-extrabold">🌱 Garden Monitor</h1>
      </header>

      {/* Add Form */}
      <main className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end bg-greenMain text-white rounded-xl p-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Plant Name</label>
            <input
              className="w-full rounded px-3 py-2 text-black"
              placeholder="e.g. Basil"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="w-full md:w-48">
            <label className="block font-semibold mb-1">Frequency (days)</label>
            <input
              type="number"
              min={1}
              className="w-full rounded px-3 py-2 text-black"
              value={frequency}
              onChange={(e) => setFrequency(Math.max(1, Number(e.target.value)))}
            />
          </div>

          <button
            onClick={addPlant}
            className="w-full md:w-auto px-4 py-2 rounded bg-orangeMain text-black font-bold hover:opacity-90"
          >
            Add
          </button>
        </div>

        {/* Plant List */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {plantCards}
          {plants.length === 0 && (
            <div className="p-6 rounded-xl bg-orangeMain text-black text-center font-semibold">
              No plants yet. Add your first plant to get started!
            </div>
          )}
        </div>
      </main>

      {/* Footer (optional minimalist) */}
     <footer className="px-6 py-4 text-center text-sm text-black italic">
        "Gardening nurtures not just plants but also the soul, offering a quiet refuge."
     </footer>
    </div>
  );
}
