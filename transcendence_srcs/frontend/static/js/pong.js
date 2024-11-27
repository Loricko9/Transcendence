document.addEventListener("DOMContentLoaded", function() {
const paddingLeft = document.querySelector('.padding-left');
const paddingRight = document.querySelector('.padding-right');
const ball = document.querySelector('.ball');
const box = document.querySelector('.box');
const playerVsIaButton = document.getElementById('player-vs-ia');
const playerVsPlayerButton = document.getElementById('player-vs-player');

const mainMenu = document.getElementById('main-menu');
const difficultyMenu = document.getElementById('difficulty-menu');
const PVPMenu = document.getElementById('pvp-menu');

const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');
const PVP1v1Button = document.getElementById('pvp_1v1');
const PVP2v2Button = document.getElementById('pvp_2v2');
const tournamentButton = document.getElementById('tournament');

const scorePlayerLeftElement = document.getElementById('score-player-left');
const scorePlayerRightElement = document.getElementById('score-player-right');
	
let ballTop = parseInt(window.getComputedStyle(ball).top);
let ballLeft = parseInt(window.getComputedStyle(ball).left);
const ballTopOriginal = ballTop;
const ballLeftOriginal = ballLeft;
const paddingLeftOriginalTop = parseInt(window.getComputedStyle(paddingLeft).top);
const paddingRightOriginalTop = parseInt(window.getComputedStyle(paddingRight).top);
let directionX = Math.random() < 0.5 ? 1 : -1;
let directionY = Math.random() < 0.5 ? 1 : -1;
let speed = 2;
let gameStarted = false;
let gameMode = 0; 
let difficulty = 0;

let scorePlayer1 = 0;
let scorePlayer2 = 0;
let scorePlayer3 = 0;
let scorePlayer4 = 0;

let pvp_mode = 0; //1v1 = 1; 2v2 = 2; tournament = 3;
let player1_id = null;
let player2_id = null;
let player3_id = null;
let player4_id = null;
let left_player = null;
let right_player = null
let whoFight = [null, null]; // first is for the player at the left, second for the player at the right
/* 
	tournament
	2 v 2
	1 v 1
*/

// console.log("Test");

const keyPressed = {};

document.addEventListener("keydown", (e) => {
	keyPressed[e.key] = true;
});

document.addEventListener("keyup", (e) => {
	keyPressed[e.key] = false;
});

function movePaddings() {
	if (keyPressed['s']) {
		if (parseInt(window.getComputedStyle(paddingLeft).top) + 30 < 510)
			paddingLeft.style.top = (parseInt(window.getComputedStyle(paddingLeft).top) + 30) + "px";
		else
			paddingLeft.style.top = 510 + "px";
	} if (keyPressed['w']) {
		if (parseInt(window.getComputedStyle(paddingLeft).top) - 30 > 80)
			paddingLeft.style.top = (parseInt(window.getComputedStyle(paddingLeft).top) - 30) + "px";
		else
			paddingLeft.style.top = 80 + "px";
	} if (gameMode === 0) {
		if (keyPressed['l']) {
			if (parseInt(window.getComputedStyle(paddingRight).top) + 30 < 510)
				paddingRight.style.top = (parseInt(window.getComputedStyle(paddingRight).top) + 30) + "px";
			else
				paddingRight.style.top = 510 + "px";
		} if (keyPressed['o']) {
			if (parseInt(window.getComputedStyle(paddingRight).top) - 30 > 80)
				paddingRight.style.top = (parseInt(window.getComputedStyle(paddingRight).top) - 30) + "px";
			else
				paddingRight.style.top = 80 + "px";
		}
	}
}


function resetBall() {
	ball.style.top = ballTopOriginal + "px";
	ball.style.left = ballLeftOriginal + "px";
	ballTop = parseInt(window.getComputedStyle(ball).top);
	ballLeft = parseInt(window.getComputedStyle(ball).left);

	directionX = Math.random() < 0.5 ? 1 : -1;
	directionY = Math.random() < 0.5 ? 1 : -1;
	speed = 2;
	paddingLeft.style.top = paddingLeftOriginalTop + "px";
	paddingRight.style.top = paddingRightOriginalTop + "px";

	console.log("paddingLeft top:", paddingLeft.style.top);
	console.log("paddingRight top:", paddingRight.style.top);
	updateScore();
}

function resetGame() {
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    updateScore();
	gameStarted = false;
    mainMenu.style.display = 'flex';
	resetBall();
}

let lastPaddingLeftTop = parseInt(window.getComputedStyle(paddingLeft).top);
let lastPaddingRightTop = parseInt(window.getComputedStyle(paddingRight).top);

function moveBall() {
    ballTop += speed * directionY;
    ballLeft += speed * directionX;

	if (gameMode === 1) {
		if (directionY === 1 && ballTop > 80) {
			if (ballTop < 510)
				paddingRight.style.top = ballTop + "px";
			else
				paddingRight.style.top = 510 + "px";
		} else if (directionY === -1 && ballTop < 510) {
			if (ballTop > 80)
				paddingRight.style.top = ballTop + "px";
			else
				paddingRight.style.top = 80 + "px";
		}
	}
    if (ballTop <= ball.offsetHeight / 2 || ballTop >= 600 - ball.offsetHeight) {
        directionY *= -1;
    }
    if (ballLeft <= 0) {
        scorePlayer2 += 1; // Player 2 scores
        resetBall(); // Reset ball position
    }
    if (ballLeft >= 700 - ball.offsetWidth) {
        scorePlayer1 += 1; // Player 1 scores
        resetBall(); // Reset ball position
    }

    const paddingLeftRect = paddingLeft.getBoundingClientRect();
    const paddingRightRect = paddingRight.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();

    const currentPaddingLeftTop = parseInt(window.getComputedStyle(paddingLeft).top);
    const currentPaddingRightTop = parseInt(window.getComputedStyle(paddingRight).top);

    const paddingLeftMovingUp = currentPaddingLeftTop < lastPaddingLeftTop;
    const paddingLeftMovingDown = currentPaddingLeftTop > lastPaddingLeftTop;
    const paddingRightMovingUp = currentPaddingRightTop < lastPaddingRightTop;
    const paddingRightMovingDown = currentPaddingRightTop > lastPaddingRightTop;

    if (ballRect.left <= paddingLeftRect.right && ballRect.right >= paddingLeftRect.left && ballRect.top <= paddingLeftRect.bottom && ballRect.bottom >= paddingLeftRect.top) {
        directionX = 1;
        if (paddingLeftMovingUp && directionY > 0) {
            directionY *= -1;
            speed = Math.max(speed - 1, 2); // Decrease speed but not below 2
        } else if (paddingLeftMovingDown && directionY < 0) {
            if (speed < 10)
				speed += 1;
			if (speed > 10)
				speed = 10;
        }
        if (speed < 10) {
            speed += 0.1;
        }
    }

    if (ballRect.right >= paddingRightRect.left && ballRect.left <= paddingRightRect.right && ballRect.top <= paddingRightRect.bottom && ballRect.bottom >= paddingRightRect.top) {
        directionX = -1;
        if (paddingRightMovingUp && directionY > 0) {
            directionY *= -1;
            speed = Math.max(speed - 1, 2); // Decrease speed but not below 2
        } else if (paddingRightMovingDown && directionY < 0) {
            if (speed < 10)
				speed += 1;
			if (speed > 10)
				speed = 10;
        }
        if (speed < 10) {
            speed += 0.1;
        }
    }
	console.log(speed);

    lastPaddingLeftTop = currentPaddingLeftTop;
    lastPaddingRightTop = currentPaddingRightTop;

    ball.style.top = ballTop + 'px';
    ball.style.left = ballLeft + 'px';
}

function updateScore() {
    scorePlayerLeftElement.textContent = scorePlayer1;
    scorePlayerRightElement.textContent = scorePlayer2;
	checkWin();
}

function checkWin() {
    if (scorePlayer1 >= 3 || scorePlayer2 >= 3) {
		let result = false;
        if (scorePlayer1 >= 3) {
			result = true;
            scorePlayerLeftElement.textContent = "Win";
            scorePlayerRightElement.textContent = "Lose";
			console.log('Normalement true:', result);
        } else {
			result = false;
            scorePlayerLeftElement.textContent = "Lose";
            scorePlayerRightElement.textContent = "Win";
			console.log('Normalement false:', result);
        }
        gameStarted = false;
		fetch('/game/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': Get_Cookie('csrftoken')
			},
			body: JSON.stringify({
				'result': result
			})
		})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				document.getElementById('infoco').innerHTML = data.message

				const nbWinElement = document.getElementById('nbWin');
                const nbLoseElement = document.getElementById('nbLose');

				nbWinElement.textContent = data.nb_win;
        		nbLoseElement.textContent = data.nb_lose;
				showSuccessModal()
			}
		})
		.catch(error => {
			console.error('Erreur:', error);
		});
		setTimeout(resetGame, 3000);
    }
}

function gameLoop() {
	// resetBall();
	if (gameStarted === true) {	
		movePaddings();
		moveBall();
		requestAnimationFrame(gameLoop);
	}
}

function startGame(mode) {
    gameStarted = true;
	mainMenu.style.display = 'none';
	PVPMenu.style.display = 'none';
    if (mode === 'player-vs-ia') {
		difficultyMenu.style.display = 'flex';
    } else if (mode === 'player-vs-player') {
		difficulty = 0;
		pvp_mode = 0;
		PVPMenu.style.display = 'flex';
        // startPlayerVsPlayer();
    }
}

function startPlayerVsIA() {
    if (difficulty === 1) {
		paddingRight.style.transition = '0.5s linear';
	}
	else if (difficulty === 2) {
		paddingRight.style.transition = '0.3s linear';
	}
	else if (difficulty === 3) {
		paddingRight.style.transition = '0.15s linear';
	}
	difficultyMenu.style.display = 'none';
	// console.log("Starting Player vs IA mxode");
	gameMode = 1;
    gameLoop();
}

function playersSelection(mode) {
	
}

function startPlayerVsPlayer() {
	playersSelection(pvp_mode);
	PVPMenu.style.display = 'none';
	gameMode = 0;
	paddingRight.style.transition = '0.06s linear';
    // gameLoop();
}





playerVsIaButton.addEventListener('click', () => startGame('player-vs-ia'));
playerVsPlayerButton.addEventListener('click', () => startGame('player-vs-player'));
PVP1v1Button.addEventListener('click', () => {pvp_mode = 1; startPlayerVsPlayer();});
PVP2v2Button.addEventListener('click', () => {pvp_mode = 2; startPlayerVsPlayer();});
tournamentButton.addEventListener('click', () => {pvp_mode = 3; startPlayerVsPlayer();});
easyButton.addEventListener('click', () => {difficulty = 1; startPlayerVsIA();});
mediumButton.addEventListener('click', () => {difficulty = 2; startPlayerVsIA();});
hardButton.addEventListener('click', () => {difficulty = 3; startPlayerVsIA();});
});