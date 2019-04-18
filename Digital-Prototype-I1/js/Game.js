"use strict";

GameStates.makeGame = function( game, shared ) {

	var player;
	var pointer;
	var grappling;
	var gdist;
	var accel;
	var drag;

    var map;
	//layers
	var ground;
	var grapple;
	var bg;
	var oob;
	var goal;
	
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
		console.log("QUITTING GAME");
        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
	function win(){
		console.log("GAME FINISHED");
		game.state.start('WinMenu');
	}
	
	function playerMovement(){
		if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
			player.body.acceleration.x -= accel;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
			player.body.acceleration.x += accel;
		}
		else if(!game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			//player.body.acceleration.x = 0;
			//player.body.velocity.x = 0;
		}
	}
	function ptrListener(){
		//pointer.x = game.input.mousePointer.x-5;
		//pointer.y = game.input.mousePointer.y+475;
		pointer.x = game.input.mousePointer.worldX;
		pointer.y = game.input.mousePointer.worldY;
	}
	function p_ptr_dist(){
		var dx = player.x - pointer.x;
		var dy = player.y - pointer.y;
		return Math.sqrt(dx*dx+dy*dy);
	}
	function playerGrapple(){
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			/*
			if(player.x > pointer.x+20 && p_ptr_dist() < gdist){
				player.body.acceleration.x -= ((1/(Math.abs(player.x-pointer.x)))*10000);
			}
			else if(player.x < pointer.x-20 && p_ptr_dist() < gdist){
				player.body.acceleration.x += ((1/(Math.abs(player.x-pointer.x)))*10000);
			}
			if(player.y > pointer.y+20 && p_ptr_dist() < gdist){
				game.physics.arcade.gravity.y = 0;
				player.body.acceleration.y -= ((1/(Math.abs(player.y-pointer.y)))*10000);
			}
			else if(player.y < pointer.y-20 && p_ptr_dist() < gdist){
				player.body.acceleration.y += ((1/(Math.abs(player.y-pointer.y)))*100);
			}
			else{
				game.physics.arcade.gravity.y = 900;
			}
			*/
			if(player.x > pointer.x+20 && p_ptr_dist() < gdist){
				player.body.acceleration.x -= ((1/p_ptr_dist())*10000);
			}
			else if(player.x < pointer.x-20 && p_ptr_dist() < gdist){
				player.body.acceleration.x += ((1/p_ptr_dist())*10000);
			}
			if(player.y > pointer.y+20 && p_ptr_dist() < gdist){
				game.physics.arcade.gravity.y = 0;
				player.body.acceleration.y -= ((1/p_ptr_dist())*10000);
			}
			else if(player.y < pointer.y-20 && p_ptr_dist() < gdist){
				player.body.acceleration.y += ((1/p_ptr_dist())*100);
			}
			else{
				game.physics.arcade.gravity.y = 900;
			}
		}
		else{
			game.physics.arcade.gravity.y = 900;
		}
	}
	
	function checkGrapple(){
		//update pointer position
		grappling = true;
	}
	
	function render(){
			game.debug.camerInfo(game.camera, 32, 32);
			game.debug.spriteCoords(player, 32, 500);
	}
	
	function p(pointer) {
		console.log(pointer.event);
	}
    
    return {
    
        create: function () {
			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.physics.arcade.gravity.y = 900;
			
			drag = .90;
			grappling = false;
			accel = 200;
			gdist = 1000;
			game.world.setBounds(0,0,3200,1920);
			
			map = game.add.tilemap('map2');
			map.addTilesetImage('tilesGB');
			map.addTilesetImage('tileGoal');
			map.addTilesetImage('hazard');
			
			bg = map.createLayer('Background');
			oob = map.createLayer('oob');//Out-Of-Bounds
			grapple = map.createLayer('grapple');
			ground = map.createLayer('ground');
			goal = map.createLayer('goal');
			
			//ground.resizeWorld();
			
			// Collision
			game.physics.arcade.enable(ground);
			game.physics.arcade.enable(grapple);
			game.physics.arcade.enable(goal);
			game.physics.arcade.enable(oob);
			
			//TILES ARE NOT 0 INDEXED, START AT 1 (i.e. +1 to tile id from Tiled)
			map.setCollision([0,1,2,3,57,58,59,60,61, 62, 63],true,ground);
			map.setCollision([4,5,6],true,grapple);
			map.setCollision([0,1,2,2012,2013, 2014,2015, 2016],true,goal);
			map.setCollision([0,1,2,2012,2013,2014,2015],true,oob);
			
			//map.setTileIndexCallback(1, function(){console.log("HFDKLGJIJIEF");}, game, ground);
			map.setTileIndexCallback([0,1,2,2012,2013,2014,2015], function(){ quitGame();}, game, oob);
			map.setTileIndexCallback([4,5,6], function(){checkGrapple();}, game, grapple);
			map.setTileIndexCallback([0,1,2,2012,2013, 2014,2015, 2016], function(){win();}, game, goal);
			
			//grapple.input.addMoveCallback(p, this);
			
			//player
			player = game.add.sprite(230, 1690, 'cubel');
			player.scale.setTo(1, 1);
			game.physics.enable(player);
			player.body.collideWorldBounds = true;
			player.body.maxVelocity.x = 600;
			//player.body.drag.x = 2*accel;
			
			//player.body.maxVelocity.y = 1000;

			
			pointer = game.add.sprite(200, 1680, 'cubel');
			pointer.scale.setTo(0.5, 0.5);
			
			game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
			
			//tracking key presses
			game.input.keyboard.addKeyCapture([
				Phaser.Keyboard.A,
				Phaser.Keyboard.D,
				Phaser.Keyboard.W,
				Phaser.Keyboard.S,
				Phaser.Keyboard.E,
				Phaser.Keyboard.SPACEBAR
			]);
			
			game.physics.gravity = 0;
			
			},
    
        update: function () {
			
			//collision
			//game.physics.arcade.TILE_BIAS = 32;
			game.physics.arcade.collide(player, ground);
			game.physics.arcade.collide(pointer, grapple);
			game.physics.arcade.collide(player, goal);
			game.physics.arcade.collide(player, oob);
			
			
			//player movement
			playerMovement();
			player.body.velocity.x *= drag;
			//player.body.velocity.y *= drag;
			player.body.acceleration.x *= drag;
			player.body.acceleration.y *= drag;
			
			//player gadget actions
			//update ptr pos
			if(game.input.activePointer.leftButton.isDown){
				//pointer.x = game.input.mousePointer.x-5;
				//pointer.y = game.input.mousePointer.y+475;
				pointer.x = game.input.mousePointer.worldX;
				pointer.y = game.input.mousePointer.worldY;
			}
			//if(grappling){
				console.log("update: grappling");
				console.log("VX" + player.body.velocity.x);
				console.log("AX" + player.body.acceleration.x);
				console.log("AY" + player.body.acceleration.y);
				playerGrapple();
			//}
			/*
			pointer.x = game.input.mousePointer.x-5;
			pointer.y = game.input.mousePointer.y+475;
			*/
			/*if(grapple.input.pointerOver()){
				grapple.alpha = 1;
			}
			else{
				grapple.alpha = 0.5;
			}*/

        }
    };
};