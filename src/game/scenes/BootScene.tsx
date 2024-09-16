"use client";
import * as Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    //  Load assets
  }

  create() {
    // Start the next scene after loading assets
    this.scene.start("MainScene");
  }
}
