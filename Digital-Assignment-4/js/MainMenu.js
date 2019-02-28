"use strict";

GameStates.makeMainMenu = function( game, shared ) {

	var music = null;
	var playButton = null;
	var player = null;
	var redbull = null;
    
    function startGame(pointer) {

        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        music.stop();

        //	And start the actual game
        game.state.start('Game');

    }
    
    return {
    
        create: function () {
            //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
            //	Here all we're doing is playing some music and adding a picture and button
            //	Naturally I expect you to do something significantly better :)
    
            music = game.add.audio('titleMusic');
            music.play();
			
			
    
            game.add.sprite(0, 0, 'titlePage');
			//game.add.text(800, 300, "Click below to become a bird!", { fontSize: '64px', fill: '#999' });
            playButton = game.add.button( 438, 800, 'playButton', startGame, null, 'over', 'def', 'down');
			//player
			player = game.add.sprite((game.width/2)-90, 300, 'birdperson');
			redbull = game.add.sprite((game.width/2)-32, 300, 'redbull');
			player.scale.setTo(2,2);
			redbull.scale.setTo(.2,.2);
			var animIdle = player.animations.add('idle', [0,1,2,6], 2, true);
			player.animations.play('idle');
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }
        
    };
};
