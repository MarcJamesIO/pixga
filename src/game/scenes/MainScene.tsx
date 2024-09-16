// src/scenes/MainScene.ts

import * as Phaser from "phaser";
import Ball from "../objects/Ball";
import Wind from "../objects/Wind";
import MapLoader from "../maploader/MapLoader";
import MouseControls from "../mousecontrols/MouseControls";
import {
  GRAVITY,
  DISTANCE_SCALING_FACTOR,
  LOFTS,
  DISTANCES,
  ROLLFRICTION,
} from "../constants";

export default class MainScene extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private mapLoader: MapLoader | undefined;
  public ball: Ball | null = null; // Made public for access in MouseControls
  private spacebar: Phaser.Input.Keyboard.Key | undefined;
  public aimAngle: number = 110; // Made public for access in KeyboardControls
  private selectedClub = 11;

  // Wind instance
  private wind: Wind | undefined;

  // Mouse Controls
  private mouseControls: MouseControls | undefined;

  constructor() {
    super("MainScene");
    window.phaserScene = this;
  }

  preload() {
    this.mapLoader = new MapLoader(this);
    this.mapLoader.loadAssets();

    // Load other assets
    this.load.image("ball", "/objects/ball.png");
    this.load.image("shadow", "/objects/shadow.png");
  }

  create() {
    this.mapLoader?.createTilemap();
    this.setupCamera();
    this.setupCursors();

    // Initialize wind
    this.wind = new Wind(0, 0); // Adjust initial wind speed and angle as needed

    // Display wind information
    this.displayWind();

    // Create the ball
    this.createBall();

    // Bind spacebar to trigger hitBall
    if (this.input.keyboard) {
      this.spacebar = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );
    }

    // Initialize Mouse Controls
    this.mouseControls = new MouseControls(this);

    this.events.emit("sceneCreated");
  }

  update(time: number, delta: number) {
    if (this.ball) {
      this.ball.update(delta);

      // Adjust aim angle with left/right keys
      if (this.cursors?.left.isDown) {
        this.aimAngle -= 1;
        console.log(`Aim Angle: ${this.aimAngle}`);
      }
      if (this.cursors?.right.isDown) {
        this.aimAngle += 1;
        console.log(`Aim Angle: ${this.aimAngle}`);
      }

      // Keep angle within 0-360 degrees
      if (this.aimAngle < 0) this.aimAngle += 360;
      if (this.aimAngle >= 360) this.aimAngle -= 360;

      // If spacebar is pressed, hit the ball
      if (this.spacebar?.isDown && this.ball.isStopped()) {
        this.hitBall();
      }

      // Camera follows the ball while it's moving
      if (!this.ball.isStopped()) {
        this.cameras.main.startFollow(this.ball, true, 0.1, 0.1);
      } else {
        // Stop following when the ball stops
        this.cameras.main.stopFollow();
      }
    }
  }

  private setupCamera() {
    const camera = this.cameras.main;
    if (this.mapLoader?.map) {
      camera.setBounds(
        0,
        0,
        this.mapLoader.map.widthInPixels,
        this.mapLoader.map.heightInPixels
      );
    }
    camera.setZoom(0.32);
  }

  private setupCursors() {
    if (this.input && this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
  }

  private createBall() {
    if (this.ball) {
      console.warn("Ball already exists!");
      return;
    }
    const initialX = 12750;
    const initialY = 2400;

    // Ensure wind is initialized
    const windVector = this.wind
      ? this.wind.vector
      : new Phaser.Math.Vector2(0, 0);

    // Ensure the tilemap is available
    if (!this.mapLoader?.map) {
      console.error("Tilemap not loaded yet!");
      return;
    }

    const tilemap = this.mapLoader.map;
    const tileSize = tilemap.tileWidth; // Assuming square tiles

    // Pass wind vector, tilemap, and tileSize to the ball
    this.ball = new Ball(
      this,
      initialX,
      initialY,
      GRAVITY,
      windVector,
      tilemap,
      tileSize
    );

    // Camera starts by following the ball
    this.cameras.main.startFollow(this.ball, true, 0.1, 0.1);
  }

  private displayWind() {
    const windText = this.add.text(
      10,
      10,
      this.wind ? this.wind.getWindInfo() : "Wind: N/A",
      {
        fontSize: "20px",
        color: "#ffffff",
      }
    );
    windText.setScrollFactor(0);
  }

  hitBall() {
    if (!this.ball) return;

    const loft = LOFTS[this.selectedClub];
    const distance = DISTANCES[this.selectedClub];
    const rollFriction = ROLLFRICTION[this.selectedClub];

    // Convert aim angle to radians
    const angleRad = Phaser.Math.DegToRad(this.aimAngle);
    const direction = new Phaser.Math.Vector2(
      Math.cos(angleRad),
      Math.sin(angleRad)
    );

    this.ball.hitBall(
      direction,
      distance,
      loft,
      DISTANCE_SCALING_FACTOR,
      rollFriction
    );

    // Camera follows the ball
    this.cameras.main.startFollow(this.ball, true, 0.1, 0.1);
  }
}
