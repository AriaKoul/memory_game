// memory-game.js

// These variables will be set in each HTML file
let fruits;
let POINTS_PER_MATCH;

let cards = [...fruits, ...fruits];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let attempts = 0;


function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function createCard(fruit) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.fruit = fruit;
    card.addEventListener('click', flipCard);
    return card;
}


function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.textContent = this.dataset.fruit;
        flippedCards.push(this);


        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 700);
        }
    }
}


function checkMatch() {
    attempts++;
    const [card1, card2] = flippedCards;
    if (card1.dataset.fruit === card2.dataset.fruit) {
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        matchedPairs++;
        score += POINTS_PER_MATCH;
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
    }


    flippedCards = [];
    updateScore();
    checkWin();
}

function updateScore() {
    document.getElementById('score-value').textContent = score;
}


function checkWin() {
    if (matchedPairs === fruits.length) {
        const minAttempts = fruits.length;
        const maxBonus = fruits.length * POINTS_PER_MATCH / 2; // 50% bonus for perfect game
        const bonus = Math.max(0, Math.floor(maxBonus * (1 - (attempts - minAttempts) / (minAttempts * 2))));
        score += bonus;
        updateScore();
        document.getElementById('win-message').textContent = `Congratulations! You won!! Bonus: ${bonus}`;
        document.getElementById('win-message').style.display = 'block';
    }
}


function initializeGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    cards = shuffleCards(cards);
    matchedPairs = 0;
    score = 0;
    updateScore();
    document.getElementById('win-message').style.display = 'none';


    cards.forEach(fruit => {
        const card = createCard(fruit);
        gameBoard.appendChild(card);
    });
}


function resetGame() {
    initializeGame();
}

// Initialize the game when the script loads
window.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    document.querySelector('button').addEventListener('click', resetGame);
});