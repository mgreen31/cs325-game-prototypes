"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
	
	//init vars:
	var player;
	var enemy;
	var platforms;
	var killzones;
	var score;
	var flames;//collectible
	
	var cursors;
	
	
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        this.load.image('sky','assets/sky.png');
		this.load.image('ground', 'assets/platform.png');
		this.load.image('flash', 'assets/flash.png');
    }
    
    function create() {
        //  A simple background for our game
		this.add.image(0,0, 'sky');
		
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = 300;
		this.physics.arcade.debug = false;

		//  The platforms group contains the ground and the 2 ledges we can jump on
		//platforms = this.physics.add.staticGroup();
		this.platforms = this.add.physicsGroup();

		this.platforms.create(0, 568, 'ground');
		this.platforms.create(400, 568, 'ground');
		
		this.platforms.setAll('body.allowGravity', false);
		this.platforms.setAll('body.immovable', true);

		// Define movement constants
		this.MAX_SPEED = 500; // pixels/second
		this.ACCELERATION = 1500; // pixels/second/second
		this.DRAG = 600; // pixels/second
		this.GRAVITY = 2600; // pixels/second/second
		this.JUMP_SPEED = -700; // pixels/second (negative y is up)

		// The player and its settings
		player = this.add.sprite(100, 450, 'flash');
		this.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.collideWorldBounds = true;
		player.body.bounce.y = 0.4;
		
		this.game.input.keyboard.addKeyCapture([
			Phaser.Keyboard.LEFT,
			Phaser.Keyboard.RIGHT,
			Phaser.Keyboard.UP,
			Phaser.Keyboard.DOWN
		]);

    }
    
    function update() {
		// Collide the player with the ground
		this.game.physics.arcade.collide(this.player, this.ground);

		if (this.leftInputIsActive()) {
			// If the LEFT key is down, set the player velocity to move left
			this.player.body.velocity.x = -this.MAX_SPEED;
		} else if (this.rightInputIsActive()) {
			// If the RIGHT key is down, set the player velocity to move right
			this.player.body.velocity.x = this.MAX_SPEED;
		} else {
			// Stop the player from moving horizontally
			this.player.body.velocity.x = 0;
		}
    }
	
	leftInputIsActive = function() {
		var isActive = false;

		isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
		isActive |= (this.game.input.activePointer.isDown &&
			this.game.input.activePointer.x < this.game.width/4);

		return isActive;
	};
	
	rightInputIsActive = function() {
		var isActive = false;

		isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
		isActive |= (this.game.input.activePointer.isDown &&
			this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

		return isActive;
	};
	
};
