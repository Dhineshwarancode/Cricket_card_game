import React from "react";
import { motion } from "framer-motion";
import { X, Star, Coins } from "lucide-react";
import { useGame } from "../contexts/GameContext";
import { PlayerCard } from "./PlayerCard";

export function PackSummary() {
  const { packOpeningState, resetPackOpening } = useGame();

  if (!packOpeningState.showSummary) {
    return null;
  }

  // Get the cards that were revealed in this pack
  const revealedCards = packOpeningState.revealedCards || [];

  // Separate new cards from duplicates based on the pack opening state
  const newCards = revealedCards.filter((card) => !card.isDuplicate);
  const duplicateCards = revealedCards.filter((card) => card.isDuplicate);

  const getDuplicateValue = (tier) => {
    const values = { Common: 10, Rare: 25, Epic: 60, Legend: 150 };
    return values[tier] || 10;
  };

  const totalDuplicateValue = duplicateCards.reduce(
    (sum, card) => sum + getDuplicateValue(card.tier),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-white/20 backdrop-blur-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              Pack Summary
            </h2>
            <p className="text-white/60 text-sm sm:text-base">
              {packOpeningState.currentPack?.name}
            </p>
          </div>
          <button
            onClick={resetPackOpening}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {/* New Cards */}
          {newCards.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-400" />
                New Cards ({newCards.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
                {newCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PlayerCard card={card} size="medium" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Duplicate Cards */}
          {duplicateCards.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                <Coins className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-400" />
                Duplicates Converted (+{totalDuplicateValue} coins)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
                {duplicateCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <PlayerCard card={card} size="medium" />
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-yellow-500 text-white text-xs font-bold px-1 sm:px-2 py-1 rounded-full">
                      +{getDuplicateValue(card.tier)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* No Cards Message */}
          {newCards.length === 0 && duplicateCards.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white/60">No cards to display</p>
            </div>
          )}

          {/* Continue Button */}
          <div className="text-center">
            <motion.button
              onClick={resetPackOpening}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg sm:rounded-xl text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
