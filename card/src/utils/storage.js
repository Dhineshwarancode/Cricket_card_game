const STORAGE_KEY = "cricket-card-game";

export function saveGameState(state) {
  try {
    const stateToSave = {
      ...state,
      unlockedCards: Array.from(state.unlockedCards),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.error("Failed to save game state:", error);
  }
}

export function loadGameState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        unlockedCards: new Set(parsed.unlockedCards || []),
        collection: (parsed.collection || []).map((card) => ({
          ...card,
          openedAt: card.openedAt ? new Date(card.openedAt) : new Date(),
        })),
      };
    }
  } catch (error) {
    console.error("Failed to load game state:", error);
  }

  return {
    coins: 1000,
    packs: [],
    collection: [],
    unlockedCards: new Set(),
  };
}

export function processPackCards(cards, currentState) {
  const newCollection = [...currentState.collection];
  const newUnlocked = new Set(currentState.unlockedCards);
  let bonusCoins = 0;

  // Mark cards as new or duplicate and process them
  const processedCards = cards.map((card) => {
    const isDuplicate = newUnlocked.has(card.player.id);

    if (isDuplicate) {
      // Duplicate - convert to coins
      bonusCoins += getDuplicateValue(card.tier);
      return { ...card, isDuplicate: true };
    } else {
      // New card - add to collection
      newCollection.push(card);
      newUnlocked.add(card.player.id);
      return { ...card, isDuplicate: false };
    }
  });

  return {
    processedCards,
    newState: {
      ...currentState,
      collection: newCollection,
      unlockedCards: newUnlocked,
      coins: currentState.coins + bonusCoins,
    },
  };
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
