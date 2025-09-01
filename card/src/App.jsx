import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { GameProvider } from "./contexts/GameContext";
import { GameUI } from "./components/GameUI";
import { PackOpening } from "./components/PackOpening";
import { PackSummary } from "./components/PackSummary";
import { Collection } from "./components/Collection";

function App() {
  const [showCollection, setShowCollection] = useState(false);

  return (
    <GameProvider>
      <div className="relative">
        <GameUI onOpenCollection={() => setShowCollection(true)} />

        <AnimatePresence>
          <PackOpening />
          <PackSummary />
          <Collection
            isOpen={showCollection}
            onClose={() => setShowCollection(false)}
          />
        </AnimatePresence>
      </div>
    </GameProvider>
  );
}

export default App;
