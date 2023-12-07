const ROWS = 6;
const COLS = 7;
const player = 1;
const computer = 2;
let currentPlayer = player;
let gameBoard = [];
let playerWins = false;
let AIWins = false;
let AIGoFirst = false;
let maxScore = 100000;
let depth = 8;
const body = document.body
const table = document.createElement('table');
const resultTable = document.createElement('table');
const resetBtn = document.createElement('button');
const menuBtn = document.createElement('a');
const winText = document.createElement('h2');
const waitBox = document.createElement('div');
const waitText = document.createElement('h2');


function createTable() {
    body.append(table);
    for (let i = 0; i < COLS; i++) {
        const col = document.createElement('col');
        table.append(col);
    }
    for (let row = 0; row < ROWS; row++) {
        const tr = document.createElement('tr');
        table.append(tr);
        gameBoard[row] = [];
        for (let col = 0; col < COLS; col++) {
            const td = document.createElement('td');
            td.className = "cell";
            td.dataset.row = row;
            td.dataset.col = col;
            tr.append(td);
            gameBoard[row][col] = 0;
        }
    }
    $('td').hover(function () {
        $(this).parents('table').find('col:eq(' + $(this).index() + ')').toggleClass('hover');
    });
    body.append(waitBox);
    waitBox.append(waitText);
    waitText.innerHTML = `Player's turn`;
}

function playGame() {
    if (playerWins) {
        currentPlayer = player;
        playerWins = false;
        AIGoFirst = false;
    } else if (AIWins) {
        currentPlayer = computer;
        AIWins = false;
        computerMove();
    } else {
        currentPlayer = 1;
    }
}

function dropPiece(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (gameBoard[row][col] === 0) {
            gameBoard[row][col] = currentPlayer;
            const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
            cell.classList.add(`player${currentPlayer}`);
            return row;
        }
    }
    return -1;
}

function checkSpace(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (gameBoard[row][col] === 0) {
            return row;
        }
    }
    return -1;
}

function checkWinner() {
    // Check for a win horizontally
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col <= COLS - 4; col++) {
            if (
                gameBoard[row][col] !== 0 &&
                gameBoard[row][col] === gameBoard[row][col + 1] &&
                gameBoard[row][col] === gameBoard[row][col + 2] &&
                gameBoard[row][col] === gameBoard[row][col + 3]
            ) {
                return true;
            }
        }
    }

    // Check for a win vertically
    for (let col = 0; col < COLS; col++) {
        for (let row = 0; row <= ROWS - 4; row++) {
            if (
                gameBoard[row][col] !== 0 &&
                gameBoard[row][col] === gameBoard[row + 1][col] &&
                gameBoard[row][col] === gameBoard[row + 2][col] &&
                gameBoard[row][col] === gameBoard[row + 3][col]
            ) {
                return true;
            }
        }
    }

    // Check for a win diagonally (from bottom-left to top-right)
    for (let row = 0; row <= ROWS - 4; row++) {
        for (let col = 0; col <= COLS - 4; col++) {
            if (
                gameBoard[row][col] !== 0 &&
                gameBoard[row][col] === gameBoard[row + 1][col + 1] &&
                gameBoard[row][col] === gameBoard[row + 2][col + 2] &&
                gameBoard[row][col] === gameBoard[row + 3][col + 3]
            ) {
                return true;
            }
        }
    }

    // Check for a win diagonally (from top-left to bottom-right)
    for (let col = COLS - 1; col >= COLS - 4; col--) {
        for (let row = 0; row <= ROWS - 4; row++) {
            if (
                gameBoard[row][col] !== 0 &&
                gameBoard[row][col] === gameBoard[row + 1][col - 1] &&
                gameBoard[row][col] === gameBoard[row + 2][col - 2] &&
                gameBoard[row][col] === gameBoard[row + 3][col - 3]
            ) {
                return true;
            }
        }
    }

    return false;
}

function checkDraw() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (gameBoard[row][col] === 0) {
                return false; // If any cell is available, the game is not a draw
            }
        }
    }
    return true; // If no empty cells found, it's a draw
}

function updateScore(player, AI) {
    let points = 0;
    switch (player) {
        case 4:
            points += maxScore;
            break;
        case 3:
            points += 10;
            break;
        case 2:
            points += 1;
            break;
        default:
            break
    }
    switch (AI) {
        case 4:
            points -= maxScore;
            break;
        case 3:
            points -= 10;
            break;
        case 2:
            points -= 1;
            break;
        default:
            break
    }
    return points;
}

function getScore() {
    let score = 0;

    // Evaluate horizontally
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col <= COLS - 3; col++) {
            let player = 0;
            let AI = 0;
            for (let i = col; i < col + 4; i++) {
                if (gameBoard[row][i] == 1) {
                    player++;
                    AI = 0;
                } else if (gameBoard[row][i] == 2) {
                    AI++;
                    player = 0;
                }
            }
            score += updateScore(player, AI);
            if (score <= -maxScore || score >= maxScore) {
                return score;
            }
        }
    }
    // Evaluate vertically
    for (let col = 0; col < COLS; col++) {
        for (let row = 0; row <= ROWS - 4; row++) {
            let player = 0;
            let AI = 0;
            for (let i = 0; i < 4; i++) {
                if (gameBoard[row + i][col] == 1) {
                    player++;
                    AI = 0;
                } else if (gameBoard[row + i][col] == 2) {
                    AI++;
                    player = 0;
                }
            }
            score += updateScore(player, AI);
            if (score <= -maxScore || score >= maxScore) {
                return score;
            }
        }
    }

    // Evaluate diagonally (from bottom-left to top-right)
    for (let row = 0; row <= ROWS - 4; row++) {
        for (let col = 0; col <= COLS - 4; col++) {
            let player = 0;
            let AI = 0;
            for (let i = row; i < row + 4; i++) {
                if (gameBoard[i][(i - row) + col] == 1) {
                    player++;
                    AI = 0;
                } else if (gameBoard[i][(i - row) + col] == 2) {
                    AI++;
                    player = 0;
                }
            }
            score += updateScore(player, AI);
            if (score <= -maxScore || score >= maxScore) {
                return score;
            }
        }
    }

    // Evaluate diagonally (from top-left to bottom-right)
    for (let col = COLS - 1; col >= COLS - 4; col--) {
        for (let row = 0; row <= ROWS - 4; row++) {
            let player = 0;
            let AI = 0;
            for (let i = row; i < row + 4; i++) {
                if (gameBoard[i][col - (i - row)] == 1) {
                    player++;
                    AI = 0;
                } else if (gameBoard[i][col - (i - row)] == 2) {
                    AI++;
                    player = 0;
                }
            }
            score += updateScore(player, AI);
            if (score <= -maxScore || score >= maxScore) {
                return score;
            }
        }
    }
    return score;
}

function findBestMove(AIFirst) {
    var bestEval;
    var move = null;
    if (AIFirst) {
        bestEval = Infinity;
    } else {
        bestEval = -Infinity;
    }

    for (let col = 0; col < COLS; col++) {
        if (gameBoard[0][col] == 0) {
            let row = checkSpace(col);
            if (AIFirst) {
                gameBoard[row][col] = computer;
                let eval = miniMax(depth, true, -Infinity, Infinity);
                gameBoard[row][col] = 0;
                if (eval < bestEval) {
                    bestEval = eval;
                    move = col;
                }
            }
            if (!AIFirst) {
                gameBoard[row][col] = player;
                let eval = miniMax(depth, false, -Infinity, Infinity);
                gameBoard[row][col] = 0;
                if (eval > bestEval) {
                    bestEval = eval;
                    move = col;
                }
            }
        }
    }
    currentPlayer = computer;
    return move;
}

function miniMax(depth, isMaximizing, alpha, beta) {
    if (depth === 0 || checkWinner() || checkDraw()) {
        return getScore();
    }
    if (isMaximizing) {
        let v = -Infinity;
        for (let col = 0; col < COLS; col++) {
            if (gameBoard[0][col] === 0) {
                const row = checkSpace(col);
                gameBoard[row][col] = 1;
                v = Math.max(v, miniMax(depth - 1, false, alpha, beta));
                gameBoard[row][col] = 0;
                if (v >= beta) {
                    return v;
                }
                alpha = Math.max(alpha, v);
            }
        }
        return v;
    } else {
        let v = Infinity;
        for (let col = 0; col < COLS; col++) {
            if (gameBoard[0][col] === 0) {
                const row = checkSpace(col);
                gameBoard[row][col] = 2;
                v = Math.min(v, miniMax(depth - 1, true, alpha, beta));
                gameBoard[row][col] = 0;
                if (v <= alpha) {
                    return v;
                }
                beta = Math.min(beta, v);
            }
        }
        return v;
    }
}

function handleClick(e) {
    if (currentPlayer === 0) return;

    const col = parseInt(e.target.dataset.col);
    const row = dropPiece(col);

    if (row !== -1) {
        winCondition();
    }
}

function computerMove() {
    const randomCol = findBestMove(AIGoFirst);
    const row = dropPiece(randomCol);
    if (row !== -1) {
        winCondition();
    }
}

// check winning condition for player or computer moves
function winCondition() {
    if (checkWinner()) {
        if (currentPlayer === 1) {
            winText.innerHTML = "Player Wins!";
            playerWins = true;
        } else {
            winText.innerHTML = "AI Wins!";
            AIWins = true;
            AIGoFirst = true;
        }
        gameOver();
    } else if (checkDraw()) {
        winText.innerHTML = "It's a draw";
        if (AIGoFirst) {
            waitText.innerHTML = `AI's turn`;
        } else {
            waitText.innerHTML = `Player's turn`;
        }
        gameOver();
    } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        waitText.innerHTML = `Player's turn`;
        if (currentPlayer == 2) {
            waitText.innerHTML = `AI's turn`;
            setTimeout(computerMove, 0);
        }
    }
}
// remove game over button options when new game is starting
function removeOption() {
    resultTable.removeChild(resetBtn);
    resultTable.removeChild(menuBtn);
    resultTable.removeChild(winText);
    body.removeChild(resultTable);
    playGame();
}
// clearing the board when new game is starting
function clearBoard() {
    gameBoard = [];
    for (let row = 0; row < ROWS; row++) {
        gameBoard[row] = [];
        for (let col = 0; col < COLS; col++) {
            const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
            cell.className = 'cell';
            gameBoard[row][col] = 0;
        }
    }
    removeOption();
}
// Display buttons to play again or direct to main menu
function gameOver() {
    resultTable.className = 'result';
    resetBtn.innerHTML = 'Play Again';
    menuBtn.href = 'index.html';
    menuBtn.innerHTML = 'Main Menu';
    currentPlayer = 0;
    const header = document.querySelector('h1');
    header.after(resultTable);
    resultTable.append(winText, resetBtn, menuBtn);
}

createTable();
table.addEventListener('click', handleClick);
resetBtn.addEventListener('click', clearBoard);