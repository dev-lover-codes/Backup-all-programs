// Game State
const state = {
    screen: 'welcome', // welcome, selection, game
    mode: 'friend', // friend, ai, online
    p1Emoji: '❌',
    p2Emoji: '⭕',
    currentPlayer: 'p1', // p1, p2
    board: Array(9).fill(null),
    gameActive: false,
    scores: { p1: 0, p2: 0, ties: 0 },
    roomId: null,
    playerId: null // 'p1' or 'p2' for online
};

const emojis = ['😀', '😎', '🤖', '👽', '👻', '💩', '🦄', '🔥', '⭐', '🍕', '⚽', '🚀'];
let socket;

// DOM Elements
const screens = {
    welcome: document.getElementById('welcome-screen'),
    selection: document.getElementById('selection-screen'),
    game: document.getElementById('game-screen')
};

const emojiGrid = document.getElementById('emoji-grid');
const p1Preview = document.getElementById('p1-emoji-preview');
const p2Preview = document.getElementById('p2-emoji-preview');
const continueBtn = document.getElementById('continue-btn');
const modeSelection = document.getElementById('mode-selection');
const gameBoardWrapper = document.getElementById('game-board-wrapper');
const boardEl = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const turnText = document.getElementById('turn-text');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const confettiCanvas = document.getElementById('confetti-canvas');

// Navigation
function showScreen(screenName) {
    Object.values(screens).forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    screens[screenName].classList.remove('hidden');
    setTimeout(() => screens[screenName].classList.add('active'), 50);
    state.screen = screenName;
}

document.getElementById('start-btn').addEventListener('click', () => {
    initEmojiGrid();
    showScreen('selection');
});

document.getElementById('back-btn').addEventListener('click', () => {
    gameBoardWrapper.classList.add('hidden');
    modeSelection.classList.remove('hidden');
    state.gameActive = false;
    if (socket) socket.disconnect();
});

document.getElementById('modal-home-btn').addEventListener('click', () => {
    modal.classList.add('hidden');
    showScreen('welcome');
    resetGame(true);
    if (socket) socket.disconnect();
});

// Emoji Selection
function initEmojiGrid() {
    emojiGrid.innerHTML = '';
    emojis.forEach(emoji => {
        const el = document.createElement('div');
        el.className = 'emoji-option';
        el.innerText = emoji;
        el.onclick = () => selectEmoji(emoji, el);
        emojiGrid.appendChild(el);
    });
}

function selectEmoji(emoji, el) {
    document.querySelectorAll('.emoji-option').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    state.p1Emoji = emoji;
    p1Preview.innerText = emoji;
    
    // Auto-select random opponent emoji
    let available = emojis.filter(e => e !== emoji);
    state.p2Emoji = available[Math.floor(Math.random() * available.length)];
    p2Preview.innerText = state.p2Emoji;
    
    continueBtn.classList.remove('disabled');
}

continueBtn.addEventListener('click', () => {
    if (continueBtn.classList.contains('disabled')) return;
    showScreen('game');
    modeSelection.classList.remove('hidden');
    gameBoardWrapper.classList.add('hidden');
});

// Game Mode Selection
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        state.mode = btn.dataset.mode;
        if (state.mode === 'online') {
            initOnlineGame();
        } else {
            startGame();
        }
    });
});

function startGame() {
    modeSelection.classList.add('hidden');
    gameBoardWrapper.classList.remove('hidden');
    resetGame();
}

function initOnlineGame() {
    modeSelection.classList.add('hidden');
    gameBoardWrapper.classList.remove('hidden');
    resetGame();
    turnText.innerText = "Connecting...";
    state.gameActive = false; // Wait for opponent

    socket = io();

    socket.on('connect', () => {
        socket.emit('join_game');
    });

    socket.on('game_created', ({ roomId, player }) => {
        state.roomId = roomId;
        state.playerId = player;
        turnText.innerText = "Waiting for opponent...";
    });

    socket.on('game_joined', ({ roomId, player }) => {
        state.roomId = roomId;
        state.playerId = player;
    });

    socket.on('game_start', ({ startTurn }) => {
        state.gameActive = true;
        state.currentPlayer = 'p1'; // Server decides who starts (p1 usually)
        updateTurnText();
    });

    socket.on('opponent_move', ({ index, player }) => {
        makeMove(index, player === 'p1' ? 'p1' : 'p2', false); // false = don't emit back
    });

    socket.on('opponent_left', () => {
        state.gameActive = false;
        showModal("Opponent Left!");
    });
}

// Game Logic
function handleCellClick(index) {
    if (!state.gameActive || state.board[index]) return;
    
    // Online check: Is it my turn?
    if (state.mode === 'online') {
        if (state.playerId !== state.currentPlayer) return;
    }

    makeMove(index, state.currentPlayer, true);
    
    if (state.gameActive && state.mode === 'ai' && state.currentPlayer === 'p2') {
        setTimeout(makeAIMove, 500);
    }
}

function makeMove(index, player, emit = true) {
    state.board[index] = player;
    const cell = cells[index];
    cell.innerText = player === 'p1' ? state.p1Emoji : state.p2Emoji;
    cell.classList.add('pop');
    
    if (state.mode === 'online' && emit) {
        socket.emit('make_move', { roomId: state.roomId, index, player: state.playerId });
    }

    if (checkWin(player)) {
        endGame(player);
    } else if (state.board.every(cell => cell)) {
        endGame('draw');
    } else {
        state.currentPlayer = player === 'p1' ? 'p2' : 'p1';
        updateTurnText();
    }
}

function updateTurnText() {
    if (state.mode === 'online') {
        if (state.playerId === state.currentPlayer) {
            turnText.innerText = "Your Turn";
        } else {
            turnText.innerText = "Opponent's Turn";
        }
    } else {
        const isP1 = state.currentPlayer === 'p1';
        turnText.innerText = isP1 ? "Your Turn" : (state.mode === 'ai' ? "AI's Turn" : "Opponent's Turn");
    }
}

function makeAIMove() {
    let move = findBestMove(state.board, 'p2');
    makeMove(move, 'p2');
}

function findBestMove(board, player) {
    const opponent = player === 'p1' ? 'p2' : 'p1';
    
    // 1. Try to win
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = player;
            if (checkWin(player, board)) {
                board[i] = null;
                return i;
            }
            board[i] = null;
        }
    }
    
    // 2. Block opponent
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = opponent;
            if (checkWin(opponent, board)) {
                board[i] = null;
                return i;
            }
            board[i] = null;
        }
    }
    
    // 3. Pick center
    if (!board[4]) return 4;
    
    // 4. Random
    const empty = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
    return empty[Math.floor(Math.random() * empty.length)];
}

function checkWin(player, board = state.board) {
    const wins = [
        [0,1,2], [3,4,5], [6,7,8], // Rows
        [0,3,6], [1,4,7], [2,5,8], // Cols
        [0,4,8], [2,4,6] // Diagonals
    ];
    return wins.some(combo => combo.every(i => board[i] === player));
}

function endGame(result) {
    state.gameActive = false;
    if (result === 'draw') {
        state.scores.ties++;
        modalMessage.innerText = "It's a Draw!";
    } else {
        // Online: check if *I* won
        if (state.mode === 'online') {
             if (result === state.playerId) {
                 modalMessage.innerText = "You Win!";
                 fireConfetti();
             } else {
                 modalMessage.innerText = "You Lose!";
             }
        } else {
            state.scores[result]++;
            modalMessage.innerText = result === 'p1' ? "You Win!" : (state.mode === 'ai' ? "AI Wins!" : "Opponent Wins!");
            if (result === 'p1') fireConfetti();
        }
    }
    updateScoreboard();
    setTimeout(() => showModal(modalMessage.innerText), 500);
}

function showModal(message) {
    modalMessage.innerText = message;
    modal.classList.remove('hidden');
}

function updateScoreboard() {
    document.getElementById('score-x').innerText = state.scores.p1;
    document.getElementById('score-o').innerText = state.scores.p2;
    document.getElementById('score-ties').innerText = state.scores.ties;
}

function resetGame(fullReset = false) {
    state.board.fill(null);
    state.gameActive = true;
    state.currentPlayer = 'p1';
    cells.forEach(c => {
        c.innerText = '';
        c.classList.remove('pop');
    });
    modal.classList.add('hidden');
    updateTurnText();
    
    if (fullReset) {
        state.scores = { p1: 0, p2: 0, ties: 0 };
        updateScoreboard();
    }
}

// Event Listeners for Board
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
});

document.getElementById('modal-restart-btn').addEventListener('click', () => {
    if (state.mode === 'online') {
         // Online restart logic is complex (needs handshake), for now just reset board
         // Ideally: emit 'request_restart'
         resetGame(); 
         // Re-init socket for simplicity in this MVP
         socket.disconnect();
         initOnlineGame();
    } else {
        resetGame();
    }
});
document.getElementById('reset-game-btn').addEventListener('click', () => resetGame());

// Confetti Effect
function fireConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#3b82f6', '#ec4899', '#8b5cf6', '#f59e0b', '#10b981'];
    
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 5 + 2
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // Gravity
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
            if (p.y > window.innerHeight) particles.splice(i, 1);
        });
        if (particles.length > 0) requestAnimationFrame(animate);
    }
    animate();
}
