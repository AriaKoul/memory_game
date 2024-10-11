let cards = [...animals, ...animals];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let moves = 0;
let timerInterval;
let seconds = 0;

function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(animal) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.animal = animal;
    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.textContent = this.dataset.animal;
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            updateMoves();
            setTimeout(checkMatch, 700);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.animal === card2.dataset.animal) {
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

function updateMoves() {
    document.getElementById('moves-value').textContent = moves;
}

function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById('timer-value').textContent = 
        `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function checkWin() {
    if (matchedPairs === animals.length) {
        clearInterval(timerInterval);
        const minAttempts = animals.length;
        const maxBonus = animals.length * POINTS_PER_MATCH / 2; // 50% bonus for perfect game
        const bonus = Math.max(0, Math.floor(maxBonus * (1 - (moves - minAttempts) / (minAttempts * 2))));
        score += bonus;
        updateScore();
        document.getElementById('win-message').textContent = `Congratulations! You won in ${moves} moves and ${seconds} seconds! Bonus: ${bonus}`;
        document.getElementById('win-message').style.display = 'block';
    }
}

function initializeGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    cards = shuffleCards(cards);
    matchedPairs = 0;
    score = 0;
    moves = 0;
    seconds = 0;
    updateScore();
    updateMoves();
    document.getElementById('timer-value').textContent = '00:00';
    document.getElementById('win-message').style.display = 'none';

    cards.forEach(animal => {
        const card = createCard(animal);
        gameBoard.appendChild(card);
    });

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function resetGame() {
    initializeGame();
}

window.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    document.getElementById('play-again').addEventListener('click', resetGame);
});

// document.getElementById('play-again').addEventListener('click', initializeGame);

// initializeGame();