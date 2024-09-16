import * as Phaser from "phaser";

export default class MapLoader {
  constructor(scene) {
    this.scene = scene;
    this.map = undefined;
    this.groundLayer = null;
  }

  loadAssets() {
    console.log("Loading assets...");
    // Load ground tiles (keep these as normal images)
    this.scene.load.image("grassland", "/maps/test/grassland.png");
    this.scene.load.image("fairway", "/maps/test/fairway.png");
    this.scene.load.image("fairway-green", "/maps/test/green.png");
    this.scene.load.image("bunkers", "/maps/test/bunkers.png");

    // Load tree spritesheets only
    this.scene.load.spritesheet(
      "Tree1",
      "/maps/test/Large Spruce Tree - GREEN - Spritesheet.png",
      {
        frameWidth: 74,
        frameHeight: 128,
      }
    );
    this.scene.load.spritesheet(
      "Tree2",
      "/maps/test/Large Spruce Tree - TEAL - Spritesheet.png",
      {
        frameWidth: 74,
        frameHeight: 128,
      }
    );
    this.scene.load.spritesheet(
      "Tree3",
      "/maps/test/Large Spruce Tree - YELLOW - Spritesheet.png",
      {
        frameWidth: 74,
        frameHeight: 128,
      }
    );
    this.scene.load.spritesheet(
      "Tree4",
      "/maps/test/Bubble Pine Tree - GREEN_TEAL - Spritesheet.png",
      {
        frameWidth: 51,
        frameHeight: 91,
      }
    );
    this.scene.load.spritesheet(
      "Tree5",
      "/maps/test/Slim Spruce Tree - GREEN_TEAL - Spritesheet.png",
      {
        frameWidth: 48,
        frameHeight: 92,
      }
    );

    // Load the tilemap JSON
    this.scene.load.tilemapTiledJSON(
      "map",
      "/maps/quailhollow/QuailHollow1.json"
    );
  }

  createTilemap() {
    this.map = this.scene.make.tilemap({ key: "map" });

    if (this.map) {
      // Add ground tilesets only (these can remain images)
      const grasslandTileset = this.map.addTilesetImage(
        "grassland",
        "grassland"
      );
      const fairwayTileset = this.map.addTilesetImage("fairway", "fairway");
      const bunkerTileset = this.map.addTilesetImage("bunkers", "bunkers");

      if (!grasslandTileset || !fairwayTileset || !bunkerTileset) {
        console.error("Tileset not found!");
        return; // Exit if any tileset is missing
      }

      // Create the ground layer
      this.groundLayer = this.map.createLayer(
        "Tile Layer 1",
        [grasslandTileset, fairwayTileset, bunkerTileset],
        0,
        0
      );
      this.groundLayer?.setScrollFactor(1);
      this.groundLayer?.setCollisionByProperty({ collides: true });

      // Manually place trees using spritesheet frame (using frame 0 for static trees)
      this.placeTreeTilesFromSpritesheet();

      // Create tree animations for animated trees
      this.createTreeAnimations();

      // Create animated trees from object layer using gid
      this.createTreesFromObjectLayer();

      // Set camera bounds to match map size
      this.scene.cameras.main.setBounds(
        0,
        0,
        this.map.widthInPixels,
        this.map.heightInPixels
      );
    }
  }

  placeTreeTilesFromSpritesheet() {
    // Example of manually placing static tree tiles from the spritesheets
    this.map.createBlankLayer("Tree Layer", [this.map.tilesets[0]], 0, 0);

    // Manually add frame 0 of the spritesheet as static tiles at specific locations
    const treeSpriteTexture = "Tree1"; // Use the correct texture (spritesheet)
    this.scene.add.image(100, 100, treeSpriteTexture, 0); // Using frame 0 from spritesheet for static tile placement
    // You can add more trees as needed
  }

  createTreeAnimations() {
    // Define an animation for each tree based on the spritesheets
    this.scene.anims.create({
      key: "Tree1Anim",
      frames: this.scene.anims.generateFrameNumbers("Tree1", {
        start: 0,
        end: 10,
      }), // Adjust 'end' based on number of frames
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "Tree2Anim",
      frames: this.scene.anims.generateFrameNumbers("Tree2", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "Tree3Anim",
      frames: this.scene.anims.generateFrameNumbers("Tree3", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "Tree4Anim",
      frames: this.scene.anims.generateFrameNumbers("Tree4", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "Tree5Anim",
      frames: this.scene.anims.generateFrameNumbers("Tree5", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });
  }

  createTreesFromObjectLayer() {
    // Access the object layer in the tilemap
    const treeObjectsLayer = this.map?.getObjectLayer("Trees");

    if (treeObjectsLayer) {
      treeObjectsLayer.objects.forEach((treeObject) => {
        const gid = treeObject.gid;

        if (gid) {
          const x = treeObject.x ?? 0;
          const y = (treeObject.y ?? 0) - (treeObject.height ?? 0); // Adjust y to account for object origin

          let treeSpriteKey = "";
          let treeAnimationKey = "";

          switch (gid) {
            case 577: // GID for Tree1
              treeSpriteKey = "Tree1";
              treeAnimationKey = "Tree1Anim";
              break;
            case 602: // GID for Tree2
              treeSpriteKey = "Tree2";
              treeAnimationKey = "Tree2Anim";
              break;
            case 627: // GID for Tree3
              treeSpriteKey = "Tree3";
              treeAnimationKey = "Tree3Anim";
              break;
            case 682: // GID for Tree4
              treeSpriteKey = "Tree4";
              treeAnimationKey = "Tree4Anim";
              break;
            case 652: // GID for Tree4
              treeSpriteKey = "Tree5";
              treeAnimationKey = "Tree5Anim";
              break;

            default:
              console.warn(`Unknown tree gid: ${gid}`);
              break;
          }

          if (treeSpriteKey) {
            const treeSprite = this.scene.add.sprite(x, y, treeSpriteKey);
            treeSprite.setOrigin(0.5, 1);
            treeSprite.setDepth(10);

            const objectWidth = treeObject.width ?? treeSprite.width;
            const objectHeight = treeObject.height ?? treeSprite.height;

            const scaleX = objectWidth / treeSprite.width;
            const scaleY = objectHeight / treeSprite.height;
            treeSprite.setScale(scaleX, scaleY);

            // Play the corresponding animation
            treeSprite.anims.play(treeAnimationKey);
          }
        }
      });
    } else {
      console.warn("Tree object layer not found.");
    }
  }
}
