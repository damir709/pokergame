/*

THIS GAME IS CURRENTLY NOT FINISHED

To do: Add logic for determining the value of each poker hand

Hello there and welcome to my poker game! This is my first hobby project I am developing on my own time to sharpen
my JavaScript skills and to apply knowledge I have learned. The game is played in the console of a web
browser and is currently text-only. I plan to make this game with HTML/CSS later on, sorta like how those old
flash games on Miniclip used to be.

My email is damir.golami@gmail.com. Please let me know what you think about my code.
I know that some of my code may not be the most efficient or easiest to follow at times, but I am always
learning and trying to improve myself or my code in any way possible.
*/

var pokerHands = { // Object for values of the hands
    highcard: 1,
    pair: 2,
    twopair: 3,
    threeofkind: 4,
    straight: 5,
    flush: 6,
    fullhouse: 7,
    fourofkind: 8,
    straightflush: 9,
    royalflush: 10,
};
var suits = ['Spades', 'Clubs', 'Diamonds', 'Hearts']; // Create suits of cards
var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King', 'Ace',]; // Create values of cards
var deck = []; // Make the deck an array
var yourHand = []; // Start with no cards
var opponentHand = []; // Opponent starts with no cards
var usedCards = []; // Cards that are burned or discarded go here
var yourHandValue = 0; // Variables to determine who has the better hand
var opponentHandValue = 0;
var yourChips = 1000; // player and opponent start with 1000 chips
var opponentChips = 1000;
var sameValueCards = 0;
var chipsPot = 0; //  Pot starts at nothing
var opponentBet; 
var bet = 0;
var recentBet = 0; // a variable to store opponent bets
var yourRecentBet = 0; // a variable to store player bets
var numberOfBurnedCards; // a variable for discarding cards
var burnedCards; // another variable for discarding cards
var gameState = -1; /* Creating the states of the game. Game will cycle through a
                     switch statement for different parts of the game i.e drawing cards is state 0,
                     placing bets the first time around is state 1, etc.
                     */
for(i = 0; i < suits.length; i++) {  // Create all cards in a deck
    for(x = 0; x < values.length; x++) {
        var card = {Value: values[x], Suit: suits[i]}; // create object "card" with Suit and Value properties
        deck.push(card);
    }
}

function shuffleDeck(deck) { // Function to shuffle the deck
    for(i = 0; i < 999; i++) { // Deck is shuffled 999 times per function call
        var shuffleSpot1 = Math.floor((Math.random() * deck.length)); // return a random integer between 0 and 51
        var shuffleSpot2 = Math.floor((Math.random() * deck.length)); // return another random integer
        var temporarySpot = deck[shuffleSpot1]; // swap the cards in the indexes of the two integers
        deck[shuffleSpot1] = deck[shuffleSpot2];
        deck[shuffleSpot2] = temporarySpot;
         // console.log(shuffleSpot1, shuffleSpot2);
    }
}
function dealCard(deck) { // Function to deal a card from the top of the deck
     return deck.pop(); 
} 

function dealYourHand(deck) { // Function to deal a card to yourHand
    var newCard = dealCard(deck);
    yourHand = yourHand.concat(newCard);
}

function dealOpponentHand(deck) { // Function to deal a card to opponentHand
    var newCard = dealCard(deck);
    opponentHand = opponentHand.concat(newCard);
}

function placeYourBet() { // Function to bet chips
   var bet = prompt("Enter your bet:");
   bet = +bet;
    if(bet > yourChips) { // Player cannot bet more chips than they have
        alert('Sorry, you do not have enough chips for this bet.');
        placeYourBet();
    }
    else if(bet < 0) { // Player cannot bet negative numbers
        alert('You cannot bet a negative number.');
        placeYourBet();
    }
    else if(bet == '' || 0) { // If the bet is empty, call instead
        youCall();
    }
    else if((typeof(bet) != 'number') || isNaN(bet) == true) { // If the bet is not a number, or NaN...
        alert('Sorry, you need to enter a numeric value.'); // Don't allow other types besides numbers for input
        placeYourBet();
    }
    else {
    chipsPot = +chipsPot + bet; // Add chips to pot
    yourChips = +yourChips - bet; // Subtract bet from yourChips
    yourRecentBet = yourRecentBet + bet;
    console.log('You have bet' + ' ' + bet + ' chips.');
    console.log('You now have ' + yourChips + ' chips.');
    console.log('The pot is now ' + chipsPot + ' chips.');
    }
}

function placeOpponentBet() { // Function to make the opponent bet chips, A.I will be added later
    console.log('Opponent has ' + opponentChips + ' chips.');
    if (opponentChips > 1000) {
        opponentBet = 200;
    }
    else {
        opponentBet = 100;
    }
    if(opponentBet === '') { // If the bet is empty, call instead
        callOpponentBet();
    }
    else {
        recentBet = opponentBet;
        chipsPot = +chipsPot + opponentBet;
        opponentChips = opponentChips - opponentBet;
        console.log('Opponent has bet' + ' ' + opponentBet + ' chips.');
        console.log('Opponent now has ' + opponentChips + ' chips.');
    }
}

function youCall() { // Player function to not bet
    var bet = 0;
    chipsPot = chipsPot;
    console.log('You have called.');
}

function callOpponentBet() { // Opponent function to not bet
    var bet = 0;
    chipsPot = chipsPot;
    console.log('Opponent has called.');
}

function resetGame() { // resets the game, adds all cards back to deck
    deck.concat(yourHand.splice(0, yourHand.length));
    deck.concat(opponentHand.splice(0, opponentHand.length));
    deck.concat(usedCards);
    console.log(yourHand);
    console.log(opponentHand);
    console.log(usedCards);
    console.log(deck);
}

function youFold() { // Function to fold
    console.log('You fold.');
    alert('You fold.');
    deck = deck.concat(yourHand.splice(0, yourHand.length)); // Concat ALL cards back to the deck
    deck = deck.concat(opponentHand.splice(0, opponentHand.length));
    deck = deck.concat(usedCards);
    opponentChips = opponentChips + chipsPot; // Opponent gets chips from the pot and what they were betting
    opponentChips = opponentChips + recentBet;
    yourChips = yourChips - recentBet;
    chipsPot = 0;
    gameState = 0;
    //console.log(yourHand); 
    //console.log(opponentHand);
    //console.log(usedCards);           // Debug stuff
    //console.log(deck);
}

function opponentFold() { // Function to make opponent fold
    console.log('Opponent has folded.');
    deck = deck.concat(yourHand.splice(0, yourHand.length));
    deck = deck.concat(opponentHand.splice(0, opponentHand.length));
    deck = deck.concat(usedCards);
    console.log(yourHand);
    console.log(opponentHand);
    console.log(usedCards);
    console.log(deck);
    yourChips = yourChips + chipsPot;
    chipsPot = 0;
    gameState = 0;
}

function sortHands() { // Sorts both the player and opponent hands by Value, shifting lower values to the start
    yourHand.sort((a, b) => {
        if (typeof a.Value === 'number' && typeof b.Value === 'number') { //If a and b are both numbers
            return a.Value - b.Value; //return a - b
        }
        else if (typeof a.Value === 'number') {
            return -1;
        }
        else if (typeof b.Value === 'number') {
            return 1;
        }
        else {
            return a.Value > b.Value ? 1 : -1; // Return 1 if true, -1 if false
        }
    }
    );
    opponentHand.sort((a, b) => {
        if (typeof a.Value === 'number' && typeof b.Value === 'number') {
            return a.Value - b.Value;
        } else if (typeof a.Value === 'number') {
            return -1;
        } else if (typeof b.Value === 'number') {
            return 1;
        } else {
            return a.Value > b.Value ? 1 : -1;
        }
        
    }
    );
}

function displayYourHand() { // Function to show the player their hand
    sortHands();
    console.log('This is your hand. It has ' + yourHand.length + ' cards in it.');
    console.log(yourHand[0]);
    console.log(yourHand[1]);
    console.log(yourHand[2]);
    console.log(yourHand[3]);
    console.log(yourHand[4]);
}
function discardYourHand() { // Function to discard cards
    displayYourHand();
    burnedCards = prompt("Select the card(s) to be discarded. Syntax: 'Suit' of 'Value'");
    var cardValue = burnedCards.split(' of ');
    var cardSuit = cardValue.pop();
    if (yourHand.some(yourHand => yourHand.Value == cardValue[0]) && yourHand.some(yourHand => yourHand.Suit[0] == cardSuit[0])) { 
        // If the value of your chosen card is in your hand AND... If the suit of your chosen card is in your hand...
            cardValue = +cardValue;
            var cardIndex = yourHand.findIndex(element => (element.Value === cardValue && element.Suit === cardSuit)); // Find the index of the selected card
            usedCards = usedCards.concat(yourHand.splice(cardIndex, 1)); // Concat the card at that index to the used or trash cards pile
            gameState = 3;
            numberOfBurnedCards = numberOfBurnedCards - 1;
        }
    else if (yourHand.some(yourHand => yourHand.Value.toString() !== cardValue[0]) || yourHand.some(yourHand => yourHand.Suit.toString() !== cardValue[1])) { // If the value or suit is not in your hand...
        alert('Sorry, that card is not in your hand.'); 
    }
}

for(gameState; gameState < 6 ;) { // Switch statement to determine game state, any state more than the total number of states ends the game, should only happen on win or loss
    if(yourChips < 0) {          
        alert('You have lost all your chips. Game over!'); // Make the player lose if they run out of chips
        gameState = 99; 
    }
    if(opponentChips < 0) {
        alert('Your opponent has lost all their chips. You win!'); // Make the opponent lose if they run out of chips
        gameState = 99; 
    }
switch(gameState) {
    case -1: // Welcome screen state
       var startPrompt = prompt('Welcome to Console Poker! Please press enter to begin! You will be dealt 5 cards. Enter anything else to abort.');
        if(startPrompt === '') { // Not pressing enter on the welcome screen aborts the game
            gameState = 0;
        }
        else {
            gameState = 99; // End the for loop so the game doesn't loop infinitely
        }
    break;

    case 0: // Card dealing state
        shuffleDeck(deck); // Shuffle and deal 5 cards to both players
        while(yourHand.length < 5) {
            dealYourHand(deck);
        }
        while(opponentHand.length < 5) {
            dealOpponentHand(deck);
        }
        displayYourHand();
        sortHands();
        alert('You have been dealt 5 cards.');
        gameState = 1;
    break;
    
    case 1: // 1st Betting state
        placeOpponentBet(); // Opponent bets first
        console.log('The pot is now ' + chipsPot + ' chips.'); // Display the pot and your amount of chips
        console.log('You have ' + yourChips + ' chips.');
        while(recentBet > yourRecentBet) { // Don't let the player proceed if their bet is less than the opponent's, they have to match or fold.
            var yourSelection = prompt('Your opponent has raised you by ' + (recentBet - yourRecentBet) + ' chip(s). Would you like to match them? Enter Yes or no.');
        if(yourSelection.toUpperCase() == 'YES') { // Automatically match the opponent's bet
            chipsPot = +chipsPot + (+recentBet - +yourRecentBet); // Add the difference between your bet and the opponent's to the pot
            yourChips = yourChips - (+recentBet - +yourRecentBet);
            alert("You have matched your opponent's bet of " + recentBet + ' chips.');
            console.log('You now have ' + yourChips + ' chips.');
            console.log('The pot is now ' + chipsPot + ' chips.');
            yourRecentBet = recentBet; // Set your bets to be equal to break the loop
            console.log('gameState ' + gameState);
            gameState = 2; // Continue the game
            break;
        }
        else if(yourSelection.toUpperCase() == 'NO') { // If the player's bet is lower than the opponent's, they cannot call or continue
            while(recentBet > yourRecentBet) {     // Force player to raise their bet or fold
                var anotherSelection = prompt('The opponent has bet ' + (recentBet - yourRecentBet) + ' chip(s) more than you. Would you like to raise or fold?');
                if(anotherSelection.toUpperCase() === 'RAISE') { // Selection to raise
                    placeYourBet();
                    yourRecentBet = +yourRecentBet + bet;
                    alert('You have bet ' + yourRecentBet + ' chips.');
                    if (yourRecentBet > recentBet) { // If you raise the opponent, they will match you
                        recentBet = +yourRecentBet - +recentBet;
                        chipsPot = +chipsPot + recentBet;
                        opponentChips = opponentChips - +recentBet;
                        alert('Opponent has matched you by betting' + ' ' + recentBet + ' chips.');
                        console.log('Opponent has matched you by betting' + ' ' + recentBet + ' chips.');
                        console.log('Opponent now has ' + opponentChips + ' chips.');
                        console.log('The pot is now ' + chipsPot + ' chips.');
                    }
                    gameState = 2;
                    break;
                }
                else if (anotherSelection.toUpperCase() === 'STEAL') { // Unless you are reading this JS file, you shouldn't know how to do this...                     
                    var stealPrompt = prompt('SWIPER NO SWIPING (enter the amount of chips you want to steal from your opponent)');
                    stealPrompt = +stealPrompt;
                    yourChips = yourChips + stealPrompt;
                    opponentChips = opponentChips - stealPrompt;
                    yourRecentBet, recentBet = 0; 
                    console.log('You have stolen ' + stealPrompt + ' chips from your opponent, LMAOOOOOOOO'); // CHEATY CHEATERTON
                }
                else if (anotherSelection.toUpperCase() === 'FOLD') {
                    youFold();
                    recentBet = 0;
                    yourRecentBet = 0;
                    gameState = 0;
                    break;
                }
                else {
                    alert('Sorry, you need to enter a selection.');
                }
            } 
        }
        else {
            alert('Sorry, you need to enter "yes" or "no" to continue.');
        }
    }
    break;
    
    case 2: // Player discard and draw state
        numberOfBurnedCards = prompt("How many cards would you like to discard? Enter 0 or leave blank to skip.");
        numberOfBurnedCards = +numberOfBurnedCards;
        console.log(typeof(numberOfBurnedCards));
        console.log(numberOfBurnedCards);
        if(numberOfBurnedCards == 0 || '') { // If the player discards no cards, continue
            alert('You discard no cards.');
            console.log('You draw no cards.');
            gameState = 3;
            break;
        }
        
        else if (numberOfBurnedCards == 5) {
            alert('You have discarded 5 cards.');
            usedCards = usedCards.concat(yourHand.splice(0, numberOfBurnedCards)); // If the player discards all cards, deal 5 cards
            while(yourHand.length < 5) {
                 dealYourHand(deck);
            } 
            displayYourHand();
            console.log('gameState ' + gameState);
            gameState = 3;
            break; 
        }
        else if (numberOfBurnedCards > 5) { // Don't let the player discard more than 5
            alert("You cannot discard more than 5 cards.");
        }
        else if ((typeof(numberOfBurnedCards)) != 'number' || isNaN(numberOfBurnedCards) == true) { // The player has to enter a number between 0 and 5
            alert("Sorry, you must enter a number between 0 and 5.");
        }
        else {
            while(numberOfBurnedCards != 0) { // Show the cards the player has and prompt to discard
            discardYourHand();
            }
            while(yourHand.length < 5) { // Make sure the player has 5 cards at all times
                dealYourHand(deck);
            }
        }
        displayYourHand();
        break;

    case 3: // Opponent discard and draw state
        numberOfBurnedCards = Math.floor(Math.random() * 5) + 1; // opponent discards a random number of cards, FOR NOW
        burnedCards = Math.floor(Math.random() * 5) + 1;        // A.I will be given to the opponent later
        //console.log(burnedCards);
        //console.log(numberOfBurnedCards);
        usedCards = usedCards.concat(opponentHand.splice(0, numberOfBurnedCards)); // Concat the card taken from opponentHand to usedCards
        
        while(opponentHand.length < 5) { // Opponent always needs 5 cards
            dealOpponentHand(deck);
        }
        if(numberOfBurnedCards == 1) {
            console.log('Your opponent draws ' + numberOfBurnedCards + ' card.');
            alert('Your opponent draws ' + numberOfBurnedCards + ' card.');
        }
        else {
            console.log('Your opponent draws ' + numberOfBurnedCards + ' cards.');
            alert('Your opponent draws ' + numberOfBurnedCards + ' cards.');
        }
        console.log('gameState ' + gameState);
        console.log(usedCards);
        gameState = 4;
    break;

    case 4: //2nd betting state, similar to first
    recentBet = 0;
    yourRecentBet = 0;
    placeOpponentBet();
    console.log('The pot is now ' + chipsPot + ' chips.');
    console.log('You have ' + yourChips + ' chips.');
    
    while(recentBet > yourRecentBet) { // While your recent bet is less than the opponent's
        var yourSelection = prompt('Your opponent has raised you by ' + (recentBet - yourRecentBet) + ' chip(s). Would you like to match them? Enter Yes or no.');
        if(yourSelection.toUpperCase() == 'YES') { // Automatically match the opponent's bet if player selects "YES"
            chipsPot = +chipsPot + (+recentBet - +yourRecentBet);
            yourChips = yourChips - (+recentBet - +yourRecentBet);
            alert("You have matched your opponent's bet.");
            console.log('You now have ' + yourChips + ' chips.');
            console.log('The pot is now ' + chipsPot + ' chips.');
            yourRecentBet = recentBet;
            console.log('gameState ' + gameState);
            gameState = 5;
            break;
        }
        else if(yourSelection.toUpperCase() == 'NO') { // If the player's bet is lower than the opponent's, they cannot call, same as before
            while(recentBet > yourRecentBet) {
                var anotherSelection = prompt('The opponent has bet ' + (recentBet - yourRecentBet) + ' chip(s) more than you. Would you like to raise or fold?');
                if(anotherSelection.toUpperCase() == 'RAISE') {
                    placeYourBet();
                    yourRecentBet = +yourRecentBet + bet;
                    if (yourRecentBet > recentBet) { // If you raise the opponent, they will match you
                        recentBet = +yourRecentBet - +recentBet;
                        chipsPot = +chipsPot + recentBet;
                        opponentChips = opponentChips - +recentBet;
                        console.log('Opponent has matched you by betting' + ' ' + recentBet + ' chips.');
                        console.log('Opponent now has ' + opponentChips + ' chips.');
                        console.log('The pot is now ' + chipsPot + ' chips.');
                        console.log('gameState ' + gameState);
                        
                    }
                    gameState = 5;
                        break;
                }
                else if (anotherSelection.toUpperCase() === 'STEAL') {
                    yourRecentBet, recentBet = 0;
                    var stealPrompt = prompt('SWIPER NO SWIPING (enter the amount of chips you want to steal from your opponent)');
                    stealPrompt = +stealPrompt;
                    yourChips = yourChips + stealPrompt;
                    opponentChips = opponentChips - stealPrompt;
                    console.log('You have stolen ' + stealPrompt + ' chips from your opponent, LMAOOOOOOOO');
                }
                else if (anotherSelection.toUpperCase() === 'FOLD') {
                 youFold();
                recentBet = 0;
                yourRecentBet = 0;
                gameState = 0;
                break;
                }
                else {
                   alert('Sorry, you need to enter a selection.');
                    break;
                }
            }
        }
        else {
        alert('Sorry, you need to enter "yes" or "no" to continue.');
        }
    }
    break;
        
    /* As of right now, this is where the game ends, the only thing left to do is adding the logic for each poker hand.
    If I was going to redo this project, I would make use of objects more as dealing with arrays and strings is a PAIN.
    */
        
        
        
    case 5: // Determine the value of the hands, whichever value is higher wins the hand
    var firstSuit = yourHand[0].Suit;
    var isFlush = (yourHand) => yourHand.Suit == firstSuit;
    if (yourHand.every(isFlush) === true) {
        yourHandValue = pokerHands.flush;
        console.log('You have a flush.');
        console.log(yourHand.every(isFlush));
    }
    gameState = 99;
    break;    
    } // Should be 2 curly braces here
}
