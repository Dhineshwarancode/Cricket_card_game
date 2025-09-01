import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Package, X, RotateCcw } from "lucide-react";
import { PlayerCard } from "./PlayerCard";
import { useGame } from "../contexts/GameContext";
import { soundManager } from "../utils/soundManager";

export function PackOpening() {
  const {
    packOpeningState,
    revealNextCard,
    completePack,
    resetPackOpening,
    stopAnimation,
  } = useGame();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (
      packOpeningState.isOpening &&
      packOpeningState.revealedCards.length > 0
    ) {
      soundManager.playSound("packOpen");

      // Stop pack animation after 2 seconds
      setTimeout(() => {
        stopAnimation();
      }, 2000);

      // Check for rare cards to trigger confetti
      const hasRareCard = packOpeningState.revealedCards.some(
        (card) => card.tier === "Epic" || card.tier === "Legend"
      );

      if (hasRareCard) {
        setTimeout(() => {
          setShowConfetti(true);
          soundManager.playSound("rareCard");
          setTimeout(() => setShowConfetti(false), 3000);
        }, 3000);
      }
    }
  }, [
    packOpeningState.isOpening,
    packOpeningState.revealedCards,
    stopAnimation,
  ]);

  const handleRevealCard = () => {
    console.log("Reveal card clicked", {
      revealIndex: packOpeningState.revealIndex,
      totalCards: packOpeningState.revealedCards.length,
    });

    if (packOpeningState.revealIndex < packOpeningState.revealedCards.length) {
      soundManager.playSound("cardFlip");
      revealNextCard();
    } else {
      completePack();
    }
  };

  const handleRevealAll = () => {
    console.log("Reveal all clicked");
    soundManager.playSound("cardFlip");

    // Reveal all remaining cards quickly
    const remainingCards =
      packOpeningState.revealedCards.length - packOpeningState.revealIndex;
    for (let i = 0; i < remainingCards; i++) {
      setTimeout(() => {
        revealNextCard();
      }, i * 200);
    }

    // Complete pack after all cards are revealed
    setTimeout(() => {
      completePack();
    }, remainingCards * 200 + 500);
  };

  if (!packOpeningState.isOpening) {
    return null;
  }

  const isAllRevealed =
    packOpeningState.revealIndex >= packOpeningState.revealedCards.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 flex flex-col items-center justify-center p-2 sm:p-4"
    >
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      {/* Header */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex justify-between items-center z-10">
        <motion.h2
          className="text-lg sm:text-2xl font-bold text-white"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          {packOpeningState.currentPack?.name}
        </motion.h2>

        <div className="flex gap-2">
          {!packOpeningState.isAnimating && !isAllRevealed && (
            <motion.button
              onClick={handleRevealAll}
              className="px-2 sm:px-4 py-1 sm:py-2 bg-white/10 hover:bg-white/20 rounded-md sm:rounded-lg text-white font-medium backdrop-blur-sm border border-white/20 transition-all text-xs sm:text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
              Reveal All
            </motion.button>
          )}

          <motion.button
            onClick={resetPackOpening}
            className="p-1 sm:p-2 bg-white/10 hover:bg-white/20 rounded-md sm:rounded-lg text-white backdrop-blur-sm border border-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </div>

      {/* Pack Animation */}
      {packOpeningState.isAnimating && (
        <motion.div
          className="mb-4 sm:mb-8"
          initial={{ scale: 1, rotateZ: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            rotateZ: [-5, 5, -5, 5, 0],
          }}
          transition={{
            duration: 2,
            times: [0, 0.5, 1],
            ease: "easeInOut",
          }}
        >
          <div
            className={`w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br ${packOpeningState.currentPack?.gradient} rounded-xl sm:rounded-2xl border-2 border-white/30 flex items-center justify-center backdrop-blur-sm ${packOpeningState.currentPack?.glowColor} shadow-2xl`}
          >
            <Package className="w-10 h-10 sm:w-16 sm:h-16 text-white" />
          </div>
        </motion.div>
      )}

      {/* Cards Grid */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-6xl px-2 mb-4">
        {packOpeningState.revealedCards.map((card, index) => {
          const isRevealed = index < packOpeningState.revealIndex;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 50, rotateY: 180 }}
              animate={{
                opacity: packOpeningState.isAnimating ? 0 : 1,
                y: packOpeningState.isAnimating ? 50 : 0,
                rotateY: isRevealed ? 0 : 180,
              }}
              transition={{
                delay: packOpeningState.isAnimating ? 0 : 0.2,
                duration: 0.6,
                ease: "easeOut",
              }}
              className="transform-gpu"
            >
              {isRevealed ? (
                <PlayerCard
                  card={card}
                  isRevealing={index === packOpeningState.revealIndex - 1}
                  delay={0}
                  size="medium"
                />
              ) : (
                <div className="w-32 h-44 sm:w-40 sm:h-56 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg sm:rounded-xl border-2 border-white/20 flex items-center justify-center">
                  <Package className="w-8 h-8 sm:w-12 sm:h-12 text-white/40" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Controls */}
      {!packOpeningState.isAnimating && (
        <div className="text-center">
          {!isAllRevealed ? (
            <motion.button
              onClick={handleRevealCard}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg sm:rounded-xl text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Reveal Next Card
            </motion.button>
          ) : (
            <motion.button
              onClick={completePack}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg sm:rounded-xl text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              View Pack Summary
            </motion.button>
          )}
        </div>
      )}

      {/* Progress indicator */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-1 sm:gap-2">
          {Array.from({ length: packOpeningState.revealedCards.length }).map(
            (_, index) => (
              <div
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index < packOpeningState.revealIndex
                    ? "bg-white shadow-lg"
                    : "bg-white/30"
                }`}
              />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}
