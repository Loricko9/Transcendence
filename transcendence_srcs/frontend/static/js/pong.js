import {showSuccessModal} from './utils.js';
import {updateNotifications} from './main.js';

let MatchmakingSocket = null;

export function closeMatchmakingSocket() {
	if (MatchmakingSocket){
		MatchmakingSocket.send(JSON.stringify({
			command: 'delete',
		}));
		console.log("delete group")
		MatchmakingSocket.close();
		MatchmakingSocket = null;
		console.log("Matchmaking websocket close")
	}
}

export function initAll(invite_bool, invite_username) {
	const PaddingLeft = document.getElementById('left-paddle');
	const PaddingRight = document.getElementById('right-paddle');
	const Ball = document.getElementById('ball');
	const Delimiter = document.getElementById('delimiter');
	const counterElement = document.getElementById('counter');
	const RoomHostInfo = document.getElementById('Host');
	// const RoomUserInviteInfo = document.getElementById('UserInvite');
	// const RoomWait = document.getElementById('wait');
	const RoomUser1Info = document.getElementById('User1');
	const RoomUser2Info = document.getElementById('User2');
	const RoomUser3Info = document.getElementById('User3');

	const PVP1v1Button = document.getElementById('HostGame1v1Button');
	const PVP2v2Button = document.getElementById('HostGame2v2Button');
	const TournamentButton = document.getElementById('HostTournamentButton');
	const PVPStartButton = document.getElementById('StartGame');
	const PVAButton = document.getElementById('AIButton');
	const PvAIeasyButton = document.getElementById('AIEasyButton');
	const PvAImediumButton = document.getElementById('AIMediumButton');
	const PvAIhardButton = document.getElementById('AIHardButton');
	const BackToMainMenuButton = document.getElementById('BackMainMenuButton');
	const ReadyButton = document.getElementById('ready');
	const NextButton = document.getElementById('NextButton');
	const PlayAgainButton = document.getElementById('PlayAgain');
	const LaunchMatchMaking = document.getElementById('launchMatchMaking');
	const waitingPlayer = document.getElementById('waitingPlayer');
	const DMswitch = document.getElementById('darkModeSwitch');
	const RightDownTouchZone = document.getElementById('zone-right-down');
	const RightUpTouchZone = document.getElementById('zone-right-up');
	const LeftDownTouchZone = document.getElementById('zone-left-down');
	const LeftUpTouchZone = document.getElementById('zone-left-up');

	const AIMenu = document.getElementById('AIMenu');
	const RoomMenu = document.getElementById('Room');

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
	let ballDirectionX = Math.random() < 0.5 ? -1 : 1;
	let ballDirectionY = Math.random() < 0.5 ? -1 : 1;
	let ballSpeed = 6;

	let scoreleftplayer = 0, scorerightplayer = 0, redTeamScore = 0, blueTeamScore = 0;

	let tournamentWinnerRound1 = null;
	let tournamentWinnerRound1Icon = null;
	let tournamentWinnerRound2 = null;
	let tournamentWinnerRound2Icon = null;
	let timer;

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
		if (mode === 'in') {
			document.getElementById('main-menu').style.pointerEvents = 'auto';
			PVAButton.style.left = '0%';PVP1v1Button.style.right = '0%';PVP2v2Button.style.left = '0%';TournamentButton.style.right = '0%';
			document.getElementById('game-area').style.display = 'none';
			document.getElementById('game-header').style.display = 'none';
		}
		else {
			PVAButton.style.left = '100%';PVP1v1Button.style.right = '100%';PVP2v2Button.style.left = '100%';TournamentButton.style.right = '100%';
			document.getElementById('game-area').style.display = 'block';
			document.getElementById('game-header').style.display = 'flex';
			document.getElementById('main-menu').style.pointerEvents = 'none';
		}
	}

	function AnimationAIMenu(mode) {
		if (mode === 'in') {
			document.getElementById('AIMenu').style.pointerEvents = 'auto';
			PvAIeasyButton.style.left = '0%';PvAImediumButton.style.right = '0%';PvAIhardButton.style.left = '0%';AIMenu.style.pointerEvents = 'auto';
			document.getElementById('game-area').style.display = 'none';
			document.getElementById('game-header').style.display = 'none';
		}
		else {
			PvAIeasyButton.style.left = '100%';PvAImediumButton.style.right = '100%';PvAIhardButton.style.left = '100%';AIMenu.style.pointerEvents = 'none';
			document.getElementById('game-area').style.display = 'block';
			document.getElementById('game-header').style.display = 'flex';
			document.getElementById('AIMenu').style.pointerEvents = 'none';
		}
	}
	
	function changeMenu(menu) {
		AnimationAIMenu('out');
		AnimationMainMenu('out');
		document.getElementById('EndGameMenu').style.display = 'none';
		Ball.style.display = 'none';
		PaddingLeft.style.display = 'none';
		PaddingRight.style.display = 'none';
		Delimiter.style.display = 'none';
		RoomMenu.style.display = 'none';
		ReadyButton.style.display = 'none';
		counterElement.style.display = 'none';
		if (menu === 'MainMenu') {AnimationMainMenu('in');resetAllData();gameStarted = false;
		} else if (menu === 'AIMenu') {document.getElementById('EndGameMenu').style.display = 'none';AnimationAIMenu('in');
		} else if (menu === 'RoomMenu') {
			delete_MatchGroup()
			RoomHostInfo.style.backgroundColor = 'lightgrey';
			RoomUser1Info.style.backgroundColor = 'lightgrey';
			RoomUser2Info.style.backgroundColor = 'lightgrey';
			RoomUser3Info.style.backgroundColor = 'lightgrey';
			waitingPlayer.style.display = 'none';
			LaunchMatchMaking.style.display = 'block';
			RoomHostInfo.style.display = 'block';
			RoomUser1Info.style.display = 'block';
			RoomUser2Info.style.display = 'block';
			RoomUser3Info.style.display = 'block';
			RoomMenu.style.display = 'flex';
			document.getElementById('game-area').style.display = 'none';
			document.getElementById('game-header').style.display = 'none';
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
			if (timer)
				clearTimeout(timer);
			Ball.style.display = 'block';
			PaddingLeft.style.display = 'block';
			PaddingRight.style.display = 'block';
			Delimiter.style.display = 'block';
			ReadyButton.style.display = 'block';
			document.getElementById('game-area').style.display = 'block';
			document.getElementById('game-header').style.display = 'flex';
			defineWhoFight();
			send_notif();
		} else if (menu === 'endGameMenu') {
			document.getElementById('game-area').style.display = 'none';
			document.getElementById('game-header').style.display = 'none';
			document.getElementById('EndGameMenu').style.display = 'block';}
		else
			console.error('Menu not found');
	}

	function send_notif(){
		if (MatchmakingSocket){
			MatchmakingSocket.send(JSON.stringify({
				command: 'notif',
				username1: LeftPlayerUserNameContent.textContent,
				username2: RightPlayerUserNameContent.textContent,
			}));
		}
	}

	function delete_MatchGroup(){
		if (MatchmakingSocket){
			MatchmakingSocket.send(JSON.stringify({
				command: 'delete',
			}));
		}
	}

	function resetAllData() {
		if (timer)
			clearTimeout(timer);
		delete_MatchGroup()
		gameStarted = false;
		AIDifficulty = "none";
		PVPMode = "none";
		ballSpeed = 6;
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
		setHostUserName();
		setUser1UserName(null);
		setUser1Image(null);
		setUser2UserName(null);
		setUser2Image(null);
		setUser3UserName(null);
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
			if (gameStarted === false) {clearInterval(interval);counterElement.style.display = 'none';return;}
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
		gameStarted = 10;
		counter(() => {
			gameStarted = true;
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
			delete_MatchGroup()
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
				}
				else if (scorerightplayer === 3) {
					document.getElementById("WinnerName").textContent = RightPlayerUserNameContent.textContent;
					setWinnerIcon(rightUserIcon.src);
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
			if (HostUserNameVar === null || User1UserNameVar === null || User2UserNameVar === null || User3UserNameVar === null) {console.error('Fatal Error: player not initialised!');changeMenu('MainMenu');resetAllData();return ;}
			if (round === 0) {setFight(HostUserNameVar, User2UserNameVar);setFightIcons(HostUserIcon.src, User2Icon.src);}
			else if (round === 1) {setFight(User1UserNameVar, User3UserNameVar);setFightIcons(User1Icon.src, User3Icon.src);}
		} else if (PVPMode === 'Tournament') {
			if (HostUserNameVar === null || User1UserNameVar === null || User2UserNameVar === null || User3UserNameVar === null) {console.error('Fatal Error: player not initialised!');changeMenu('MainMenu');resetAllData();return ;}
			if (round === 0) {setFight(HostUserNameVar, User1UserNameVar);setFightIcons(HostUserIcon.src, User1Icon.src);}
			else if (round === 1) {setFight(User2UserNameVar, User3UserNameVar);setFightIcons(User2Icon.src, User3Icon.src);}
			else if (round === 2) {setFight(tournamentWinnerRound1, tournamentWinnerRound2);setFightIcons(tournamentWinnerRound1Icon, tournamentWinnerRound2Icon);}
		}
	}

	function movePaddings() {
		const gameAreaHeight = document.getElementById('game-area').clientHeight;
		if (parseInt(window.getComputedStyle(PaddingRight).top) > (gameAreaHeight-80)) {PaddingRight.style.top = (gameAreaHeight-80) + "px";}
		if (parseInt(window.getComputedStyle(PaddingLeft).top) > (gameAreaHeight-80)) {PaddingLeft.style.top = (gameAreaHeight-80) + "px";}

		if (keyPressed['s']) {
			if (parseInt(window.getComputedStyle(PaddingLeft).top) + 30 < (gameAreaHeight - 80)) {PaddingLeft.style.top = (parseInt(window.getComputedStyle(PaddingLeft).top) + 30) + "px";}
			else {PaddingLeft.style.top = (gameAreaHeight - 80) + "px";}
		} if (keyPressed['w']) {
			if (parseInt(window.getComputedStyle(PaddingLeft).top) - 30 > 80) {PaddingLeft.style.top = (parseInt(window.getComputedStyle(PaddingLeft).top) - 30) + "px";}
			else{PaddingLeft.style.top = 80 + "px";}
		} if (PVPMode !== 'none') {
			if (keyPressed['ArrowDown']) {
				if (parseInt(window.getComputedStyle(PaddingRight).top) + 30 < (gameAreaHeight - 80)) {PaddingRight.style.top = (parseInt(window.getComputedStyle(PaddingRight).top) + 30) + "px";}
				else {PaddingRight.style.top = (gameAreaHeight - 80) + "px";}
			} if (keyPressed['ArrowUp']) {
				if (parseInt(window.getComputedStyle(PaddingRight).top) - 30 > 80) {PaddingRight.style.top = (parseInt(window.getComputedStyle(PaddingRight).top) - 30) + "px";}
				else {PaddingRight.style.top = 80 + "px";}
			}
		} else {AI();}
	}

	function AI() {
		let ballTop = parseInt(window.getComputedStyle(Ball).top) + ballSpeed * ballDirectionY;
		let result = parseInt(window.getComputedStyle(PaddingRight).top);
		let gameAreaHeight = document.getElementById('game-area').clientHeight;
		let gameAreaWidth = document.getElementById('game-area').clientWidth;
		let diff = (gameAreaWidth - gameAreaHeight) - parseInt(window.getComputedStyle(Ball).left);
		
		let chance = 0;
		if (AIDifficulty === 'easy')
			chance = randomIntFromInterval(0, 10);
		else if (AIDifficulty === 'medium')
			chance = randomIntFromInterval(0, 100);
		else if (AIDifficulty === 'hard')
			chance = randomIntFromInterval(0, 1000);
		if (chance === 1)
			return;
		if (ballTop <= Ball.offsetHeight / 2 || ballTop >= gameAreaHeight - Ball.offsetHeight) {
			if (diff < 0) {diff *= -1;}
			
			if (ballTop <= Ball.offsetHeight / 2)
				result = gameAreaHeight - diff;
			if (ballTop >= gameAreaHeight - Ball.offsetHeight)
				result = diff;

			if (result < 80) {result = 80;}
			if (result > (gameAreaHeight-80)) {result = (gameAreaHeight-80);}
			PaddingRight.style.top = result + "px";
		}
	}

	function moveBall() {
		const paddingLeftRect = PaddingLeft.getBoundingClientRect();
		const paddingRightRect = PaddingRight.getBoundingClientRect();
		let gameAreaHeight = document.getElementById('game-area').clientHeight;
		let gameAreaWidth = document.getElementById('game-area').clientWidth;
		const ballRect = Ball.getBoundingClientRect();
		let ballTop = parseInt(window.getComputedStyle(Ball).top) + ballSpeed * ballDirectionY;
		let ballLeft = parseInt(window.getComputedStyle(Ball).left) + ballSpeed * ballDirectionX;
		
		if (ballTop <= Ball.offsetHeight / 2) {ballDirectionY = 1;}
		else if (ballTop >= gameAreaHeight - (Ball.offsetHeight / 2)) {ballDirectionY = -1;}
		
		if (ballLeft <= 0) {addPoint("right");softReset();return;}
		else if (ballLeft >= gameAreaWidth) {addPoint("left");softReset();return;}
		
		if (ballRect.left <= paddingLeftRect.right && ballRect.right >= paddingLeftRect.left && ballRect.top <= paddingLeftRect.bottom && ballRect.bottom >= paddingLeftRect.top) 
			{ballDirectionX = 1;if (ballSpeed < 9)ballSpeed += 0.1;if (ballSpeed > 9)ballSpeed = 9;}
		
		if (ballRect.right >= paddingRightRect.left && ballRect.left <= paddingRightRect.right && ballRect.top <= paddingRightRect.bottom && ballRect.bottom >= paddingRightRect.top) 
			{ballDirectionX = -1;if (ballSpeed < 9)ballSpeed += 0.1;if (ballSpeed > 9)ballSpeed = 9;}

		Ball.style.top = ballTop + 'px';
		Ball.style.left = ballLeft + 'px';
	}

	function matchMaking(){
		LaunchMatchMaking.style.display = 'none';
		let playerNb;
		switch (PVPMode) {
			case '1vs1':
				playerNb = 1;
				break;
			default:
				playerNb = 3;
				break;
		}
		console.log("Matchmaking lancee")
		fetch('/api/matchmaking/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': Get_Cookie('csrftoken')
			},
			body: JSON.stringify({
				playerNb: playerNb,
				PVPMode: PVPMode,
			})
		})
		.then(response => response.json())
		.then(data => {
			if (data.waiting){
				console.log("waiting")
				if (data.maxPlayer === 1)
					RoomUser1Info.style.display = 'none';
				else if (data.maxPlayer === 3){
					RoomUser1Info.style.display = 'none';
					RoomUser2Info.style.display = 'none';
					RoomUser3Info.style.display = 'none';
				}
				waitingPlayer.style.display = 'block';
				timer = setTimeout(() => {
					alert("echec Matchmaking")
					changeMenu('MainMenu')
				}, 60000);
			}
			else{
				const lang = Get_Cookie("language")
				let continue_msg = null;
				switch (lang) {
					case "fr":
						continue_msg = " vous attend a son poste."
						break;
					case "en":
						continue_msg = " is waiting for you at his post."
						break;
					case "es":
						continue_msg = " te espera en su puesto."
					default:
						break;
				}
				const message = data.leader_username + continue_msg
				updateNotifications(true, message)
				document.getElementById('infoco').innerText = message
				showSuccessModal()
			}
		})
		.catch(error => console.error('Error matchmaking:', error));
	}
	
	function InitializeMatchmakingWebsocket(){
		MatchmakingSocket = new WebSocket(`wss://${window.location.host}/ws/matchmaking/`);
		
		MatchmakingSocket.onmessage = function (event) {
			const data = JSON.parse(event.data);

			const lang = Get_Cookie("language");

			if (data.type == 'notif'){
				let message = null;
				switch (lang) {
					case "fr":
						message = data.leader_username + " vous attend, c'est a votre tour de jouer !"
						break;
					case "en":
						message = data.leader_username + " is waiting for you, now it's your turn to play!"
						break;
					case "es":
						message = data.leader_username + " te está esperando, ¡ahora es tu turno de jugar!"
					default:
						break;
				}
				updateNotifications(true, message)
				document.getElementById('infoco').innerText = message
				showSuccessModal()
				return
			}

			if (data.playerNb === 1 ){
				RoomUser1Info.style.display = 'block';
				searchUser(data.member_username, 'user1')
			}
			else if (data.playerNb === 2 ){
				RoomUser2Info.style.display = 'block';
				searchUser(data.member_username, 'user2')
			}
			else if (data.playerNb === 3 ){
				RoomUser3Info.style.display = 'block';
				searchUser(data.member_username, 'user3')
			}
			if (data.playerNb === data.maxPlayer)
				waitingPlayer.style.display = 'none';
		};

		MatchmakingSocket.onclose = function () {
			console.error("WebSocket connection closed.");
		};
	};
			
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
	PVPStartButton.addEventListener('click', () => {changeMenu('Game');});
	ReadyButton.addEventListener('click', () => {if (PVPMode !== 'none') {PaddingRight.style.transition = '0.06s linear';}if (AIDifficulty === 'Easy') {PaddingRight.style.transition = '1.5s linear';}if (AIDifficulty === 'Meduim') {PaddingRight.style.transition = '1s linear';}if (AIDifficulty === 'Hard') {PaddingRight.style.transition = '0.8s linear';}ReadyButton.style.display = 'none';startGame();});
	NextButton.addEventListener('click', () => {round++;scorerightplayer = 0;scoreleftplayer = 0;ScorePlayerLeftElement.textContent = scoreleftplayer;ScorePlayerRightElement.textContent = scorerightplayer;softReset();changeMenu('Game');});
	Player1SearchButton.addEventListener('click', () => {searchUser(User1SearchBox.value, 'user1');});
	Player2SearchButton.addEventListener('click', () => {searchUser(User2SearchBox.value, 'user2');});
	Player3SearchButton.addEventListener('click', () => {searchUser(User3SearchBox.value, 'user3');});
	
	LeftUpTouchZone.addEventListener('touchstart', (e) => {e.preventDefault();keyPressed['w'] = true;}, { passive: false });
	LeftUpTouchZone.addEventListener('touchend', (e) => {e.preventDefault();keyPressed['w'] = false;}, { passive: false });
	LeftDownTouchZone.addEventListener('touchstart', (e) => {e.preventDefault();keyPressed['s'] = true;}, { passive: false });
	LeftDownTouchZone.addEventListener('touchend', (e) => {e.preventDefault();keyPressed['s'] = false;}, { passive: false });
	RightUpTouchZone.addEventListener('touchstart', (e) => {e.preventDefault();keyPressed['ArrowUp'] = true;}, { passive: false });
	RightUpTouchZone.addEventListener('touchend', (e) => {e.preventDefault();keyPressed['ArrowUp'] = false;}, { passive: false });
	RightDownTouchZone.addEventListener('touchstart', (e) => {e.preventDefault();keyPressed['ArrowDown'] = true;}, { passive: false });
	RightDownTouchZone.addEventListener('touchend', (e) => {e.preventDefault();keyPressed['ArrowDown'] = false;}, { passive: false });

	PlayAgainButton.addEventListener('click', () => {playAgain();changeMenu('Game');});
	document.addEventListener("keydown", (e) => {keyPressed[e.key] = true;});
	document.addEventListener("keyup", (e) => {keyPressed[e.key] = false;});
	LaunchMatchMaking.addEventListener('click', () => {matchMaking()});
	
	function toggleDarkMode() {document.getElementById('game-container').classList.toggle('dark-mode');}
	
	DMswitch.removeEventListener('click', toggleDarkMode);
    DMswitch.addEventListener('click', toggleDarkMode);
	
  ///////////////////////////////////////////////////
 //                    INIT                       //
///////////////////////////////////////////////////

	function init() {
		if (invite_bool){
			PVPMode = '1vs1';
			changeMenu('RoomMenu');
			searchUser(invite_username, 'user1')
		} else {
			changeMenu('MainMenu');
			resetAllData();
		}
		setHostUserName();
		if (!MatchmakingSocket)
			InitializeMatchmakingWebsocket();
	}
	init();
};