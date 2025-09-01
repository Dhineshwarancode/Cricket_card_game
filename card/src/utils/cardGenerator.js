import { CRICKET_PLAYERS } from "../data/players";

export function generateCard(packType) {
  const tier = selectTierByOdds(packType.odds);
  const availablePlayers = CRICKET_PLAYERS.filter(
    (player) => player.tier === tier
  );
  const randomPlayer =
    availablePlayers[Math.floor(Math.random() * availablePlayers.length)];

  return {
    id: randomPlayer.id,
    player: randomPlayer,
    tier,
    packId: packType.id,
    openedAt: new Date(),
  };
}

export function generatePackCards(pack) {
  const cards = [];

  for (let i = 0; i < pack.cardsCount; i++) {
    cards.push(generateCard(pack));
  }

  // Ensure at least one rare+ card in Silver and Gold packs
  if (pack.type === "Silver" || pack.type === "Gold") {
    const hasRareOrBetter = cards.some(
      (card) =>
        card.tier === "Rare" || card.tier === "Epic" || card.tier === "Legend"
    );

    if (!hasRareOrBetter) {
      const guaranteedTier = pack.type === "Silver" ? "Rare" : "Epic";
      cards[cards.length - 1] = generateCard({
        ...pack,
        odds: { Common: 0, Rare: 0, Epic: 0, Legend: 0, [guaranteedTier]: 100 },
      });
    }
  }

  return cards.sort((a, b) => getTierValue(a.tier) - getTierValue(b.tier));
}

function selectTierByOdds(odds) {
  const random = Math.random() * 100;
  let cumulative = 0;

  for (const [tier, chance] of Object.entries(odds)) {
    cumulative += chance;
    if (random <= cumulative) {
      return tier;
    }
  }

  return "Common";
}

function getTierValue(tier) {
  const values = { Common: 1, Rare: 2, Epic: 3, Legend: 4 };
  return values[tier];
}

export function getTierColor(tier) {
  const colors = {
    Common: "from-gray-400 to-gray-600",
    Rare: "from-blue-400 to-blue-600",
    Epic: "from-purple-400 to-pink-600",
    Legend: "from-yellow-400 to-orange-600",
  };
  return colors[tier];
}

export function getTierGlow(tier) {
  const glows = {
    Common: "shadow-gray-500/30",
    Rare: "shadow-blue-500/50",
    Epic: "shadow-purple-500/50",
    Legend: "shadow-yellow-500/70",
  };
  return glows[tier];
}

export function getTierBorder(tier) {
  const borders = {
    Common: "border-gray-400",
    Rare: "border-blue-400",
    Epic: "border-purple-400",
    Legend: "border-yellow-400",
  };
  return borders[tier];
}
