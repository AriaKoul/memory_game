// These variables will be set in each HTML file
let fruits;
let POINTS_PER_MATCH;

let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let canFlip = true;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(fruit) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back">${fruit}</div>
        </div>
    `;
    card.addEventListener('click', () => flipCard(card));
    return card;
}

function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped')) return;
    
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        canFlip = false;
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const fruit1 = card1.querySelector('.card-back').textContent;
    const fruit2 = card2.querySelector('.card-back').textContent;

    if (fruit1 === fruit2) {
        score += POINTS_PER_MATCH;
        updateScore();
        matchedPairs++;
        flippedCards = [];
        canFlip = true;
        checkForWin();
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

function updateScore() {
    document.getElementById('score-value').textContent = score;
}

function checkForWin() {
    if (matchedPairs === fruits.length / 2) {
        document.getElementById('win-message').style.display = 'block';
    }
}

function initializeGame() {
    const gameBoard = document.getElementById('game-board');
    const shuffledFruits = shuffleArray([...fruits, ...fruits]);
    
    shuffledFruits.forEach(fruit => {
        const card = createCard(fruit);
        gameBoard.appendChild(card);
    });

    document.querySelector('.button').addEventListener('click', resetGame);
    updateScore();
}

function resetGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    score = 0;
    canFlip = true;
    document.getElementById('win-message').style.display = 'none';
    initializeGame();
}

// Initialize the game when the script loads
window.addEventListener('DOMContentLoaded', initializeGame);