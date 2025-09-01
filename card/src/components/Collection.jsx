import React, { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Search, X } from "lucide-react";
import { useGame } from "../contexts/GameContext";
import { PlayerCard } from "./PlayerCard";

export function Collection({ isOpen, onClose }) {
  const { gameState } = useGame();
  const [filter, setFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCards = gameState.collection.filter((card) => {
    const tierMatch = filter === "All" || card.tier === filter;
    const roleMatch = roleFilter === "All" || card.player.role === roleFilter;
    const searchMatch =
      searchTerm === "" ||
      card.player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.player.team.toLowerCase().includes(searchTerm.toLowerCase());

    return tierMatch && roleMatch && searchMatch;
  });

  const tierCounts = {
    Common: gameState.collection.filter((c) => c.tier === "Common").length,
    Rare: gameState.collection.filter((c) => c.tier === "Rare").length,
    Epic: gameState.collection.filter((c) => c.tier === "Epic").length,
    Legend: gameState.collection.filter((c) => c.tier === "Legend").length,
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-2 sm:p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-white/20 backdrop-blur-xl w-full max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              My Collection
            </h2>
            <p className="text-white/60 text-sm sm:text-base">
              {gameState.collection.length} cards collected
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 sm:p-6 border-b border-white/10">
          <div className="flex flex-col gap-3 sm:gap-4 mb-4">
            {/* Tier Filter */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {["All", "Common", "Rare", "Epic", "Legend"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setFilter(tier)}
                  className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-all ${
                    filter === tier
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {tier} {tier !== "All" && `(${tierCounts[tier]})`}
                </button>
              ))}
            </div>

            {/* Role Filter */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {["All", "BAT", "BOWL", "AR", "WK"].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-all ${
                    roleFilter === role
                      ? "bg-purple-500 text-white"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search players or teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="p-4 sm:p-6 overflow-auto max-h-[50vh] sm:max-h-[60vh]">
          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-8 sm:gap-10">
              {filteredCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PlayerCard card={card} size="medium" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="text-white/60 text-base sm:text-lg mb-2">
                No cards found
              </div>
              <p className="text-white/40 text-sm sm:text-base">
                Try adjusting your filters or open some packs!
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
