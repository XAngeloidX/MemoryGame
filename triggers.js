const gridContainer = document.querySelector(".grid-Container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let startTime;

document.querySelector(".score").textContent = score;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
    startTimer();

    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", flipCard);
    });
  });

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
  }
}

function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains("flipped"))
    return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  if (firstCard && secondCard) {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    if (isMatch) {
      score++;
      document.querySelector(".score").textContent = score;
      disableCards();
    } else {
      unflipCards();
    }
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
  checkVictory();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
    checkVictory();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", flipCard);
  });
}

function restart() {
  resetBoard();
  shuffleCards();
  restartTimer();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
  location.reload();

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", flipCard);

  });
}

function startTimer() {
  startTime = new Date();
}

function stopTimer() {
  const endTime = new Date();
  const timeDiff = endTime - startTime;
  const seconds = Math.floor(timeDiff / 1000);
  return seconds;
}

function restartTimer() {
  startTimer();
}

function checkVictory() {
  const allFlippedCards = document.querySelectorAll(".card.flipped");
  if (allFlippedCards.length === cards.length) {
    const timeTaken = stopTimer();
    setTimeout(() => {
      alert(`Congratulations! You've won in ${timeTaken} seconds!`);
    }, 1000);
  }
}
