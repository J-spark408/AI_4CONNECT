const ROWS = 6;
const COLS = 7;
let currentPlayer = 1;
let gameBoard = [];
let playerWins = false;
let AIWins = false;
const body = document.body
const table = document.createElement('table');

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
}

function playGame() {
    if (playerWins) {
        currentPlayer = 1;
        playerWins = false;
    } else if (AIWins) {
        currentPlayer = 2;
        AIWins = false;
        //computerMove();
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



function checkWinner(row, col) {
    function checkDirection(dx, dy) {
        let count = 1;
        let r, c;

        r = row + dx;
        c = col + dy;
        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && gameBoard[r][c] === currentPlayer) {
            count++;
            r += dx;
            c += dy;
        }

        r = row - dx;
        c = col - dy;
        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && gameBoard[r][c] === currentPlayer) {
            count++;
            r -= dx;
            c -= dy;
        }

        return count >= 4;
    }

    return (
        checkDirection(1, 0) || // vertical
        checkDirection(0, 1) || // horizontal
        checkDirection(1, 1) || // diagonal \
        checkDirection(1, -1)   // diagonal /
    );
}

function checkDraw() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (gameBoard[row][col] === 0) {
                return false; // If any cell is empty, the game is not a draw
            }
        }
    }
    return true; // If no empty cells found, it's a draw
}

const resultTable = document.createElement('table');
const resetBtn = document.createElement('button');
const menuBtn = document.createElement('a');
const winText = document.createElement('h2');
resultTable.className = 'result';
resetBtn.innerHTML = 'Play Again';
menuBtn.href = 'menu.html';
menuBtn.innerHTML = 'Main Menu';

function computerMove() {
    if (currentPlayer === 2) {
        const availableCols = [];
        for (let col = 0; col < COLS; col++) {
            if (gameBoard[0][col] === 0) {
                availableCols.push(col);
            }
        }

        const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
        const row = dropPiece(randomCol);

        if (row !== -1) {
            if (checkWinner(row, randomCol)) {
                if (currentPlayer === 1) {
                    winText.innerHTML = "Player Wins!";
                    playerWins = true;
                } else {
                    winText.innerHTML = "AI Wins!";
                    AIWins = true;
                }
                gameOver();
            } else if (checkDraw()) {
                winText.innerHTML = "It's a draw";
                gameOver();
            } else {
                currentPlayer = 1; // switch back to human player
            }
        }
    }
}

function handleClick(e) {
    if (currentPlayer === 0) return;

    const col = parseInt(e.target.dataset.col);
    const row = dropPiece(col);

    if (row !== -1) {
        if (checkWinner(row, col)) {
            if (currentPlayer === 1) {
                winText.innerHTML = "Player Wins!";
                playerWins = true;
            } else {
                winText.innerHTML = "AI Wins!";
                AIWins = true;
            }
            gameOver();
        } else if (checkDraw()) {
            winText.innerHTML = "It's a draw";
            gameOver();
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            //setTimeout(computerMove, 100);
        }
    }
}

function gameOver() {
    currentPlayer = 0; // game ends
    const header = document.querySelector('h1');
    header.after(resultTable);
    resultTable.append(winText, resetBtn, menuBtn);
}

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

function removeOption() {
    resultTable.removeChild(resetBtn);
    resultTable.removeChild(menuBtn);
    resultTable.removeChild(winText);
    body.removeChild(resultTable);
    playGame();
}

createTable();
table.addEventListener('click', handleClick);
resetBtn.addEventListener('click', clearBoard);