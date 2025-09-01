import React, { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Package, Volume2, VolumeX, Trophy } from "lucide-react";
import { useGame } from "../contexts/GameContext";
import { soundManager } from "../utils/soundManager";
import { PACK_TYPES } from "../data/packs";
import { PackCard } from "./PackCard";

export function GameUI({ onOpenCollection }) {
  const { gameState, openPack, canAffordPack } = useGame();
  const [isMuted, setIsMuted] = useState(false);
  const [showOdds, setShowOdds] = useState(false);

  const handleMuteToggle = () => {
    const newMutedState = soundManager.toggleMute();
    setIsMuted(newMutedState);
  };

  const handlePackOpen = (pack) => {
    soundManager.playSound("ui");
    openPack(pack);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 sm:w-64 sm:h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 flex flex-col sm:flex-row justify-between items-center p-3 sm:p-6 gap-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 sm:p-3 rounded-lg sm:rounded-xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <img
              src="./././public/cricket-player-logo-playing-short-concept-vector.jpg"
              className="w-10 h-10 sm:w-8 sm:h-8 text-white rounded-lg"
            />
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Cricket Cards
            </h1>
            <p className="text-white/60 text-sm sm:text-base">
              Collect legendary players
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Coins */}
          <motion.div
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 border border-white/20"
            whileHover={{ scale: 1.05 }}
          >
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            <span className="text-white font-bold text-base sm:text-lg">
              {gameState.coins}
            </span>
          </motion.div>

          {/* Collection Button */}
          <motion.button
            onClick={onOpenCollection}
            className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 border border-white/20 text-white hover:bg-white/20 transition-all text-xs sm:text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium hidden sm:inline">Collection</span>
            <span className="font-medium">({gameState.collection.length})</span>
          </motion.button>

          {/* Sound Toggle */}
          <motion.button
            onClick={handleMuteToggle}
            className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/20 text-white hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-3 sm:px-6 pb-6">
        {/* Pack Store */}
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">
              Pack Store
            </h2>
            <p className="text-white/60 text-sm sm:text-lg">
              Choose your pack and reveal legendary cricketers
            </p>
          </div>

          {/* Odds Toggle */}
          <div className="text-center mb-4 sm:mb-6">
            <button
              onClick={() => setShowOdds(!showOdds)}
              className="text-white/80 hover:text-white text-xs sm:text-sm underline transition-colors"
            >
              {showOdds ? "Hide" : "Show"} Drop Rates
            </button>
          </div>

          {/* Packs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto">
            {PACK_TYPES.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <PackCard
                  pack={pack}
                  onOpen={handlePackOpen}
                  canAfford={canAffordPack(pack)}
                  showOdds={showOdds}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Stats */}
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {Object.entries({
              Common: gameState.collection.filter((c) => c.tier === "Common")
                .length,
              Rare: gameState.collection.filter((c) => c.tier === "Rare")
                .length,
              Epic: gameState.collection.filter((c) => c.tier === "Epic")
                .length,
              Legend: gameState.collection.filter((c) => c.tier === "Legend")
                .length,
            }).map(([tier, count]) => (
              <div
                key={tier}
                className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 border border-white/20 text-center"
              >
                <div className="text-lg sm:text-2xl font-bold text-white">
                  {count}
                </div>
                <div className="text-white/60 text-xs sm:text-sm">{tier}</div>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
