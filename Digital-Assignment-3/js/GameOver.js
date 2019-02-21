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
            playButton = game.add.button( 438, 800, 'playButton', startGame, null, 'over', 'def', 'down');
			menuButton = game.add.button( 350, 500, 'menuButton', goToMenu, null, 'over', 'def', 'down');
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }
        
    };
};