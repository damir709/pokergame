/*This is a poker game that runs in the console of the Google chrome browser.
 The game involves playing against an opponent and betting chips in order to win.
 The player and opponent are dealt 5 cards and start with 4000 chips.
 The opponent makes bets and the player has to match them or fold.
 This game doesn't require any additional libraries to run, all functions are included.



 Things to know:    The values of cards are in the array values[],
                    while the value of the hands are in the object pokerHands 

                    The opponent always goes first, this is a house-always-wins
                    style poker game.

                    The inputs for selecting a card to discard are case sensitive.

*/
var pokerHands = { // Object for values of the hands
    highcard: 1, // Done
    pair: 2,   // Done
    twopair: 3, // Done
    threeofkind: 4, // Done
    straight: 5,
    flush: 6, // Done
    fullhouse: 7,
    fourofkind: 8, // Done
    straightflush: 9,
    royalflush: 10, // Done
};

var suits = ['Spades', 'Clubs', 'Diamonds', 'Hearts']; // Create suits of cards
var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King', 'Ace']; // Create values of cards
var deck = []; // Make the deck an empty array
var yourHand = []; // Player starts with no cards
var opponentHand = []; // Opponent starts with no cards
var usedCards = []; // Cards that are "burned" or discarded go here
var yourHandValue = 0; // Variables to determine who has the better hand
var opponentHandValue = 0;
var yourChips = 4000; // Player and opponent start with 2000 chips
var opponentChips = 4000;
var sameValueCards = 0;
var opponentBrain; // A variable to store opponent betting behavior
var chipsPot = 0; //  Pot starts at nothing
var opponentBet; // A variable for what the opponent will be betting
var bet = 0; // A variable for the player's bet
var recentBet = 0; // A variable to store what the opponent has previously bet
var yourRecentBet = 0; // A variable to store player bets
var numberOfBurnedCards; // A variable used in logic for discarding cards
var burnedCards; // Another variable used in logic for discarding cards
var gameState = -1; /* A variable for storing the states of the game. Game will cycle through a
                     switch statement for different parts. 
                     */
for(i = 0; i < suits.length; i++) {  // For each suit and value pair, this loop creates all 52 cards
    for(x = 0; x < values.length; x++) {
        var card = {Value: values[x], Suit: suits[i]}; // create object "card" with Suit and Value properties
        deck.push(card); // Every iteration, the card is added to the deck array
    }
}

function shuffleDeck(deck) { // A function to shuffle the deck
    for(i = 0; i < 999; i++) { // Deck is shuffled 999 times per function call
        var shuffleSpot1 = Math.floor((Math.random() * deck.length)); // return a random integer between 0 and 51
        var shuffleSpot2 = Math.floor((Math.random() * deck.length)); // return another random integer
        var temporarySpot = deck[shuffleSpot1]; // Swap the cards in the indexes of the two integers
        deck[shuffleSpot1] = deck[shuffleSpot2];
        deck[shuffleSpot2] = temporarySpot;
    }
}
function dealCard(deck) { // Function to deal a card from the top of the deck
     return deck.pop(); 
} 

function dealYourHand(deck) { // Function to deal a card to yourHand
    var newCard = dealCard(deck); // Make a new variable equal to the card removed from the deck
    yourHand = yourHand.concat(newCard); // Add (concat) this to yourHand
}

function dealOpponentHand(deck) { // Function to deal a card to opponentHand
    var newCard = dealCard(deck); 
    opponentHand = opponentHand.concat(newCard); // Add to opponentHand
}

function placeYourBet() { // Function to bet chips
   var bet = prompt("Enter your bet:");
   bet = +bet; // Make sure the bet is an integer
    if (bet > yourChips) { // Player cannot bet more chips than they have
        alert('Sorry, you do not have enough chips for this bet.');
        placeYourBet(); // Prompt again
    }
    else if (bet < 0) { // Player cannot bet negative numbers
        alert('You cannot bet a negative number.');
        placeYourBet(); // Prompt again
    }
    else if (bet == '' || 0) { // If the bet is empty, call instead, currently unused
        youCall();
    }
    else if ((typeof(bet) != 'number') || isNaN(bet) == true) { // If the bet is not a number, or type NaN...
        alert('Sorry, you need to enter a numeric value.'); // Don't allow other types besides numbers for input
        placeYourBet(); // Prompt again
    }
    else { // Normally...
    chipsPot = +chipsPot + bet; // Add chips to pot
    yourChips = +yourChips - bet; // Subtract bet from yourChips
    yourRecentBet = yourRecentBet + bet; // Store the amount you just bet, used for logic later
    console.log('You have bet' + ' ' + bet + ' chips.'); // Show the player in the console the pot and their chips
    console.log('You now have ' + yourChips + ' chips.');
    console.log('The pot is now ' + chipsPot + ' chips.');
    }
}

function placeOpponentBet() { // Function to make the opponent bet chips
    console.log('Opponent has ' + opponentChips + ' chips.');
    if (opponentChips > 1400) { // A.I to make the opponent change their bet depending on how many chips they have
        opponentBrain = Math.floor(Math.random() * 10); // A variable to store a randomly generated integer between 0 and 9
        if (opponentBrain >= 7) {
            opponentBet = 250;
        }
        else if (opponentBrain == 6) {
            opponentBet = 500;
        }
        else if (opponentBrain == 5 || 4) {
            opponentBet = Math.floor((yourChips / 2)); // The opponent sometimes bets a fraction of the player's chips
        }
        else if (opponentBrain == 0) { // Sometimes the opponent bets ALL of your chips
            opponentBet = yourChips;
        }
        else {
            opponentBet = 150;
        }
    }
    else if (opponentChips < 500) { // If the opponent is losing chips, they will play less aggressive
        opponentBrain = Math.floor(Math.random() * 10);
        if (opponentBrain > 6) {
            opponentBet = 75;
        }
        else if (opponentBrain = 5 || 4) {
            opponentBet = 50;
        }
        else if (opponentBrain < 2) {
            opponentBet = Math.floor((yourChips / 10)); // Opponent sometimes bets 10% of the players chips
        }
        else {
            opponentBet = 400;
        }
    }
    else { // When the opponent has between 501 and 1400 chips...
        opponentBrain = Math.floor(Math.random() * 20); // A variable to store a randomly generated integer between 0 and 19
        if (opponentBrain > 15) {
            opponentBet = 100;
        }
        else if (opponentBrain < 7) {
            opponentBet = 150;

        }
        else {
            opponentBet = Math.floor(opponentChips / 11);
        }
    }

    if (opponentBet === '') { // If the bet is empty, call instead
        callOpponentBet();
    }
    else { // Normally...
        recentBet = opponentBet; // Store the opponent's recent bet
        chipsPot = +chipsPot + opponentBet; // Add the chips to the pot
        opponentChips = opponentChips - opponentBet; // Remove the same amount from opponentChips
        console.log('Opponent has bet' + ' ' + opponentBet + ' chips.');
        console.log('Opponent now has ' + opponentChips + ' chips.');
    }
}

function youCall() { // Player function to not bet, currently unused
    var bet = 0;
    chipsPot = chipsPot;
    console.log('You have called.');
}

function callOpponentBet() { // Opponent function to not bet, currently unused
    var bet = 0;
    chipsPot = chipsPot;
    console.log('Opponent has called.');
}

function resetGame() { // A function to reset the game, adds all cards back to deck
    deck.concat(yourHand.splice(0, yourHand.length)); // Take cards from yourHand[0] to yourHand[4], and concat them to deck
    deck.concat(opponentHand.splice(0, opponentHand.length)); // Do the same for the opponent
    deck.concat(usedCards); // Take all the cards from the usedCards pile
    recentBet = 0; // Reset betting variables stored from earlier games
    yourRecentBet = 0; //
    opponentBet = 0; //
}

function youFold() { // Function to fold
    deck = deck.concat(yourHand.splice(0, yourHand.length)); // Concat ALL cards back to the deck
    deck = deck.concat(opponentHand.splice(0, opponentHand.length));
    deck = deck.concat(usedCards);
    opponentChips = opponentChips + chipsPot; // Opponent gets chips from the pot and what they were betting
    yourChips = yourChips - recentBet; // Take however much the opponent bet from yourChips
    gameState = 0;
    recentBet = 0;
    yourRecentBet = 0;
  
}

function opponentFold() { // Function to make opponent fold, currently unused
    deck = deck.concat(yourHand.splice(0, yourHand.length));
    deck = deck.concat(opponentHand.splice(0, opponentHand.length));
    deck = deck.concat(usedCards);
    yourChips = yourChips + chipsPot;
    gameState = 0;
    recentBet = 0;
    yourRecentBet = 0;
}

function sortHands() { // Sorts both the player and opponent hands by values.indexOf(), shifting lower values to the start
    yourHand.sort((a, b) => { // Sort yourHand with a reference function
       var sortIndex = values.indexOf(a.Value); // Store a variable equal to the index of the card's suit value.
       if (sortIndex > values.indexOf(b.Value)) { // If the next card in yourHand is a lower value...
            return 1; // Move its index forward
        }
        else {
            return -1; // Move its index backwards
        }
    });
        // Do the same for opponentHand
    opponentHand.sort((a, b) => { 
        var opponentSortIndex = values.indexOf(a.Value);
       if (opponentSortIndex > values.indexOf(b.Value)) {
            return 1;
        }
        else {
            return -1;
        }
    }
    );
}

function displayYourHand() { // Function to show the player their hand in the console
    sortHands(); // Sort the hand before showing it
    console.log('This is your hand. It has ' + yourHand.length + ' cards in it.'); // This statement will appear when discarding
    console.log(yourHand[0]);
    console.log(yourHand[1]); // Show all the cards in the hand
    console.log(yourHand[2]); // The player should always have 5 cards.
    console.log(yourHand[3]); // 
    console.log(yourHand[4]); //
}
function displayOpponentHand() { // Function to show the player the opponent's hand
    sortHands();
    console.log('This is your opponents hand. It has ' + opponentHand.length + ' cards in it.');
    console.log(opponentHand[0]);
    console.log(opponentHand[1]);
    console.log(opponentHand[2]);
    console.log(opponentHand[3]);
    console.log(opponentHand[4]);
}
function discardYourHand() { // Function to discard cards
    displayYourHand(); // Show the player their hand first
    burnedCards = prompt("Select the card(s) to be discarded. Syntax: 'Value' of 'Suit'. (CASE SENSITIVE) "); // Prompt the player to type the card they want to discard
    var cardValue = burnedCards.split(' of '); // Create variables to store what Suit and Value the player chose
    var cardSuit = cardValue.pop();
    if (yourHand.some(yourHand => yourHand.Value == cardValue[0]) && yourHand.some(yourHand => yourHand.Suit[0] == cardSuit[0])) { 
        // If the Value of your chosen card is in your hand... AND... If the suit of your chosen card is in your hand...
            cardValue = +cardValue;// Make sure the Value is an integer because JavaScript is annoying
            var cardIndex = yourHand.findIndex(element => (element.Value === cardValue && element.Suit === cardSuit)); // Find the index of the selected card
            usedCards = usedCards.concat(yourHand.splice(cardIndex, 1)); // Concat the card at that index to the used or trash cards pile
            gameState = 3; // After discarding, change the state of the game
            numberOfBurnedCards = numberOfBurnedCards - 1;
        }
    else if (yourHand.some(yourHand => yourHand.Value.toString() !== cardValue[0]) || yourHand.some(yourHand => yourHand.Suit.toString() !== cardValue[1])) { // If the value or suit is not in your hand...
        alert('Sorry, that card is not in your hand.'); 
    }
}
/* Switch statement to determine game state, any state more than the
 total number of states ends the game, should only happen on win or loss 
 */
for(gameState; gameState < 8 ;) { 
    if(yourChips < 0) {           
        alert('You have lost all your chips. Game over!');
        gameState = 99; // Make the player lose if they run out of chips
    }
    if(opponentChips < 0) {
        alert('Your opponent has lost all their chips. You win!');
        gameState = 99; // Make the opponent lose if they run out of chips
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
        resetGame(); // Reset the game, since this is the beginning of any hand
        shuffleDeck(deck); // Shuffle and deal 5 cards to both players
        while(yourHand.length < 5) { 
            dealYourHand(deck);
        }                           // Deal 5 cards to player and opponent
        while(opponentHand.length < 5) {
            dealOpponentHand(deck);
        }
        displayYourHand();                      
        alert('You have been dealt 5 cards.'); 
        gameState = 1; // Show the player their hand and advance the game
    break;
    
    case 1: // 1st Betting state
        if (yourChips < 50) {
            alert('You could not afford the 50 chip buy-in. You lose!');
            gameState = 99;
        }
        chipsPot = chipsPot + 100;
        yourChips = yourChips - 50; // There is a 50 chip buy-in so the player cannot repeatedly fold
        opponentChips = opponentChips - 50;
        console.log('You and your opponent add 50 chips to the pot as a buy-in.');

        placeOpponentBet(); // Opponent bets first
        console.log('The pot is now ' + chipsPot + ' chips.'); // Display the pot and your amount of chips
        console.log('You have ' + yourChips + ' chips.');
        
        while(recentBet > yourRecentBet) { // Don't let the player proceed if their bet is less than the opponent's, they have to match or fold.
            var yourSelection = prompt('Your opponent has raised you by ' + (recentBet - yourRecentBet) + ' chip(s). Would you like to match them? Enter Yes or no. (Case insensitive)');
        if(yourSelection.toUpperCase() == 'YES') { // Automatically match the opponent's bet
            chipsPot = +chipsPot + (+recentBet - +yourRecentBet); // Add the difference between your bet and the opponent's to the pot
            yourChips = yourChips - (+recentBet - +yourRecentBet);
            alert("You have matched your opponent's bet of " + recentBet + ' chips.');
            console.log('You now have ' + yourChips + ' chips.');
            console.log('The pot is now ' + chipsPot + ' chips.');
            yourRecentBet = recentBet; // Set your bets to be equal to break the loop

            gameState = 2; // Continue the game
            break;
        }
        else if(yourSelection.toUpperCase() == 'NO') { // If the player's bet is lower than the opponent's, they cannot call or continue
            while(recentBet > yourRecentBet) {     // Force player to raise their bet or fold
                var anotherSelection = prompt('The opponent has bet ' + (recentBet - yourRecentBet) + ' chip(s) more than you. Would you like to raise or fold?');
                if(anotherSelection.toUpperCase() == 'RAISE') {
                    placeYourBet();
                    yourRecentBet = +yourRecentBet + bet;
                    if (yourRecentBet > (opponentChips / 4)) {
                       opponentBrain = Math.floor(Math.random() * 10);
                        if (opponentBrain > 7) {
                            opponentFold();
                            alert('Your opponent has folded.');
                            gameState = 0;
                            break;
                        }
                        else {
                            if (yourRecentBet > recentBet) { // If you raise the opponent, they will match you
                                recentBet = +yourRecentBet - +recentBet;
                                chipsPot = +chipsPot + recentBet;
                                opponentChips = opponentChips - +recentBet;
                                alert('Opponent has matched you by betting' + ' ' + recentBet + ' chips.');
                                console.log('Opponent now has ' + opponentChips + ' chips.');
                                console.log('The pot is now ' + chipsPot + ' chips.');
                                gameState = 5;
                                break;
                            }

                        }
                    }
                    
                
                }
                else if (anotherSelection.toUpperCase() === 'STEAL') { // Unless you are reading this file, you shouldn't know how to do this...                     
                    var stealPrompt = prompt('SWIPER NO SWIPING (enter the amount of chips you want to steal from your opponent)');
                    stealPrompt = +stealPrompt;
                    yourChips = yourChips + stealPrompt;
                    opponentChips = opponentChips - stealPrompt;
                    yourRecentBet, recentBet = 0; 
                    console.log('You have stolen ' + stealPrompt + ' chips from your opponent, LMAOOOOOOOO'); // CHEATY CHEATERTON
                }
                else if (anotherSelection.toUpperCase() === 'FOLD') { // If the player wants to fold...
                    youFold();
                     // Reset the betting variables after the player folds
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
        
        numberOfBurnedCards = Math.floor(Math.random() * 5) + 1; // opponent discards a random number of cards if they have no pairs
        burnedCards = Math.floor(Math.random() * 5) + 1;
        for (i = 1;i < 3; i++) {
            if (opponentHand[i].Value === opponentHand[(i + 1)].Value) { // If the opponent has a pair in their hand, they will throw away other cards instead
                var opponentDiscardIndex = opponentHand[(i - 1)].Value;
                numberofBurnedCards = 1;
            }
        }        
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
        
        console.log(usedCards);
        gameState = 4;
    break;

    case 4: //2nd betting state, similar to first
    recentBet = 0;
    yourRecentBet = 0;
    placeOpponentBet();
    console.log('The pot is now ' + chipsPot + ' chips.');
    console.log('You have ' + yourChips + ' chips.');
    if (opponentBet > yourChips) {
        var yourSelection = prompt('The opponent has raised you by more chips than you have. Would you like to go all in or fold?');
        if (yourSelection.toUpperCase() == 'FOLD') {
            youFold();
        }
        else { 
        chipsPot = chipsPot + yourChips;
        yourChips = 0;
        console.log('The pot is now ' + chipsPot + ' chips.');
        console.log('You have ' + yourChips + ' chips.');
        gameState++;
        break;
        }
    }
    while(recentBet > yourRecentBet) { // While your recent bet is less than the opponent's
        var yourSelection = prompt('Your opponent has raised you by ' + (recentBet - yourRecentBet) + ' chip(s). Would you like to match them? Enter Yes or no.');
        if(yourSelection.toUpperCase() == 'YES') { // Automatically match the opponent's bet if player selects "YES"
            chipsPot = +chipsPot + (+recentBet - +yourRecentBet);
            yourChips = yourChips - (+recentBet - +yourRecentBet);
            alert("You have matched your opponent's bet.");
            console.log('You now have ' + yourChips + ' chips.');
            console.log('The pot is now ' + chipsPot + ' chips.');
            yourRecentBet = recentBet;
            gameState = 5;
            break;
        }
        else if(yourSelection.toUpperCase() == 'NO') { // If the player's bet is lower than the opponent's, they cannot call, same as before
            while(recentBet > yourRecentBet) {
                var anotherSelection = prompt('The opponent has bet ' + (recentBet - yourRecentBet) + ' chip(s) more than you. Would you like to raise or fold?');
                if(anotherSelection.toUpperCase() == 'RAISE') {
                    placeYourBet();
                    yourRecentBet = +yourRecentBet + bet;
                    if (yourRecentBet > (opponentChips / 4)) {
                       opponentBrain = Math.floor(Math.random() * 10);
                        if (opponentBrain > 7) {
                            opponentFold();
                            alert('Your opponent has folded.');
                            gameState = 0;
                            break;
                        }
                        else {
                            if (yourRecentBet > recentBet) { // If you raise the opponent, they will match you
                                recentBet = +yourRecentBet - +recentBet;
                                chipsPot = +chipsPot + recentBet;
                                opponentChips = opponentChips - +recentBet;
                                alert('Opponent has matched you by betting' + ' ' + recentBet + ' chips.');
                                console.log('Opponent now has ' + opponentChips + ' chips.');
                                console.log('The pot is now ' + chipsPot + ' chips.');
                                gameState = 5;
                                break;
                            }

                        }
                    }
                    
                
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
    
    case 5: // State to determine the value of the player's hand
    let testHand = [];
    let testCard1 = {Value: 2, Suit: 'Spades'};
    let testCard2 = {Value: 3, Suit: 'Spades'};
    let testCard3 = {Value: 4, Suit: 'Spades'};
    let testCard4 = {Value: 5, Suit: 'Spades'};
    let testCard5 = {Value: 6, Suit: 'Hearts'};
    testHand.push(testCard1);
    testHand.push(testCard2);
    testHand.push(testCard3);
    testHand.push(testCard4);
    testHand.push(testCard5);
    testHand.sort((a, b) => {
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

    var pairCount = 0;
    var cardSuit = yourHand[0].Suit;
    var isFlush = (yourHand) => yourHand.Suit == cardSuit;
    if (yourHand[0].Value == 10) {
        if(yourHand[1].Value == 'Ace') {
            if(yourHand[2].Value == 'Jack') {
                if(yourHand[3].Value == 'King') {
                    if(yourHand[4].Value == 'Queen') {
                        if(yourHand.every(isFlush) === true) {
                            yourHandValue = pokerHands.royalflush;
                            console.log('You have a royal flush. What are the odds? Your hand value is: ', pokerHands.royalflush);
                            gameState = 6;
                            break;
                        }
                    }
                }
            }
        }
    }
    // if every card in your hand is the same suit, AND if the index of the first and last cards in your hand have a difference of 4...
    if ((yourHand.every(isFlush) === true) && (values.indexOf(yourHand[4].Value) - values.indexOf(yourHand[0].Value) == 4)) { // Straight Flush
        yourHandValue = pokerHands.straightflush;// If every card in your hand is the same suit AND you have a straight...
        console.log('You have a straight flush. Your hand value is: ', pokerHands.straightflush);
        gameState = 6;
        break;
    }
    else if (values.indexOf(yourHand[4].Value) - values.indexOf(yourHand[0].Value) == 4) {
        yourHandValue = pokerHands.straight;// If you have a straight...
        console.log('You have a straight. Your hand value is: ', pokerHands.straight);
        gameState = 6;
        break;
    }
    else if (yourHand.every(isFlush) === true) { //
        yourHandValue = pokerHands.flush;// If every card in your hand is the same suit...
        console.log('You have a flush. Your hand value is: ', pokerHands.flush);
        gameState = 6;
        break;
    }
    else if (((yourHand[0].Value == yourHand[2].Value) && yourHand[3].Value == yourHand[4].Value) || ((yourHand[0].Value == yourHand[1].Value) && (yourHand[2].Value == yourHand[4].Value))) {
        yourHandValue = pokerHands.fullhouse;// Full house logic, if you have a 3 of a kind and a pair...
        console.log('You have a full house. Your hand value is: ', pokerHands.fullhouse);
        gameState = 6;
        break;
    }
    else if ((yourHand[0].Value == yourHand[3].Value) || (yourHand[1].Value == yourHand[4].Value)) {
        yourHandValue = pokerHands.threeofkind;// If you have a 4 of a kind
        console.log('You have a four of a kind. Your hand value is: ', pokerHands.fourofkind);
        gameState = 6;
        break;
    }
    else if ((yourHand[0].Value == yourHand[2].Value) || (yourHand[1].Value == yourHand[3].Value) || (yourHand[2].Value == yourHand[4].Value)) {
        yourHandValue = pokerHands.threeofkind;// If you have a 3 of a kind
        console.log('You have a three of a kind. Your hand value is: ', pokerHands.threeofkind);
        gameState = 6;
        break;
    }
   
    for (i = 0; i <= 3; i++) { // Two pair, pair, and high card logic
        if (yourHand[i].Value === yourHand[(i + 1)].Value) { // If the value of a card is the same for the next index...
            pairCount = pairCount + 1;
        }
    }
    if (pairCount == 2) { // If you have two pairs total...
        yourHandValue = pokerHands.twopair;
        console.log('You have a two pair. Your hand value is: ', pokerHands.twopair);
        gameState = 6;
        break;
    }
    else if (pairCount == 1) { // If you have one pair total...
        yourHandValue = pokerHands.pair;
        console.log('You have a pair. Your hand value is: ', pokerHands.pair);
        gameState = 6;
        break;
    }
    else { // If you have no pairs and no other hands...
        yourHandValue = pokerHands.highcard;
        console.log('You just have a high card. Your hand value is: ', pokerHands.highcard, ' Ouch.');
        gameState = 6;
        break;
    }
    break;

    case 6: // Determine the value of the opponent's hand
    displayOpponentHand();
    var opponentPairCount = 0;
    var opponentCardSuit = opponentHand[0].Suit;
    var isFlush = (opponentHand) => opponentHand.Suit == opponentCardSuit;
    if (opponentHand[0].Value == 10) {
        if(opponentHand[1].Value == 'Ace') {
            if(opponentHand[2].Value == 'Jack') {
                if(opponentHand[3].Value == 'King') {
                    if(opponentHand[4].Value == 'Queen') {
                        if(opponentHand.every(isFlush) === true) {
                            opponentHandValue = pokerHands.royalflush;
                            console.log("Your opponent has a royal flush. What are the odds? Your opponent's hand value is: ", pokerHands.royalflush);
                            gameState = 7;
                            break;
                        }
                    }
                }
            }
        }
    }

    if ((opponentHand.every(isFlush) === true) && (values.indexOf(opponentHand[4].Value) - values.indexOf(opponentHand[0].Value) == 4)) { // Straight Flush
        opponentHandValue = pokerHands.straightflush;// If every card in your hand is the same suit AND you have a straight...
        console.log("Your opponent has a straight flush.  Your opponent's hand value is: ", pokerHands.straightflush);
        gameState = 7;
        break;
    }
    else if (values.indexOf(opponentHand[4].Value) - values.indexOf(opponentHand[0].Value) == 4) {
        opponentHandValue = pokerHands.straight;// If you have a straight...
        console.log("Your opponent has a straight.  Your opponent's hand value is: ", pokerHands.straight);
        gameState = 7;
        break;
    }
    else if (opponentHand.every(isFlush) === true) { //
        opponentHandValue = pokerHands.flush;// If every card in your hand is the same suit...
        console.log("Your opponent has a flush.Your opponent's hand value is: ", pokerHands.flush);
        gameState = 7;
        break;
    }
    else if (((opponentHand[0].Value == opponentHand[2].Value) && opponentHand[3].Value == opponentHand[4].Value) || ((opponentHand[0].Value == opponentHand[1].Value) && (opponentHand[2].Value == opponentHand[4].Value))) {
        opponentHandValue = pokerHands.fullhouse;// Full house logic, if you have a 3 of a kind and a pair...
        console.log("Your opponent has a full house. Your opponent's hand value is: ", pokerHands.fullhouse);
        gameState = 7;
        break;
    }
    else if ((opponentHand[0].Value == opponentHand[3].Value) || (opponentHand[1].Value == opponentHand[4].Value)) {
        opponentHandValue = pokerHands.threeofkind;// If you have a 4 of a kind
        console.log("Your opponent has a four of a kind. Your opponent's hand value is: ", pokerHands.fourofkind);
        gameState = 7;
        break;
    }
    else if ((opponentHand[0].Value == opponentHand[2].Value) || (opponentHand[1].Value == opponentHand[3].Value) || (opponentHand[2].Value == opponentHand[4].Value)) {
        opponentHandValue = pokerHands.threeofkind;// If you have a 3 of a kind
        console.log("Your opponent has a three of a kind. Your opponent's hand value is: ", pokerHands.threeofkind);
        gameState = 7;
        break;
    }
   
    for (i = 0; i <= 3; i++) { 
        if (opponentHand[i].Value === opponentHand[(i + 1)].Value) { // If the value of a card is the same for the next index...
            opponentPairCount = opponentPairCount + 1;
        }
    }
    if (opponentPairCount == 2) { 
        opponentHandValue = pokerHands.twopair;
        console.log("Your opponent has a two pair. Your opponent's hand value is: ", pokerHands.twopair);
        gameState = 7;
        break;
    }
    else if (opponentPairCount == 1) { 
        opponentHandValue = pokerHands.pair;
        console.log("Your opponent has a pair. Your opponent's hand value is: ", pokerHands.pair);
        gameState = 7;
        break;
    }
    else {
        opponentHandValue = pokerHands.highcard;
        console.log("Your opponent just has a high card. Your opponent's hand value is: ", pokerHands.highcard);
        gameState = 7;
        break;
    }
    case 7: // Player and opponent hand value comparison
    yourHand.sort();
    console.log(yourHand);
        if (yourHandValue > opponentHandValue) {
            opponentFold();
            alert('You have won the hand.');
            gameState = 0;
            break;
        }
        else if (yourHandValue < opponentHandValue) {
            youFold();
            alert('The opponent has won the hand.');
            gameState = 0;
            break;
        }
        else if (yourHandValue == opponentHandValue) { // If both the player and opponent have the same hand, it goes to high cards
            switch(pokerHands) {
                case pokerHands.straightflush:
                case pokerHands.flush:
                case pokerHands.straight:
                    if ((values.indexOf(yourHand[4].Value)) > (values.indexOf(opponentHand[4].Value))) {
                        opponentFold();
                        alert('You have won the hand by high card.');
                        gameState = 0;
                        break;
                    }
                    else {
                        youFold();
                        alert('The opponent has won the hand by high card.');
                        gameState = 0;
                        break;
                    }
                case pokerHands.fourofkind:
                case pokerHands.fullhouse:
                case pokerHands.threeofkind:
                    if ((values.indexOf(yourHand[2].Value)) > (values.indexOf(opponentHand[2].Value))) {
                        opponentFold();
                        alert('You have won the hand by high card.');
                        gameState = 0;
                        break;
                    }
                    else {
                        youFold();
                        alert('The opponent has won the hand by high card.');
                        gameState = 0;
                        break;
                    }
                }
            }
                case pokerHands.twopair:
                case pokerHands.pair:
                    var pairIndex;
                    var opponentPairIndex;
                    for (i = 0; i < 4; i++) {
                        if (yourHand[i].Value === yourHand[(i + 1)].Value) {
                            pairIndex = yourHand[i].Value;
                        }
                        if (opponentHand[i].Value === opponentHand[(i + 1)].Value) {
                            opponentPairIndex = opponentHand[i].Value;
                        }
                    }
                    if ((values.indexOf(pairIndex)) > (values.indexOf(opponentPairIndex))) {
                        opponentFold();
                        alert('You have won the hand by high card.');
                        gameState = 0;
                        break;
                    }
                    else {
                        youFold();
                        alert('The opponent has won the hand by high card.');
                        gameState = 0;
                        break;
                    }

                case pokerHands.highcard:
                    if ((values.indexOf(yourHand[4].Value)) > (values.indexOf(opponentHand[4].Value))) {
                        opponentFold();
                        alert('You have won the hand by high card.');
                        gameState = 0;
                        break;
                    }
                    else if ((values.indexOf(yourHand[3].Value)) > (values.indexOf(opponentHand[3].Value))) {
                        opponentFold();
                        alert('You have won the hand by high card.');
                        gameState = 0;
                        break;
                    }
                    else if ((values.indexOf(yourHand[2].Value)) > (values.indexOf(opponentHand[2].Value))) {
                        opponentFold();
                        alert('You have won the hand by high card.');
                        gameState = 0;
                        break;
                    }
                    else if ((values.indexOf(yourHand[1].Value)) > (values.indexOf(opponentHand[1].Value))) {
                        opponentFold();
                        alert('You have won the hand by high card.');
                        gameState = 0;
                        break;
                    }
                    else if ((values.indexOf(yourHand[0].Value)) > (values.indexOf(opponentHand[0].Value))) {
                        opponentFold();
                        alert('You have won the hand by high card.');
                        gameState = 0;
                        break;
                    }
                    else {
                        youFold();
                        alert('The opponent has won the hand by high card.');
                        gameState = 0;
                        break;

                    }
        
    } // Switch statement brace, line 251
     
} // For loop switch statement brace, line 242

