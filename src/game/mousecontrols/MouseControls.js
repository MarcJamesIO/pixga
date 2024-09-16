// src/controls/MouseControls.js

import Phaser from "phaser";
import MainScene from "../scenes/MainScene";

export default class MouseControls {
  constructor(scene) {
    this.scene = scene;
    this.isDragging = false;
    this.dragStartPoint = new Phaser.Math.Vector2(0, 0);
    this.cameraStartScroll = new Phaser.Math.Vector2(0, 0);
    this.setupInput();
  }

  setupInput() {
    // Set up camera panning via mouse drag
    this.scene.input.on("pointerdown", this.onPointerDown, this);
    this.scene.input.on("pointermove", this.onPointerMove, this);
    this.scene.input.on("pointerup", this.onPointerUp, this);
    this.scene.input.on("pointerupoutside", this.onPointerUp, this);

    // Handle mouse wheel for zooming
    this.scene.input.on("wheel", (_pointer, _gameObjects, _deltaX, deltaY) => {
      this.handleMouseWheel(deltaY);
    });
  }

  onPointerDown(pointer) {
    if (this.scene.ball && this.scene.ball.isStopped()) {
      this.isDragging = true;
      this.dragStartPoint.set(pointer.x, pointer.y);
      this.cameraStartScroll.set(
        this.scene.cameras.main.scrollX,
        this.scene.cameras.main.scrollY
      );
      this.scene.cameras.main.stopFollow();
    }
  }

  onPointerMove(pointer) {
    if (this.isDragging) {
      const dragDistanceX = pointer.x - this.dragStartPoint.x;
      const dragDistanceY = pointer.y - this.dragStartPoint.y;

      this.scene.cameras.main.scrollX =
        this.cameraStartScroll.x - dragDistanceX / this.scene.cameras.main.zoom;
      this.scene.cameras.main.scrollY =
        this.cameraStartScroll.y - dragDistanceY / this.scene.cameras.main.zoom;
    }
  }

  onPointerUp() {
    if (this.isDragging) {
      this.isDragging = false;
    }
  }

  handleMouseWheel(deltaY) {
    const zoomChange = deltaY * -0.001;
    const newZoom = Phaser.Math.Clamp(
      this.scene.cameras.main.zoom + zoomChange,
      0.1,
      2
    );

    this.scene.tweens.add({
      targets: this.scene.cameras.main,
      zoom: newZoom,
      duration: 100,
      ease: "Sine.easeInOut",
    });
  }
}
