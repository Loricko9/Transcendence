import * as Game from './game.js';
import * as Animation from './animation.js';

export const PaddingLeft = document.getElementById('left-paddle');
export const PaddingRight = document.getElementById('right-paddle');
export const Ball = document.getElementById('ball');
export const Delimiter = document.getElementById('delimiter');
export const ScorePlayerLeftElement = document.getElementById('LeftPlayerScore');
export const ScorePlayerRightElement = document.getElementById('RightPlayerScore');
export const LeftPlayerUserNameContent = document.getElementById('LeftPlayerName');
export const RightPlayerUserNameContent = document.getElementById('RightPlayerName');
export const GameTypeHeader = document.getElementById('GameTypeHeader');
export const Ltips = document.getElementById('tips1');
export const Rtips = document.getElementById('tips2');

export const PVP1v1Button = document.getElementById('HostGame1v1Button');
export const PVP2v2Button = document.getElementById('HostGame2v2Button');
export const TournamentButton = document.getElementById('HostTournamentButton');
export const PVPStartButton = document.getElementById('StartGame');
export const Player1SearchButton = document.getElementById('User1Search');
export const Player2SearchButton = document.getElementById('User2Search');
export const Player3SearchButton = document.getElementById('User3Search');
export const PVAButton = document.getElementById('AIButton');
export const PvAIeasyButton = document.getElementById('AIEasyButton');
export const PvAImediumButton = document.getElementById('AIMediumButton');
export const PvAIhardButton = document.getElementById('AIHardButton');
export const BackToMainMenuButton = document.getElementById('BackMainMenuButton');
export const OptnButton = document.getElementById('OptnButton');
export const ReadyButton = document.getElementById('ready');
export const counterElement = document.getElementById('counter');

export const MainMenu = document.getElementById('main-menu');
export const AIMenu = document.getElementById('AIMenu');
export const RoomMenu = document.getElementById('Room');
export const OptnMenu = document.getElementById('OptnMenu');

export const RoomHostInfo = document.getElementById('Host');
export const RoomUser1Info = document.getElementById('User1');
export const RoomUser2Info = document.getElementById('User2');
export const RoomUser3Info = document.getElementById('User3');

export const RoomHostName = document.getElementById('HostName');
export const RoomUser1Name = document.getElementById('User1Name');
export const RoomUser2Name = document.getElementById('User2Name');
export const RoomUser3Name = document.getElementById('User3Name');

export const keyPressed = {};

export let gameStarted = false;
export let darkMode = false;
export let AIDifficulty = "none"; // none, easy, medium, hard
export let PVPMode = "none"; // none, 1vs1, 2vs2, Tournament
export let HostUserNameVar = null;
export let User1UserNameVar = null;
export let User2UserNameVar = null;
export let User3UserNameVar = null;
export let round = null;
export let fight = [null, null]; // [left_user, right_user]
export let ballSpeed = 5;
export let ballDirectionX = Math.random() < 0.5 ? -1 : 1; // Random initial direction
export let ballDirectionY = Math.random() < 0.5 ? -1 : 1; // Random initial direction

export function setGameStarted(value) {gameStarted = value;}
export function setAIDifficulty(value) {AIDifficulty = value;}
export function setPVPMode(value) {PVPMode = value;}
export function setHostUserName(value) {
	HostUserNameVar = value;
	if (value === null) {
		RoomHostName.textContent = '...';
	} else {
		RoomHostName.textContent = value;
	}
}
export function setUser1UserName(value) {
	User1UserNameVar = value;
	if (value === null) {
		RoomUser1Name.textContent = '...';
	} else {
		RoomUser1Name.textContent = value;
	}
}
export function setUser2UserName(value) {
	User2UserNameVar = value;
	if (value === null) {
		RoomUser2Name.textContent = '...';
	} else {
		RoomUser2Name.textContent = value;
	}
}
export function setUser3UserName(value) {
	User3UserNameVar = value;
	if (value === null) {
		RoomUser3Name.textContent = '...';
	} else {
		RoomUser3Name.textContent = value;
	}
}

export function setFight(value1, value2) {
	fight[0] = value1;
	fight[1] = value2;
	if (value1 === null || value2 === null) {
		console.error('Fatal Error: player not initialised!');
		Animation.changeMenu('MainMenu');
		console.log('test');
		Game.resetAllData();
		return ;
	}
	LeftPlayerUserNameContent.textContent = value1;
	RightPlayerUserNameContent.textContent = value2;
}

export function resetFight() {
	fight = [null, null];
}

export function setRound(value) {
	round = value;
}
export function setDarkMode(value) {
	darkMode = value;
}

export function setBallSpeed(value) {
	ballSpeed = value;
}

export function setBallDirectionX(value) {
	ballDirectionX = value;
}

export function setBallDirectionY(value) {
	ballDirectionY = value;
}