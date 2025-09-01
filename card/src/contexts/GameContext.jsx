import React, { createContext, useContext, useReducer, useEffect } from "react";
import { loadGameState, saveGameState } from "../utils/storage";
import { generatePackCards } from "../utils/cardGenerator";

const GameContext = createContext();

const initialGameState = {
  coins: 1000,
  packs: [],
  collection: [],
  unlockedCards: new Set(),
};

const initialPackState = {
  isOpening: false,
  currentPack: null,
  revealedCards: [],
  revealIndex: 0,
  showSummary: false,
  isAnimating: false,
};

function gameReducer(state, action) {
  console.log("GameReducer action:", action.type, action.payload);

  switch (action.type) {
    case "LOAD_STATE":
      return {
        ...state,
        game: action.payload,
      };

    case "START_PACK_OPENING":
      console.log("Starting pack opening with cards:", action.payload.cards);
      return {
        game: {
          ...state.game,
          coins: state.game.coins - action.payload.pack.price,
        },
        pack: {
          isOpening: true,
          currentPack: action.payload.pack,
          revealedCards: action.payload.cards,
          revealIndex: 0,
          showSummary: false,
          isAnimating: true,
        },
      };

    case "REVEAL_CARD":
      console.log("Revealing card, current index:", state.pack.revealIndex);
      return {
        ...state,
        pack: {
          ...state.pack,
          revealIndex: Math.min(
            state.pack.revealIndex + 1,
            state.pack.revealedCards.length
          ),
        },
      };

    case "REVEAL_ALL":
      return {
        ...state,
        pack: {
          ...state.pack,
          revealIndex: state.pack.revealedCards.length,
        },
      };

    case "COMPLETE_PACK":
      console.log("Completing pack with cards:", state.pack.revealedCards);

      // Process cards for duplicates and add to collection
      const newCollection = [...state.game.collection];
      const newUnlocked = new Set(state.game.unlockedCards);
      let bonusCoins = 0;

      const processedCards = state.pack.revealedCards.map((card) => {
        const isDuplicate = newUnlocked.has(card.player.id);

        if (isDuplicate) {
          // Duplicate - convert to coins
          const coinValue = getDuplicateValue(card.tier);
          bonusCoins += coinValue;
          return { ...card, isDuplicate: true, coinValue };
        } else {
          // New card - add to collection
          const cardWithTimestamp = { ...card, openedAt: new Date() };
          newCollection.push(cardWithTimestamp);
          newUnlocked.add(card.player.id);
          return { ...card, isDuplicate: false };
        }
      });

      const newGameState = {
        ...state.game,
        collection: newCollection,
        unlockedCards: newUnlocked,
        coins: state.game.coins + bonusCoins,
      };

      return {
        game: newGameState,
        pack: {
          ...state.pack,
          revealedCards: processedCards,
          showSummary: true,
          isAnimating: false,
        },
      };

    case "RESET_PACK_OPENING":
      return {
        ...state,
        pack: initialPackState,
      };

    case "STOP_ANIMATION":
      return {
        ...state,
        pack: {
          ...state.pack,
          isAnimating: false,
        },
      };

    default:
      return state;
  }
}

function getDuplicateValue(tier) {
  const values = {
    Common: 10,
    Rare: 25,
    Epic: 60,
    Legend: 150,
  };
  return values[tier] || 10;
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, {
    game: initialGameState,
    pack: initialPackState,
  });

  useEffect(() => {
    const savedState = loadGameState();
    dispatch({ type: "LOAD_STATE", payload: savedState });
  }, []);

  useEffect(() => {
    if (
      state.game.coins !== initialGameState.coins ||
      state.game.collection.length > 0
    ) {
      saveGameState(state.game);
    }
  }, [state.game]);

  const openPack = (pack) => {
    console.log("Opening pack:", pack, "Current coins:", state.game.coins);
    if (state.game.coins >= pack.price) {
      const cards = generatePackCards(pack);
      console.log("Generated cards:", cards);
      dispatch({ type: "START_PACK_OPENING", payload: { pack, cards } });
    } else {
      console.log("Cannot afford pack");
    }
  };

  const revealNextCard = () => {
    console.log("Reveal next card called");
    dispatch({ type: "REVEAL_CARD" });
  };

  const revealAllCards = () => {
    console.log("Reveal all cards called");
    dispatch({ type: "REVEAL_ALL" });
  };

  const completePack = () => {
    console.log("Complete pack called");
    dispatch({ type: "COMPLETE_PACK" });
  };

  const resetPackOpening = () => {
    console.log("Reset pack opening called");
    dispatch({ type: "RESET_PACK_OPENING" });
  };

  const stopAnimation = () => {
    console.log("Stop animation called");
    dispatch({ type: "STOP_ANIMATION" });
  };

  const canAffordPack = (pack) => {
    return state.game.coins >= pack.price;
  };

  const value = {
    gameState: state.game,
    packOpeningState: state.pack,
    openPack,
    revealNextCard,
    revealAllCards,
    completePack,
    resetPackOpening,
    stopAnimation,
    canAffordPack,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
