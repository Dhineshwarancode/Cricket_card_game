import React from "react";
import { motion } from "framer-motion";
import {
  getTierColor,
  getTierGlow,
  getTierBorder,
} from "../utils/cardGenerator";

export function PlayerCard({
  card,
  isRevealing = false,
  delay = 0,
  size = "medium",
}) {
  const { player, tier } = card;

  const sizeClasses = {
    small: "w-24 h-32 sm:w-32 sm:h-44",
    medium: "w-32 h-44 sm:w-40 sm:h-56",
    large: "w-36 h-48 sm:w-48 sm:h-68",
  };

  const getRoleColor = (role) => {
    const colors = {
      BAT: "bg-green-500",
      BOWL: "bg-red-500",
      AR: "bg-purple-500",
      WK: "bg-blue-500",
    };
    return colors[role] || "bg-gray-500";
  };

  const cardVariants = {
    hidden: {
      rotateY: 180,
      scale: 0.8,
      opacity: 0,
    },
    visible: {
      rotateY: 0,
      scale: 1,
      opacity: 1,
      transition: {
        delay,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const glowVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity:
        tier === "Legend" ? [0, 1, 0] : tier === "Epic" ? [0, 0.8, 0] : 0,
      scale:
        tier === "Legend"
          ? [0.8, 1.1, 0.8]
          : tier === "Epic"
          ? [0.8, 1.05, 0.8]
          : 1,
      transition: {
        delay: delay + 0.5,
        duration: 2,
        repeat: tier === "Legend" ? Infinity : tier === "Epic" ? 3 : 0,
        repeatType: "reverse",
      },
    },
  };

  return (
    <div className="relative">
      {/* Glow effect for rare cards */}
      <motion.div
        className={`absolute -inset-2 sm:-inset-4 rounded-lg sm:rounded-xl bg-gradient-to-r ${getTierColor(
          tier
        )} blur-xl ${getTierGlow(tier)}`}
        variants={glowVariants}
        initial="hidden"
        animate={isRevealing ? "visible" : "hidden"}
      />

      <motion.div
        className={`relative ${sizeClasses[size]} perspective-1000`}
        variants={cardVariants}
        initial={isRevealing ? "hidden" : "visible"}
        animate="visible"
      >
        <div
          className={`w-full h-full bg-gradient-to-br ${getTierColor(
            tier
          )} rounded-lg sm:rounded-xl border-2 ${getTierBorder(
            tier
          )} ${getTierGlow(tier)} backdrop-blur-sm`}
        >
          {/* Card Header */}
          <div className="p-2 sm:p-3">
            <div className="flex justify-between items-start">
              <div
                className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-bold text-white ${getRoleColor(
                  player.role
                )}`}
              >
                {player.role}
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-sm sm:text-lg">
                  {player.rating}
                </div>
                <div className="text-white/80 text-xs">{tier}</div>
              </div>
            </div>
          </div>

          {/* Player Info */}
          <div className="px-2 sm:px-3 pb-2 sm:pb-3">
            <h3 className="text-white font-bold text-xs sm:text-sm leading-tight mb-1">
              {player.name}
            </h3>
            <p className="text-white/80 text-xs mb-1 sm:mb-2">{player.team}</p>

            {/* Stats */}
            <div className="space-y-0.5 sm:space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Matches</span>
                <span className="text-white">{player.stats.matches}</span>
              </div>
              {player.stats.runs && (
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Runs</span>
                  <span className="text-white">{player.stats.runs}</span>
                </div>
              )}
              {player.stats.wickets && (
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Wickets</span>
                  <span className="text-white">{player.stats.wickets}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Average</span>
                <span className="text-white">{player.stats.average}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
