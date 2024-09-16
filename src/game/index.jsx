"use client";
import * as Phaser from "phaser";
import { GameConfig } from "./config/Config";
import BootScene from "./scenes/BootScene";
import MainScene from "./scenes/MainScene";

// Add scenes to the game config
if (GameConfig) {
  GameConfig.scene = [BootScene, MainScene];
}

// Initialize Phaser game
export default function initPhaser() {
  if (typeof window !== "undefined") {
    new Phaser.Game(GameConfig);
  }
}
