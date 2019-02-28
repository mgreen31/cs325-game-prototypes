"use strict";

GameStates.makeGameOver = function( game, shared ) {

	var music = null;
	var wind = null;
	var playButton = null;
	var menuButton = null;
    
    function startGame(pointer) {

        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        music.stop();
		wind.stop();
        //	And start the actual game
        game.state.start('Game');

    }
	function goToMenu(pointer){
		music.stop();
		game.state.start('MainMenu');
	}
    
    return {
    
        create: function () {
            music = game.add.audio('gameOver');
            music.play();
			wind = game.add.audio('wind');
			wind.play();
			
            game.add.sprite(0, 0, 'sky');
			game.add.text((game.width/2)-275, game.height/4, 'Game Over!', { fontSize: '100px', fill: '#000' });
            playButton = game.add.button( 438, 800, 'playButton', startGame, null, 'over', 'def', 'down');
			menuButton = game.add.button( 350, 500, 'menuButton', goToMenu, null, 'over', 'def', 'down');
			
			var player = game.add.sprite((game.width/4), 300, 'birdperson');
			//redbull = game.add.sprite((game.width/2)-32, 300, 'redbull');
			player.scale.setTo(2,2);
			//redbull.scale.setTo(.2,.2);
			var animIdle = player.animations.add('idle', [5,10], 2, true);
			player.animations.play('idle');
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }
        
    };
};