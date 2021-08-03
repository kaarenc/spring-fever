"use strict";
// Kaaren Corrigan

/*-------------------------------
Contents                   lines
---------------------------------
Game object                 37
switchScreen                58
helpModuleShow              121
helpModuleClose             144
enablePlayButton            166
addPlayer                   183
gameLoop                    193
updateClock                 200
updateMeter                 236
intervalFunction            255
setIntervalId               265
setTimer                    271
startTimer                  293
pauseTimer                  300
stopTimer                   307
deckShuffle                 320
hideCards                   330
flipCard                    336
runCheckMatch               377
matchCheck                  385
clearPastGame               425
initializeGame              438
-------------------------------*/


$(() => {
    // console.log('the DOM is ready, jQuery best style.');
    game.initializeGame ();
});

const game = {
    title: '',
    isRunning: false,
    currentScreen: 'splash',
    scoreBoard: $('#score-board'),
    players: [],
    loopDuration: 100,
    totalTime: 90000,
    timeRemaining: 90000,
    intervalId: null,
    $Clock: $('#clock'),
    $Progress: $('#progress'),
    moduleOpen: false,
    flipCounter: ('#flips'),
    totalClicks: 0,
    cards: $('.card'),
    isSelected: false,
    cardSelected: [],
    matches: 0,


    // screen switching
    switchScreen(screenId) {
        this.currentScreen = screenId;
        if (screenId === 'splash') {
            game.isRunning = false;

            //controlling what elements are shown on splash screen
            $('header .quit').hide();
            $('header .home').hide();
            $('header .play-again').hide();
            $('header .help').removeClass( 'hidden' );
            $('header .clock').addClass( 'hidden' );
            $('header .progress').addClass( 'hidden' );
            $('header .progress-border').addClass( 'hidden' );
            $('header .flips-name-container').addClass( 'hidden');
            $('.cloud').addClass('hidden');
            $('.splash-cloud').removeClass('hidden');
            

        }  if (screenId === 'game') {
            game.isRunning = true; 
            game.clearPastGame();

            //controlling what elements are shown on game screen
            $('header .help').removeClass( 'hidden' );  
            $('header .quit').show();
            $('header .home').show();
            $('header .play-again').hide();
            $('header .clock').removeClass( 'hidden' );
            $('header .progress').removeClass( 'hidden' ); 
            $('header .progress-border').removeClass( 'hidden' );
            $('header .flips-name-container').removeClass( 'hidden' );
            $('.cloud').removeClass('hidden');
            $('.splash-cloud').addClass('hidden');

            $('#splash').addClass('hidden');
        }
        if (screenId === 'game-over') {
            game.isRunning = false;
            // game.pauseTimer();
            $('header .quit').hide();
            $('header .home').show();
            $('header .play-again').show();
            $('header .help').addClass( 'hidden' );
            $('header .clock').addClass( 'hidden' );
            $('header .progress').addClass( 'hidden' );
            $('header .progress-border').addClass( 'hidden');
            $('header .flips-name-container').addClass( 'hidden');
              $('.cloud').removeClass('hidden');
            $('.splash-cloud').addClass('hidden');
            $('.cloud').addClass('hidden');
            $('.splash-cloud').removeClass('hidden');  
        }

        if (game.screenId == 'game-over' && game.isRunning == false){
            game.pauseTimer();
        }
        $('.screen').hide();
        $(`#${screenId}`).show();
    },
    


// Module popups
helpModuleShow(){ 
    if (game.moduleOpen == false && game.currentScreen == 'game') {
            $('#help').on('click', () => {
            $('#game-instructions').removeClass('hidden');
            game.moduleOpen = true
            if (game.moduleOpen = true){
                game.pauseTimer();}
         
        })
        return;
    }
   
   if(game.moduleOpen == false && game.currentScreen == 'splash') {
            $('#setup-instructions').removeClass('hidden');
            game.moduleOpen = true;
            game.isRunning = false;
        return;

    } 
    },

helpModuleClose () {
   if (game.moduleOpen == true && game.currentScreen == 'splash') {
            $('#setup-instructions').addClass('hidden');
            game.moduleOpen = false; 
            game.stopTimer();
            
            return;

     }
if (game.moduleOpen == true && game.currentScreen == 'game') {
         $('#help').on('click', () => {
            $('#game-instructions').addClass('hidden');
            game.moduleOpen = false;
            game.startTimer();
            
        })
        return;
    }
    },
    


// disable play button if no name input & enable when somethign is in input
enablePlayButton () {
        $('#player-name-input').keydown(function() {
            if ($(this).val().length) {
                $('#play-button').removeClass( 'hidden' );
                game.playButtonActive = true

            }
            else if ($(this).val().length) {
                $('#play-button').addClass ( 'hidden' )
                game.playButtonActive = false};
    })
},


  

// adding player from html input into game
addPlayer(oPlayer) {

        game.players = $('#player-name-input').val();
        $('#player-name').html(game.players);
        $('#player-name-gameover').html(game.players);   
},



// Clock and visual countdown dependant on difficulty
gameLoop () {
    game.timeRemaining -= game.loopDuration;
    // console.log(game.timeRemaining);
    game.updateClock();
},

// setting up and updating the clock
updateClock () {
    let minutesRemaining = Math.floor(game.timeRemaining / 60 / 1000);
    let secondsRemaining = Math.floor ((game.timeRemaining - minutesRemaining * 60 * 1000)/1000);
    let miliRemaining = Math.floor (game.timeRemaining - minutesRemaining * 60000 - secondsRemaining * 1000);

        if(minutesRemaining < 10) {
            minutesRemaining = '0'+ minutesRemaining;
        };

        if(secondsRemaining < 10) {
            secondsRemaining = '0' + secondsRemaining 
        };

        if((game.timeRemaining / game.totalTime) < 0) {
            minutesRemaining = '--';
            secondsRemaining = '--';
            miliRemaining = '-';
        };

        // if time runs out before all matches are made, gameover (no win shown)
        if(game.timeRemaining === 0) {
            game.switchScreen('game-over');
            game.stopTimer();
            $('.win').hide();
        }

        // updating clock on game and gameover screens
        $('#min').html(minutesRemaining);
        $('#sec').html(secondsRemaining);
        $('#mili').html(`${miliRemaining}`.charAt(0));
        $('#min-gameover').html(minutesRemaining);
        $('#sec-gameover').html(secondsRemaining);
        $('#mili-gameover').html(`${miliRemaining}`.charAt(0));
},

// update progress bar
updateMeter () {
    $('#progress').each(function () {
        let progressBar =$(this);
        progressBar.css("width", (game.timeRemaining / game.totalTime) * 350);

    // changes colour of progress bar as time runs out
    if((game.timeRemaining / game.totalTime) >= .5) {
            progressBar.css("background-color", "green");
        }
    if((game.timeRemaining / game.totalTime) <= .5) {
        progressBar.css("background-color", "orange");
    }
    if((game.timeRemaining / game.totalTime) <= .25) {
        progressBar.css("background-color", "red");
    }
    })
},

intervalFunction ()  {
    // console.log(game.timeRemaining);
    game.timeRemaining -= game.loopDuration;
    if (game.timeRemaining <= 0) {
        window.clearInterval(game.intervalId);
    }
    game.updateClock();
    game.updateMeter();
},

setIntervalId () {
    if (game.isRunning === false) {
        game.intervalId = setInterval(game.intervalFunction, game.loopDuration);
    }
},

// Determining what time limit to set based on difficulty chosen
setTimer (button, totalTime, TimeRemaining) {
    game.isRunning = false;

    if(button === '#easy') {
        // console.log('easy mode set');
        game.totalTime = 90000;
        game.timeRemaining = 90000;
    }
    if (button === '#normal') {
        // console.log('normal mode set');
        game.totalTime = 60000;
        game.timeRemaining = 60000;
    }
    if (button === '#hard') {
        // console.log('hard mode set');
        game.totalTime = 45000;
        game.timeRemaining = 45000;
    }
    game.updateClock();
},

// function to start timer
startTimer () {
    // console.log('timer started');
    game.setIntervalId ();
    game.isRunning = true;  
},

// function to pause timer
pauseTimer: () => {
    // console.log('timer paused');
    window.clearInterval(game.intervalId);
    game.isRunning = false;
},
 
// function to stop timer
stopTimer: () => {
    // console.log('timer stopped')
    game.timeRemaining = game.totalTime;
    window.clearInterval(game.intervalId);
    game.updateClock(); 
    game.updateMeter();
    game.isRunning = false;
    $('#flips').html(0)
    game.totalClicks = 0;
    },


// card shuffling 
deckshuffle () {
//  console.log('shuffled deck');
    for(let i = this.cards.length -1; i > 0; i--){   
        let randIndex = Math.floor(Math.random() * (i + 1)) ;
    game.cards[randIndex].style.order = i; 
    game.cards[i].style.order = randIndex; }
},


// function to hide flower cards 
hideCards() {
   $('.front-face').hide();
},


// functino to flip cards when selected 
flipCard(currentTarget) { 
    // console.log(currentTarget)

    // Disable clicking on already matched cards
    if(currentTarget.hasClass('matched')){
        return;
    }

    // disable clicking on more than 2 cards at a time
    if (game.cardSelected.length === 2){
        return;
    }

    // functionality to count card flips
    if(game.isRunning == true){
    if(game.isSelected = true) {
        game.totalClicks++;
        $('#flips').html(game.totalClicks); 
        $('#flips-gameover-number').html(game.totalClicks);
   
       } }
         
    // flipping the cards and pushing them to the cardSelected array
    if(game.cardSelected.length < 2){
            currentTarget.find('.back-face').hide();
            currentTarget.find('.front-face').show();
            game.cardSelected.push(currentTarget);
        
        
        }
      
 
    // setting timeout for flipped cards to check matches  
    if(game.cardSelected.length === 2){   
        setTimeout(game.runCheckMatch, 1000); 

}
},
        

// runs the match checking function
runCheckMatch () {
    // console.log(game.cardSelected);
     game.matchCheck(game.cardSelected[0], game.cardSelected[1]);
        
},


// check match function
matchCheck (ocard1, ocard2) {

    const card1Img = ocard1
                    .find('.front-face img')
                    

    const card2Img = ocard2
                    .find('.front-face img')
                    

    // checking whether the selected cards have the same image src BUT DON't have the same class. Checking the class so that a card can't match itself.
     if (card1Img.attr('src') === card2Img.attr('src') && ocard1.attr('class') != ocard2.attr('class')){
        ocard1.addClass('matched');
        ocard2.addClass('matched');
        // console.log ("MATCH!");
        game.matches++;
        $('#matches').html(game.matches)

        // determines if all cards have been matched and takes player to the WIN screen
        if (game.matches >= 6){
            game.switchScreen('game-over')
            game.pauseTimer();
            $('.win').show();
            $('.gameover-title').hide();
        }

    // flips cards back if they're not a match
    }else{ 
            ocard1.find('.front-face').hide();
            ocard1.find('.back-face').show();
            ocard2.find('.front-face').hide();
            ocard2.find('.back-face').show();
            // console.log ("Not a match");
    }
     
    game.cardSelected = [];
 },


// function to clear all past data so the player can play a fresh game without any old data
clearPastGame(){
    // console.log('past game cleared');
    $('.card').removeClass('matched');
    game.deckshuffle();
    $('.card').find('.front-face').hide();
    $('.card').find('.back-face').show();
    game.totalClicks = 0;
    game.timeRemaining = game.totalTime;
    game.matches = 0; 
},


// click functionality and game initializing instructions
initializeGame: () =>{
    // console.log('Game Initialized');
    game.deckshuffle();
    $('#player-name-input').on('keydown', () => {game.enablePlayButton()});

    // initially hiding buttons at the start of the game
    $('header .quit').hide();
    $('header .home').hide();
    $('header .play-again').hide();

    // play button click handling
    $('button.play-game').on('click', () => {game.startTimer()});
    $('button.play-game').on('click', () => {game.switchScreen('game')});
    $('button.play-game').on('click', () => {game.addPlayer()});

    // difficulty buttons click handling
    $('button.easy').on('click', () => {game.setTimer('#easy')});
    $('button.normal').on('click', () => {game.setTimer('#normal')});
    $('button.hard').on('click', () => {game.setTimer('#hard')});

    // play again button click handling
    $('button.play-again').on('click', () => {game.startTimer()});
    $('button.play-again').on('click', () => {game.switchScreen('game')});
    $('button.play-again').on('click', () => {game.clearPastGame()});
    $('button.play-again').on('click', () => {$('#flips').html(0);})
    $('button.play-again').on('click', () => {$('#setup-instructions').hide();})

    // home button click handling
    $('button.home').on('click', () => {game.stopTimer()});
    $('button.home').on('click', () => {game.switchScreen('splash')});
    $('button.home').on('click', () => {game.isRunning = false});

    // quit button click handling
    $('button.quit').on('click', () => {game.switchScreen('game-over')});
    $('button.quit').on('click', () => {game.pauseTimer()});
    $('button.quit').on('click', () => {$('.win').hide();});
    
    // closing help modules
    $('#setup-instructions').on('click', () => {game.helpModuleClose()});
    $('#game-instructions').on('click', () => {game.helpModuleClose()});
    $('button.help').on('click', () => {game.helpModuleShow();});

    $('.card').on('click', function(){
     //console.log(event);
     game.flipCard($(this))

    });
      
    // starting the game with flower cards hidden
   game.hideCards();
      
}

};


