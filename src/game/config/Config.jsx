"use client";
import * as Phaser from "phaser";

let GameConfig;

if (typeof window !== "undefined") {
  // Dynamically import Phaser only on the client side
  import("phaser").then((Phaser) => {
    GameConfig = {
      type: Phaser.AUTO,
      width: "100%",
      height: "100%",
      parent: "game-container",
      backgroundColor: "#000000",
      pixelArt: true,
      physics: {
        default: "matter",
        matter: {
          gravity: { x: 0, y: 0 }, // No gravity since it's a top-down game
          debug: true, // Enable this for debugging
        },
      },
      scene: [],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };
  });
}

export { GameConfig };
