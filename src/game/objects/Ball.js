import * as Phaser from "phaser";

export default class Ball extends Phaser.GameObjects.Image {
  constructor(
    scene,
    x,
    y,
    gravity,
    wind,
    tilemap, // Pass the tilemap
    tileSize // Pass the tile size
  ) {
    super(scene, x, y, "ball");
    this.ballVelocity = new Phaser.Math.Vector2(0, 0);
    this.gravity = gravity;
    this.zPos = 0;
    this.zVel = 0;
    this.elasticity = 0.4;
    this.frictionCoefficient = 50; // Default friction deceleration per second
    this.stopThreshold = 0.15;
    this.bounceVelocityReduction = 0.5;
    this.ballPosition = new Phaser.Math.Vector2(x, y);
    this.wind = wind;
    this.tilemap = tilemap;
    this.tileSize = tileSize;

    scene.add.existing(this);
    this.setScale(5);
    this.setDepth(2);

    // Create shadow
    this.shadow = scene.add.image(x, y, "shadow");
    this.shadow.setScale(5);
    this.shadow.alpha = 0.5;
    this.shadow.setDepth(1);
  }

  update(delta) {
    const deltaInSeconds = delta * 0.001;

    // Apply wind only if the ball is airborne
    if (this.zPos > 0 || this.zVel !== 0) {
      const windAcceleration = this.wind.clone();
      const windVelocityChange = windAcceleration.scale(deltaInSeconds);
      this.ballVelocity.add(windVelocityChange);
    }

    // Update logical position based on velocity
    this.ballPosition.x += this.ballVelocity.x * deltaInSeconds;
    this.ballPosition.y += this.ballVelocity.y * deltaInSeconds;

    // Simulate the z-axis movement (vertical trajectory)
    if (this.zPos > 0 || this.zVel !== 0) {
      this.zVel += this.gravity * deltaInSeconds;
      this.zPos += this.zVel * deltaInSeconds;

      // Ball hits the ground (bounce effect)
      if (this.zPos <= 0) {
        this.zPos = 0;
        if (Math.abs(this.zVel) > 50) {
          this.zVel = -this.zVel * this.elasticity;
          this.ballVelocity.scale(this.bounceVelocityReduction);
        } else {
          this.zVel = 0;
        }
      }
    }

    // Set the ball's position (adjust Y for z-axis simulation)
    this.setX(this.ballPosition.x);
    this.setY(this.ballPosition.y - this.zPos);

    // Update the shadow's position (without z-axis adjustment)
    if (this.shadow) {
      this.shadow.setX(this.ballPosition.x);
      this.shadow.setY(this.ballPosition.y);
    }

    // Apply friction and slope when the ball is rolling on the ground
    if (this.zPos === 0 && this.zVel === 0) {
      const tile = this.getTileAtCurrentPosition();

      let slopeAcceleration = new Phaser.Math.Vector2(0, 0);
      let tileFrictionCoefficient = this.frictionCoefficient; // Default friction coefficient

      if (tile) {
        if (
          tile.properties.slopeX !== undefined &&
          tile.properties.slopeY !== undefined
        ) {
          slopeAcceleration = new Phaser.Math.Vector2(
            tile.properties.slopeX,
            tile.properties.slopeY
          );
        }

        if (tile.properties.frictionCoefficient !== undefined) {
          tileFrictionCoefficient = tile.properties.frictionCoefficient;
        }
      }

      const slopeVelocityChange = slopeAcceleration.scale(deltaInSeconds);
      this.ballVelocity.add(slopeVelocityChange);

      if (this.ballVelocity.length() > 0) {
        const frictionDecelerationMagnitude =
          tileFrictionCoefficient * deltaInSeconds;
        const speed = this.ballVelocity.length();

        if (frictionDecelerationMagnitude >= speed) {
          this.ballVelocity.set(0, 0);
        } else {
          const frictionDeceleration = this.ballVelocity
            .clone()
            .negate()
            .normalize()
            .scale(frictionDecelerationMagnitude);
          this.ballVelocity.add(frictionDeceleration);
        }
      }

      if (
        this.ballVelocity.lengthSq() <
        this.stopThreshold * this.stopThreshold
      ) {
        this.ballVelocity.set(0, 0);
      }
    }
  }

  getTileAtCurrentPosition() {
    const tileX = Math.floor(this.ballPosition.x / this.tileSize);
    const tileY = Math.floor(this.ballPosition.y / this.tileSize);
    const tile = this.tilemap.getTileAt(tileX, tileY);
    return tile;
  }

  hitBall(
    direction,
    distance,
    loft,
    distanceScalingFactor,
    frictionCoefficient
  ) {
    const gravityAbs = Math.abs(this.gravity);
    this.zVel = Math.sqrt(2 * gravityAbs * loft);
    this.frictionCoefficient = frictionCoefficient;
    direction.normalize();

    const timeToApex = this.zVel / gravityAbs;
    const totalFlightTime = 2 * timeToApex;
    const scaledDistance = distance * distanceScalingFactor;
    const horizontalVelocity = scaledDistance / totalFlightTime;

    this.ballVelocity = direction.clone().scale(horizontalVelocity);
    this.zPos = 0;
  }

  isStopped() {
    return (
      this.ballVelocity.lengthSq() === 0 && this.zVel === 0 && this.zPos === 0
    );
  }

  getPosition() {
    return this.ballPosition.clone();
  }

  setTileProperties(tileX, tileY, properties) {
    const tile = this.tilemap.getTileAt(tileX, tileY);
    if (tile) {
      Object.assign(tile.properties, properties);
    }
  }
}
