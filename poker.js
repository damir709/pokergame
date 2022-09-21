
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
var deck = []; // Make the deck an array
var yourHand = []; // Start with no cards
var opponentHand = []; // Opponent starts with no cards
var usedCards = []; // Cards that are "burned" or discarded go here
var yourHandValue = 0; // Variables to determine who has the better hand
var opponentHandValue = 0;
var yourChips = 2000; // player and opponent start with 1000 chips
var opponentChips = 2000;
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
   //console.log(typeof(bet));
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
    if (opponentChips > 1400) {
        var opponentBrain = Math.floor(Math.random() * 10);
        if (opponentBrain >= 7) {
            opponentBet = 250;
        }
        else if (opponentBrain == 6) {
            opponentBet = 300;
        }
        else if (opponentBrain == 5 || 4) {
            opponentBet = Math.floor((yourChips / 4));
        }
        else {
            opponentBet = 150;
        }
    }
    else if (opponentChips < 500) {
        opponentBet = 50;
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
    recentBet = 0;
    yourRecentBet = 0;
    opponentBet = 0;
}

function youFold() { // Function to fold
    deck = deck.concat(yourHand.splice(0, yourHand.length)); // Concat ALL cards back to the deck
    deck = deck.concat(opponentHand.splice(0, opponentHand.length));
    deck = deck.concat(usedCards);
    opponentChips = opponentChips + chipsPot; // Opponent gets chips from the pot and what they were betting
    opponentChips = opponentChips + recentBet;
    yourChips = yourChips - recentBet;
    chipsPot = 0;
    gameState = 0;
  
}

function opponentFold() { // Function to make opponent fold
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

function sortHands() { // Sorts both the player and opponent hands by values.indexOf(), shifting lower values to the start
    yourHand.sort((a, b) => {
       var sortIndex = values.indexOf(a.Value);
       if (sortIndex > values.indexOf(b.Value)) {
            return 1;
        }
        else {
            return -1;
        }
    }
    
    );
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

function displayYourHand() { // Function to show the player their hand
    sortHands();
    console.log('This is your hand. It has ' + yourHand.length + ' cards in it.');
    console.log(yourHand[0]);
    console.log(yourHand[1]);
    console.log(yourHand[2]);
    console.log(yourHand[3]);
    console.log(yourHand[4]);
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
    displayYourHand();
    burnedCards = prompt("Select the card(s) to be discarded. Syntax: 'Value' of 'Suit' ");
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

for(gameState; gameState < 8 ;) { // Switch statement to determine game state, any state more than the
    if(yourChips < 0) {           // total number of states ends the game, should only happen on win or loss
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
        resetGame();
        shuffleDeck(deck); // Shuffle and deal 5 cards to both players
        while(yourHand.length < 5) {
            dealYourHand(deck);
        }
        while(opponentHand.length < 5) {
            dealOpponentHand(deck);
        }
        displayYourHand();
        alert('You have been dealt 5 cards.');
        gameState = 1;
    break;
    
    case 1: // 1st Betting state
        placeOpponentBet(); // Opponent bets first
        console.log('The pot is now ' + chipsPot + ' chips.'); // Display the pot and your amount of chips
        console.log('You have ' + yourChips + ' chips.');
        if (opponentBet > yourChips) {
            alert('The opponent has bet more chips than you have. You must now go all in.');
            chipsPot = chipsPot + yourChips;
            yourChips = 0;
            console.log('The pot is now ' + chipsPot + ' chips.');
            console.log('You have ' + yourChips + ' chips.');
            gameState = 5;
            break;
        }
        while(recentBet > yourRecentBet) { // Don't let the player proceed if their bet is less than the opponent's, they have to match or fold.
            var yourSelection = prompt('Your opponent has raised you by ' + (recentBet - yourRecentBet) + ' chip(s). Would you like to match them? Enter Yes or no.');
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
                        console.log('gameState ' + gameState);
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
        alert('The opponent has bet more chips than you have. You must now go all in.');
        chipsPot = chipsPot + yourChips;
        yourChips = 0;
        console.log('The pot is now ' + chipsPot + ' chips.');
        console.log('You have ' + yourChips + ' chips.');
        gameState++;
        break;
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
                    if (yourRecentBet > recentBet) { // If you raise the opponent, they will match you
                        recentBet = +yourRecentBet - +recentBet;
                        chipsPot = +chipsPot + recentBet;
                        opponentChips = opponentChips - +recentBet;
                        console.log('Opponent has matched you by betting' + ' ' + recentBet + ' chips.');
                        console.log('Opponent now has ' + opponentChips + ' chips.');
                        console.log('The pot is now ' + chipsPot + ' chips.'); 
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
    
    case 5: // Determine the value of the player's hand
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
                            console.log('You have a royal flush. What are the odds?');
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
        console.log('You have a straight flush.');
        gameState = 6;
        break;
    }
    else if (values.indexOf(yourHand[4].Value) - values.indexOf(yourHand[0].Value) == 4) {
        yourHandValue = pokerHands.straight;// If you have a straight...
        console.log('You have a straight.');
        gameState = 6;
        break;
    }
    else if (yourHand.every(isFlush) === true) { //
        yourHandValue = pokerHands.flush;// If every card in your hand is the same suit...
        console.log('You have a flush.');
        gameState = 6;
        break;
    }
    else if (((yourHand[0].Value == yourHand[2].Value) && yourHand[3].Value == yourHand[4].Value) || ((yourHand[0].Value == yourHand[1].Value) && (yourHand[2].Value == yourHand[4].Value))) {
        yourHandValue = pokerHands.fullhouse;// Full house logic, if you have a 3 of a kind and a pair...
        console.log('You have a full house.');
        gameState = 6;
        break;
    }
    else if ((yourHand[0].Value == yourHand[3].Value) || (yourHand[1].Value == yourHand[4].Value)) {
        yourHandValue = pokerHands.threeofkind;// If you have a 4 of a kind
        console.log('You have a four of a kind.');
        gameState = 6;
        break;
    }
    else if ((yourHand[0].Value == yourHand[2].Value) || (yourHand[1].Value == yourHand[3].Value) || (yourHand[2].Value == yourHand[4].Value)) {
        yourHandValue = pokerHands.threeofkind;// If you have a 3 of a kind
        console.log('You have a three of a kind.');
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
        console.log('You have a two pair.');
        gameState = 6;
        break;
    }
    else if (pairCount == 1) { // If you have one pair total...
        yourHandValue = pokerHands.pair;
        console.log('You have a pair.');
        gameState = 6;
        break;
    }
    else { // If you have no pairs and no other hands...
        yourHandValue = pokerHands.highcard;
        console.log('You just have a high card. Ouch.');
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
                            console.log('Your opponent has a royal flush. What are the odds?');
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
        console.log('Your opponent has a straight flush.');
        gameState = 7;
        break;
    }
    else if (values.indexOf(opponentHand[4].Value) - values.indexOf(opponentHand[0].Value) == 4) {
        opponentHandValue = pokerHands.straight;// If you have a straight...
        console.log('Your opponent has a straight.');
        gameState = 7;
        break;
    }
    else if (opponentHand.every(isFlush) === true) { //
        opponentHandValue = pokerHands.flush;// If every card in your hand is the same suit...
        console.log('Your opponent has a flush.');
        gameState = 7;
        break;
    }
    else if (((opponentHand[0].Value == opponentHand[2].Value) && opponentHand[3].Value == opponentHand[4].Value) || ((opponentHand[0].Value == opponentHand[1].Value) && (opponentHand[2].Value == opponentHand[4].Value))) {
        opponentHandValue = pokerHands.fullhouse;// Full house logic, if you have a 3 of a kind and a pair...
        console.log('Your opponent has a full house.');
        gameState = 7;
        break;
    }
    else if ((opponentHand[0].Value == opponentHand[3].Value) || (opponentHand[1].Value == opponentHand[4].Value)) {
        opponentHandValue = pokerHands.threeofkind;// If you have a 4 of a kind
        console.log('Your opponent has a four of a kind.');
        gameState = 7;
        break;
    }
    else if ((opponentHand[0].Value == opponentHand[2].Value) || (opponentHand[1].Value == opponentHand[3].Value) || (opponentHand[2].Value == opponentHand[4].Value)) {
        opponentHandValue = pokerHands.threeofkind;// If you have a 3 of a kind
        console.log('Your opponent has a three of a kind.');
        gameState = 7;
        break;
    }
   
    for (i = 0; i <= 3; i++) { // Two pair, pair, and high card logic
        if (opponentHand[i].Value === opponentHand[(i + 1)].Value) { // If the value of a card is the same for the next index...
            opponentPairCount = opponentPairCount + 1;
        }
    }
    if (opponentPairCount == 2) { // If you have two pairs total...
        opponentHandValue = pokerHands.twopair;
        console.log('Your opponent has a two pair.');
        gameState = 7;
        break;
    }
    else if (opponentPairCount == 1) { // If you have one pair total...
        opponentHandValue = pokerHands.pair;
        console.log('Your opponent has a pair.');
        gameState = 7;
        break;
    }
    else { // If you have no pairs and no other hands...
        opponentHandValue = pokerHands.highcard;
        console.log('Your opponent just has a high card.');
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


