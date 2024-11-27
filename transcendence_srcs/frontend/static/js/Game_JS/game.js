import * as Variables from './variables.js';
import * as Animation from './animation.js';

/*
let gameStarted = false;
let darkMode = false;
let AIDifficulty = "none"; // none, easy, medium, hard
let PVPMode = "none"; // none, 1vs1, 2vs2, Tournament
let HostUserName = null;
let User1UserName = null;
let User2UserName = null;
let User3UserName = null;
let round = null;
let fight = [null, null]; // [left_user, right_user];
*/

export function resetAllData() {
	Variables.setGameStarted(false);
	Variables.setAIDifficulty("none");
	Variables.setPVPMode("none");
	Variables.setHostUserName(null); ///////////////////////
	Variables.setUser1UserName(null);
	Variables.setUser2UserName(null);
	Variables.setUser3UserName(null);
	Variables.LeftPlayerUserNameContent.textContent = '...';
	Variables.RightPlayerUserNameContent.textContent = '...';
	Variables.setRound(0);
	Variables.resetFight();
	Variables.setBallSpeed(5);
	Variables.GameTypeHeader.style.display = 'none';
	Variables.GameTypeHeader.textContent = 'none';
	Variables.OptnMenu.style.bottom = '-650px';
	Variables.PaddingLeft.style.top = '50%';
	Variables.PaddingRight.style.top = '50%';
	Variables.Ball.style.left = '50%';
	Variables.Ball.style.top = '50%';
}

export function softReset() {
	Variables.PaddingLeft.style.top = '50%';
	Variables.PaddingRight.style.top = '50%';
	Variables.Ball.style.left = '50%';
	Variables.Ball.style.top = '50%';
}

export function counter(callback) {
	let counter = 3;
	Variables.counterElement.style.display = 'block';
	Variables.counterElement.textContent = counter;
	let interval = setInterval(() => {
		counter--;
		Variables.counterElement.textContent = counter;
		if (counter === 0) {
			clearInterval(interval);
			Variables.counterElement.style.display = 'none';
			if (callback) {
				callback();
			}
		}
	}, 1000);
}

export function startGame() {
	counter(() => {
		Variables.setGameStarted(true)
		// Animation.changeMenu('Game');
	
		if (Variables.PVPMode === 'none') {
			Variables.Rtips.style.display = 'none';
			Variables.Ltips.style.display = 'block';
		} else {
			Variables.Ltips.style.display = 'block';
			Variables.Rtips.style.display = 'block';
		}
		gameLoop();
	});
}

export function gameLoop() {
	if (Variables.gameStarted === true) {	
		movePaddings();
		moveBall();
		defineWhoFight();
		requestAnimationFrame(gameLoop);
	}
}

export function defineWhoFight() {
	if (Variables.PVPMode === 'none') {
		Variables.setFight(Variables.HostUserNameVar, 'AI');
	} else if (Variables.PVPMode === '1vs1') {
		Variables.setFight(Variables.HostUserNameVar, Variables.User1UserNameVar);
	} else if (Variables.PVPMode === '2vs2') {
		if (Variables.round === 0) {
			Variables.setFight(Variables.HostUserNameVar, Variables.User2UserNameVar);
		} else if (Variables.round === 1) {
			Variables.setFight(Variables.User1UserNameVar, Variables.User3UserNameVar);
		}
	} else if (Variables.PVPMode === 'Tournament') {
		if (Variables.round === 0) {
			Variables.setFight(Variables.HostUserNameVar, Variables.User1UserNameVar);
		} else if (Variables.round === 1) {
			Variables.setFight(Variables.User2UserNameVar, Variables.User3UserNameVar);
		} else if (Variables.round === 2) {
			Variables.setFight('round 0 winner', ' round 1 winner'); ////////////////////////////////////////////////////////
		}
	}
}

export function movePaddings() {
	if (Variables.keyPressed['s']) {
		if (parseInt(window.getComputedStyle(Variables.PaddingLeft).top) + 30 < 520)
			Variables.PaddingLeft.style.top = (parseInt(window.getComputedStyle(Variables.PaddingLeft).top) + 30) + "px";
		else
			Variables.PaddingLeft.style.top = 520 + "px";
	} if (Variables.keyPressed['w']) {
		if (parseInt(window.getComputedStyle(Variables.PaddingLeft).top) - 30 > 80)
			Variables.PaddingLeft.style.top = (parseInt(window.getComputedStyle(Variables.PaddingLeft).top) - 30) + "px";
		else
			Variables.PaddingLeft.style.top = 80 + "px";
	} if (Variables.PVPMode === 'none') { ////////////////////////
		if (Variables.keyPressed['ArrowDown']) {
			if (parseInt(window.getComputedStyle(Variables.PaddingRight).top) + 30 < 520)
				Variables.PaddingRight.style.top = (parseInt(window.getComputedStyle(Variables.PaddingRight).top) + 30) + "px";
			else
				Variables.PaddingRight.style.top = 520 + "px";
		} if (Variables.keyPressed['ArrowUp']) {
			if (parseInt(window.getComputedStyle(Variables.PaddingRight).top) - 30 > 80)
				Variables.PaddingRight.style.top = (parseInt(window.getComputedStyle(Variables.PaddingRight).top) - 30) + "px";
			else
				Variables.PaddingRight.style.top = 80 + "px";
		}
	}
		// else {AI();}
}

// function moveBall() {
// 	// let ballRect = Variables.Ball.getBoundingClientRect();

//     // let ballX = ballRect.left + (Variables.ballSpeed * Variables.ballDirectionX);
//     // let ballY = ballRect.top + (Variables.ballSpeed * Variables.ballDirectionY);
// 	let ballTop = parseInt(window.getComputedStyle(Variables.Ball).top) + Variables.ballSpeed * Variables.ballDirectionY;
// 	let ballLeft = parseInt(window.getComputedStyle(Variables.Ball).left) + Variables.ballSpeed * Variables.ballDirectionX;
// 	console.log(ballLeft, Variables.ballDirectionX, Variables.ballSpeed);

//     // Check for collisions with the top and bottom walls
//     if (ballTop <= 0 || ballTop + 20 >= window.innerHeight) {
//         Variables.setBallDirectionY(Variables.ballDirectionY * -1); // Reverse the Y direction
//     }

//     // Check for collisions with the paddles
//     let leftPaddleRect = Variables.PaddingLeft.getBoundingClientRect();
//     let rightPaddleRect = Variables.PaddingRight.getBoundingClientRect();

//     if (ballLeft <= leftPaddleRect.right && ballTop >= leftPaddleRect.top && ballTop <= leftPaddleRect.bottom) {
//         Variables.setBallDirectionX(Variables.ballDirectionX * -1); // Reverse the X direction
//     }

//     if (ballLeft + 20 >= rightPaddleRect.left && ballTop >= rightPaddleRect.top && ballTop <= rightPaddleRect.bottom) {
//         Variables.setBallDirectionX(Variables.ballDirectionX * -1); // Reverse the X direction
//     }

//     // Update the ball's position
//     Variables.Ball.style.left = ballLeft + "px";
//     Variables.Ball.style.top = ballTop + "px";
// }

// let ballTop = parseInt(window.getComputedStyle(ball).top);
// let ballLeft = parseInt(window.getComputedStyle(ball).left);
// let lastPaddingLeftTop = parseInt(window.getComputedStyle(paddingLeft).top);
// let lastPaddingRightTop = parseInt(window.getComputedStyle(paddingRight).top);
// const ballTopOriginal = ballTop;
// const ballLeftOriginal = ballLeft;
// const paddingLeftOriginalTop = parseInt(window.getComputedStyle(paddingLeft).top);
// const paddingRightOriginalTop = parseInt(window.getComputedStyle(paddingRight).top);
// let directionX = Math.random() < 0.5 ? 1 : -1;
// let directionY = Math.random() < 0.5 ? 1 : -1;
// let speed = 2;
// let gameStarted = false;
// let gameMode = 0; 
// let difficulty = 0;

// function moveBall() {
//     let ballTop = parseInt(window.getComputedStyle(Variables.Ball).top) + Variables.ballSpeed * Variables.ballDirectionY;
// 	let ballLeft = parseInt(window.getComputedStyle(Variables.Ball).left) + Variables.ballSpeed * Variables.ballDirectionX;
	

// 	// if (gameMode === 1) {
// 		if (directionY === 1 && ballTop > 80) {
// 			if (ballTop < 510)
// 				paddingRight.style.top = ballTop + "px";
// 			else
// 				paddingRight.style.top = 510 + "px";
// 		} else if (directionY === -1 && ballTop < 510) {
// 			if (ballTop > 80)
// 				paddingRight.style.top = ballTop + "px";
// 			else
// 				paddingRight.style.top = 80 + "px";
// 		}
// 	// }
//     if (ballTop <= ball.offsetHeight / 2 || ballTop >= 600 - ball.offsetHeight) {
// 		directionY *= -1;
//     }
//     // if (ballLeft <= 0) {
// 	// 	scorePlayer2 += 1; // Player 2 scores
//     //     resetBall(); // Reset ball position
//     // }
//     // if (ballLeft >= 700 - ball.offsetWidth) {
// 	// 	scorePlayer1 += 1; // Player 1 scores
//     //     resetBall(); // Reset ball position
//     // }
	
//     const paddingLeftRect = paddingLeft.getBoundingClientRect();
//     const paddingRightRect = paddingRight.getBoundingClientRect();
//     const ballRect = ball.getBoundingClientRect();
	
//     const currentPaddingLeftTop = parseInt(window.getComputedStyle(paddingLeft).top);
//     const currentPaddingRightTop = parseInt(window.getComputedStyle(paddingRight).top);
	
//     const paddingLeftMovingUp = currentPaddingLeftTop < lastPaddingLeftTop;
//     const paddingLeftMovingDown = currentPaddingLeftTop > lastPaddingLeftTop;
//     const paddingRightMovingUp = currentPaddingRightTop < lastPaddingRightTop;
//     const paddingRightMovingDown = currentPaddingRightTop > lastPaddingRightTop;
	
//     if (ballRect.left <= paddingLeftRect.right && ballRect.right >= paddingLeftRect.left && ballRect.top <= paddingLeftRect.bottom && ballRect.bottom >= paddingLeftRect.top) {
// 		directionX = 1;
//         if (paddingLeftMovingUp && directionY > 0) {
//             directionY *= -1;
//             speed = Math.max(speed - 1, 2); // Decrease speed but not below 2
//         } else if (paddingLeftMovingDown && directionY < 0) {
// 			if (speed < 10)
// 				speed += 1;
// 			if (speed > 10)
// 				speed = 10;
// 		}
//         if (speed < 10) {
// 			speed += 0.1;
//         }
//     }
	
//     if (ballRect.right >= paddingRightRect.left && ballRect.left <= paddingRightRect.right && ballRect.top <= paddingRightRect.bottom && ballRect.bottom >= paddingRightRect.top) {
// 		directionX = -1;
//         if (paddingRightMovingUp && directionY > 0) {
//             directionY *= -1;
//             speed = Math.max(speed - 1, 2); // Decrease speed but not below 2
//         } else if (paddingRightMovingDown && directionY < 0) {
// 			if (speed < 10)
// 				speed += 1;
// 			if (speed > 10)
// 				speed = 10;
//         }
//         if (speed < 10) {
// 			speed += 0.1;
//         }
//     }
// 	// console.log(speed);
	
//     lastPaddingLeftTop = currentPaddingLeftTop;
//     lastPaddingRightTop = currentPaddingRightTop;
	
//     ball.style.top = ballTop + 'px';
//     ball.style.left = ballLeft + 'px';
// }

export function moveBall() {
	let ballTop = parseInt(window.getComputedStyle(Variables.Ball).top) + Variables.ballSpeed * Variables.ballDirectionY;
	let ballLeft = parseInt(window.getComputedStyle(Variables.Ball).left) + Variables.ballSpeed * Variables.ballDirectionX;
	
}


function AI() {

}

// export function gameLoop() {
// 	if (Variables.gameStarted === true) {	
// 		movePaddings();
// 		moveBall();
// 		requestAnimationFrame(gameLoop);
// 	}
// }