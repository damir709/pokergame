let suits = ['spades', 'clubs', 'diamonds', 'hearts']; // Create suits of cards
let values = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King']; // Create values of cards

let deck = new Array(); // Make the deck an array

for(i = 0; i < suits.length; i++) {  // Create all cards in a deck
    for(x = 0; x < values.length; x++) {
        let card = {Value: values[x], Suit: suits[i]} // create object "card" with Suit and Value properties
        deck.push(card);
    }
}
function shuffleDeck(deck) { // Function to shuffle the deck
    for(i = 0; i < 999; i++) {
        let shuffleSpot1 = Math.floor((Math.random() * deck.length)); // return a random integer
        let shuffleSpot2 = Math.floor((Math.random() * deck.length)); // return another random integer
        let temporarySpot = deck[shuffleSpot1]; // swap the two values
        deck[shuffleSpot1] = deck[shuffleSpot2];
        deck[shuffleSpot2] = temporarySpot;
       // console.log(shuffleSpot1, shuffleSpot2);
    }
}

function dealCard(deck) { // Function to deal a card from the top of the deck
    return deck.pop(); // returns last value
}
let pokerHands = {
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
}
let yourHand = []; // Start with no cards
let opponentHand = []; // Opponent starts with no cards
let usedCards = []; // Cards that are burned or discarded go here
let yourHandValue = 0;
let opponentHandValue = 0;
function dealYourHand(deck) { // Function to deal a card to yourHand
    let newCard = dealCard(deck);
   yourHand = yourHand.concat(newCard); // Add popped element to yourHand
}
function dealOpponentHand(deck) { // Function to deal a card to opponentHand
    let newCard = dealCard(deck);
   opponentHand = opponentHand.concat(newCard);
}
let yourChips = 1000; // player and opponent start with 1000 chips, pot starts at nothing
let opponentChips = 1000;
var chipsPot = 0;
console.log('You have ' + yourChips + ' chips.');
function placeYourBet() { // Function to bet chips
   let bet = prompt("Enter your bet:");
   bet = +bet;
   //console.log(typeof(bet));
    if(bet > yourChips) {
        alert('Sorry, you do not have enough chips for this bet.')
        placeYourBet();
    }
    else if(bet < 0) {
        alert('You cannot bet a negative number.')
        placeYourBet();
    }
    else if(bet == '' || 0) { // If the bet is empty, call different function
        callYourBet();
    }
    else if(typeof(bet) === 'string' || typeof(bet) === NaN) { // Don't allow other types besides numbers for input
        alert('Sorry, you need to enter a numeric value.')
        placeYourBet();
    }
    else {
    chipsPot = +chipsPot + +bet;
    yourChips = yourChips - bet;
    console.log('You have bet' + ' ' + bet + ' chips.');
    console.log('You now have ' + yourChips + ' chips.');
    }
}
function placeOpponentBet() { // Function to bet chips
    console.log('Opponent has ' + opponentChips + ' chips.');
    let bet = '';
    if(bet === '') { // If the bet is empty, call different function
        callOpponentBet();
    }
    else {
     chipsPot = +chipsPot + +bet;
     opponentChips = opponentChips - bet;
     console.log('Opponent has bet' + ' ' + bet + ' chips.');
     console.log('Opponent now has ' + opponentChips + ' chips.');
    }
}
function callYourBet() { // Function to not bet
    let bet = 0;
    chipsPot = chipsPot;
    console.log('You have called.');
}
function callOpponentBet() { // Function to not bet
    let bet = 0;
    chipsPot = chipsPot;
    console.log('Opponent has called.');
}
function sortHands() {
    yourHand.sort((a, b) => a.Value > b.Value ? 1: -1); //Sort your hand by Value
    opponentHand.sort((a, b) => a.Value > b.Value ? 1: -1); //Sort opponent hand by Value
}
function displayYourHand() {
    sortHands();
    console.log("This is your hand.");
    console.log(yourHand[0]);
    console.log(yourHand[1]);
    console.log(yourHand[2]);
    console.log(yourHand[3]);
    console.log(yourHand[4]);
    console.log(yourHand);
}
let numberOfBurnedCards;
let burnedCards;
let gameState = -1; // Creating the states of the game
for(gameState; gameState < 6 ;) {
switch(gameState) {
    case -1: // Welcome screen state
       let startPrompt = prompt('Welcome to Poker! Please enter "s" to begin!');
        if(startPrompt === 's') {
            console.log('gameState ' + gameState);
            gameState = 0;
        }
        else {
            alert('Sorry, you need to press "s" to begin.');
        }
    break;

    case 0: // Card dealing state
        shuffleDeck(deck);
        while(yourHand.length < 5) {
            dealYourHand(deck);
        }
        while(opponentHand.length < 5) {
            dealOpponentHand(deck);
        }
        displayYourHand();
        sortHands();
        
        console.log('gameState ' + gameState);
        gameState = 1;
    break;
    
    case 1: // Betting state
        placeYourBet();
        placeOpponentBet();
        console.log('The pot is now ' + chipsPot + ' chips.');
        console.log('gameState ' + gameState);
        gameState = 2;
    break;

    case 2: // Player discard and draw state
        numberOfBurnedCards = prompt("How many cards would you like to discard?");
        if(numberOfBurnedCards == 0 || '') { // If the player discards no cards
            console.log('You draw no cards.')
            displayYourHand();
            console.log('gameState ' + gameState);
            gameState = 3;
        }
        
        else if (numberOfBurnedCards == 5) {
            usedCards = usedCards.concat(yourHand.splice(0, numberOfBurnedCards)); //Concat the element spliced from yourHand to usedCards
            while(yourHand.length < 5) {
                 dealYourHand(deck);
            } 
            displayYourHand();
            console.log('gameState ' + gameState);
            gameState = 3;     
        }
        else if (numberOfBurnedCards == 1) {
                for(y = 0; y < numberOfBurnedCards; y++) {
                    burnedCards = prompt("Select the card to be discarded. 0 is counted as the first position.");
                    usedCards = usedCards.concat(yourHand.splice(burnedCards, 1)); //Concat the element spliced from yourHand to usedCards
                    console.log('gameState ' + gameState);
                }
                while(yourHand.length < 5) {
                    dealYourHand(deck);
                }
                displayYourHand();
                gameState = 3;
            }
        else {
            for(y = 0; y < numberOfBurnedCards; y++) {
                burnedCards = prompt("Select the card to be discarded. 0 is counted as the first position.");
                usedCards = usedCards.concat(yourHand.splice(burnedCards, 1)); //Concat the element spliced from yourHand to usedCards
            }
            while(yourHand.length < 5) {
                dealYourHand(deck);
            }
            displayYourHand();
            console.log('gameState ' + gameState);
            gameState = 3;
        }
        
    
    break;

    case 3: // Opponent discard and draw state
        numberOfBurnedCards = Math.floor(Math.random() * 5) + 1;
        burnedCards = Math.floor(Math.random() * 5) + 1;
        //console.log(burnedCards);
        //console.log(numberOfBurnedCards);
        usedCards = usedCards.concat(opponentHand.splice(0, numberOfBurnedCards)); //Concat the element spliced from opponentHand to usedCards
        
        while(opponentHand.length < 5) {
            dealOpponentHand(deck);
        }
        if(numberOfBurnedCards == 1) {
            console.log('Your opponent draws ' + numberOfBurnedCards + ' card.')
        }
        else {
            console.log('Your opponent draws ' + numberOfBurnedCards + ' cards.')
        }
        console.log('gameState ' + gameState);
        console.log(usedCards);
        gameState = 4;
    break;

    case 4: //2nd betting state
        placeYourBet();
        placeOpponentBet();
        console.log('The pot is now ' + chipsPot + ' chips.');
        console.log('gameState ' + gameState);
        gameState = 1;
    break;
    }
}



//console.log(yourHand);
//console.log(opponentHand);
//console.log(deck);
//console.log(usedCards);
