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
    setFilters({
      difficulty: [],
      terrain: [],
      minDistance: "",
      maxDistance: "",
      pace: ""
    });
    onReset?.();
  };

  const activeFilterCount = Object.values(filters).reduce((count, val) => {
    if (Array.isArray(val)) {
      return count + val.length;
    }
    return count + (val ? 1 : 0);
  }, 0);

  return (
    <motion.div className="space-y-4">
      <motion.button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-2 border-cyan-500/30 hover:border-cyan-500/50 transition"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold uppercase text-cyan-400">🔍 Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-1 rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-300">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`transition ${expanded ? "rotate-180" : ""} text-cyan-400`}
        />
      </motion.button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 space-y-6"
        >
          {/* Difficulty Filter */}
          <div>
            <p className="text-sm font-bold uppercase text-indigo-400 mb-3">⛰️ Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {["beginner", "intermediate", "advanced"].map((level) => (
                <motion.button
                  key={level}
                  onClick={() => handleFilterChange("difficulty", level)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                    filters.difficulty.includes(level)
                      ? "bg-indigo-500 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {level === "beginner" && "🟢"}
                  {level === "intermediate" && "🟡"}
                  {level === "advanced" && "🔴"}
                  {" " + level.charAt(0).toUpperCase() + level.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Terrain Filter */}
          <div>
            <p className="text-sm font-bold uppercase text-green-400 mb-3">🏞️ Terrain</p>
            <div className="flex flex-wrap gap-2">
              {["road", "trail", "mixed"].map((terrain) => (
                <motion.button
                  key={terrain}
                  onClick={() => handleFilterChange("terrain", terrain)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                    filters.terrain.includes(terrain)
                      ? "bg-green-500 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {terrain === "road" && "🛣️"}
                  {terrain === "trail" && "🥾"}
                  {terrain === "mixed" && "🔀"}
                  {" " + terrain.charAt(0).toUpperCase() + terrain.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Distance Filter */}
          <div>
            <p className="text-sm font-bold uppercase text-yellow-400 mb-3">📏 Distance (km)</p>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minDistance}
                onChange={(e) => handleFilterChange("minDistance", e.target.value)}
                className="input px-4 py-2 rounded-lg border-2 border-yellow-500/30 bg-yellow-500/5 text-white placeholder-yellow-600 transition focus:border-yellow-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxDistance}
                onChange={(e) => handleFilterChange("maxDistance", e.target.value)}
                className="input px-4 py-2 rounded-lg border-2 border-yellow-500/30 bg-yellow-500/5 text-white placeholder-yellow-600 transition focus:border-yellow-500"
              />
            </div>
          </div>

          {/* Pace Filter */}
          <div>
            <p className="text-sm font-bold uppercase text-lime-400 mb-3">⏱️ Pace</p>
            <input
              type="text"
              placeholder="e.g., 8:00/km"
              value={filters.pace}
              onChange={(e) => handleFilterChange("pace", e.target.value)}
              className="input w-full px-4 py-2 rounded-lg border-2 border-lime-500/30 bg-lime-500/5 text-white placeholder-lime-600 transition focus:border-lime-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              onClick={applyFilters}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm uppercase transition hover:shadow-lg hover:shadow-cyan-500/50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Apply Filters
            </motion.button>
            {activeFilterCount > 0 && (
              <motion.button
                onClick={resetFilters}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 font-bold text-sm transition hover:bg-zinc-700"
                whileHover={{ scale: 1.02 }}
              >
                <X size={16} />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
