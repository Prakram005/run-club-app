import { motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

export default function EventFilter({ onFilter, onReset }) {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: [],
    terrain: [],
    minDistance: "",
    maxDistance: "",
    pace: ""
  });

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      if (filterType === "difficulty" || filterType === "terrain") {
        const array = prev[filterType];
        return {
          ...prev,
          [filterType]: array.includes(value)
            ? array.filter((item) => item !== value)
            : [...array, value]
        };
      }

      return { ...prev, [filterType]: value };
    });
  };

  const applyFilters = () => {
    onFilter?.(filters);
    setExpanded(false);
  };

  const resetFilters = () => {
    const cleared = {
      difficulty: [],
      terrain: [],
      minDistance: "",
      maxDistance: "",
      pace: ""
    };

    setFilters(cleared);
    onReset?.();
  };

  const activeFilterCount = Object.values(filters).reduce((count, value) => {
    if (Array.isArray(value)) {
      return count + value.length;
    }

    return count + (value ? 1 : 0);
  }, 0);

  return (
    <motion.div className="space-y-4">
      <motion.button
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center justify-between rounded-[24px] border border-red-500/30 bg-black/45 px-4 py-3.5 text-left backdrop-blur transition-all hover:border-red-400/40 hover:shadow-red-glow-sm"
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold uppercase tracking-[0.26em] text-red-300">Filters</span>
          {activeFilterCount > 0 ? (
            <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-200">
              {activeFilterCount} active
            </span>
          ) : null}
        </div>

        <ChevronDown size={18} className={`text-red-300 transition ${expanded ? "rotate-180" : ""}`} />
      </motion.button>

      {expanded ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated space-y-6 border border-red-500/25 p-6"
        >
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-red-300">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {["beginner", "intermediate", "advanced"].map((level) => (
                <motion.button
                  key={level}
                  onClick={() => handleFilterChange("difficulty", level)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    filters.difficulty.includes(level)
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-glow-sm"
                      : "border border-white/10 bg-black/40 text-zinc-400 hover:border-red-500/30 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.04 }}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-red-300">Terrain</p>
            <div className="flex flex-wrap gap-2">
              {["road", "trail", "mixed"].map((terrain) => (
                <motion.button
                  key={terrain}
                  onClick={() => handleFilterChange("terrain", terrain)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    filters.terrain.includes(terrain)
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-glow-sm"
                      : "border border-white/10 bg-black/40 text-zinc-400 hover:border-red-500/30 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.04 }}
                >
                  {terrain.charAt(0).toUpperCase() + terrain.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-red-300">Distance (km)</p>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minDistance}
                onChange={(event) => handleFilterChange("minDistance", event.target.value)}
                className="input px-4 py-2"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxDistance}
                onChange={(event) => handleFilterChange("maxDistance", event.target.value)}
                className="input px-4 py-2"
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-red-300">Pace</p>
            <input
              type="text"
              placeholder="e.g., 8:00/km"
              value={filters.pace}
              onChange={(event) => handleFilterChange("pace", event.target.value)}
              className="input w-full px-4 py-2"
            />
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={applyFilters}
              className="btn-primary flex-1 py-2 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Apply Filters
            </motion.button>
            {activeFilterCount > 0 ? (
              <motion.button
                onClick={resetFilters}
                className="btn-subtle px-4 py-2"
                whileHover={{ scale: 1.02 }}
              >
                <X size={16} />
              </motion.button>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
