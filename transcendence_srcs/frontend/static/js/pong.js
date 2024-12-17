export function initAll(invite_bool, invite_username) {
	const PaddingLeft = document.getElementById('left-paddle');
	const PaddingRight = document.getElementById('right-paddle');
	const Ball = document.getElementById('ball');
	const Delimiter = document.getElementById('delimiter');
	const counterElement = document.getElementById('counter');
	const RoomHostInfo = document.getElementById('Host');
	const RoomUserInviteInfo = document.getElementById('UserInvite');
	const RoomWait = document.getElementById('wait');
	const RoomUser1Info = document.getElementById('User1');
	const RoomUser2Info = document.getElementById('User2');
	const RoomUser3Info = document.getElementById('User3');
	const Ltips = document.getElementById('tips1');
	const Rtips = document.getElementById('tips2');

	const PVP1v1Button = document.getElementById('HostGame1v1Button');
	const PVP2v2Button = document.getElementById('HostGame2v2Button');
	const TournamentButton = document.getElementById('HostTournamentButton');
	const PVPStartButton = document.getElementById('StartGame');
	const PVAButton = document.getElementById('AIButton');
	const PvAIeasyButton = document.getElementById('AIEasyButton');
	const PvAImediumButton = document.getElementById('AIMediumButton');
	const PvAIhardButton = document.getElementById('AIHardButton');
	const BackToMainMenuButton = document.getElementById('BackMainMenuButton');
	const OptnButton = document.getElementById('OptnButton');
	const ReadyButton = document.getElementById('ready');
	const NextButton = document.getElementById('NextButton');
	const PlayAgainButton = document.getElementById('PlayAgain');

	const MainMenu = document.getElementById('main-menu');
	const AIMenu = document.getElementById('AIMenu');
	const RoomMenu = document.getElementById('Room');
	const OptnMenu = document.getElementById('OptnMenu');

	const ScorePlayerLeftElement = document.getElementById('LeftPlayerScore');
	const LeftPlayerUserNameContent = document.getElementById('LeftPlayerName');
	const leftUserIcon = document.getElementById('leftUserIcon');

	const ScorePlayerRightElement = document.getElementById('RightPlayerScore');
	const RightPlayerUserNameContent = document.getElementById('RightPlayerName');
	const rightUserIcon = document.getElementById('rightUserIcon');

	const RoomHostName = document.getElementById('HostName');
	const HostUserIcon = document.getElementById('hostUserIcon');
	let HostUserNameVar = null;


	const RoomUser1Name = document.getElementById('User1Name');
	const Player1SearchButton = document.getElementById('User1Search');
	const User1SearchBox = document.getElementById('User1SearchBox');
	const User1Icon = document.getElementById('user1Icon');
	let User1UserNameVar = null;


	const RoomUser2Name = document.getElementById('User2Name');
	const Player2SearchButton = document.getElementById('User2Search');
	const User2SearchBox = document.getElementById('User2SearchBox');
	const User2Icon = document.getElementById('user2Icon');
	let User2UserNameVar = null;


	const RoomUser3Name = document.getElementById('User3Name');
	const Player3SearchButton = document.getElementById('User3Search');
	const User3SearchBox = document.getElementById('User3SearchBox');
	const User3Icon = document.getElementById('user3Icon');
	let User3UserNameVar = null;

	const WinnerIcon = document.getElementById('WinnerIcon');

	const keyPressed = {};

	let gameStarted = false;
	let darkMode = false;
	let AIDifficulty = "none"; // none, easy, medium, hard
	let PVPMode = "none"; // none, 1vs1, 2vs2, Tournament
	let round = null;
	let fight = [null, null]; // [left_user, right_user]
	let ballDirectionX = Math.random() < 0.5 ? -1 : 1; // Random initial direction
	let ballDirectionY = Math.random() < 0.5 ? -1 : 1; // Random initial direction
	let ballSpeed = 6;

	let scoreleftplayer = 0, scorerightplayer = 0, redTeamScore = 0, blueTeamScore = 0;

	let tournamentWinnerRound1 = null;
	let tournamentWinnerRound1Icon = null;
	let tournamentWinnerRound2 = null;
	let tournamentWinnerRound2Icon = null;

	//////////////////////////////////////////////////////////////////////////////////
	////                             functions                                    ///
	////////////////////////////////////////////////////////////////////////////////

	function setHostImage(value) {if (value === null) {HostUserIcon.src = '/media/avatars/DefaultIcon.png';}else {HostUserIcon.src = value;}}
	function setUser1Image(value) {if (value === null) {User1Icon.src = '/media/avatars/DefaultIcon.png';}else {User1Icon.src = value;}}
	function setUser2Image(value) {if (value === null) {User2Icon.src = '/media/avatars/DefaultIcon.png';}else {User2Icon.src = value;}}
	function setUser3Image(value) {if (value === null) {User3Icon.src = '/media/avatars/DefaultIcon.png';}else {User3Icon.src = value;}}
	function setWinnerIcon(value) {if (value === null) {WinnerIcon.src = '/media/avatars/DefaultIcon.png';}else {WinnerIcon.src = value;}}
	function setUser1UserName(value) {if (value === null) {User1UserNameVar = null;RoomUser1Name.textContent = '...';} else {User1UserNameVar = value;RoomUser1Name.textContent = value;}}
	function setUser2UserName(value) {if (value === null) {User2UserNameVar = null;RoomUser2Name.textContent = '...';} else {User2UserNameVar = value;RoomUser2Name.textContent = value;}}
	function setUser3UserName(value) {if (value === null) {User3UserNameVar = null;RoomUser3Name.textContent = '...';}else {User3UserNameVar = value;RoomUser3Name.textContent = value;}}
	function resetFight() {fight = [null, null];}
	function hideOptnMenu() {OptnMenu.style.bottom = '-650px';}
	function ToggleOptnMenu() {if (OptnMenu.style.bottom === '-650px') {OptnMenu.style.bottom = '-200px';} else {OptnMenu.style.bottom = '-650px';}}
	function addPoint(side) {if (side === 'left') {scoreleftplayer++;ScorePlayerLeftElement.textContent = scoreleftplayer;}else if (side === 'right') {scorerightplayer++;ScorePlayerRightElement.textContent = scorerightplayer;}}
	function setHostUserName() {
		let UserIcon;
		fetch('/api/find-hostname/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': Get_Cookie('csrftoken')
			}
		})
		.then(response => response.json())
		.then(data => {
			if (data.user) {
				UserIcon = data.userIcon;
				HostUserNameVar = data.user;
				RoomHostName.textContent = data.user;
				setHostImage(UserIcon);
			} else {
				console.error('Error:', data.error);
			}
		})
	}

	function searchUser(username, user_id) {
		let UserName;
		let UserIcon;
		fetch('/api/find-username/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': Get_Cookie('csrftoken')
			},
			body: JSON.stringify({
				'username': username 
			})
		})
		.then(response => response.json())
		.then(data => {
			UserName = data.user;
			UserIcon = data.userIcon;
			if (UserName === undefined || UserName === null) {
				alert('User not found');
				return ;
			}
			if (UserName!== User1UserNameVar && UserName !== User2UserNameVar && UserName !== User3UserNameVar && UserName !== HostUserNameVar) {
				if (user_id == 'user1') {
					setUser1UserName(UserName);
					setUser1Image(UserIcon);
					return ;
				}
				else if (user_id == 'user2') {
					setUser2UserName(UserName);
					setUser2Image(UserIcon);
					return ;
				}
				else if (user_id == 'user3') {
					setUser3UserName(UserName);
					setUser3Image(UserIcon);
					return ;
				}
			}
			alert('User already in the room');
		})
		.catch(error => {
			console.error('Erreur:', error);
		});
		return;
	}

	function Get_Cookie(name) {
		let new_name = name + "=";
		let tab = decodeURIComponent(document.cookie).split(';');
		for (let i = 0; i < tab.length; i++) {
			let cookie = tab[i].trim();
			if (cookie.indexOf(new_name) == 0)
				return (cookie.substring(new_name.length, cookie.length))
		}
		return null
	}

	function setFight(value1, value2) {
		fight[0] = value1;fight[1] = value2;
		if (value1 === null || value2 === null) {
			console.error('Fatal Error: player not initialised!');changeMenu('MainMenu');resetAllData();return ;}
		LeftPlayerUserNameContent.textContent = value1;
		RightPlayerUserNameContent.textContent = value2;
	}

	function setFightIcons(value1, value2) {
		if (value1 === null) {leftUserIcon.src = '/media/avatars/DefaultIcon.png';}
		else {leftUserIcon.src = value1;}
		if (value2 === null) {rightUserIcon.src = '/media/avatars/DefaultIcon.png';}
		else {rightUserIcon.src = value2;}
	}

	function AnimationMainMenu(mode) {
		if (mode === 'in') {PVAButton.style.left = '0%';PVP1v1Button.style.right = '0%';PVP2v2Button.style.left = '0%';TournamentButton.style.right = '0%';}
		else {PVAButton.style.left = '100%';PVP1v1Button.style.right = '100%';PVP2v2Button.style.left = '100%';TournamentButton.style.right = '100%';}
	}

	function AnimationAIMenu(mode) {
		if (mode === 'in') {PvAIeasyButton.style.left = '0%';PvAImediumButton.style.right = '0%';PvAIhardButton.style.left = '0%';AIMenu.style.pointerEvents = 'auto';}
		else {PvAIeasyButton.style.left = '100%';PvAImediumButton.style.right = '100%';PvAIhardButton.style.left = '100%';AIMenu.style.pointerEvents = 'none';}
	}

	function changeMenu(menu) {
		hideOptnMenu();
		AnimationAIMenu('out');
		AnimationMainMenu('out');
		document.getElementById('EndGameMenu').style.display = 'none';
		Rtips.style.display = 'none';
		Ltips.style.display = 'none';
		Ball.style.display = 'none';
		PaddingLeft.style.display = 'none';
		PaddingRight.style.display = 'none';
		Delimiter.style.display = 'none';
		RoomMenu.style.display = 'none';
		ReadyButton.style.display = 'none';
		counterElement.style.display = 'none';
		if (menu === 'MainMenu') {AnimationMainMenu('in');resetAllData();
		} else if (menu === 'AIMenu') {document.getElementById('EndGameMenu').style.display = 'none';AnimationAIMenu('in');
		} else if (menu === 'RoomMenu') {
			RoomHostInfo.style.backgroundColor = 'lightgrey';
			RoomUser1Info.style.backgroundColor = 'lightgrey';
			RoomUser2Info.style.backgroundColor = 'lightgrey';
			RoomUser3Info.style.backgroundColor = 'lightgrey';
			RoomHostInfo.style.display = 'block';
			RoomUser1Info.style.display = 'block';
			RoomUser2Info.style.display = 'block';
			RoomUser3Info.style.display = 'block';
			RoomMenu.style.display = 'flex';
			if (PVPMode === '1vs1') {
				RoomUser2Info.style.display = 'none';
				RoomUser3Info.style.display = 'none';
			} else if (PVPMode === '2vs2') {
				RoomHostInfo.style.backgroundColor = 'red';
				RoomUser1Info.style.backgroundColor = 'red';
				RoomUser2Info.style.backgroundColor = 'blue';
				RoomUser3Info.style.backgroundColor = 'blue';
			} else if (PVPMode === 'Tournament') {} 
		} else if (menu === 'Game') {
			Ball.style.display = 'block';
			PaddingLeft.style.display = 'block';
			PaddingRight.style.display = 'block';
			Delimiter.style.display = 'block';
			ReadyButton.style.display = 'block';
			defineWhoFight();
		} else if (menu === 'endGameMenu') {document.getElementById('EndGameMenu').style.display = 'block';}
		else
			console.error('Menu not found');
	}

	function resetAllData() {
		gameStarted = false;
		AIDifficulty = "none";
		PVPMode = "none";
		ballSpeed = 6;
		OptnMenu.style.bottom = '-650px';
		PaddingLeft.style.top = '50%';
		PaddingRight.style.top = '50%';
		Ball.style.left = '50%';
		Ball.style.top = '50%';
		scoreleftplayer = 0;
		scorerightplayer = 0;
		ScorePlayerLeftElement.textContent = scoreleftplayer;
		ScorePlayerRightElement.textContent = scorerightplayer;
		redTeamScore = 0;
		blueTeamScore = 0;
		tournamentWinnerRound1 = null;
		tournamentWinnerRound2 = null;
		tournamentWinnerRound1Icon = null;
		tournamentWinnerRound2Icon = null;
		LeftPlayerUserNameContent.textContent = '...';
		RightPlayerUserNameContent.textContent = '...';
		leftUserIcon.src = '/media/avatars/DefaultIcon.png';
		rightUserIcon.src = '/media/avatars/DefaultIcon.png';
		WinnerIcon.src = '/media/avatars/DefaultIcon.png';
		round = 0;
		if (PVPMode !== 'none') {PaddingRight.style.transition = '0.06s linear';}
		setHostUserName(); ///////////////////////
		setUser1UserName(null); ////////////
		setUser1Image(null);
		setUser2UserName(null); ////////////
		setUser2Image(null);
		setUser3UserName(null); ////////////
		setUser3Image(null);
		resetFight();
	}

	function softReset() {
		PaddingLeft.style.top = '50%';
		PaddingRight.style.top = '50%';
		Ball.style.left = '50%';
		Ball.style.top = '50%';
		ballSpeed = 6;
		ballDirectionX = Math.random() < 0.5 ? -1 : 1;
		ballDirectionY = Math.random() < 0.5 ? -1 : 1;
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
				if (callback) {callback();}
			}
		}, 1000);
	}

	function startGame() {
		counter(() => {
			gameStarted = true;
			if (PVPMode === 'none') {Rtips.style.display = 'none';Ltips.style.display = 'block';} else {Ltips.style.display = 'block';Rtips.style.display = 'block';}
			gameLoop();
		});
	}

	function playAgain() {
		scoreleftplayer = 0;
		scorerightplayer = 0;
		ScorePlayerLeftElement.textContent = scoreleftplayer;
		ScorePlayerRightElement.textContent = scorerightplayer;
		round = 0;
		softReset();
	}

	function updateScore(winner, loser, winnerScore, loserScore, isTournament) {
		console.log('UpdateScoreTests [', 'winner:', winner, 'loser:', loser, 'winnerScore:', winnerScore, 'loserScore:', loserScore, 'isTournament:', isTournament, ']');
		fetch('/api/update-score/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': Get_Cookie('csrftoken')
			},
			body: JSON.stringify({
				'winner': winner,
				'loser': loser,
				'winnerScore': winnerScore,
				'loserScore': loserScore,
				'isTournament': isTournament
			})
		})
		.catch(error => {
			console.error('Erreur:', error);
		});
	}
	
	function checkWin() {
		WinnerIcon.style.backgroundColor = 'transparent';
		document.getElementById("Draw").style.display = "none";
		document.getElementById("WinnerName").style.display = "block";
		document.getElementById("WinnerIcon").style.display = "block";
		if (scoreleftplayer === 3 || scorerightplayer === 3) {
			softReset();
			gameStarted = false;
			if (PVPMode === 'none' || PVPMode === '1vs1') {
				changeMenu("endGameMenu");
				NextButton.style.display = 'none';
				PlayAgainButton.style.display = 'block';
				if (scoreleftplayer === 3) {
					setWinnerIcon(leftUserIcon.src);
					document.getElementById("WinnerName").textContent = LeftPlayerUserNameContent.textContent;
					updateScore(LeftPlayerUserNameContent.textContent, RightPlayerUserNameContent.textContent, scoreleftplayer, scorerightplayer, false);
					
					// if (PVPMode === 'none') {
					// 	updateScore(LeftPlayerUserNameContent.textContent, RightPlayerUserNameContent.textContent, scoreleftplayer, scorerightplayer, false);
					// } else if (PVPMode !== 'none') {
					// 	updateScore(LeftPlayerUserNameContent.textContent, RightPlayerUserNameContent.textContent, scoreleftplayer, scorerightplayer, false);
					// }
				}
				else if (scorerightplayer === 3) {
					document.getElementById("WinnerName").textContent = RightPlayerUserNameContent.textContent;
					setWinnerIcon(rightUserIcon.src);
					// if (PVPMode === 'none') {
					// 	setWinnerIcon('/media/avatars/Bot.png');
					// 	// document.getElementById("WinnerName").textContent = RightPlayerUserNameContent.textContent;
					// 	// updateScore('loose', RightPlayerUserNameContent.textContent); ////////////
					// }
					// else {
					// 	// updateScore('win', RightPlayerUserNameContent.textContent); ///////////
					// 	// updateScore('loose', LeftPlayerUserNameContent.textContent); ///////////////
					// }
					updateScore(RightPlayerUserNameContent.textContent, LeftPlayerUserNameContent.textContent, scorerightplayer, scoreleftplayer, false);
				}
			}
			else if (PVPMode === '2vs2') {
				changeMenu("endGameMenu");
				if (round === 0) {
					NextButton.style.display = 'block';
					PlayAgainButton.style.display = 'none';
					if (scoreleftplayer === 3) {
						setWinnerIcon(leftUserIcon.src);
						updateScore(LeftPlayerUserNameContent.textContent, RightPlayerUserNameContent.textContent, scoreleftplayer, scorerightplayer, false);
						redTeamScore++;
						document.getElementById("WinnerName").textContent = LeftPlayerUserNameContent.textContent;
					}
					else if (scorerightplayer === 3) {
						setWinnerIcon(rightUserIcon.src);
						updateScore(RightPlayerUserNameContent.textContent, LeftPlayerUserNameContent.textContent, scorerightplayer, scoreleftplayer, false);
						blueTeamScore++;
						document.getElementById("WinnerName").textContent = RightPlayerUserNameContent.textContent;
					}
				} else if (round === 1) {
					if (scoreleftplayer === 3) {
						setWinnerIcon(leftUserIcon.src);
						redTeamScore++;
						updateScore(LeftPlayerUserNameContent.textContent, RightPlayerUserNameContent.textContent, scoreleftplayer, scorerightplayer, false);
						document.getElementById("WinnerName").textContent = LeftPlayerUserNameContent.textContent;
					}
					else if (scorerightplayer === 3) {
						setWinnerIcon(rightUserIcon.src);
						updateScore(RightPlayerUserNameContent.textContent, LeftPlayerUserNameContent.textContent, scorerightplayer, scoreleftplayer, false);
						blueTeamScore++;
						document.getElementById("WinnerName").textContent = RightPlayerUserNameContent.textContent;
					}
					if (redTeamScore > blueTeamScore) {
						WinnerIcon.style.backgroundColor = 'red';
						document.getElementById("WinnerName").textContent = HostUserNameVar + " " + User1UserNameVar;
					}
					else if (redTeamScore < blueTeamScore) {
						WinnerIcon.style.backgroundColor = 'blue';
						document.getElementById("WinnerName").textContent = User2UserNameVar + " " + User3UserNameVar;
					}
					else {
						document.getElementById("WinnerName").style.display = "none";
						document.getElementById("Draw").style.display = "block";
					}

					NextButton.style.display = 'none';
					PlayAgainButton.style.display = 'block';
				}
			} else if (PVPMode === 'Tournament') {
				changeMenu("endGameMenu");
				if (round === 0) {
					NextButton.style.display = 'block';
					PlayAgainButton.style.display = 'none';
					if (scoreleftplayer === 3) {
						document.getElementById("WinnerName").textContent = LeftPlayerUserNameContent.textContent;
						tournamentWinnerRound1 = LeftPlayerUserNameContent.textContent;
						tournamentWinnerRound1Icon = leftUserIcon.src;
						updateScore(LeftPlayerUserNameContent.textContent, RightPlayerUserNameContent.textContent, scoreleftplayer, scorerightplayer, true);
						setWinnerIcon(leftUserIcon.src);
					} else if (scorerightplayer === 3) {
						document.getElementById("WinnerName").textContent = RightPlayerUserNameContent.textContent;
						tournamentWinnerRound1 = RightPlayerUserNameContent.textContent;
						tournamentWinnerRound1Icon = rightUserIcon.src;
						setWinnerIcon(rightUserIcon.src);
						updateScore(RightPlayerUserNameContent.textContent, LeftPlayerUserNameContent.textContent, scorerightplayer, scoreleftplayer, true);
					}
				} else if (round === 1) {
					NextButton.style.display = 'block';
					PlayAgainButton.style.display = 'none';
					if (scoreleftplayer === 3) {
						document.getElementById("WinnerName").textContent = LeftPlayerUserNameContent.textContent;
						tournamentWinnerRound2 = LeftPlayerUserNameContent.textContent;
						tournamentWinnerRound2Icon = leftUserIcon.src;
						setWinnerIcon(leftUserIcon.src);
						updateScore(LeftPlayerUserNameContent.textContent, RightPlayerUserNameContent.textContent, scoreleftplayer, scorerightplayer, true);
					}
					else if (scorerightplayer === 3) {
						document.getElementById("WinnerName").textContent = RightPlayerUserNameContent.textContent;
						tournamentWinnerRound2 = RightPlayerUserNameContent.textContent;
						tournamentWinnerRound2Icon = rightUserIcon.src;
						setWinnerIcon(rightUserIcon.src);
						updateScore(RightPlayerUserNameContent.textContent, LeftPlayerUserNameContent.textContent, scorerightplayer, scoreleftplayer, true);
					}
				} else if (round === 2) {
					if (scoreleftplayer === 3) {
						document.getElementById("WinnerName").textContent = LeftPlayerUserNameContent.textContent;
						tournamentWinnerRound2 = LeftPlayerUserNameContent.textContent;
						tournamentWinnerRound2Icon = leftUserIcon.src;
						setWinnerIcon(leftUserIcon.src);
						updateScore(LeftPlayerUserNameContent.textContent, RightPlayerUserNameContent.textContent, scoreleftplayer, scorerightplayer, true);
					}
					else if (scorerightplayer === 3) {
						document.getElementById("WinnerName").textContent = RightPlayerUserNameContent.textContent;
						tournamentWinnerRound2 = RightPlayerUserNameContent.textContent;
						tournamentWinnerRound2Icon = rightUserIcon.src;
						setWinnerIcon(rightUserIcon.src);
						updateScore(RightPlayerUserNameContent.textContent, LeftPlayerUserNameContent.textContent, scorerightplayer, scoreleftplayer, true);
					}
					NextButton.style.display = 'none';
					PlayAgainButton.style.display = 'block';
				}
			}
		}
	}

	function gameLoop() {
		if (gameStarted === true) {	
			movePaddings();
			moveBall();
			defineWhoFight();
			checkWin();
			requestAnimationFrame(gameLoop);
		}
	}

	function defineWhoFight() {
		if (PVPMode === 'none') {setFight(HostUserNameVar, 'AI');setFightIcons(HostUserIcon.src, '/media/avatars/Bot.png');}
		else if (PVPMode === '1vs1') {setFight(HostUserNameVar, User1UserNameVar);setFightIcons(HostUserIcon.src, User1Icon.src);}
		else if (PVPMode === '2vs2') {
			if (round === 0) {setFight(HostUserNameVar, User2UserNameVar);setFightIcons(HostUserIcon.src, User2Icon.src);}
			else if (round === 1) {setFight(User1UserNameVar, User3UserNameVar);setFightIcons(User1Icon.src, User3Icon.src);}
		} else if (PVPMode === 'Tournament') {
			if (round === 0) {setFight(HostUserNameVar, User1UserNameVar);setFightIcons(HostUserIcon.src, User1Icon.src);}
			else if (round === 1) {setFight(User2UserNameVar, User3UserNameVar);setFightIcons(User2Icon.src, User3Icon.src);}
			else if (round === 2) {setFight(tournamentWinnerRound1, tournamentWinnerRound2);setFightIcons(tournamentWinnerRound1Icon, tournamentWinnerRound2Icon);}
		}
	}

	function movePaddings() {
		if (keyPressed['s']) {
			if (parseInt(window.getComputedStyle(PaddingLeft).top) + 30 < 314) {PaddingLeft.style.top = (parseInt(window.getComputedStyle(PaddingLeft).top) + 30) + "px";}
			else {PaddingLeft.style.top = 314 + "px";}
		} if (keyPressed['w']) {
			if (parseInt(window.getComputedStyle(PaddingLeft).top) - 30 > 80) {PaddingLeft.style.top = (parseInt(window.getComputedStyle(PaddingLeft).top) - 30) + "px";}
			else{PaddingLeft.style.top = 80 + "px";}
		} if (PVPMode !== 'none') {
			if (keyPressed['ArrowDown']) {
				if (parseInt(window.getComputedStyle(PaddingRight).top) + 30 < 314) {PaddingRight.style.top = (parseInt(window.getComputedStyle(PaddingRight).top) + 30) + "px";}
				else {PaddingRight.style.top = 314 + "px";}
			} if (keyPressed['ArrowUp']) {
				if (parseInt(window.getComputedStyle(PaddingRight).top) - 30 > 80) {PaddingRight.style.top = (parseInt(window.getComputedStyle(PaddingRight).top) - 30) + "px";}
				else {PaddingRight.style.top = 80 + "px";}
			}
		} else {AI();}
	}

	function AI() {
		let ballTop = parseInt(window.getComputedStyle(Ball).top) + ballSpeed * ballDirectionY;
		let result = parseInt(window.getComputedStyle(PaddingRight).top);
		let diff = (700 - 400) - parseInt(window.getComputedStyle(Ball).left);
		if (ballTop <= Ball.offsetHeight / 2 || ballTop >= 400 - Ball.offsetHeight) {
			if (diff < 0) {diff *= -1;}
			
			if (ballTop <= Ball.offsetHeight / 2) //top
				result = 400 - diff;
			if (ballTop >= 400 - Ball.offsetHeight) //bottom
				result = diff;

			if (result < 80) {result = 80;}
			if (result > 314) {result = 314;}
			PaddingRight.style.top = result + "px";
		}
	}

	function moveBall() {
		const paddingLeftRect = PaddingLeft.getBoundingClientRect();
		const paddingRightRect = PaddingRight.getBoundingClientRect();
		const ballRect = Ball.getBoundingClientRect();
		let ballTop = parseInt(window.getComputedStyle(Ball).top) + ballSpeed * ballDirectionY;
		let ballLeft = parseInt(window.getComputedStyle(Ball).left) + ballSpeed * ballDirectionX;
		if (ballTop <= Ball.offsetHeight / 2) {ballDirectionY = 1;}
		else if (ballTop >= 400 - Ball.offsetHeight) {ballDirectionY = -1;}
		if (ballLeft <= 0) {addPoint("right");softReset();return;}
		else if (ballLeft >= 700 - Ball.offsetWidth) {addPoint("left");softReset();return;}
		if (ballRect.left <= paddingLeftRect.right && ballRect.right >= paddingLeftRect.left 
			&& ballRect.top <= paddingLeftRect.bottom && ballRect.bottom >= paddingLeftRect.top) 
			{ballDirectionX = 1;if (ballSpeed < 9)ballSpeed += 0.1;if (ballSpeed > 9)ballSpeed = 9;}
		if (ballRect.right >= paddingRightRect.left && ballRect.left <= paddingRightRect.right 
			&& ballRect.top <= paddingRightRect.bottom && ballRect.bottom >= paddingRightRect.top) 
			{ballDirectionX = -1;if (ballSpeed < 9)ballSpeed += 0.1;if (ballSpeed > 9)ballSpeed = 9;}
		Ball.style.top = ballTop + 'px';
		Ball.style.left = ballLeft + 'px';
	}
			
	/*///////////////////////////////////////////////////////////////////////////////////////////////
	////                                  EVENTS                                               ////
	/////////////////////////////////////////////////////////////////////////////////////////////// */

	PVP1v1Button.addEventListener('click', () => {PVPMode = '1vs1';changeMenu('RoomMenu');});
	PVP2v2Button.addEventListener('click', () => {PVPMode = '2vs2';changeMenu('RoomMenu');});
	TournamentButton.addEventListener('click', () => {PVPMode = 'Tournament';changeMenu('RoomMenu');});
	PVAButton.addEventListener('click', () => {changeMenu('AIMenu');});
	PvAIeasyButton.addEventListener('click', () => {AIDifficulty = 'Easy'; PaddingRight.style.transition = '1.5s linear'; changeMenu('Game');});
	PvAImediumButton.addEventListener('click', () => {AIDifficulty = 'Medium'; PaddingRight.style.transition = '1s linear'; changeMenu('Game');});
	PvAIhardButton.addEventListener('click', () => {AIDifficulty = 'Hard'; PaddingRight.style.transition = '0.8s linear'; changeMenu('Game');});
	BackToMainMenuButton.addEventListener('click', () => {changeMenu('MainMenu');resetAllData();});
	OptnButton.addEventListener('click', () => {ToggleOptnMenu();});
	PVPStartButton.addEventListener('click', () => {changeMenu('Game');});
	ReadyButton.addEventListener('click', () => {if (PVPMode !== 'none') {PaddingRight.style.transition = '0.06s linear';}if (AIDifficulty === 'Easy') {PaddingRight.style.transition = '1.5s linear';}if (AIDifficulty === 'Meduim') {PaddingRight.style.transition = '1s linear';}if (AIDifficulty === 'Hard') {PaddingRight.style.transition = '0.8s linear';}ReadyButton.style.display = 'none';startGame();});
	NextButton.addEventListener('click', () => {round++;scorerightplayer = 0;scoreleftplayer = 0;ScorePlayerLeftElement.textContent = scoreleftplayer;ScorePlayerRightElement.textContent = scorerightplayer;softReset();changeMenu('Game');});

	Player1SearchButton.addEventListener('click', () => {searchUser(User1SearchBox.value, 'user1');});
	Player2SearchButton.addEventListener('click', () => {searchUser(User2SearchBox.value, 'user2');});
	Player3SearchButton.addEventListener('click', () => {searchUser(User3SearchBox.value, 'user3');});

	PlayAgainButton.addEventListener('click', () => {playAgain();changeMenu('Game');});
	document.addEventListener("keydown", (e) => {keyPressed[e.key] = true;});
	document.addEventListener("keyup", (e) => {keyPressed[e.key] = false;});

	function init() {
		if (invite_bool){
			PVPMode = '1vs1';
			changeMenu('RoomMenu');
			searchUser(invite_username, 'user1')
		}
		else
			changeMenu('MainMenu');
		resetAllData();
		setHostUserName();
	}

	init();
};

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
// 		fetch('/api/game/', {
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
// 		fetch('/api/game/', {
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