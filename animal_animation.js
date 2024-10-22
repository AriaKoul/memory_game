let cards = [...animals, ...animals];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let moves = 0;
let timerInterval;
let seconds = 0;
let gameStarted = false;

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
    if (!gameStarted) {
        startGame();
    }
    
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

function startGame() {
    gameStarted = true;
    timerInterval = setInterval(updateTimer, 1000);
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
        
        // Calculate bonus
        const minAttempts = animals.length;
        const maxBonus = animals.length * POINTS_PER_MATCH / 2;
        const bonus = Math.max(0, Math.floor(maxBonus * (1 - (moves - minAttempts) / (minAttempts * 2))));
        
        // Hide timer and moves display
        document.getElementById('timer').style.display = 'none';
        document.getElementById('moves').style.display = 'none';
        
        // Update score display
        const scoreElement = document.getElementById('score');
        scoreElement.innerHTML = `
            <div class="final-score-breakdown">
                <strong>Initial Score: ${score}</strong><br>
                <strong>Bonus Points: ${bonus}</strong><br>
                <strong>Final Score: ${score + bonus}</strong>
            </div>
        `;
        
        // Update win message without bonus mention
        document.getElementById('win-message').textContent = 
            `Congratulations! You won in ${moves} moves and ${seconds} seconds!`;
        document.getElementById('win-message').style.display = 'block';
        
        // Hide game board
        document.getElementById('game-board').style.display = 'none';
        
        // Update final total score
        score += bonus;
    }
}

function initializeGame() {
    // Reset game board
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    gameBoard.style.display = 'grid';  // Make sure game board is visible
    
    // Reset all game variables
    cards = shuffleCards([...animals, ...animals]);
    matchedPairs = 0;
    score = 0;
    moves = 0;
    seconds = 0;
    gameStarted = false;
    flippedCards = [];
    
    // Reset displays
    updateScore();
    updateMoves();
    document.getElementById('timer-value').textContent = '00:00';
    document.getElementById('win-message').style.display = 'none';
    
    // Show timer and moves display again
    document.getElementById('timer').style.display = 'block';
    document.getElementById('moves').style.display = 'block';
    
    // Reset score display to original format
    document.getElementById('score').innerHTML = `
        <strong>Score: <span id="score-value">0</span></strong>
    `;

    // Create and append new cards
    cards.forEach(animal => {
        const card = createCard(animal);
        gameBoard.appendChild(card);
    });

    clearInterval(timerInterval);
}

function resetGame() {
    // Make sure the game board is visible before initializing
    const gameBoard = document.getElementById('game-board');
    gameBoard.style.display = 'grid';
    
    initializeGame();
}

// Add styling for score breakdown
const style = document.createElement('style');
style.textContent = `
    .final-score-breakdown {
        text-align: center;
        margin: 10px 0;
    }
    .final-score-breakdown br {
        margin: 5px 0;
    }
`;
document.head.appendChild(style);

window.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    document.getElementById('play-again').addEventListener('click', resetGame);
});