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
        className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-950/30 to-black border border-red-600/40 hover:border-red-600/60 transition-all hover:shadow-red-glow-sm"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold uppercase text-red-400">🔍 Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-red-600/30 text-xs font-bold text-red-300 border border-red-600/20">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`transition ${expanded ? "rotate-180" : ""} text-red-400`}
        />
      </motion.button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-6 border border-red-600/40 space-y-6"
        >
          {/* Difficulty Filter */}
          <div>
            <p className="text-sm font-bold uppercase text-red-400 mb-3">⛰️ Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {["beginner", "intermediate", "advanced"].map((level) => (
                <motion.button
                  key={level}
                  onClick={() => handleFilterChange("difficulty", level)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                    filters.difficulty.includes(level)
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-glow"
                      : "bg-black/50 text-gray-400 border border-red-600/20 hover:border-red-600/50"
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
                      ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                      : "bg-black/50 text-gray-400 border border-green-600/20 hover:border-green-600/50"
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
            <p className="text-sm font-bold uppercase text-purple-400 mb-3">📏 Distance (km)</p>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minDistance}
                onChange={(e) => handleFilterChange("minDistance", e.target.value)}
                className="input px-4 py-2"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxDistance}
                onChange={(e) => handleFilterChange("maxDistance", e.target.value)}
                className="input px-4 py-2"
              />
            </div>
          </div>

          {/* Pace Filter */}
          <div>
            <p className="text-sm font-bold uppercase text-blue-400 mb-3">⏱️ Pace</p>
            <input
              type="text"
              placeholder="e.g., 8:00/km"
              value={filters.pace}
              onChange={(e) => handleFilterChange("pace", e.target.value)}
              className="input w-full px-4 py-2"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              onClick={applyFilters}
              className="btn-primary flex-1 py-2 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Apply Filters
            </motion.button>
            {activeFilterCount > 0 && (
              <motion.button
                onClick={resetFilters}
                className="btn-subtle px-4 py-2"
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
