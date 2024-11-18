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
    const [firstCard, secondCard] = flippedCards;
    const match = firstCard.dataset.animal === secondCard.dataset.animal;

    if (match) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        score += POINTS_PER_MATCH;
        matchedPairs++;
        
        // Add score animation
        const scoreValue = document.getElementById('score-value');
        scoreValue.classList.add('score-animate');
        setTimeout(() => scoreValue.classList.remove('score-animate'), 500);
        
        updateScore();
        checkWin();
    } else {
        // Add mismatch animation
        firstCard.classList.add('mismatch');
        secondCard.classList.add('mismatch');
        
        setTimeout(() => {
            firstCard.classList.remove('mismatch', 'flipped');
            secondCard.classList.remove('mismatch', 'flipped');
            firstCard.textContent = '';
            secondCard.textContent = '';
        }, 700);
    }
    
    flippedCards = [];
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
    const timerValue = document.getElementById('timer-value');
    
    // Add warning animation when time exceeds 2 minutes
    if (seconds > 120 && !timerValue.classList.contains('timer-warning')) {
        timerValue.classList.add('timer-warning');
    }
    
    timerValue.textContent = 
        `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function checkWin() {
    if (matchedPairs === animals.length) {
        clearInterval(timerInterval);
        
        // Calculate bonus
        const minAttempts = animals.length;
        const maxBonus = animals.length * POINTS_PER_MATCH / 2;
        const bonus = Math.max(0, Math.floor(maxBonus * (1 - (moves - minAttempts) / (minAttempts * 2))));
        
        // Hide timer and moves display with fade out
        const displays = [document.getElementById('timer'), document.getElementById('moves')];
        displays.forEach(display => {
            display.style.transition = 'opacity 0.5s';
            display.style.opacity = '0';
            setTimeout(() => display.style.display = 'none', 500);
        });
        
        // Update score display with animation
        const scoreElement = document.getElementById('score');
        scoreElement.innerHTML = `
            <div class="final-score-breakdown">
                <strong>Initial Score: ${score}</strong><br>
                <strong>Bonus Points: ${bonus}</strong><br>
                <strong>Final Score: ${score + bonus}</strong>
            </div>
        `;
        
        // Show win message with animation
        const winMessage = document.getElementById('win-message');
        winMessage.textContent = 
            `Congratulations! You won in ${moves} moves and ${seconds} seconds!`;
        winMessage.style.display = 'block';
        
        // Update final total score
        score += bonus;
    }
}

function initializeGame() {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Reset all game variables
    cards = shuffleCards([...animals, ...animals]);
    matchedPairs = 0;
    score = 0;
    moves = 0;
    seconds = 0;
    gameStarted = false;
    flippedCards = [];
    
    // Reset game board
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    gameBoard.className = 'game-board';  // Ensure the grid layout is maintained
    
    // Create and append new cards
    cards.forEach(animal => {
        const card = createCard(animal);
        gameBoard.appendChild(card);
    });
    
    // Reset all displays to original state
    document.getElementById('score').innerHTML = '<strong>Score: <span id="score-value">0</span></strong>';
    document.getElementById('moves').innerHTML = '<strong>Moves: <span id="moves-value">0</span></strong>';
    document.getElementById('timer').innerHTML = '<strong>Time: <span id="timer-value">00:00</span></strong>';
    
    // Make sure all displays are visible
    document.getElementById('score').style.display = 'block';
    document.getElementById('moves').style.display = 'block';
    document.getElementById('timer').style.display = 'block';
    
    // Hide win message
    document.getElementById('win-message').style.display = 'none';
}

function resetGame() {
    // initializeGame();
    window.location.reload();
}

// Add styling for score breakdown
const style = document.createElement('style');
style.textContent = `
    .final-score-breakdown {
        text-align: center;
        margin: 10px 0;
        opacity: 0;
        animation: fadeIn 0.8s ease-out forwards;
        animation-delay: 0.5s;
    }
    .final-score-breakdown br {
        margin: 5px 0;
    }
    .score-animate {
        animation: scoreAnimate 0.5s ease-out forwards;
    }
    .mismatch {
        animation: mismatchAnimate 0.7s ease-out forwards;
    }
    .matched {
        animation: matchedAnimate 0.7s ease-out forwards;
    }
    .timer-warning {
        color: red;
    }
    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    @keyframes scoreAnimate {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
    @keyframes mismatchAnimate {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
    @keyframes matchedAnimate {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

window.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    document.getElementById('play-again').addEventListener('click', resetGame);
});