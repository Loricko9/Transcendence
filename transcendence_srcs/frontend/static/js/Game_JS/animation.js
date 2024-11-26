import * as Variables from './variables.js';
import * as Game from './game.js';

export function ChangeGameModeHeader(mode) {
	if (mode === 'none') {
		Variables.GameTypeHeader.textContent = 'none';
		Variables.GameTypeHeader.style.display = 'none';
	} else {
		Variables.GameTypeHeader.textContent = `{{ texts.` + mode + ` }}`; // texts.AIEasy;
		// Variables.GameTypeHeader.textContent = mode;
		Variables.GameTypeHeader.style.display = 'block';
	}
}

export function hideOptnMenu() {Variables.OptnMenu.style.bottom = '-650px';}

export function ToggleOptnMenu() {
	if (Variables.OptnMenu.style.bottom === '-650px') {
		Variables.OptnMenu.style.bottom = '-200px';
	} else {
		Variables.OptnMenu.style.bottom = '-650px';
	}
	console.log(Variables.OptnMenu.style.bottom);
}

export function changeMenu(menu) {
	if (menu === 'MainMenu') {
		Variables.Rtips.style.display = 'none';
		Variables.Ltips.style.display = 'none';
		Variables.Ball.style.display = 'none';
		Variables.PaddingLeft.style.display = 'none';
		Variables.PaddingRight.style.display = 'none';
		Variables.Delimiter.style.display = 'none';
		Variables.RoomMenu.style.display = 'none';
		Variables.ReadyButton.style.display = 'none';
		Variables.counterElement.style.display = 'none';


		AnimationGameMainMenu('in');
		AnimationAIMenu('out');
		hideOptnMenu();

		Game.resetAllData();
	} else if (menu === 'AIMenu') {
		// PVAButton.style.left = '300%'; /////////////////////////////////////////////////////////
		Variables.Ltips.style.display = 'none';
		Variables.Rtips.style.display = 'none';
		Variables.Ball.style.display = 'none';
		Variables.PaddingLeft.style.display = 'none';
		Variables.PaddingRight.style.display = 'none';
		Variables.Delimiter.style.display = 'none';
		Variables.RoomMenu.style.display = 'none';
		Variables.ReadyButton.style.display = 'none';
		Variables.counterElement.style.display = 'none';
		
		AnimationGameMainMenu('out');
		AnimationAIMenu('in');
		hideOptnMenu();

	} else if (menu === 'RoomMenu') {
		// PVAButton.style.left = '300%'; /////////////////////////////////////////////////////////

		Variables.Ltips.style.display = 'none';
		Variables.Rtips.style.display = 'none';
		// MainMenu.style.display = 'none'; ////////////////
		// AIMenu.style.display = 'none';
		Variables.RoomMenu.style.display = 'flex';
		Variables.Ball.style.display = 'none';
		Variables.PaddingLeft.style.display = 'none';
		Variables.PaddingRight.style.display = 'none';
		Variables.Delimiter.style.display = 'none';
		Variables.ReadyButton.style.display = 'none';
		Variables.counterElement.style.display = 'none';
		AnimationGameMainMenu('out');
		if (Variables.PVPMode === '1vs1') {
			Variables.RoomHostInfo.style.display = 'block';
			Variables.RoomUser1Info.style.display = 'block';
			Variables.RoomUser2Info.style.display = 'none';
			Variables.RoomUser3Info.style.display = 'none';

			Variables.RoomHostInfo.style.backgroundColor = 'lightgrey';
			Variables.RoomUser1Info.style.backgroundColor = 'lightgrey';
			Variables.RoomUser2Info.style.backgroundColor = 'lightgrey';
			Variables.RoomUser3Info.style.backgroundColor = 'lightgrey';
		} else if (Variables.PVPMode === '2vs2') {
			Variables.RoomHostInfo.style.display = 'block';
			Variables.RoomUser1Info.style.display = 'block';
			Variables.RoomUser2Info.style.display = 'block';
			Variables.RoomUser3Info.style.display = 'block';
			
			Variables.RoomHostInfo.style.backgroundColor = 'red';
			Variables.RoomUser1Info.style.backgroundColor = 'red';
			Variables.RoomUser2Info.style.backgroundColor = 'blue';
			Variables.RoomUser3Info.style.backgroundColor = 'blue';
		} else if (Variables.PVPMode === 'Tournament') {
			Variables.RoomHostInfo.style.display = 'block';
			Variables.RoomUser1Info.style.display = 'block';
			Variables.RoomUser2Info.style.display = 'block';
			Variables.RoomUser3Info.style.display = 'block';

			Variables.RoomHostInfo.style.backgroundColor = 'lightgrey';
			Variables.RoomUser1Info.style.backgroundColor = 'lightgrey';
			Variables.RoomUser2Info.style.backgroundColor = 'lightgrey';
			Variables.RoomUser3Info.style.backgroundColor = 'lightgrey';
		} 
	} else if (menu === 'Game') {
		// PVAButton.style.left = '300%'; /////////////////////////////////////////////////////////
		Variables.Ltips.style.display = 'none';
		Variables.Rtips.style.display = 'none';
		// MainMenu.style.display = 'none'; ///////////////
		// AIMenu.style.display = 'none';
		Variables.RoomMenu.style.display = 'none';
		Variables.Ball.style.display = 'block';
		Variables.PaddingLeft.style.display = 'block';
		Variables.PaddingRight.style.display = 'block';
		Variables.Delimiter.style.display = 'block';
		Variables.ReadyButton.style.display = 'block';
		Variables.counterElement.style.display = 'none';

		
		AnimationGameMainMenu('out');
		AnimationAIMenu('out');
		hideOptnMenu();
		Game.defineWhoFight();


		// AnimationGameMenu('out');

	} else if (menu === 'End') {
		
	} else
		console.error('Menu not found');
}

export function AnimationGameMainMenu(mode) {
	if (mode === 'in') {
		Variables.PVAButton.style.left = '0%';
		Variables.PVP1v1Button.style.right = '0%';
		Variables.PVP2v2Button.style.left = '0%';
		Variables.TournamentButton.style.right = '0%';
	} else {
		Variables.PVAButton.style.left = '100%';
		Variables.PVP1v1Button.style.right = '100%';
		Variables.PVP2v2Button.style.left = '100%';
		Variables.TournamentButton.style.right = '100%';
	}
	console.log(mode);
}

export function AnimationAIMenu(mode) {
	if (mode === 'in') {
		Variables.PvAIeasyButton.style.left = '0%';
		Variables.PvAImediumButton.style.right = '0%';
		Variables.PvAIhardButton.style.left = '0%';
		Variables.AIMenu.style.pointerEvents = 'auto';
		// AIMenu.style.display = 'flex';
	} else {
		Variables.PvAIeasyButton.style.left = '100%';
		Variables.PvAImediumButton.style.right = '100%';
		Variables.PvAIhardButton.style.left = '100%';
		Variables.AIMenu.style.pointerEvents = 'none';
		// AIMenu.style.display = 'none';
	}
}