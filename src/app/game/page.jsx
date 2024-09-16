"use client";

import { useEffect, useRef } from "react";

const GamePage = () => {
  const phaserInitialized = useRef(false); // Track whether Phaser has been initialized

  useEffect(() => {
    const loadPhaser = async () => {
      if (!phaserInitialized.current && typeof window !== "undefined") {
        console.log("Loading Phaser...");
        const Phaser = await import("phaser");
        const { GameConfig } = await import("@/game/config/Config");
        const initPhaser = (await import("@/game")).default;

        // Initialize Phaser only if it hasn't been initialized before
        new Phaser.Game(GameConfig);
        initPhaser();

        // Mark the Phaser game as initialized
        phaserInitialized.current = true;
      }
    };

    loadPhaser();
  }, []);

  return (
    <div className="w-screen h-screen">
      {/* The container for the Phaser game */}
      <div id="game-container" style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default GamePage;
