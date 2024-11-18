document.addEventListener("DOMContentLoaded", function() {
const PaddingLeft = document.getElementById('left-paddle');
const PaddingRight = document.getElementById('right-paddle');
const Ball = document.getElementById('ball');
const Delimiter = document.getElementById('delimiter');
const ScorePlayerLeftElement = document.getElementById('LeftPlayerScore');
const ScorePlayerRightElement = document.getElementById('RightPlayerScore');
const LeftPlayerUserNameContent = document.getElementById('LeftPlayerName');
const RightPlayerUserNameContent = document.getElementById('RightPlayerName');
const GameTypeHeader = document.getElementById('GameTypeHeader');
const Ltips = document.getElementById('tips1');
const Rtips = document.getElementById('tips2');
	
const PVP1v1Button = document.getElementById('HostGame1v1Button');
const PVP2v2Button = document.getElementById('HostGame2v2Button');
const TournamentButton = document.getElementById('HostTournamentButton');
const PVPStartButton = document.getElementById('StartGame');
const Player1SearchButton = document.getElementById('User1Search');
const Player2SearchButton = document.getElementById('User2Search');
const Player3SearchButton = document.getElementById('User3Search');
const PVAButton = document.getElementById('AIButton');
const PvAIeasyButton = document.getElementById('AIEasyButton');
const PvAImediumButton = document.getElementById('AIMediumButton');
const PvAIhardButton = document.getElementById('AIHardButton');
const BackToMainMenuButton = document.getElementById('BackMainMenuButton');
const OptnButton = document.getElementById('OptnButton');
const ReadyButton = document.getElementById('ready');
const counterElement = document.getElementById('counter');
	
const MainMenu = document.getElementById('main-menu');
const AIMenu = document.getElementById('AIMenu');
const RoomMenu = document.getElementById('Room');
const OptnMenu = document.getElementById('OptnMenu');
	
const RoomHostInfo = document.getElementById('Host');
const RoomUser1Info = document.getElementById('User1');
const RoomUser2Info = document.getElementById('User2');
const RoomUser3Info = document.getElementById('User3');
	
const RoomHostName = document.getElementById('HostName');
const RoomUser1Name = document.getElementById('User1Name');
const RoomUser2Name = document.getElementById('User2Name');
const RoomUser3Name = document.getElementById('User3Name');
	
const keyPressed = {};
	
let gameStarted = false;
let darkMode = false;
let AIDifficulty = "none"; // none, easy, medium, hard
let PVPMode = "none"; // none, 1vs1, 2vs2, Tournament
let HostUserNameVar = null;
let User1UserNameVar = null;
let User2UserNameVar = null;
let User3UserNameVar = null;
let round = null;
let fight = [null, null]; // [left_user, right_user]
let ballSpeed = 5;
let ballDirectionX = Math.random() < 0.5 ? -1 : 1; // Random initial direction
let ballDirectionY = Math.random() < 0.5 ? -1 : 1; // Random initial direction

function setHostUserName(value) {
	HostUserNameVar = value;
	if (value === null) {
		RoomHostName.textContent = '...';
	} else {
		RoomHostName.textContent = value;
	}
}

function setUser1UserName(value) {
	User1UserNameVar = value;
	if (value === null) {
		RoomUser1Name.textContent = '...';
	} else {
		RoomUser1Name.textContent = value;
	}
}
function setUser2UserName(value) {
	User2UserNameVar = value;
	if (value === null) {
		RoomUser2Name.textContent = '...';
	} else {
		RoomUser2Name.textContent = value;
	}
}
function setUser3UserName(value) {
	User3UserNameVar = value;
	if (value === null) {
		RoomUser3Name.textContent = '...';
	} else {
		RoomUser3Name.textContent = value;
	}
}

function setFight(value1, value2) {
	fight[0] = value1;
	fight[1] = value2;
	if (value1 === null || value2 === null) {
		console.error('Fatal Error: player not initialised!');
		changeMenu('MainMenu');
		resetAllData();
		console.log(value1, value2);
		return ;
	}
	console.log(value1, value2);
	LeftPlayerUserNameContent.textContent = value1;
	RightPlayerUserNameContent.textContent = value2;
}

function resetFight() {
	fight = [null, null];
}

function ChangeGameModeHeader(mode) {if (mode === 'none') {GameTypeHeader.textContent = 'none';GameTypeHeader.style.display = 'none';} else {
	GameTypeHeader.textContent = `{{ texts.` + mode + `Mode }}`;
	// GameTypeHeader.textContent = mode;
	GameTypeHeader.style.display = 'block';}}
function hideOptnMenu() {OptnMenu.style.bottom = '-650px';}
function ToggleOptnMenu() {
	if (OptnMenu.style.bottom === '-650px') {
		OptnMenu.style.bottom = '-200px';
	} else {
		OptnMenu.style.bottom = '-650px';
	}
	console.log(OptnMenu.style.bottom);
}

function changeMenu(menu) {
	if (menu === 'MainMenu') {
		Rtips.style.display = 'none';
		Ltips.style.display = 'none';
		Ball.style.display = 'none';
		PaddingLeft.style.display = 'none';
		PaddingRight.style.display = 'none';
		Delimiter.style.display = 'none';
		RoomMenu.style.display = 'none';
		ReadyButton.style.display = 'none';
		counterElement.style.display = 'none';


		AnimationGameMainMenu('in');
		AnimationAIMenu('out');
		hideOptnMenu();

		resetAllData();
	} else if (menu === 'AIMenu') {
		// PVAButton.style.left = '300%'; /////////////////////////////////////////////////////////
		Ltips.style.display = 'none';
		Rtips.style.display = 'none';
		Ball.style.display = 'none';
		PaddingLeft.style.display = 'none';
		PaddingRight.style.display = 'none';
		Delimiter.style.display = 'none';
		RoomMenu.style.display = 'none';
		ReadyButton.style.display = 'none';
		counterElement.style.display = 'none';
		
		AnimationGameMainMenu('out');
		AnimationAIMenu('in');
		hideOptnMenu();

	} else if (menu === 'RoomMenu') {
		// PVAButton.style.left = '300%'; /////////////////////////////////////////////////////////

		Ltips.style.display = 'none';
		Rtips.style.display = 'none';
		// MainMenu.style.display = 'none'; ////////////////
		// AIMenu.style.display = 'none';
		RoomMenu.style.display = 'flex';
		Ball.style.display = 'none';
		PaddingLeft.style.display = 'none';
		PaddingRight.style.display = 'none';
		Delimiter.style.display = 'none';
		ReadyButton.style.display = 'none';
		counterElement.style.display = 'none';
		AnimationGameMainMenu('out');
		if (PVPMode === '1vs1') {
			RoomHostInfo.style.display = 'block';
			RoomUser1Info.style.display = 'block';
			RoomUser2Info.style.display = 'none';
			RoomUser3Info.style.display = 'none';

			RoomHostInfo.style.backgroundColor = 'lightgrey';
			RoomUser1Info.style.backgroundColor = 'lightgrey';
			RoomUser2Info.style.backgroundColor = 'lightgrey';
			RoomUser3Info.style.backgroundColor = 'lightgrey';
		} else if (PVPMode === '2vs2') {
			RoomHostInfo.style.display = 'block';
			RoomUser1Info.style.display = 'block';
			RoomUser2Info.style.display = 'block';
			RoomUser3Info.style.display = 'block';
			
			RoomHostInfo.style.backgroundColor = 'red';
			RoomUser1Info.style.backgroundColor = 'red';
			RoomUser2Info.style.backgroundColor = 'blue';
			RoomUser3Info.style.backgroundColor = 'blue';
		} else if (PVPMode === 'Tournament') {
			RoomHostInfo.style.display = 'block';
			RoomUser1Info.style.display = 'block';
			RoomUser2Info.style.display = 'block';
			RoomUser3Info.style.display = 'block';

			RoomHostInfo.style.backgroundColor = 'lightgrey';
			RoomUser1Info.style.backgroundColor = 'lightgrey';
			RoomUser2Info.style.backgroundColor = 'lightgrey';
			RoomUser3Info.style.backgroundColor = 'lightgrey';
		} 
	} else if (menu === 'Game') {
		// PVAButton.style.left = '300%'; /////////////////////////////////////////////////////////
		Ltips.style.display = 'none';
		Rtips.style.display = 'none';
		// MainMenu.style.display = 'none'; ///////////////
		// AIMenu.style.display = 'none';
		RoomMenu.style.display = 'none';
		Ball.style.display = 'block';
		PaddingLeft.style.display = 'block';
		PaddingRight.style.display = 'block';
		Delimiter.style.display = 'block';
		ReadyButton.style.display = 'block';
		counterElement.style.display = 'none';

		
		AnimationGameMainMenu('out');
		AnimationAIMenu('out');
		hideOptnMenu();
		defineWhoFight();


		// AnimationGameMenu('out');

	} else if (menu === 'End') {
		
	} else
		console.error('Menu not found');
}

function AnimationGameMainMenu(mode) {
	if (mode === 'in') {
		PVAButton.style.left = '0%';
		PVP1v1Button.style.right = '0%';
		PVP2v2Button.style.left = '0%';
		TournamentButton.style.right = '0%';
	} else {
		PVAButton.style.left = '100%';
		PVP1v1Button.style.right = '100%';
		PVP2v2Button.style.left = '100%';
		TournamentButton.style.right = '100%';
	}
	console.log(mode);
}

function AnimationAIMenu(mode) {
	if (mode === 'in') {
		PvAIeasyButton.style.left = '0%';
		PvAImediumButton.style.right = '0%';
		PvAIhardButton.style.left = '0%';
		AIMenu.style.pointerEvents = 'auto';
		// AIMenu.style.display = 'flex';
	} else {
		PvAIeasyButton.style.left = '100%';
		PvAImediumButton.style.right = '100%';
		PvAIhardButton.style.left = '100%';
		AIMenu.style.pointerEvents = 'none';
		// AIMenu.style.display = 'none';
	}
}
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

function resetAllData() {
	gameStarted = false;
	AIDifficulty = "none";
	PVPMode = "none";
	setHostUserName("hostname"); ///////////////////////
	setUser1UserName(null);
	setUser2UserName(null);
	setUser3UserName(null);
	LeftPlayerUserNameContent.textContent = '...';
	RightPlayerUserNameContent.textContent = '...';
	round = 0;
	resetFight();
	ballSpeed = 5;
	GameTypeHeader.style.display = 'none';
	GameTypeHeader.textContent = 'none';
	OptnMenu.style.bottom = '-650px';
	PaddingLeft.style.top = '50%';
	PaddingRight.style.top = '50%';
	Ball.style.left = '50%';
	Ball.style.top = '50%';
}

function softReset() {
	PaddingLeft.style.top = '50%';
	PaddingRight.style.top = '50%';
	Ball.style.left = '50%';
	Ball.style.top = '50%';
}

function counter(callback) {
	let counter = 3;
	counterElement.style.display = 'block';
	counterElement.textContent = counter;
	let interval = setInterval(() => {
		counter--;
		counterElement.textContent = counter;
		if (counter === 0) {
			clearInterval(interval);
			counterElement.style.display = 'none';
			if (callback) {
				callback();
			}
		}
	}, 1000);
}

function startGame() {
	counter(() => {
		gameStarted = true;
		// changeMenu('Game');
	
		if (PVPMode === 'none') {
			Rtips.style.display = 'none';
			Ltips.style.display = 'block';
		} else {
			Ltips.style.display = 'block';
			Rtips.style.display = 'block';
		}
		gameLoop();
	});
}

function gameLoop() {
	if (gameStarted === true) {	
		movePaddings();
		moveBall();
		defineWhoFight();
		requestAnimationFrame(gameLoop);
	}
}

function defineWhoFight() {
	if (PVPMode === 'none') {
		setFight(HostUserNameVar, 'AI');
	} else if (PVPMode === '1vs1') {
		setFight(HostUserNameVar, User1UserNameVar);
	} else if (PVPMode === '2vs2') {
		if (round === 0) {
			setFight(HostUserNameVar, User2UserNameVar);
		} else if (round === 1) {
			setFight(User1UserNameVar, User3UserNameVar);
		}
	} else if (PVPMode === 'Tournament') {
		if (round === 0) {
			setFight(HostUserNameVar, User1UserNameVar);
		} else if (round === 1) {
			setFight(User2UserNameVar, User3UserNameVar);
		} else if (round === 2) {
			setFight('round 0 winner', ' round 1 winner'); ////////////////////////////////////////////////////////
		}
	}
}

function movePaddings() {
	if (keyPressed['s']) {
		if (parseInt(window.getComputedStyle(PaddingLeft).top) + 30 < 314)
			PaddingLeft.style.top = (parseInt(window.getComputedStyle(PaddingLeft).top) + 30) + "px";
		else
			PaddingLeft.style.top = 314 + "px";
	} if (keyPressed['w']) {
		if (parseInt(window.getComputedStyle(PaddingLeft).top) - 30 > 80)
			PaddingLeft.style.top = (parseInt(window.getComputedStyle(PaddingLeft).top) - 30) + "px";
		else
			PaddingLeft.style.top = 80 + "px";
	} if (PVPMode === 'none') { ////////////////////////
		if (keyPressed['ArrowDown']) {
			if (parseInt(window.getComputedStyle(PaddingRight).top) + 30 < 314)
				PaddingRight.style.top = (parseInt(window.getComputedStyle(PaddingRight).top) + 30) + "px";
			else
				PaddingRight.style.top = 314 + "px";
		} if (keyPressed['ArrowUp']) {
			if (parseInt(window.getComputedStyle(PaddingRight).top) - 30 > 80)
				PaddingRight.style.top = (parseInt(window.getComputedStyle(PaddingRight).top) - 30) + "px";
			else
				PaddingRight.style.top = 80 + "px";
		}
	}
		// else {AI();}
}

function moveBall() {

}

// ------------------------------- PVP events -------------------------------

PVP1v1Button.addEventListener('click', () => {
	PVPMode = '1vs1';
	ChangeGameModeHeader(PVPMode);
	changeMenu('RoomMenu');
});

PVP2v2Button.addEventListener('click', () => {
	PVPMode = '2vs2';
	ChangeGameModeHeader(PVPMode);
	changeMenu('RoomMenu');
});

TournamentButton.addEventListener('click', () => {
	PVPMode = 'Tournament';
	ChangeGameModeHeader(PVPMode);
	changeMenu('RoomMenu');
});

// ------------------------------- AI events -------------------------------
PVAButton.addEventListener('click', () => {
	changeMenu('AIMenu');
});

PvAIeasyButton.addEventListener('click', () => {
	AIDifficulty = 'Easy';
	ChangeGameModeHeader(AIDifficulty);
	changeMenu('Game');
	// startGame()
});

PvAImediumButton.addEventListener('click', () => {
	AIDifficulty = 'Medium';
	ChangeGameModeHeader(AIDifficulty);
	changeMenu('Game');
	// startGame()
});

PvAIhardButton.addEventListener('click', () => {
	AIDifficulty = 'Hard';
	ChangeGameModeHeader(AIDifficulty);
	changeMenu('Game');
	// startGame()
});

BackToMainMenuButton.addEventListener('click', () => {
	changeMenu('MainMenu');
	resetAllData();
});

OptnButton.addEventListener('click', () => {
	console.log('OptnButton clicked');
	ToggleOptnMenu();
});

////////////////////////////////////////////////////////////
PVPStartButton.addEventListener('click', () => {
	changeMenu('Game');
	// startGame();
});

ReadyButton.addEventListener('click', () => {
	ReadyButton.style.display = 'none';
	startGame();
});
////////////////////////////////////////////////////////////

document.addEventListener("keydown", (e) => {keyPressed[e.key] = true;});
document.addEventListener("keyup", (e) => {keyPressed[e.key] = false;});

function init() {
	changeMenu('MainMenu');
	// alert("test");
	resetAllData();
	setHostUserName("HostName");
}

init();

});

// ------------------------------- -------------------------------
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

// let scorePlayer1 = 0;
// let scorePlayer2 = 0;
// let scorePlayer4 = 0;

// let pvp_mode = 0; //1v1 = 1; 2v2 = 2; tournament = 3;
// let player1_id = null;
// let player2_id = null;
// let player3_id = null;
// let player4_id = null;
// let left_player = null;
// let right_player = null;
// let whoFight = [null, null]; // first is for the player at the left, second for the player at the right

// ------------------------------- functions -------------------------------
// ------------------------------- events -------------------------------
// const keyPressed = {};

// document.addEventListener("keydown", (e) => {
// 	keyPressed[e.key] = true;
// });

// document.addEventListener("keyup", (e) => {
// 	keyPressed[e.key] = false;
// });

// function movePaddings() {
// 	if (keyPressed['s']) {
// 		if (parseInt(window.getComputedStyle(paddingLeft).top) + 30 < 520)
// 			paddingLeft.style.top = (parseInt(window.getComputedStyle(paddingLeft).top) + 30) + "px";
// 		else
// 		paddingLeft.style.top = 520 + "px";
// } if (keyPressed['w']) {
// 	if (parseInt(window.getComputedStyle(paddingLeft).top) - 30 > 80)
// 		paddingLeft.style.top = (parseInt(window.getComputedStyle(paddingLeft).top) - 30) + "px";
// 	else
// 	paddingLeft.style.top = 80 + "px";
// } if (gameMode === 0) {
// 		if (keyPressed['l']) {
// 			if (parseInt(window.getComputedStyle(paddingRight).top) + 30 < 520)
// 				paddingRight.style.top = (parseInt(window.getComputedStyle(paddingRight).top) + 30) + "px";
// 			else
// 				paddingRight.style.top = 520 + "px";
// 		} if (keyPressed['o']) {
// 			if (parseInt(window.getComputedStyle(paddingRight).top) - 30 > 80)
// 				paddingRight.style.top = (parseInt(window.getComputedStyle(paddingRight).top) - 30) + "px";
// 			else
// 				paddingRight.style.top = 80 + "px";
// 		}
// 	}
// 	console.log("paddingLeft top:", paddingLeft.style.top);
// }
// // ------------------------------- resets -------------------------------
// function resetBall() {
// 	ball.style.top = ballTopOriginal + "px";
// 	ball.style.left = ballLeftOriginal + "px";
// 	ballTop = parseInt(window.getComputedStyle(ball).top);
// 	ballLeft = parseInt(window.getComputedStyle(ball).left);
	
// 	directionX = Math.random() < 0.5 ? 1 : -1;
// 	directionY = Math.random() < 0.5 ? 1 : -1;
// 	speed = 2;
// 	paddingLeft.style.top = paddingLeftOriginalTop + "px";
// 	paddingRight.style.top = paddingRightOriginalTop + "px";
	
// 	// console.log("paddingLeft top:", paddingLeft.style.top);
// 	// console.log("paddingRight top:", paddingRight.style.top);
// 	updateScore();
// }

// function resetGame() {
//     scorePlayer1 = 0;
//     scorePlayer2 = 0;
//     updateScore();
// 	gameStarted = false;
//     mainMenu.style.display = 'flex';
// 	resetBall();
// }

// // ------------------------------- game -------------------------------
// function moveBall() {
//     ballTop += speed * directionY;
//     ballLeft += speed * directionX;
	
// 	if (gameMode === 1) {
// 		if (directionY === 1 && ballTop > 80) {
// 			if (ballTop < 510)
// 				paddingRight.style.top = ballTop + "px";
// 			else
// 			paddingRight.style.top = 510 + "px";
// 	} else if (directionY === -1 && ballTop < 510) {
// 		if (ballTop > 80)
// 			paddingRight.style.top = ballTop + "px";
// 			else
// 			paddingRight.style.top = 80 + "px";
// 		}
// 	}
//     if (ballTop <= ball.offsetHeight / 2 || ballTop >= 600 - ball.offsetHeight) {
// 		directionY *= -1;
//     }
//     if (ballLeft <= 0) {
// 		scorePlayer2 += 1; // Player 2 scores
//         resetBall(); // Reset ball position
//     }
//     if (ballLeft >= 700 - ball.offsetWidth) {
// 		scorePlayer1 += 1; // Player 1 scores
//         resetBall(); // Reset ball position
//     }
	
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

// // ------------------------------- updates -------------------------------
// function updateScore() {
// 	scorePlayerLeftElement.textContent = scorePlayer1;
//     scorePlayerRightElement.textContent = scorePlayer2;
// 	checkWin();
// }

// function checkWin() {
//     if (scorePlayer1 >= 3 || scorePlayer2 >= 3) {
// 		let result = false;
//         if (scorePlayer1 >= 3) {
// 			result = true;
//             scorePlayerLeftElement.textContent = "Win";
//             scorePlayerRightElement.textContent = "Lose";
// 			// console.log('Normalement true:', result);
//         } else {
// 			result = false;
//             scorePlayerLeftElement.textContent = "Lose";
//             scorePlayerRightElement.textContent = "Win";
// 			// console.log('Normalement false:', result);
//         }
//         gameStarted = false;
// 		fetch('/game/', {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json',
// 				'X-CSRFToken': Get_Cookie('csrftoken')
// 			},
// 			body: JSON.stringify({
// 				'result': result
// 			})
// 		})
// 		.then(response => response.json())
// 		.then(data => {
// 			if (data.success) {
// 				document.getElementById('infoco').innerHTML = data.message

// 				const nbWinElement = document.getElementById('nbWin');
//                 const nbLoseElement = document.getElementById('nbLose');
				
// 				nbWinElement.textContent = data.nb_win;
//         		nbLoseElement.textContent = data.nb_lose;
// 				showSuccessModal()
// 			}
// 		})
// 		.catch(error => {
// 			console.error('Erreur:', error);
// 		});
// 		setTimeout(resetGame, 3000);
//     }
// }

// function gameLoop() {
// 	// resetBall();
// 	if (gameStarted === true) {	
// 		movePaddings();
// 		moveBall(); ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// remove that
// 		requestAnimationFrame(gameLoop);
// 	}
// }

// function startGame(mode) {
// 	gameStarted = true;
// 	mainMenu.style.display = 'none';
// 	// PVPMenu.style.display = 'none';    cursor: pointer;
//     if (mode === 'player-vs-ia') {
// 		difficultyMenu.style.display = 'flex';
//     } else if (mode === 'player-vs-player') {
// 		difficulty = 0;
// 		pvp_mode = 0;
// 		// PVPMenu.style.display = 'flex';
//         // startPlayerVsPlayer();
//     }
// }

// function startPlayerVsIA() {
//     if (difficulty === 1) {
// 		paddingRight.style.transition = '0.5s linear';
// 	}
// 	else if (difficulty === 2) {
// 		paddingRight.style.transition = '0.3s linear';
// 	}
// 	else if (difficulty === 3) {
// 		paddingRight.style.transition = '0.15s linear';
// 	}
// 	difficultyMenu.style.display = 'none';
// 	// console.log("Starting Player vs IA mxode");
// 	gameMode = 1;
//     gameLoop();
// }

// function startPlayerVsPlayer() {
// 	// playersSelection(pvp_mode);
// 	// PVPMenu.style.display = 'none';
// 	gameMode = 0;
// 	paddingRight.style.transition = '0.06s linear';
//     gameLoop();
// }

// // ------------------------------- button events -------------------------------

// // playerVsIaButton.addEventListener('click', () => startGame('player-vs-ia'));
// // playerVsPlayerButton.addEventListener('click', () => startGame('player-vs-player'));
// PVP1v1Button.addEventListener('click', () => {console.log("test"); pvp_mode = 1; startGame('player-vs-player'); startPlayerVsPlayer();});
// PVP2v2Button.addEventListener('click', () => {pvp_mode = 2; startGame('player-vs-player'), startPlayerVsPlayer();});
// tournamentButton.addEventListener('click', () => {pvp_mode = 3; startGame('player-vs-player'), startPlayerVsPlayer();});
// // easyButton.addEventListener('click', () => {difficulty = 1; startPlayerVsIA();});
// // mediumButton.addEventListener('click', () => {difficulty = 2; startPlayerVsIA();});
// // hardButton.addEventListener('click', () => {difficulty = 3; startPlayerVsIA();});

// });



/*
  online viewer             pong game                    online chat
 ____________   __________________________________   _________________
|            | |u1 | 0                      0 |u2 | |                 |
|user1:      | |___|__________________________|___| |                 |
|    online  | |                                  | |                 |
|user2:      | |                                  | |                 |
|    offline | |                                  | |                 |
|            | |                                  | |                 |
|            | |                                  | |user1: hi!       |
|            | |                                  | |user2: hello!    |
|            | |                                  | |                 |
|            | |                                  | |                 |
|            | |                                  | |                 |
|            | |                                  | |                 |
|            | |                                  | |_________________|
|            | |                                  | |user:>_          |
|____________| |__________________________________| |_________________|




player vs AI
	┣━ easy : {actualPlayer:AI_easy}
	┣━ medium : {actualPlayer:AI_medium}
	┗━ hard : {actualPlayer:AI_hard}
player vs player
	┣━ local
	┃	┗━ 1v1
	┗━ online
		┣━ 1v1
		┃	┗━ host game
		┣━ 2v2
		┃	┗━ host game
		┣━ tournament
		┃	┗━ host game
		┗━ Join game

game code = random(10000000, 99999999)

function hostGame() {
	***
	***
	***
	***
	return (random(10000000, 99999999));
}

function joinGame(code) {
	for (let i = 0; i < gamescodes.length; i++) {
		if (code == gamescodes[i])
			return ("game found, conneting...");
	}
}
if ()














// document.addEventListener("DOMContentLoaded", function() {
// const paddingLeft = document.querySelector('.padding-left');
// const paddingRight = document.querySelector('.padding-right');
// const ball = document.querySelector('.ball');

// const playerVsIaButton = document.getElementById('player-vs-ia');
// const playerVsPlayerButton = document.getElementById('player-vs-player');

// const mainMenu = document.getElementById('main-menu');
// const difficultyMenu = document.getElementById('difficulty-menu');
// const PVPMenu = document.getElementById('pvp-menu');

// const easyButton = document.getElementById('easy');
// const mediumButton = document.getElementById('medium');
// const hardButton = document.getElementById('hard');
// const PVP1v1Button = document.getElementById('pvp_1v1');
// const PVP2v2Button = document.getElementById('pvp_2v2');
// const tournamentButton = document.getElementById('tournament');

// const scorePlayerLeftElement = document.getElementById('score-player-left');
// const scorePlayerRightElement = document.getElementById('score-player-right');
	
// let ballTop = parseInt(window.getComputedStyle(ball).top);
// let ballLeft = parseInt(window.getComputedStyle(ball).left);
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

// let scorePlayer1 = 0;
// let scorePlayer2 = 0;
// let scorePlayer3 = 0;
// let scorePlayer4 = 0;

// let pvp_mode = 0; //1v1 = 1; 2v2 = 2; tournament = 3;
// let player1_id = null;
// let player2_id = null;
// let player3_id = null;
// let player4_id = null;
// let left_player = null;
// let right_player = null;
// let whoFight = [null, null]; // first is for the player at the left, second for the player at the right
// /* 
// 	tournament
// 	2 v 2
// 	1 v 1
// */

// // console.log("Test");

// const keyPressed = {};

// document.addEventListener("keydown", (e) => {
// 	keyPressed[e.key] = true;
// });

// document.addEventListener("keyup", (e) => {
// 	keyPressed[e.key] = false;
// });

// function movePaddings() {
// 	if (keyPressed['s']) {
// 		if (parseInt(window.getComputedStyle(paddingLeft).top) + 30 < 510)
// 			paddingLeft.style.top = (parseInt(window.getComputedStyle(paddingLeft).top) + 30) + "px";
// 		else
// 			paddingLeft.style.top = 510 + "px";
// 	} if (keyPressed['w']) {
// 		if (parseInt(window.getComputedStyle(paddingLeft).top) - 30 > 80)
// 			paddingLeft.style.top = (parseInt(window.getComputedStyle(paddingLeft).top) - 30) + "px";
// 		else
// 			paddingLeft.style.top = 80 + "px";
// 	} if (gameMode === 0) {
// 		if (keyPressed['l']) {
// 			if (parseInt(window.getComputedStyle(paddingRight).top) + 30 < 510)
// 				paddingRight.style.top = (parseInt(window.getComputedStyle(paddingRight).top) + 30) + "px";
// 			else
// 				paddingRight.style.top = 510 + "px";
// 		} if (keyPressed['o']) {
// 			if (parseInt(window.getComputedStyle(paddingRight).top) - 30 > 80)
// 				paddingRight.style.top = (parseInt(window.getComputedStyle(paddingRight).top) - 30) + "px";
// 			else
// 				paddingRight.style.top = 80 + "px";
// 		}
// 	}
// }


// function resetBall() {
// 	ball.style.top = ballTopOriginal + "px";
// 	ball.style.left = ballLeftOriginal + "px";
// 	ballTop = parseInt(window.getComputedStyle(ball).top);
// 	ballLeft = parseInt(window.getComputedStyle(ball).left);

// 	directionX = Math.random() < 0.5 ? 1 : -1;
// 	directionY = Math.random() < 0.5 ? 1 : -1;
// 	speed = 2;
// 	paddingLeft.style.top = paddingLeftOriginalTop + "px";
// 	paddingRight.style.top = paddingRightOriginalTop + "px";

// 	console.log("paddingLeft top:", paddingLeft.style.top);
// 	console.log("paddingRight top:", paddingRight.style.top);
// 	updateScore();
// }

// function resetGame() {
//     scorePlayer1 = 0;
//     scorePlayer2 = 0;
//     updateScore();
// 	gameStarted = false;
//     mainMenu.style.display = 'flex';
// 	resetBall();
// }

// let lastPaddingLeftTop = parseInt(window.getComputedStyle(paddingLeft).top);
// let lastPaddingRightTop = parseInt(window.getComputedStyle(paddingRight).top);

// function moveBall() {
//     ballTop += speed * directionY;
//     ballLeft += speed * directionX;

// 	if (gameMode === 1) {
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
// 	}
//     if (ballTop <= ball.offsetHeight / 2 || ballTop >= 600 - ball.offsetHeight) {
//         directionY *= -1;
//     }
//     if (ballLeft <= 0) {
//         scorePlayer2 += 1; // Player 2 scores
//         resetBall(); // Reset ball position
//     }
//     if (ballLeft >= 700 - ball.offsetWidth) {
//         scorePlayer1 += 1; // Player 1 scores
//         resetBall(); // Reset ball position
//     }

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
//         directionX = 1;
//         if (paddingLeftMovingUp && directionY > 0) {
//             directionY *= -1;
//             speed = Math.max(speed - 1, 2); // Decrease speed but not below 2
//         } else if (paddingLeftMovingDown && directionY < 0) {
//             if (speed < 10)
// 				speed += 1;
// 			if (speed > 10)
// 				speed = 10;
//         }
//         if (speed < 10) {
//             speed += 0.1;
//         }
//     }

//     if (ballRect.right >= paddingRightRect.left && ballRect.left <= paddingRightRect.right && ballRect.top <= paddingRightRect.bottom && ballRect.bottom >= paddingRightRect.top) {
//         directionX = -1;
//         if (paddingRightMovingUp && directionY > 0) {
//             directionY *= -1;
//             speed = Math.max(speed - 1, 2); // Decrease speed but not below 2
//         } else if (paddingRightMovingDown && directionY < 0) {
//             if (speed < 10)
// 				speed += 1;
// 			if (speed > 10)
// 				speed = 10;
//         }
//         if (speed < 10) {
//             speed += 0.1;
//         }
//     }
// 	console.log(speed);

//     lastPaddingLeftTop = currentPaddingLeftTop;
//     lastPaddingRightTop = currentPaddingRightTop;

//     ball.style.top = ballTop + 'px';
//     ball.style.left = ballLeft + 'px';
// }

// function updateScore() {
//     scorePlayerLeftElement.textContent = scorePlayer1;
//     scorePlayerRightElement.textContent = scorePlayer2;
// 	checkWin();
// }

// function checkWin() {
//     if (scorePlayer1 >= 3 || scorePlayer2 >= 3) {
// 		let result = false;
//         if (scorePlayer1 >= 3) {
// 			result = true;
//             scorePlayerLeftElement.textContent = "Win";
//             scorePlayerRightElement.textContent = "Lose";
// 			console.log('Normalement true:', result);
//         } else {
// 			result = false;
//             scorePlayerLeftElement.textContent = "Lose";
//             scorePlayerRightElement.textContent = "Win";
// 			console.log('Normalement false:', result);
//         }
//         gameStarted = false;
// 		fetch('/game/', {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json',
// 				'X-CSRFToken': Get_Cookie('csrftoken')
// 			},
// 			body: JSON.stringify({
// 				'result': result
// 			})
// 		})
// 		.then(response => response.json())
// 		.then(data => {
// 			if (data.success) {
// 				document.getElementById('infoco').innerHTML = data.message

// 				const nbWinElement = document.getElementById('nbWin');
//                 const nbLoseElement = document.getElementById('nbLose');

// 				nbWinElement.textContent = data.nb_win;
//         		nbLoseElement.textContent = data.nb_lose;
// 				showSuccessModal()
// 			}
// 		})
// 		.catch(error => {
// 			console.error('Erreur:', error);
// 		});
// 		setTimeout(resetGame, 3000);
//     }
// }

// function gameLoop() {
// 	// resetBall();
// 	if (gameStarted === true) {	
// 		movePaddings();
// 		moveBall();
// 		requestAnimationFrame(gameLoop);
// 	}
// }

// function startGame(mode) {
//     gameStarted = true;
// 	mainMenu.style.display = 'none';
// 	PVPMenu.style.display = 'none';
//     if (mode === 'player-vs-ia') {
// 		difficultyMenu.style.display = 'flex';
//     } else if (mode === 'player-vs-player') {
// 		difficulty = 0;
// 		pvp_mode = 0;
// 		PVPMenu.style.display = 'flex';
//         // startPlayerVsPlayer();
//     }
// }

// function startPlayerVsIA() {
//     if (difficulty === 1) {
// 		paddingRight.style.transition = '0.5s linear';
// 	}
// 	else if (difficulty === 2) {
// 		paddingRight.style.transition = '0.3s linear';
// 	}
// 	else if (difficulty === 3) {
// 		paddingRight.style.transition = '0.15s linear';
// 	}
// 	difficultyMenu.style.display = 'none';
// 	// console.log("Starting Player vs IA mxode");
// 	gameMode = 1;
//     gameLoop();
// }

// function playersSelection(mode) {
	
// }

// function startPlayerVsPlayer() {
// 	playersSelection(pvp_mode);
// 	PVPMenu.style.display = 'none';
// 	gameMode = 0;
// 	paddingRight.style.transition = '0.06s linear';
//     // gameLoop();
// }





// playerVsIaButton.addEventListener('click', () => startGame('player-vs-ia'));
// playerVsPlayerButton.addEventListener('click', () => startGame('player-vs-player'));
// PVP1v1Button.addEventListener('click', () => {pvp_mode = 1; startPlayerVsPlayer();});
// PVP2v2Button.addEventListener('click', () => {pvp_mode = 2; startPlayerVsPlayer();});
// tournamentButton.addEventListener('click', () => {pvp_mode = 3; startPlayerVsPlayer();});
// easyButton.addEventListener('click', () => {difficulty = 1; startPlayerVsIA();});
// mediumButton.addEventListener('click', () => {difficulty = 2; startPlayerVsIA();});
// hardButton.addEventListener('click', () => {difficulty = 3; startPlayerVsIA();});
// }); */