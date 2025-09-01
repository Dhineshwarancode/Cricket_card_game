import React from "react";
import { motion } from "framer-motion";
import { Package, Coins } from "lucide-react";

export function PackCard({ pack, onOpen, canAfford, showOdds = false }) {
  const cardVariants = {
    hover: {
      scale: 1.05,
      y: -10,
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  const glowVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="relative group cursor-pointer"
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={() => canAfford && onOpen(pack)}
    >
      {/* Glow effect */}
      <motion.div
        className={`absolute -inset-1 sm:-inset-2 bg-gradient-to-r ${pack.gradient} rounded-xl sm:rounded-2xl blur-xl opacity-50 ${pack.glowColor}`}
        variants={glowVariants}
        animate="animate"
      />

      {/* Main card */}
      <div
        className={`relative bg-gradient-to-br ${
          pack.gradient
        } rounded-xl sm:rounded-2xl border-2 border-white/20 backdrop-blur-sm overflow-hidden ${
          !canAfford ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {/* Pack content */}
        <div className="p-4 sm:p-6 text-center">
          <div className="mb-3 sm:mb-4">
            <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-white drop-shadow-lg" />
          </div>

          <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 drop-shadow-lg">
            {pack.name}
          </h3>

          <div className="flex items-center justify-center mb-3 sm:mb-4 text-white/90">
            <Coins className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="font-semibold text-sm sm:text-base">
              {pack.price}
            </span>
          </div>

          <div className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">
            {pack.cardsCount} Player Cards
          </div>

          {showOdds && (
            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-black/20 rounded-lg text-xs text-white/80">
              <div className="font-semibold mb-2">Drop Rates:</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Common:</span>
                  <span>{pack.odds.Common}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Rare:</span>
                  <span>{pack.odds.Rare}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Epic:</span>
                  <span>{pack.odds.Epic}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Legend:</span>
                  <span>{pack.odds.Legend}%</span>
                </div>
              </div>
            </div>
          )}

          {!canAfford && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl sm:rounded-2xl">
              <span className="text-white font-bold text-xs sm:text-sm">
                Insufficient Coins
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
