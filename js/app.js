/**********************************************
 * Create a list that holds all of your cards *
 *********************************************/

 const memoryCards = [
   'img/beach.svg','img/beach.svg',
   'img/calendar.svg','img/calendar.svg',
   'img/hotel.svg','img/hotel.svg',
   'img/map.svg','img/map.svg',
   'img/airplane-dep.svg','img/airplane-dep.svg',
   'img/ticket.svg','img/ticket.svg',
   'img/credit-cards.svg','img/credit-cards.svg',
   'img/cruise3.svg','img/cruise3.svg'];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
   var currentIndex = array.length, temporaryValue, randomIndex;

   while (currentIndex !== 0) {
       randomIndex = Math.floor(Math.random() * currentIndex);
       currentIndex -= 1;
       temporaryValue = array[currentIndex];
       array[currentIndex] = array[randomIndex];
       array[randomIndex] = temporaryValue;
   }

   return array;
}


/***********************
****** START GAME ******
* Fill deck with cards *
***********************/

const cardContainer = document.querySelector(".deck");
let openedCards = [];
let pairedCards = [];
let firstClick = true;

/*******************************
* Initialize the game FUNCTION *
******************************/

function memory () {
  const shuffledCards = shuffle(memoryCards);

  for (let i = 0; i < memoryCards.length; i++ ) {
    const card = document.createElement("li");
    card.classList.add("card");
    card.innerHTML = `<img src="${shuffledCards[i]}"/>`;
    cardContainer.appendChild(card);

    // Call click (event) function on each card
    click(card);
  }
}


/***********************
* Click Event function *
***********************/

function click (card) {
  //Click Card event
  card.addEventListener("click", function() {

    if(firstClick) {
      startTimer();
      firstClick = false;
    }

    //Check if we have an existing opened card
    if(openedCards.length === 1) {

      const currentCard = this;
      const previousCard = openedCards[0];

      card.classList.add("open","show");
      openedCards.push(this);

      compare (currentCard,previousCard);
      addMove();
    }
    else {
      //We don't have any opened card
      //currentCard.classList.add("open","show");
      card.classList.add("open","show","disabled");
      openedCards.push(this);
    }
  });
}


/*******************
* COMPARE FUNCTION *
*******************/

function compare(currentCard,previousCard) {
  //Comparing our 2 opened cards
  if (currentCard.innerHTML === previousCard.innerHTML) {
    //Match, disable clicking
    currentCard.classList.add("match","disabled");
    previousCard.classList.add("match","disabled");
    pairedCards.push(currentCard,previousCard);
    //Reset openedCards
    openedCards=[];
    //Check if we matched all cards
    theEnd();
  }
  else {
    //Doesn't Match
    currentCard.classList.add("fail");
    previousCard.classList.add("fail");
    //Timeout function to see what cards we opened, before we close them
    setTimeout(function() {
      currentCard.classList.remove("open","show","disabled","fail");
      previousCard.classList.remove("open","show","disabled","fail");

    },1000)
    openedCards=[];
  }
}


/*******************
* the End FUNCTION *
*******************/

function theEnd() {
  if(pairedCards.length === memoryCards.length) {
    //alert("You finished game! Congrats!");
    //stopTimer();
    modalMessage();
  }
}


/*******************
** Modal Message **
******************/
const modal = document.querySelector(".modal");
function modalMessage() {
  modal.style.display = "block";
  //Display total moves
  const totalMoves = document.querySelector(".total-moves");
  totalMoves.innerHTML = moves + 1;
  //Display rating
  const totalPlanes = document.querySelector(".total-planeRate");
  totalPlanes.innerHTML = planeRate;
  //Display time
  const totalTime = document.querySelector(".total-time");
  totalTime.innerHTML = totalSeconds;
  stopTimer();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/***************************
* Restart button FUNCTION *
**************************/

function restart () {
  //Need to delete all cards
  cardContainer.innerHTML="";

  //Need to reset any related variable
  pairedCards=[];
  moves = 0;
  movesContainer.innerHTML = moves;
  planeContainer.innerHTML = `<li><i class="fa fa-paper-plane"></i></li>
                              <li><i class="fa fa-paper-plane"></i></li>
                              <li><i class="fa fa-paper-plane"></i></li>`
  totalSeconds = 0;
  timerContainer.innerHTML = totalSeconds;
  stopTimer();
  firstClick = true;
  //Create new cards
  memory();
}

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", function(){
  restart();
});

const restartModal = document.querySelector(".play-again");
restartModal.addEventListener("click", function(){
  modal.style.display = "none";
  restart();
});

/**************************
* Moves counter FUNCTION *
*************************/
const movesContainer = document.querySelector(".moves");
let moves = 0;
movesContainer.innerHTML = 0;

function addMove() {
  moves++;
  // Update HTML movesContainer
  movesContainer.innerHTML = moves;
  // Call Rating
  rating();
}


/*****************
***** Rating *****
*****************/
const planeContainer = document.querySelector(".plane");
let planeRate = 3;
planeContainer.innerHTML = `<li><i class="fa fa-paper-plane"></i></li>
                            <li><i class="fa fa-paper-plane"></i></li>
                            <li><i class="fa fa-paper-plane"></i></li>`

function rating() {
  if(moves > 10 && moves <= 15) {
    planeContainer.innerHTML = `<li><i class="fa fa-paper-plane"></i></li>
                                <li><i class="fa fa-paper-plane"></i></li>
                                <li><i class="fa fa-paper-plane-o"></i></li>`;
    planeRate = 2;
  }
  else if (moves > 15 && moves <= 20) {
    planeContainer.innerHTML = `<li><i class="fa fa-paper-plane"></i></li>
                                <li><i class="fa fa-paper-plane-o"></i></li>
                                <li><i class="fa fa-paper-plane-o"></i></li>`;
    planeRate = 1;
  }
  else if (moves > 20) {
    planeContainer.innerHTML = `<li><i class="fa fa-paper-plane-o"></i></li>
                                <li><i class="fa fa-paper-plane-o"></i></li>
                                <li><i class="fa fa-paper-plane-o"></i></li>`;
    planeRate = 0;

  }
  else {
    planeContainer.innerHTML = `<li><i class="fa fa-paper-plane"></i></li>
                                <li><i class="fa fa-paper-plane"></i></li>
                                <li><i class="fa fa-paper-plane"></i></li>`;

  }

}


/******************
****** Timer ******
******************/

const timerContainer = document.querySelector(".timer");
let liveTimer = 0;
let totalSeconds = 0;
timerContainer.innerHTML = totalSeconds;

// 'totalSeconds' will be increased by 1 after 1000ms because === 1s
function startTimer() {
  liveTimer = setInterval(function() {
    totalSeconds++;
    timerContainer.innerHTML = totalSeconds;
  },1000);
}

function stopTimer() {
  clearInterval(liveTimer);
}


/*****************
* START THE GAME *
*****************/
memory ();




/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
