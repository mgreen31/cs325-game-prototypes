window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/v2.6.2/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 320, 320, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'logo', 'assets/phaser.png' );
		game.load.spritesheet( 'penguin', 'assets/penguin.png', 41, 42, 64);
		game.load.spritesheet( 'glass', 'assets/water.png',16,16,5);
        // load a tilemap and call it 'map'.
        // from .json file
        game.load.tilemap('map', 'assets/GlassesMap.json', null, Phaser.Tilemap.TILED_JSON);
        // alternatively, from .csv file
        //game.load.tilemap('map', 'assets/tilemap_example.csv', null, Phaser.Tilemap.CSV);
        
        //load tiles for map
        game.load.image('OutdoorsTileset', 'assets/OutdoorsTileset.png');
    }
    
    var map;
    var layer1;
    var bouncy;
	var ground;
	var sand;
	var water;
	var rocks;
	
	var player;
	var accel;
	var water;
    
	var glass;
	
    function create() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//init vars
		accel = 100;
		water = 100;
		
        // Create the map. 
        map = game.add.tilemap('map');
        // for csv files specify the tile size.
        //map = game.add.tilemap('map', 16, 16);
        
        //add tiles
        map.addTilesetImage('16','OutdoorsTileset');
        
        // Create a layer from the map
        //using the layer name given in the .json file
        //layer1 = map.createLayer('Tile Layer 1');
        //for csv files
        //layer1 = map.createLayer(0);
		ground = map.createLayer(0);
		sand = map.createLayer(1);
		water = map.createLayer(2);
		rocks = map.createLayer(3);
        
        //  Resize the world
        //ground.scale.setTo(3);
		//sand.scale.setTo(3);
		//water.scale.setTo(3);
		//rocks.scale.setTo(3);
       
		// Collision
		game.physics.arcade.enable(ground);
		game.physics.arcade.enable(sand);
		game.physics.arcade.enable(water);
		game.physics.arcade.enable(rocks);
	   
		//map.setCollisionBetween(1, 64);
		//game.physics.enable(rocks);
		map.setCollision([16,17,18,32,33,34,35,36,52,53,54,55,56],true,rocks);
		map.setCollision([37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],true,water);
	   
		//player
		player = game.add.sprite(game.width/2, game.height/2, 'penguin');
		player.scale.setTo(.33, .33);
		game.physics.enable(player);
		player.body.collideWorldBounds = true;
		player.body.gravity.y = 0;
		//player.body.enable = true;
		//player.body.immovable = false;
		
		glass = game.add.sprite(game.width2, game.height/2, 'glass');
		game.physics.enable(glass);
		glass.body.immovable = true;
		glass.body.gravity = false;
		
		var fill = glass.animations.add('fill', [0,1,2,3,4], 3, true);
		glass.animations.play('fill');

		//tracking key presses
		game.input.keyboard.addKeyCapture([
			Phaser.Keyboard.A,
			Phaser.Keyboard.D,
			Phaser.Keyboard.W,
			Phaser.Keyboard.S,
			Phaser.Keyboard.E
		]);
		game.physics.gravity = 0;
        
    }
    
    function update() {
        //collision
		game.physics.arcade.TILE_BIAS = 16;
		game.physics.arcade.collide(player, rocks);
		game.physics.arcade.overlap(player, water, fill, null, this);
		
		//control
		playerMovement();
	}
	
	function playerMovement(){
		if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
			player.body.velocity.x = -accel;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
			player.body.velocity.x = accel;
		}
		else{
			player.body.velocity.x = 0;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
			player.body.velocity.y = -accel;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
			player.body.velocity.y = accel;
		}
		else{
			player.body.velocity.y = 0;
		}
	}
	function playerShootWater(){
		
	}
	
	function fill (){
		water = 100;
	}
};
