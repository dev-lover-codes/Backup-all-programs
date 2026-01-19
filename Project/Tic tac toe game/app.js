// Select elements
const boxes = document.querySelectorAll('.box');
const resetBtn = document.getElementById('reset-btn');
const newBtn = document.getElementById('new-btn');
const winnerModal = document.getElementById('winner-modal');
const winnerText = document.getElementById('winner-text');
const modalNewBtn = document.getElementById('modal-new-btn');

let currentPlayer = 'X'; // X starts
let gameActive = true;

// Winning combinations
const winningCombos = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6]
];

// Handle box click
function handleBoxClick(e) {
    const box = e.target;
    const boxIndex = Array.from(boxes).indexOf(box);

    if (box.textContent !== '' || !gameActive) return;

    box.textContent = currentPlayer;
    box.style.fontSize = '50px';
    checkWinner();
    if(gameActive) switchPlayer();
}

// Switch turns
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Check winner or draw
async function checkWinner() {
    let roundWon = false;
    let winningCombo = [];

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (
            boxes[a].textContent &&
            boxes[a].textContent === boxes[b].textContent &&
            boxes[a].textContent === boxes[c].textContent
        ) {
            roundWon = true;
            winningCombo = combo;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        highlightWinningBoxes(winningCombo);
        // Wait for the line animation to complete before showing winner modal
        await drawWinningLine(winningCombo);
        showMessage(`${currentPlayer} Wins!`);
        return;
    }

    // Check for draw
    const draw = [...boxes].every(box => box.textContent !== '');
    if (draw) {
        gameActive = false;
        showMessage(`It's a Draw!`);
    }
}

// Highlight winning boxes
function highlightWinningBoxes(combo) {
    combo.forEach(index => {
        boxes[index].classList.add('winning-box');
    });
}

// Draw animated SVG line based on winning combo and return a Promise that resolves after animation
function drawWinningLine(combo) {
    return new Promise((resolve) => {
        // Remove any existing line
        const existingLine = document.querySelector('.winning-line');
        if (existingLine) existingLine.remove();

        const gameWrapper = document.querySelector('.game-wrapper');
        const boxPositions = [...boxes].map(box => {
            const rect = box.getBoundingClientRect();
            const parentRect = gameWrapper.getBoundingClientRect();
            return {
                x: rect.left - parentRect.left + rect.width / 2,
                y: rect.top - parentRect.top + rect.height / 2,
            };
        });

        const start = boxPositions[combo[0]];
        const end = boxPositions[combo[2]];

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'winning-line');
        svg.setAttribute('width', gameWrapper.clientWidth);
        svg.setAttribute('height', gameWrapper.clientHeight);
        svg.style.position = 'absolute';
        svg.style.top = 0;
        svg.style.left = 0;

        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', start.x);
        line.setAttribute('y1', start.y);
        line.setAttribute('x2', start.x); // start at same point for animation
        line.setAttribute('y2', start.y);
        line.style.transition = 'x2 1s ease, y2 1s ease';

        svg.appendChild(line);
        gameWrapper.appendChild(svg);

        // Start animation in next frame
        requestAnimationFrame(() => {
            line.setAttribute('x2', end.x);
            line.setAttribute('y2', end.y);
        });

        // Wait for animation to finish (1 second), then resolve
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

// Show winner in modal
function showMessage(text) {
    winnerText.textContent = text;
    winnerModal.classList.remove('hide');
}

// Reset game
function resetGame() {
    boxes.forEach(box => {
        box.textContent = '';
        box.classList.remove('winning-box');
    });
    currentPlayer = 'X';
    gameActive = true;
    winnerModal.classList.add('hide');

    // Remove the SVG line if present
    const existingLine = document.querySelector('.winning-line');
    if (existingLine) existingLine.remove();
}

// Event listeners
boxes.forEach(box => box.addEventListener('click', handleBoxClick));
resetBtn.addEventListener('click', resetGame);
newBtn.addEventListener('click', resetGame);
modalNewBtn.addEventListener('click', resetGame);
