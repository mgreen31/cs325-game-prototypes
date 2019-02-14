var game = new Phaser.Game( 1200, 750, Phaser.AUTO, 'game',{ preload: preload, create: create, update: update } );
console.log("var game created");

//global vars
var ground;
var wall;

var coffee1;
var ladder1;
var ladder2;
var dynamite1;
var detonator1;

var player1;
var p1Text;
var p1AtWall = false;
var p1Interact = false;
var p1HasCoffee = false;
var p1TriedLadder = false;
var p1HasDetonator = false;

var player2;
var p2Text;
var p2AtWall = false;
var p2Interact = false;
var p2HasCoffee = false;
var p2SentCoffee = false;
var p2TriedLadder = false;
var p2HasDetonator = false;
var p2HasDynamite = false;

var p1jump;
var p2jump;

var npc1;
var npc1Text;
var npc1Dial;
var npc1Tn = 0; 

var npc2;
var npc2Text;
var npc2Dial;
var npc2Tn = 0;

var overlay;

var gameover = false;
    
function preload() {
	console.log("preload called");
	//preload background and environment assets
	game.load.image('sky', 'assets/sky.png');
	game.load.image('ground', 'assets/grass.png');
	game.load.image('wall', 'assets/wall.png');
	//preload player1 and player2, etc, `1 assets
	game.load.image('red', 'assets/Red.png');
    game.load.image('green', 'assets/Green.png');
    game.load.image('blue', 'assets/Blue.png');
	console.log("images loaded");
	//preload items, etc.
	game.load.image('dyna', 'assets/dynamite.png');
	game.load.image('deto', 'assets/detonator.png');
	game.load.image('ladder', 'assets/ladder.png');
	game.load.image('coffee', 'assets/coffee.png');
	//preload sounds
	game.load.audio('talk', 'assets/talk.mp3');
	game.load.audio('pickup', 'assets/pickup.mp3');
	game.load.audio('win', 'assets/pickup.mp3');
	game.load.audio('background', 'assets/background.wav');
}

function create() {
	game.sound.play('background');
	game.add.image(0,0,'sky');
	console.log("Background created");
	ground = game.add.group();
	for(var i = 0; i < game.width; i+=32){
		var groundBlock = game.add.sprite(i, game.height  - 32, 'ground');
		groundBlock.width = 32;
		groundBlock.height = 32;
		game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
		groundBlock.body.immovable = true;
		groundBlock.body.allowGravity = false;
		ground.add(groundBlock);
	}

	wall = game.add.sprite(game.width/2, game.height -256, 'wall');
	wall.width = 64;
	wall.height = 256;
	game.physics.enable(wall, Phaser.Physics.ARCADE);
	wall.body.immovable = true;
	wall.body.allowGravity = false;
	
	overlay = game.add.group();
	// Define movement constants
    game.MAX_SPEED = 200; // pixels/second
    game.ACCELERATION = 200; // pixels/second/second
    game.DRAG = 1000; // pixels/second
    game.GRAVITY = 300; // pixels/second/second
    game.JUMP_SPEED = -200; // pixels/second (negative y is up)
	
	//npcs to interact with
	npc1 = game.add.sprite(18, 650, 'green');
	npc1.scale.setTo(.25, .25);
	game.physics.enable(npc1, Phaser.Physics.ARCADE);
	npc1.body.collideWorldBounds = true;
	npc1.body.immovable = true;
	npc1.body.allowGravity = false;
	npc1Dial = new Array(10);
	fillnpc1Dial();
	npc1Text = game.add.text(0, game.height-250, ' ', {fontSize: '20px', fill: '#000' });
	overlay.add(npc1Text);
	
	//npcs to interact with
	npc2 = game.add.sprite(1122, 650, 'green');
	npc2.scale.setTo(.25, .25);
	game.physics.enable(npc2, Phaser.Physics.ARCADE);
	npc2.body.collideWorldBounds = true;
	npc2.body.immovable = true;
	npc2.body.allowGravity = false;
	npc2Dial = new Array(10);
	fillnpc2Dial();
	npc2Text = game.add.text(800, game.height-250, ' ', {fontSize: '20px', fill: '#000' });
	overlay.add(npc2Text);
	
	//items
	//coffee
	coffee1 = game.add.sprite(game.width, game.height, 'coffee');
	coffee1.scale.setTo(.25,.25);
	game.physics.enable(coffee1, Phaser.Physics.ARCADE);
	//coffee1.body.collideWorldBounds = true;
	coffee1.body.immovable = true;
	coffee1.body.allowGravity = false;
	//ladder1
	ladder1 = game.add.sprite(game.width, game.height, 'ladder');
	ladder1.scale.setTo(-.25,1);
	game.physics.enable(ladder1, Phaser.Physics.ARCADE);
	//ladder1.body.collideWorldBounds = true;
	ladder1.body.immovable = true;
	ladder1.body.allowGravity = false;
	//ladder2
	ladder2 = game.add.sprite(game.width, game.height, 'ladder');
	ladder2.scale.setTo(.25,1);
	game.physics.enable(ladder2, Phaser.Physics.ARCADE);
	//ladder2.body.collideWorldBounds = true;
	ladder2.body.immovable = true;
	ladder2.body.allowGravity = false;
	//detonator
	detonator1 = game.add.sprite(game.width, game.height, 'deto');
	detonator1.scale.setTo(.25,.25);
	game.physics.enable(detonator1, Phaser.Physics.ARCADE);
	//detonator.body.collideWorldBounds = true;
	detonator1.body.immovable = true;
	detonator1.body.allowGravity = false;
	//dynamite
	dynamite1 = game.add.sprite(game.width, game.height, 'dyna');
	dynamite1.scale.setTo(.25,.25);
	game.physics.enable(dynamite1, Phaser.Physics.ARCADE);
	//dynamite.body.collideWorldBounds = true;
	dynamite1.body.immovable = true;
	dynamite1.body.allowGravity = false;
	
	//player1
	player1 = game.add.sprite(game.width/6, 650,'blue');
	player1.scale.setTo(.25, .25);
    game.physics.enable(player1, Phaser.Physics.ARCADE);
    player1.body.collideWorldBounds = true;
    player1.body.maxVelocity.setTo(game.MAX_SPEED, game.MAX_SPEED * 10);
    //player1.body.drag.setTo(game.DRAG, 0);
    game.physics.arcade.gravity.y = game.GRAVITY;
    p1jump = false;
	//game.physics.add.overlap(player1, npc1, null, this);
	p1Text = game.add.text(0,20, 'TEXT P1', { fontSize: '20px', fill: '#000' });
	overlay.add(p1Text);
	////player2
	player2 = game.add.sprite((game.width/6)*5, 650, 'red');
	player2.scale.setTo(.25, .25);
	game.physics.enable(player2, Phaser.Physics.ARCADE);
	player2.body.collideWorldBounds = true;
	//player2.setBounce(0);
	player2.body.maxVelocity.setTo(game.MAX_SPEED, game.MAX_SPEED *10);
	//player2.body.drag.setTo(game.DRAG, 0);
	p2jump = false;
	p2Text = game.add.text((game.width/6)*4, 20, 'TEXT P2', { fontSize: '20px', fill: '#000' });
	overlay.add(p2Text);
	
	//tracking key presses
	this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.A,
        Phaser.Keyboard.D,
        Phaser.Keyboard.W,
        Phaser.Keyboard.S,
		Phaser.Keyboard.E,
		Phaser.Keyboard.J,
		Phaser.Keyboard.L,
		Phaser.Keyboard.I,
		Phaser.Keyboard.K,
		Phaser.Keyboard.O
    ]);
}

function update() {
	//check for winstate
	
	//player1 collision
	game.physics.arcade.collide(player1, ground);
	game.physics.arcade.collide(player1, wall);
	//player2 collision
	game.physics.arcade.collide(player2, ground);
	game.physics.arcade.collide(player2, wall);
	//npc collision
	game.physics.arcade.collide(npc1, ground);
	
	
	if(gameover){
		player1.body.velocity.x = 0;
		player2.body.velocity.x = 0;
		return;
	}
	game.physics.arcade.overlap(player1, player2, winState, null, this);
	
	//movement of player1 - move using wasd and 'click' using e, throw with q
	player1Movement();
	
	//movement of player2 - move using ijkl and 'click' with o, throw with u
	player2Movement();
	
	//player 1 interactions
	if(player1.body.touching.right && wall.body.touching.left){
		npc1Text.setText("Trouble getting over the wall?");
		p1Text.setText("You could probably throw \nsomething to the other side \nif you move towards the wall");
		p1AtWall = true;
	}
	else{
		p1AtWall = false;
	}
	if(player2.body.touching.left && wall.body.touching.right){
		npc2Text.setText("Trouble getting over the wall?");
		p2Text.setText("You could probably throw \nsomething to the other side \nif you move towards the wall");
		p2AtWall = true;
	}
	else{
		p2AtWall = false;
	}
	if(game.input.keyboard.isDown(Phaser.Keyboard.E)){
		//console.log("E pressed");
		if(!p1Interact){
			game.sound.play('pickup');
			p1Interact = true;
			game.physics.arcade.overlap(player1, npc1, npc1Dialogue, null, this);
			game.physics.arcade.overlap(player1, coffee1, p1PickUpCoffee, null, this);
			game.physics.arcade.overlap(player1, ladder1, p1TryLadder, null, this);
			game.physics.arcade.overlap(player1, detonator1, p1PickUpDetonator, null, this);
			if(p1AtWall && p1HasDetonator){
				p1Text.setText("You threw the detonator over the wall.");
				p1HasDetonator = false;
				detonator1.body.x = game.width/2+96;
				detonator1.body.y = game.height-96
			}
		}
		//game.physics.arcade.overlap(player1, items, player1Interaction, null, this);
	}
	else{
		p1Interact = false;
	}
	
	//player 2 interactions
	if(game.input.keyboard.isDown(Phaser.Keyboard.O)){
		//console.log("O pressed");
		if(!p2Interact){
			game.sound.play('pickup');
			p2Interact = true;
			game.physics.arcade.overlap(player2, npc2, npc2Dialogue, null, this);
			game.physics.arcade.overlap(player2, coffee1, p2PickUpCoffee, null, this);
			game.physics.arcade.overlap(player2, ladder2, p2TryLadder, null, this);
			game.physics.arcade.overlap(player2, detonator1, p2PickUpDetonator, null, this);
			game.physics.arcade.overlap(player2, dynamite1, p2PickUpDynamite, null, this);
			if(p2AtWall && p2HasCoffee){
				p2Text.setText("You threw the coffee over the wall.");
				p2HasCoffee = false;
				p2SentCoffee = true;
				coffee1.body.x = game.width/2 - 64;
				coffee1.body.y = game.height - 96
			}
			if(p2AtWall && p2HasDetonator && p2HasDynamite){
				wall.body.x = game.width;
				ladder1.body.x = game.width;
				ladder2.body.x = game.width;
			}
		}
	}
	else{
		p2Interact = false
	}
	
	//check npc dialogue - index
	
}

function player1Movement(){
	if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
		//console.log("A pressed");
		player1.body.velocity.x = -game.MAX_SPEED;
	}
	else if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
		//console.log("D pressed");
		player1.body.velocity.x = game.MAX_SPEED;
	}
	else {
		player1.body.velocity.x = 0;
		player1.body.acceleration.x = 0;
	}
	if(player1.body.touching.down && game.input.keyboard.isDown(Phaser.Keyboard.W)){
		//console.log("W pressed");
		player1.body.velocity.y = game.JUMP_SPEED;
	}
	else if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
		player1.body.velocity.x = 0;
		//console.log("S pressed");
	}
	
}
function player1Interaction(){
	
}
function p1PickUpCoffee(){
	p1HasCoffee = true;
	p1Text.setText("You picked up the Coffee");
	coffee1.body.x = game.width;
	coffee1.body.y = game.height;
}
function p1TryLadder(){
	console.log("Player trying ladder");
	p1Text.setText("You tried to climb the ladder");
	p1TriedLadder = true;
	ladder1.body.enable = false;
}
function p1PickUpDetonator(){
	p1HasDetonator = true;
	p1Text.setText("You picked up the detonator");
	detonator1.body.x = game.width;
}
function fillnpc1Dial(){
	npc1Dial[0] = "What do you need, Blue?";
	npc1Dial[1] = "You need to get over the wall?\n You could use my ladder, but I'm too tired to move it";
	npc1Dial[2] = "That coffee hit the spot, here, \ntry the ladder!";
	npc1Dial[3] = "What's wrong, can't climb the ladder? \nGuess it's hard with no arms or legs";
	npc1Dial[4] = "All I have left is this detonator, \nthis won't help";
}
function npc1Dialogue(){
	game.sound.play('talk');
	console.log("npc1 is talking");
	npc1Text.setText(npc1Dial[npc1Tn]);
	if(npc1Tn == 0)
		npc1Tn++;
	else if(npc1Tn == 1 && p1HasCoffee){
		npc1Tn++;
		p1HasCoffee = false;
		npc1Text.setText("Thanks for the coffee!");
	}
	else if(npc1Tn == 2){
		if(p1TriedLadder){
			npc1Tn++;
		}
		ladder1.body.x = (game.width/2)-64;
		ladder1.body.y = game.height-256;
	}
	else if(npc1Tn == 3){
		npc1Tn++;
		detonator1.body.x = game.width/4;
		detonator1.body.y = game.height - 96;
	}
}
function player2Movement(){
	if(game.input.keyboard.isDown(Phaser.Keyboard.J)){
		//console.log("J pressed");
		player2.body.velocity.x = -game.MAX_SPEED;
	}
	else if(game.input.keyboard.isDown(Phaser.Keyboard.L)){
		//console.log("L pressed");
		player2.body.velocity.x = game.MAX_SPEED;
	}
	else {
		player2.body.velocity.x = 0;
		player2.body.acceleration.x = 0;
	}
	if(player2.body.touching.down && game.input.keyboard.isDown(Phaser.Keyboard.I)){
		//console.log("I pressed");
		player2.body.velocity.y = game.JUMP_SPEED;
	}
	else if(game.input.keyboard.isDown(Phaser.Keyboard.K)){
		player2.body.velocity.x = 0;
		//console.log("K pressed");
	}
	
}

function player2Interaction(){
	
}
function p2PickUpCoffee(){
	p2Text.setText("You picked up the coffee");
	p2HasCoffee = true;
	coffee1.body.x = game.width;
	coffee1.body.y = game.height;
}
function p2TryLadder(){
	console.log("Player trying ladder");
	p2Text.setText("You tried to climb the ladder");
	p2TriedLadder = true;
	ladder2.body.enable = false;
}
function p2PickUpDetonator(){
	p2Text.setText("You picked up the detonator");
	p2HasDetonator = true;
	detonator1.body.x = game.width;
}
function p2PickUpDynamite(){
	p2Text.setText("You picked up the dynamite");
	p2HasDynamite = true;
	dynamite1.body.x = game.width;
}
function fillnpc2Dial(){
	npc2Dial[0] = "What do you need, Red?";
	npc2Dial[1] = "I just bought this coffee... \nbut I don't really want it anymore. \nHere take it";
	npc2Dial[2] = "Blue can't get over the wall? \nWhy don't you try, here's a ladder!";
	npc2Dial[3] = "What's wrong, can't climb the ladder? \nShould've seen that coming.";
	npc2Dial[4] = "Well all I have left is this dynamite, \nbut it's no good without \nanything to light it.";
}
function npc2Dialogue(){
	game.sound.play('talk');
	console.log("npc2 is talking");
	npc2Text.setText(npc2Dial[npc2Tn]);
	if(npc2Tn == 0)
		npc2Tn++;
	else if(npc2Tn == 1){
		if(p2SentCoffee){
			npc2Tn++;
		}
		else{
			coffee1.body.x = 900;
			coffee1.body.y = game.height-96
		}
	}
	else if(npc2Tn == 2){
		if(p2TriedLadder){
			npc2Tn++;
		}
		ladder2.body.x = game.width/2 + 64;
		ladder2.body.y = game.height - 256;
	}
	else if(npc2Tn == 3){
		npc2Tn++;
		dynamite1.body.x = (game.width/4)*3;
		dynamite1.body.y = game.height-96;
	}
}

function winState(){
	if(!gameover){
		p1Text.setText("Red was found!");
		p2Text.setText("Blue was found!");
		game.sound.stopAll();
		game.sound.play('win');
		gameover = true;
	}
}
