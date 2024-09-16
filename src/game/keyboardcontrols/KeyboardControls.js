// Import MainScene
import MainScene from "../scenes/MainScene";

export default class KeyboardControls {
  constructor(scene) {
    this.scene = scene;

    if (!this.scene.input.keyboard) {
      throw new Error("Keyboard input is not available");
    }

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.spacebar = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  update() {
    if (this.scene.ball) {
      // Adjust aim angle with left/right keys
      if (this.cursors.left.isDown) {
        this.scene.aimAngle -= 1;
        console.log(`Aim Angle: ${this.scene.aimAngle}`);
      }
      if (this.cursors.right.isDown) {
        this.scene.aimAngle += 1;
        console.log(`Aim Angle: ${this.scene.aimAngle}`);
      }

      // Keep angle within 0-360 degrees
      if (this.scene.aimAngle < 0) this.scene.aimAngle += 360;
      if (this.scene.aimAngle >= 360) this.scene.aimAngle -= 360;

      // If spacebar is pressed, hit the ball
      if (this.spacebar.isDown && this.scene.ball.isStopped()) {
        this.scene.hitBall();
      }
    }
  }
}
