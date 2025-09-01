import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  loadGameState,
  saveGameState,
  processPackCards,
} from "../utils/storage";
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
  switch (action.type) {
    case "LOAD_STATE":
      return {
        ...state,
        game: action.payload,
      };

    case "START_PACK_OPENING":
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
      return {
        ...state,
        pack: {
          ...state.pack,
          revealIndex: state.pack.revealIndex + 1,
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
      const { processedCards, newState } = processPackCards(
        state.pack.revealedCards,
        state.game
      );
      return {
        game: newState,
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
    if (state.game.coins >= pack.price) {
      const cards = generatePackCards(pack);
      dispatch({ type: "START_PACK_OPENING", payload: { pack, cards } });
    }
  };

  const revealNextCard = () => {
    dispatch({ type: "REVEAL_CARD" });
  };

  const revealAllCards = () => {
    dispatch({ type: "REVEAL_ALL" });
  };

  const completePack = () => {
    dispatch({ type: "COMPLETE_PACK" });
  };

  const resetPackOpening = () => {
    dispatch({ type: "RESET_PACK_OPENING" });
  };

  const stopAnimation = () => {
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
