// src/objects/Wind.js

export default class Wind {
  constructor(speed = 0, angle = 0) {
    this.speed = speed;
    this.angle = angle;
    this.vector = this.calculateWindVector();
  }

  calculateWindVector() {
    const windAngleRad = Phaser.Math.DegToRad(this.angle);
    return new Phaser.Math.Vector2(
      Math.cos(windAngleRad),
      Math.sin(windAngleRad)
    ).scale(this.speed);
  }

  setWind(speed, angle) {
    this.speed = speed;
    this.angle = angle;
    this.vector = this.calculateWindVector();
  }

  getWindInfo() {
    return `Wind: ${this.speed.toFixed(1)} at ${this.angle.toFixed(1)}°`;
  }
}
