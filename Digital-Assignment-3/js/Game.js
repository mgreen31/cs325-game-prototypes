"use strict";

GameStates.makeGame = function( game, shared ) {
    //Global vars
	var arrowsr;//left screen pointing right
	var arrowsl;//right screen pointing left
	var arrowsd;//top screen pointing down
	var arrowsu;//bottom screen pointing up
	var player;
	var redbulls;
	var rActive;//number of redbulls on screen
	var timer;
	var secs;
	var clockText;
	// Define movement constants
    var max_speed; // pixels/second
    var accel; // pixels/second/second
    var grav;// pixels/second/second
    var jump_speed;// pixels/second (negative y is up)
	var pjump;
	var currentWind;//0 for right, 1 for left, 2 for down, 3 for up
	var windAccel;
	var scoreText;
	var score;
	var clockTotal;
	var clockTotalText;
	var music = null;
	var windsfx = null;
	var wingsfx = null;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
		music.stop();
		windsfx.stop();
		wingsfx.stop();
        game.state.start('GameOver');

    }
	
	function clockUpdate() {
		secs--;
		clockTotal++;
		console.log("clockTotal = " + clockTotal);
		if(secs == 0){
			secs = 3;
			changeWind();
			if(rActive == 0)
				updateRedbull();
		}
		clockText.setText("Wind Change!: " + secs + "s");
		/*if(clockTotal%5 == 0){
			updateRedbull();
		}*/
		clockTotalText.setText("Time: " + clockTotal + "s");
	}
	
	function changeWind() {
		var rand = Math.floor(Math.random()*4);
		grav = Math.random()*300 + 1100;
		windsfx.stop();
		windsfx.play();
		switch(rand){
			case 0:
				windRight();
				break;
			case 1:
				windLeft();
				break;
			case 2:
				windDown();
				break;
			case 3:
				windUp();
				break;
			default:
				break;
		}
	}
	
	function windRight() {
		windAccel = 200;
		currentWind = 0;
		for(var i = 0; i < 5; i++){
			arrowsr[i].visible = true;
			arrowsl[i].visible = false;
			arrowsd[i].visible = false;
			arrowsu[i].visible = false;
		}
	}
	function windLeft() {
		windAccel = -200;
		currentWind = 1;
		for(var i = 0; i < 5; i++){
			arrowsr[i].visible = false;
			arrowsl[i].visible = true;
			arrowsd[i].visible = false;
			arrowsu[i].visible = false;
		}
	}
	function windDown() {
		windAccel = 200;
		currentWind = 2;
		for(var i = 0; i < 5; i++){
			arrowsr[i].visible = false;
			arrowsl[i].visible = false;
			arrowsd[i].visible = true;
			arrowsu[i].visible = false;
		}
	}
	function windUp() {
		windAccel = -400;
		currentWind = 3;
		for(var i = 0; i < 5; i++){
			arrowsr[i].visible = false;
			arrowsl[i].visible = false;
			arrowsd[i].visible = false;
			arrowsu[i].visible = true;
		}
	}
	
	function playerMovement(){
		if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
			player.body.acceleration.x = -accel;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
			player.body.acceleration.x = accel;
		}
		else{
			player.body.acceleration.x = 0;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
			player.body.velocity.y = jump_speed;
			wingsfx.play();
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
			player.body.acceleration.y = -jump_speed*2;
		}
		else{
			player.body.acceleration.y = 0;
		}
	}
	function collectRedbull (player, redbull){
		rActive--;
		console.log("Player collected redbull");
		redbull.visible = false;
		redbull.body.x = game.width+50;
		redbull.body.y = game.height+50;
		redbull.body.enable = false;
		//  Add and update the score
		score += 10;
		scoreText.setText('Score: ' + score);
	}
	function updateRedbull(){
		rActive = 3;
		console.log("Updating Redbull");
		for(var i = 0; i < redbulls.children.length; i++){
			redbulls.children[i].visible = true;
			redbulls.children[i].body.enable = true;
			redbulls.children[i].x = (Math.random()*(game.width-100))+50;
			redbulls.children[i].y = (Math.random()*(game.height-100))+50;
		}
	}
    
    return {
    
        create: function () {
			secs = 3;
			score = 0;
			clockTotal = 0;
			clockText;
			max_speed = 200; // pixels/second
			accel = 900; // pixels/second/second
			grav = 1100; // pixels/second/second
			jump_speed = -300; // pixels/second (negative y is up)
			currentWind = -1//0 for right, 1 for left, 2 for down, 3 for up
			windAccel = 100;
			rActive = 3;
			
			music = game.add.audio('gameMusic');
            music.play();
			windsfx = game.add.audio('wind');
			wingsfx = game.add.audio('wing');
			
			game.add.image(0,0,'sky');
			
			//arrows left
			arrowsr = new Array(5);
			for(var i = 0; i < 5; i++){
				arrowsr[i] = game.add.sprite(48, (i*200)+64, 'arrow');
				arrowsr[i].width = 150;
				arrowsr[i].height = 75;
				arrowsr[i].visible = false;
			}
			//arrows right
			arrowsl = new Array(5);
			for(var i = 0; i < 5; i++){
				arrowsl[i] = game.add.sprite(game.width-48, (i*200)+64, 'arrow');
				arrowsl[i].width = -150;
				arrowsl[i].height = 75;
				arrowsl[i].visible = false;
			}
			//arrows up
			arrowsd = new Array(5);
			for(var i = 0; i < 5; i++){
				arrowsd[i] = game.add.sprite((i*296)+290, 0, 'arrow');
				arrowsd[i].width = 150;
				arrowsd[i].height = 75;
				arrowsd[i].angle = 90;
				arrowsd[i].visible = false;
			}
			//arrows down
			arrowsu = new Array(5);
			for(var i = 0; i < 5; i++){
				arrowsu[i] = game.add.sprite((i*296)+290, game.height, 'arrow');
				arrowsu[i].width = 150;
				arrowsu[i].height = -75;
				arrowsu[i].angle = -90;
				arrowsd[i].visible = false;
			}
			timer = game.time.create(false);
			timer.loop(1000,clockUpdate, this);
			timer.start();
			
			clockTotalText = game.add.text(16, 0, 'Time: -s', { fontSize: '32px', fill: '#000' });
			clockText = game.add.text(16, 32, 'Wind Change!: 3s', { fontSize: '32px', fill: '#000' });
			scoreText = game.add.text(16, 64, 'Score: --', { fontSize: '32px', fill: '#000' });
			
			//player
			player = game.add.sprite(game.width/2, 400, 'birdperson');
			player.scale.setTo(.5, .5);
			game.physics.enable(player, Phaser.Physics.ARCADE);
			//player.body.collideWorldBounds = true;
			game.physics.arcade.gravity.y = grav;
			pjump = false;
			
			//collectible
			redbulls = game.add.group();
			for(var i = 0; i < 3; i++){
				//var redbull = game.add.sprite(game.width, game.height, 'redbull');
				var redbull = game.add.sprite((Math.random()*(game.width-100))+50, (Math.random()*(game.height-100))+50, 'redbull');
				redbull.scale.setTo(.1, .1);
				game.physics.enable(redbull, Phaser.Physics.ARCADE);
				redbull.body.immovable = true;
				redbull.body.allowGravity = false;//later they will move with wind/gravity
				redbull.visible = true;
				redbulls.add(redbull);
			}
			
			var anim = player.animations.add('fly');
			player.animations.play('fly', 10, true);
			
			
			
			//tracking key presses
			game.input.keyboard.addKeyCapture([
				Phaser.Keyboard.A,
				Phaser.Keyboard.D,
				Phaser.Keyboard.W,
				Phaser.Keyboard.S,
			]);
			game.physics.arcade.gravity.y = grav;
			game.physics.arcade.gravity.x = 0;
        },
    
        update: function () {
			playerMovement();
			if(player.body.x > game.width || player.body.x < -80 || player.body.y < -80 || player.body.y > game.height){
				quitGame();
			}
			game.physics.arcade.overlap(player, redbulls, collectRedbull, null, this);
			console.log("currentWind = " + currentWind);
			switch(currentWind){
				case 0:
					game.physics.arcade.gravity.y = grav;
					game.physics.arcade.gravity.x = grav/2;
					//player.body.acceleration.x += windAccel;
					break
				case 1:
					game.physics.arcade.gravity.y = grav;
					game.physics.arcade.gravity.x = -grav/2;
					//player.body.acceleration.x -= windAccel;
					break;
				case 2:
					game.physics.arcade.gravity.y = grav*2;
					game.physics.arcade.gravity.x = 0;
					//player.body.acceleration.y -= windAccel;
					break;
				case 3:
					game.physics.arcade.gravity.y = -grav/4;
					game.physics.arcade.gravity.x = 0;
					//player.body.acceleration.y += windAccel;
					break;
				default:
					break;
			}
        }
    };
};
