// This example uses the Phaser 2.2.2 framework

// Copyright © 2014 John Watson
// Licensed under the terms of the MIT License

var GameState = function(game) {
};
// Load images and sounds
this.gameOver = false;
GameState.prototype.preload = function() {
    this.game.load.image('ground', 'assets/platform.png');
    this.game.load.image('player', 'assets/flash.png', { frameWidth: 16, frameHeight: 16 });
	this.game.load.image('enemy', 'assets/enemy.png', { frameWidth: 16, frameHeight: 16 });
	this.game.load.image('flame', 'assets/flame.png');
};

// Setup the example
GameState.prototype.create = function() {
    // Set stage background to something sky colored
    this.game.stage.backgroundColor = 0x4488cc;

    // Define movement constants
    this.MAX_SPEED = 500; // pixels/second
    this.ACCELERATION = 700; // pixels/second/second
    this.DRAG = 80; // pixels/second
    this.GRAVITY = 2600; // pixels/second/second
    this.JUMP_SPEED = -700; // pixels/second (negative y is up)

    // Create a player sprite
    this.player = this.game.add.sprite(this.game.width/2, this.game.height/2, 'player');
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    // Make player collide with world boundaries so he doesn't leave the stage
    this.player.body.collideWorldBounds = true;
    // Set player minimum and maximum movement speed
    this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y
    // Add drag to the player that slows them down when they are not accelerating
    this.player.body.drag.setTo(this.DRAG, 0); // x, y
    // Since we're jumping we need gravity
    game.physics.arcade.gravity.y = this.GRAVITY;
    // Flag to track if the jump button is pressed
    this.jumping = false;
	this.player.body.setSize(75,75,0, 50);
	
	// Create a follower
	enemy = new Follower(this.game, this.game.width/2, this.game.height/2, this.player);
    this.game.add.existing(enemy);
	this.physics.arcade.collide(this.player, enemy);
	enemy.body.setSize(50,50,0, 25);
	//this.player.body.onCollide = new Phaser.Signal();

    // Create some ground for the player to walk on
    this.ground = this.game.add.group();
    for(var x = 0; x < this.game.width; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = true;
        groundBlock.body.allowGravity = false;
        this.ground.add(groundBlock);
    }
	this.platforms = this.add.physicsGroup();

	this.platforms.create(-200, 300, 'ground');
	this.platforms.create(600, 300, 'ground');
	this.platforms.create(200, 100, 'ground');
		
	this.platforms.setAll('body.allowGravity', false);
	this.platforms.setAll('body.immovable', true);
	
	this.flames = this.game.add.group();
	
	this.flames.create(25,3500, 'flame');
	this.flames.create(7750, 3500, 'flame');
	
	this.flames.scale.setTo(.1,.1);

	this.physics.arcade.collide(this.player, this.flames);
	//this.physics.add.overlap(this.player, this.flames, hitFlame, null, this);

    // Capture certain keys to prevent their default actions in the browser.
    // This is only necessary because this is an HTML5 game. Games on other
    // platforms may not need code like this.
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);

    // Just for fun, draw some height markers so we can see how high we're jumping
    this.drawHeightMarkers();
};

// This function draws horizontal lines across the stage
GameState.prototype.drawHeightMarkers = function() {
    // Create a bitmap the same size as the stage
    var bitmap = this.game.add.bitmapData(this.game.width, this.game.height);

    // These functions use the canvas context to draw lines using the canvas API
    for(y = this.game.height-32; y >= 64; y -= 32) {
        bitmap.context.beginPath();
        bitmap.context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        bitmap.context.moveTo(0, y);
        bitmap.context.lineTo(this.game.width, y);
        bitmap.context.stroke();
    }

    this.game.add.image(0, 0, bitmap);
};

// The update() method is called every frame
GameState.prototype.update = function() {
	if(gameOver)
		return;
    // Collide the player with the ground
    this.game.physics.arcade.collide(this.player, this.ground);
	this.game.physics.arcade.collide(this.player, this.platforms);
	this.game.physics.arcade.collide(this.player, enemy);

    if (this.leftInputIsActive()) {
        // If the LEFT key is down, set the player velocity to move left
        this.player.body.acceleration.x = -this.ACCELERATION;
    } else if (this.rightInputIsActive()) {
        // If the RIGHT key is down, set the player velocity to move right
        this.player.body.acceleration.x = this.ACCELERATION;
    } else {
        this.player.body.acceleration.x = 0;
    }

    // Set a variable that is true when the player is touching the ground
    var onTheGround = this.player.body.touching.down;

    // If the player is touching the ground, let him have 2 jumps
    if (onTheGround) {
        this.jumps = 2;
        this.jumping = false;
    }

    // Jump! Keep y velocity constant while the jump button is held for up to 150 ms
    if (this.jumps > 0 && this.upInputIsActive(150)) {
        this.player.body.velocity.y = this.JUMP_SPEED;
        this.jumping = true;
    }

    // Reduce the number of available jumps if the jump input is released
    if (this.jumping && this.upInputReleased()) {
        this.jumps--;
        this.jumping = false;
    }
	
};

// This function should return true when the player activates the "go left" control
// In this case, either holding the right arrow or tapping or clicking on the left
// side of the screen.
GameState.prototype.leftInputIsActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    isActive |= (this.game.input.activePointer.isDown &&
        this.game.input.activePointer.x < this.game.width/4);

    return isActive;
};

// This function should return true when the player activates the "go right" control
// In this case, either holding the right arrow or tapping or clicking on the right
// side of the screen.
GameState.prototype.rightInputIsActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
    isActive |= (this.game.input.activePointer.isDown &&
        this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

    return isActive;
};

// This function should return true when the player activates the "jump" control
// In this case, either holding the up arrow or tapping or clicking on the center
// part of the screen.
GameState.prototype.upInputIsActive = function(duration) {
    var isActive = false;

    isActive = this.input.keyboard.downDuration(Phaser.Keyboard.UP, duration);
    isActive |= (this.game.input.activePointer.justPressed(duration + 1000/60) &&
        this.game.input.activePointer.x > this.game.width/4 &&
        this.game.input.activePointer.x < this.game.width/2 + this.game.width/4);

    return isActive;
};

// This function returns true when the player releases the "jump" control
GameState.prototype.upInputReleased = function() {
    var released = false;

    released = this.input.keyboard.upDuration(Phaser.Keyboard.UP);
    released |= this.game.input.activePointer.justReleased();

    return released;
};
GameState.prototype.hitFlame = function(){
    //this.game.physics.pause();

    //player.setTint(0xff0000);

    //gameOver = true;
};


// Follower constructor
var Follower = function(game, x, y, target) {
    Phaser.Sprite.call(this, game, x, y, 'enemy');
    // Save the target that this Follower will follow
    // The target is any object with x and y properties
    this.target = target;

    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);

    // Enable physics on this object
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

	this.scale.setTo(.15,.15);
    // Define constants that affect motion
    this.MAX_SPEED = 400; // pixels/second
    this.MIN_DISTANCE = 64; // pixels
};
// Followers are a type of Phaser.Sprite
Follower.prototype = Object.create(Phaser.Sprite.prototype);
Follower.prototype.constructor = Follower;

Follower.prototype.update = function() {
	var distance = this.game.math.distance(this.x, this.y, this.target.x, this.target.y);
	var rotation = this.game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);
	
	if(distance > this.MIN_DISTANCE){
		if(this.x < this.target.x){
			this.body.velocity.x = this.MAX_SPEED;
			//this.body.velocity.y = Math.sin(rotation) * this.MAX_SPEED*.75;
		}
		else{
			this.body.velocity.x = -this.MAX_SPEED;
			//this.body.velocity.y = Math.sin(rotation) * this.MAX_SPEED*.75;
		}
		if(this.y < this.target.y){
			this.body.velocity.y = this.MAX_SPEED*.5;
		}
		else{
			this.body.velocity.y = -this.MAX_SPEED*.5;
		}
	}
	else{
		if(this.x < this.target.x){
			this.target.body.velocity.x += this.MAX_SPEED/4;
		}
		else{
			this.target.body.velocity.x -= this.MAX_SPEED/4;
		}
	}
	
	/*
    // Calculate distance to target
    var distance = this.game.math.distance(this.x, this.y, this.target.x, this.target.y);

    // If the distance > MIN_DISTANCE then move
    if (distance > this.MIN_DISTANCE) {
        // Calculate the angle to the target
        var rotation = this.game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);

        // Calculate velocity vector based on rotation and this.MAX_SPEED
        this.body.velocity.x = Math.cos(rotation) * this.MAX_SPEED;
        this.body.velocity.y = Math.sin(rotation) * this.MAX_SPEED;
    } else {
        this.body.velocity.setTo(0, 0);
    }
	*/
};


var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);