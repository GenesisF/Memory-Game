const cards = document.querySelectorAll('.memory-card');
const moveCount = document.getElementById('number-moves');
const starsRate = document.getElementById('rate-stars');
const reset = document.getElementById('reset');

let hasFlippedCard = false;
let firstCard, secondCard;
let lock = false;
let matches = 0;
let startTime = undefined;
let moves = 0;

function flipCard(event) {
  //start time on first card click 
  if(startTime === undefined) {
   startTime = Date.now();  
  }
  if(lock){
    return;
  }
  event.currentTarget.classList.add('flip');

  //first time clicking 
  if(!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = event.currentTarget;
    //secont time clicking 
  } else {
    hasFlippedCard = false;
    secondCard = event.currentTarget;
    moves++;
    moveCount.innerText = moves;
    //calculating the porcentage of stars progress
    const starProgres = Math.min((Math.max(moves - 6 , 0)/ 12) * 100, 100);
    starsRate.style.background = `linear-gradient(90deg ,#997589 ${starProgres}%, yellow ${starProgres}%)`;
    
    //cards match?
    if(firstCard.dataset.frame === secondCard.dataset.frame) {
      // it's a match!!
      matches++;
      firstCard.removeEventListener('click', flipCard);
      secondCard.removeEventListener('click', flipCard);
      if(matches === 6) {
        const endTime = Date.now();
        const totalTime = endTime - startTime
        //wait for card to flip
        setTimeout(function(){
          alert('Congrats you win! Your Total time was ' + Math.round(totalTime / 1000) + ' seconds');
        }, 500);
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
// shuffling the cards
function  shuffle() {
  cards.forEach(card => {
    let random = Math.floor(Math.random() * 100);
    card.style.order = random;
  });
}
shuffle();
//cards.forEach(card => card.addEventListener('click', flipCard ));
cards.forEach(function(card){
  card.addEventListener('click', flipCard);
});

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
  
  cards.forEach(function(card){
    card.removeEventListener('click', flipCard);
    card.addEventListener('click', flipCard);
    card.classList.remove('flip');
  });

  shuffle();
}
reset.addEventListener('click', resetGame);