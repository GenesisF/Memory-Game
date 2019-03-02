//Game scope begin
(function (){

const cards = document.querySelectorAll('.memory-card');
const moveCount = document.getElementById('number-moves');
const starsRate = document.getElementById('rate-stars');
const reset = document.getElementById('reset');
const time = document.getElementById('time');

let hasFlippedCard = false;
let firstCard, secondCard; //Dom elements
let lock = false;
let matches = 0;
let startTime = undefined; // is to be use as an number
let moves = 0;
let intervalId = -1;

// Event listener callback
function flipCard(event) {
  
  //start time on first card click 
  if(startTime === undefined) {
   startTime = Date.now(); 
   //adding the time to the screen 
    intervalId = setInterval(function(){
     const timeNow = Date.now();
     const timeLaps = timeNow - startTime;
     time.innerText = Math.round(timeLaps / 1000);
   },1000);
  } 

  // prevent flips while un pair  cards reset 
  if(lock){
    return;
  }
  
  //flip the card
  event.currentTarget.classList.add('flip');

  //first time clicking the cards 
  if(!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = event.currentTarget;

    //secont time clicking 
  } else {
    secondCard = event.currentTarget;

    // prevent cards from match it self
    if(firstCard === secondCard){
      return;
    }
    hasFlippedCard = false;
    moves++;
    //display moves to user
    moveCount.innerText = moves;
    //calculating the porcentage of stars progress
    const starProgres = Math.min((Math.max(moves - 6 , 0)/ 12) * 100, 80);
    //up date the start count for the user
    starsRate.style.background = `linear-gradient(90deg ,#997589 ${starProgres}%, yellow ${starProgres}%)`;
    
    //cards match?
    if(firstCard.dataset.frame === secondCard.dataset.frame) {
      // it's a match!!
      matches++;
      firstCard.removeEventListener('click', flipCard);
      secondCard.removeEventListener('click', flipCard);
      
      //when you have 6 matches you win
      if(matches === 6) {
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        clearInterval(intervalId);
        //wait for card to flip
        setTimeout(function(){
          const starRating = 5 - 5 * starProgres / 100;
          const playAgain = confirm('Congrats you win! Your Total time was ' + Math.round(totalTime / 1000) + ' seconds. Your star rating was ' + starRating.toFixed(2) + '. To play again press OK.');
          if(playAgain){
            resetGame();
          }
        },500);
      }
      //not a match
    } else {
      lock=true;
      setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        lock=false;
      }, 1000);
    }
  }
}

//shuffling the cards, this function execute the part where the cards change places 
function  shuffle() {
  cards.forEach(card => {
    let random = Math.floor(Math.random() * 100);
    card.style.order = random;
  });
}
//ini the  first shuffle 
shuffle();

//cards.forEach(card => card.addEventListener('click', flipCard ));
cards.forEach(function(card){
  card.addEventListener('click', flipCard);
});

//reseting the game function; 
 //this is an event listener 
function resetGame(){

  hasFlippedCard = false;
  firstCard = undefined;
  secondCard = undefined;
  lock = false;
  matches = 0;
  startTime = undefined;
  moves = 0;
  moveCount.innerText = moves;
  starsRate.style.background = null;
  
  //stop the time in the screen 
  clearInterval(intervalId);
  time.innerText = 0;
  
  cards.forEach(function(card){
    card.removeEventListener('click', flipCard);
    card.addEventListener('click', flipCard);
    card.classList.remove('flip');
  });

  shuffle();
}
reset.addEventListener('click', resetGame);

})(); //game scope end