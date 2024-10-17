document.addEventListener("DOMContentLoaded", function() {
const padding1 = document.querySelector('.padding1');
const padding2 = document.querySelector('.padding2');
const ball = document.querySelector('.ball');
const box = document.querySelector('.box');
const playerVsIaButton = document.getElementById('player-vs-ia');
const playerVsPlayerButton = document.getElementById('player-vs-player');
const mainMenu = document.getElementById('main-menu');
const difficultyMenu = document.getElementById('difficulty-menu');
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');
const scorePlayer1Element = document.getElementById('score-player1');
const scorePlayer2Element = document.getElementById('score-player2');

// console.log(document.getElementById('temp_page1'));
// console.log("padding1:", padding1);
// console.log("padding2:", padding2);
// console.log("ball:", ball);
// console.log("box:", box);
// console.log("playerVsIaButton:", playerVsIaButton);
// console.log("playerVsPlayerButton:", playerVsPlayerButton);
// console.log("mainMenu:", mainMenu);
// console.log("difficultyMenu:", difficultyMenu);
// console.log("easyButton:", easyButton);
// console.log("mediumButton:", mediumButton);
// console.log("hardButton:", hardButton);
// console.log("scorePlayer1Element:", scorePlayer1Element);
// console.log("scorePlayer2Element:", scorePlayer2Element);

// if (!padding1 || !padding2 || !ball || !box || !playerVsIaButton || !playerVsPlayerButton || !mainMenu || !difficultyMenu || !easyButton || !mediumButton || !hardButton || !scorePlayer1Element || !scorePlayer2Element) {
// 	console.error("One or more elements are not found in the DOM.");
// 	return;
// }
	// const padding1 = document.querySelector('.padding1');
	// const padding2 = document.querySelector('.padding2');
	// const ball = document.querySelector('.ball');
	// const box = document.querySelector('.box');

	// if (!padding1 || !padding2 || !ball || !box) {
	//     console.error("One or more elements not found");
	//     return;
	// }
	
let ballTop = parseInt(window.getComputedStyle(ball).top);
let ballLeft = parseInt(window.getComputedStyle(ball).left);
const ballTopOriginal = ballTop;
const ballLeftOriginal = ballLeft
const padding1OriginalTop = parseInt(window.getComputedStyle(padding1).top);
const padding2OriginalTop = parseInt(window.getComputedStyle(padding2).top);
let directionX = Math.random() < 0.5 ? 1 : -1;
let directionY = Math.random() < 0.5 ? 1 : -1;
let speed = 2;
let scorePlayer1 = 0;
let scorePlayer2 = 0;
let gameStarted = false;
let gameMode = 0;
let difficulty = 0;
console.log("Test");

const keyPressed = {};

document.addEventListener("keydown", (e) => {
	keyPressed[e.key] = true;
});

document.addEventListener("keyup", (e) => {
	keyPressed[e.key] = false;
});

function movePaddings() {
	// padding1.style.top = (parseInt(window.getComputedStyle(padding1).top) + "px");
	if (keyPressed['s']) {
		if (parseInt(window.getComputedStyle(padding1).top) + 30 < 510)
			padding1.style.top = (parseInt(window.getComputedStyle(padding1).top) + 30) + "px";
		else
			padding1.style.top = 510 + "px";
	} if (keyPressed['w']) {
		if (parseInt(window.getComputedStyle(padding1).top) - 30 > 80)
			padding1.style.top = (parseInt(window.getComputedStyle(padding1).top) - 30) + "px";
		else
			padding1.style.top = 80 + "px";
	} if (gameMode === 0) {
		if (keyPressed['l']) {
			if (parseInt(window.getComputedStyle(padding2).top) + 30 < 510)
				padding2.style.top = (parseInt(window.getComputedStyle(padding2).top) + 30) + "px";
			else
				padding2.style.top = 510 + "px";
		} if (keyPressed['o']) {
			if (parseInt(window.getComputedStyle(padding2).top) - 30 > 80)
				padding2.style.top = (parseInt(window.getComputedStyle(padding2).top) - 30) + "px";
			else
				padding2.style.top = 80 + "px";
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
	padding1.style.top = padding1OriginalTop + "px";
	padding2.style.top = padding2OriginalTop + "px";

	console.log("padding1 top:", padding1.style.top);
	console.log("padding2 top:", padding2.style.top);
	// console.log(padding1.style.top);
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
let lastPadding1Top = parseInt(window.getComputedStyle(padding1).top);
let lastPadding2Top = parseInt(window.getComputedStyle(padding2).top);

function moveBall() {
    ballTop += speed * directionY;
    ballLeft += speed * directionX;

	if (gameMode === 1) {
		if (directionY === 1 && ballTop > 80) {
			if (ballTop < 510)
				padding2.style.top = ballTop + "px";
			else
				padding2.style.top = 510 + "px";
		} else if (directionY === -1 && ballTop < 510) {
			if (ballTop > 80)
				padding2.style.top = ballTop + "px";
			else
				padding2.style.top = 80 + "px";
		}
	}
    if (ballTop <= ball.offsetHeight / 2 || ballTop >= 600 - ball.offsetHeight) {
        directionY *= -1;
    }
    if (ballLeft <= 0) {
        scorePlayer1 += 1; // Player 2 scores
        resetBall(); // Reset ball position
    }
    if (ballLeft >= 700 - ball.offsetWidth) {
        scorePlayer2 += 1; // Player 1 scores
        resetBall(); // Reset ball position
    }

    const padding1Rect = padding1.getBoundingClientRect();
    const padding2Rect = padding2.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();

    const currentPadding1Top = parseInt(window.getComputedStyle(padding1).top);
    const currentPadding2Top = parseInt(window.getComputedStyle(padding2).top);

    const padding1MovingUp = currentPadding1Top < lastPadding1Top;
    const padding1MovingDown = currentPadding1Top > lastPadding1Top;
    const padding2MovingUp = currentPadding2Top < lastPadding2Top;
    const padding2MovingDown = currentPadding2Top > lastPadding2Top;

    if (ballRect.left <= padding1Rect.right && ballRect.right >= padding1Rect.left && ballRect.top <= padding1Rect.bottom && ballRect.bottom >= padding1Rect.top) {
        directionX = 1;
        if (padding1MovingUp && directionY > 0) {
            directionY *= -1;
            speed = Math.max(speed - 1, 2); // Decrease speed but not below 2
        } else if (padding1MovingDown && directionY < 0) {
            if (speed < 10)
				speed += 1;
			if (speed > 10)
				speed = 10;
        }
        if (speed < 10) {
            speed += 0.1;
        }
    }

    if (ballRect.right >= padding2Rect.left && ballRect.left <= padding2Rect.right && ballRect.top <= padding2Rect.bottom && ballRect.bottom >= padding2Rect.top) {
        directionX = -1;
        if (padding2MovingUp && directionY > 0) {
            directionY *= -1;
            speed = Math.max(speed - 1, 2); // Decrease speed but not below 2
        } else if (padding2MovingDown && directionY < 0) {
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

    lastPadding1Top = currentPadding1Top;
    lastPadding2Top = currentPadding2Top;

    ball.style.top = ballTop + 'px';
    ball.style.left = ballLeft + 'px';
}

// function moveBall() {
// 	ballTop += speed * directionY;
// 	ballLeft += speed * directionX;
// 	if (gameMode === 1) {
// 		if (directionY === 1 && ballTop > 80) {
// 			if (ballTop < 510)
// 				padding2.style.top = ballTop + "px";
// 			else
// 				padding2.style.top = 510 + "px";
// 		} else if (directionY === -1 && ballTop < 510) {
// 			if (ballTop > 80)
// 				padding2.style.top = ballTop + "px";
// 			else
// 				padding2.style.top = 80 + "px";
// 		}
// 	}
// 	if (ballTop <= 10 || ballTop >= 600 - ball.offsetHeight) {
// 		directionY *= -1;
// 	}

// 	if (ballLeft <= 0) {
// 		scorePlayer1 += 1;
// 		resetBall();
// 	}

// 	if (ballLeft >= 700 - ball.offsetWidth) {
// 		scorePlayer2  += 1;
// 		resetBall();
// 	}

// 	const padding1Rect = padding1.getBoundingClientRect();
// 	const padding2Rect = padding2.getBoundingClientRect();
// 	const ballRect = ball.getBoundingClientRect();
	
// 	if (ballRect.left <= padding1Rect.right && ballRect.right >= padding1Rect.left && ballRect.top <= padding1Rect.bottom && ballRect.bottom >= padding1Rect.top) {
// 		directionX = 1;
// 		if (speed < 10) {
// 			speed += 0.1;
// 			console.log(speed);
// 		}
// 	} if (ballRect.right >= padding2Rect.left && ballRect.left <= padding2Rect.right && ballRect.top <= padding2Rect.bottom && ballRect.bottom >= padding2Rect.top) {
// 		directionX = -1;
// 		if (speed < 10) {
// 			speed += 0.1;
// 			console.log(speed);
// 		}
// 	}

// 	ball.style.top = ballTop + 'px';
//     ball.style.left = ballLeft + 'px';
// }

function updateScore() {
    scorePlayer1Element.textContent = scorePlayer1;
    scorePlayer2Element.textContent = scorePlayer2;
	checkWin();
}

function checkWin() {
    if (scorePlayer1 >= 3 || scorePlayer2 >= 3) {
        if (scorePlayer1 >= 3) {
            scorePlayer1Element.textContent = "Win";
            scorePlayer2Element.textContent = "Lose";
        } else {
            scorePlayer1Element.textContent = "Lose";
            scorePlayer2Element.textContent = "Win";
        }
        gameStarted = false;
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
    if (mode === 'player-vs-ia') {
		difficultyMenu.style.display = 'flex';
    } else if (mode === 'player-vs-player') {
		difficulty = 0;
        startPlayerVsPlayer();
    }
}

function startPlayerVsIA() {
    if (difficulty === 1) {
		padding2.style.transition = '0.5s linear';
	}
	else if (difficulty === 2) {
		padding2.style.transition = '0.3s linear';
	}
	else if (difficulty === 3) {
		padding2.style.transition = '0.15s linear';
	}
	difficultyMenu.style.display = 'none';
	console.log("Starting Player vs IA mode");
	gameMode = 1;
    gameLoop();
}

function startPlayerVsPlayer() {
	console.log("Starting Player vs Player mode");
	gameMode = 0;
	padding2.style.transition = '0.06s linear';
    gameLoop();
}
// startPlayerVsPlayer();
console.log("Test");

playerVsIaButton.addEventListener('click', () => startGame('player-vs-ia'));
playerVsPlayerButton.addEventListener('click', () => startGame('player-vs-player'));
easyButton.addEventListener('click', () => {difficulty = 1; startPlayerVsIA();});
mediumButton.addEventListener('click', () => {difficulty = 2; startPlayerVsIA();});
hardButton.addEventListener('click', () => {difficulty = 3; startPlayerVsIA();});
});