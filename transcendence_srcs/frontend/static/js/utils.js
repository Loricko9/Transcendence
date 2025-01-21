import {socket, updateNotifications, loadSignIn} from './main.js';
const charts = {}

export function loadChart(chart_num, win, lose) {
	if (charts[chart_num])
		charts[chart_num].destroy();
	let ctx;
	if (chart_num == 0)
		ctx = document.getElementById(`Diag_games`).getContext('2d');
	else
		ctx = document.getElementById(`Diag_tournament`).getContext('2d');
	charts[chart_num] = new Chart(ctx, {
		type: 'doughnut',
        data: {
            labels: [
				'Win',
				'Lose'
			],
            datasets: [{
				data: [win, lose],
                backgroundColor: ['green', 'red'],
				hoverOffset: 4
            }]
        },
        options: {
			responsive: false,
			plugins: {
				legend: {
					display: false
				},
				emptyDoughnut: {
					color: 'rgba(255, 128, 0, 0.5)',
					width: 20,
					radiusDecrease: 20
				}
			}
		},
		plugins: [
			{
				id: 'emptyDoughnut',
				afterDraw(chart, args, options) {
					const {datasets} = chart.data;
					const {color, width, radiusDecrease} = options;
					const hasData = datasets.some(dataset =>
						dataset.data.some(value => value > 0)
					);
					
					if (!hasData) {
						const {chartArea: {left, top, right, bottom}, ctx} = chart;
						const centerX = (left + right) / 2;
						const centerY = (top + bottom) / 2;
						const r = Math.min(right - left, bottom - top) / 2;
						
						ctx.beginPath();
						ctx.lineWidth = width || 2;
						ctx.strokeStyle = color || 'rgba(255, 128, 0, 0.5)';
						ctx.arc(centerX, centerY, (r - radiusDecrease || 0), 0, 2 * Math.PI);
						ctx.stroke();
					}
				}
			}
		]
    });
}

export function ActChart(chart_num, win, lose) {
	charts[chart_num].data.datasets[0].data = [win, lose];
	charts[chart_num].update();
}

export function DestroyCharts() {
	if (charts[0])
		charts[0].destroy();
	if (charts[1])
		charts[1].destroy();
}

export function loadTemplate(appDiv, Id) {
	const template = document.getElementById(Id);
	appDiv.innerHTML = template ? template.innerHTML : "";
}

export function loadIndex() {
	const btn_login = document.getElementById('login_btn_index');
	const btn_signin = document.getElementById('signin_btn_index');
	if (btn_login)
		btn_login.addEventListener('click', Click_login);
	if (btn_signin)
		btn_signin.addEventListener('click', Click_signin);
}

export function loadChangeLang() {
	let lang = Get_Cookie("language");
	if (lang != null) {
		switch (lang) {
			case "fr":
				document.getElementsByClassName("btn_fr")[0].classList.add("active")
				document.getElementsByClassName("btn_fr")[1].classList.add("active")
				break;
			case "en":
				document.getElementsByClassName("btn_en")[0].classList.add("active")
				document.getElementsByClassName("btn_en")[1].classList.add("active")
				break;
			case "es":
				document.getElementsByClassName("btn_es")[0].classList.add("active")
				document.getElementsByClassName("btn_es")[1].classList.add("active")
				break;
			default:
				break;
		}
	}
	document.getElementsByClassName("btn_fr")[0].addEventListener('click', () => Change_lang("fr"));
	document.getElementsByClassName("btn_fr")[1].addEventListener('click', () => Change_lang("fr"));
	document.getElementsByClassName("btn_en")[0].addEventListener('click', () => Change_lang("en"));
	document.getElementsByClassName("btn_en")[1].addEventListener('click', () => Change_lang("en"));
	document.getElementsByClassName("btn_es")[0].addEventListener('click', () => Change_lang("es"));
	document.getElementsByClassName("btn_es")[1].addEventListener('click', () => Change_lang("es"));
}

export async function fetchFriendList(callback) {
	fetch('/api/friends/', {
		method: 'GET',
        headers: {
			'Content-Type': 'application/json',
            'X-CSRFToken': Get_Cookie('csrftoken') // CSRF token
        }
    })
    .then(response => response.json())
    .then(data => {
        const list = document.getElementById('friend-list');
        list.innerHTML = '';
		friendship_lst = data.friendships;
        data.friendships.forEach(friend => {
			AppendTemplateFriends(list, friend)
        });
		if (callback) callback();
    })
    .catch(error => console.error('Error fetching friend list:', error));
}

export function AppendTemplateFriends(appDiv, friend) {
	const tempDiv = document.createElement("div")
	tempDiv.innerHTML =	document.getElementById("temp_friend").innerHTML;
	const button = tempDiv.querySelector("button");
	const span = tempDiv.querySelector("span");
	const img = tempDiv.querySelector("img");
	if (friend.status == "pending")
		button.classList.add('btn-warning');
	else
		button.classList.add('btn-light');
	span.textContent = friend.username;
	img.src = friend.avatar;
	if (friend.is_connected == true)
		img.classList.add('border-green');
	else
		img.classList.add('border-red')
	appDiv.appendChild(tempDiv.firstElementChild);
	button.addEventListener('click', () => {
		id_friend_active = friend.id;
		const elements = document.getElementsByClassName("friend_btn");
		for (const btn of elements)
			btn.classList.remove("border-blue");
		button.classList.add("border-blue");
		document.getElementById("friends_menu").classList.remove("open");
		loadfriendinput();
		loadfriendmessage();
	});
	if (friend.id == id_friend_active)
		button.classList.add("border-blue");
}

let chatSocket = null;

export function closeChatSocket() {
	if (chatSocket){
		chatSocket.close();
		chatSocket = null;
	}
}

export function loadfriendmessage() {
	const div = document.getElementById("message_lst");
	const friend = friendship_lst.find(line => line.id == id_friend_active);
	closeChatSocket()
	if (friend && friend.status == "accepted") {
		div.innerHTML = "";
		div.className = "d-flex flex-column flex-grow-1"
		if (!chatSocket)
			initializeChatWebSocket(id_friend_active);
	}
	else if (friend) {
		div.innerHTML = "";
		div.className = "d-flex align-items-center justify-content-center flex-grow-1 px-0"
	}
	else {
		div.className = "d-flex align-items-center justify-content-center flex-grow-1 px-0"
		div.innerHTML = document.getElementById("temp_no_friend").innerHTML;
	}
}

export function Get_Cookie(name) {
	let new_name = name + "=";
	let tab = decodeURIComponent(document.cookie).split(';');
	for (let i = 0; i < tab.length; i++) {
		let cookie = tab[i].trim();
		if (cookie.indexOf(new_name) == 0)
			return (cookie.substring(new_name.length, cookie.length))
	}
	return null
}

export function showSuccessModal() {
	var modalElement = document.getElementById('successModal');
    var successModal = new bootstrap.Modal(modalElement);

    modalElement.removeAttribute('aria-hidden');
    modalElement.querySelector('.modal-content').focus();
    successModal.show();
	setTimeout(function() {
		successModal.hide();
		modalElement.setAttribute('aria-hidden', 'true');
	}, 3000);
}

export function refreshCSRFToken() {
    fetch('/api/get-csrf-token/')
        .then(response => response.json())
        .then(data => {
            document.querySelector('[name=csrf-token]').content = data.csrfToken;
        })
        .catch(error => console.error('Erreur lors du rafraîchissement du CSRF token:', error));
}

export function clearFormFields() {
    document.getElementById('Email_input').value = '';
    document.getElementById('Passwd_input').value = '';
}

export function Fill_table(history) {
	const table = document.getElementById("table_history");
	if (history.length == 0) {
		document.getElementById("no_data_txt").style.display = 'block';
		return ;
	}
	document.getElementById("no_data_txt").style.display = 'none';
	table.innerHTML = '';
	history.forEach(game => {
		const tr = document.createElement('tr')
		const tdDate = document.createElement('td');
		tdDate.textContent = new Date(game.date).toLocaleString();
		const tdEnemy = document.createElement('td');
		tdEnemy.textContent = game.enemy;
		const tdScore = document.createElement('td');
		tdScore.textContent = game.score;
		const tdResult = document.createElement('td');
		tdResult.textContent = game.result;

		tr.appendChild(tdDate);
		tr.appendChild(tdEnemy);
		tr.appendChild(tdScore);
		tr.appendChild(tdResult);
		table.appendChild(tr);
	});
}

export function loadfriendinput() {
	const div = document.getElementById("message_input");
	div.style.display = "block";
	const friend = friendship_lst.find(line => line.id == id_friend_active);
	if (friend) {
		if (friend.status == "accepted") {
			div.innerHTML = document.getElementById("temp_send_message").innerHTML;
			// Afficher le profile de l'ami
			document.getElementById("friendProfile").addEventListener('click', () => {
				loadFriendProfile();
				fetchFriendProfile(id_friend_active);
			});
			// Inviter l'ami a jouer
			document.getElementById("inviteBtn").addEventListener('click', () => {
				if (socket){
					const lang = Get_Cookie("language")
					let message = null;
					switch (lang) {
						case "fr":
							message = "Invitation envoyée."
							break;
						case "en":
							message = "Invitation sent."
							break;
						case "es":
							message = "Invitación enviada."
						default:
							break;
					}
					document.getElementById('infoco').innerText = message
					showSuccessModal()
					socket.send(JSON.stringify({
						command: 'invite',
						friendship_id: id_friend_active,
					}));
				}
			});
		}
		else if (friend.status == "pending" && friend.wait_pending)
			div.innerHTML = document.getElementById("temp_wait_Friend_Request").innerHTML;
		else {
			div.innerHTML = document.getElementById("temp_Friend_Request").innerHTML;
			document.getElementById("accept_friend").addEventListener('click', () => {
				respondToRequest('accepted');
			})
			document.getElementById("refuse_friend").addEventListener('click', () => {
				respondToRequest('rejected');
			})
		}
	}
	else
	div.style.display = "none";
}

function loadFriendProfile() {
	const appDiv = document.getElementById("app");
	const profile_template = document.getElementById("temp_friend_profile")
	const stats_template = document.getElementById("temp_stats");
	appDiv.innerHTML = profile_template.innerHTML + stats_template.innerHTML;
	document.getElementById("delete_friend").addEventListener('click', () => {
		const appDiv = document.getElementById("app")
		loadTemplate(appDiv, "temp_login")
		deleteFriendship(id_friend_active);
	});
	document.getElementById('blockFriend').addEventListener('click', function() {
		var modalElement = document.getElementById('ConfirmBlockModal');
		var confirm_block_modal = new bootstrap.Modal(modalElement);
		confirm_block_modal.show();
	});
	document.getElementById('block_friend').addEventListener('click', function() {
		if (chatSocket){
			const friend_username = document.getElementById("span_friend_username").textContent;
			const appDiv = document.getElementById("app")
			loadTemplate(appDiv, "temp_login")
			fetchFriendList()
			chatSocket.send(JSON.stringify({
				command: 'block',
				username: friend_username,
			}));
		}
	});
	document.getElementById('deblockFriend').addEventListener('click', function() {
		if (chatSocket){
			const friend_username = document.getElementById("span_friend_username").innerText;
			const appDiv = document.getElementById("app")
			loadTemplate(appDiv, "temp_login")
			fetchFriendList()
			chatSocket.send(JSON.stringify({
				command: 'block',
				username: friend_username,
			}));
		}
	});
}

export function loadPrivacyPolicy(appDiv) {
	let lang = Get_Cookie("language");
	let path;
	switch (lang) {
		case "fr":
			path = "/static/html/privacy-policy_fr.html"
			break;
		case "es":
			path = "/static/html/privacy-policy_es.html"
			break;
		default:
			path = "/static/html/privacy-policy_en.html"
	}
	fetch(path)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du fichier HTML');
      }
      return response.text();
    })
    .then(data => {
      appDiv.innerHTML = data;
    })
    .catch(error => {
      console.error('Erreur:', error);
      appDiv.innerHTML = '<h3>Impossible de charger la politique de confidentialité.</h3>';
    });
}

function Add_message(txt, bool) {
	const tempDiv = document.createElement("div");
	const tempDivtxt = document.createElement("div");
	const span = document.createElement("span");
	span.innerHTML = txt;
	span.className = "text-break"
	tempDivtxt.appendChild(span);
	if (bool) {
		tempDivtxt.className = "w-auto rounded-4 m-1 ms-4 px-2 py-1 message div-blank";
		tempDiv.className = "d-flex justify-content-end";
	}
	else {
		tempDivtxt.className = "w-auto rounded-4 m-1 me-4 px-2 py-1 message div-blue";
		tempDiv.className = "d-flex justify-content-start";
	}
	tempDiv.appendChild(tempDivtxt);
	const Div = document.getElementById("message_lst");
	Div.appendChild(tempDiv);
	Div.scrollTop = Div.scrollHeight;
}

var friendship_lst;
var id_friend_active = -1;

function Click_login() {
    let dropdownElement = document.getElementById('dropdown_form');
    const dropdown = new bootstrap.Dropdown(dropdownElement);
    dropdown.show();
}

function Change_lang(lang) {
	const path = window.location.pathname.substring(3);
	window.location.href = "/api/lang/" + lang + "?prev=" + path
}

function Click_signin() {
	const appDiv = document.getElementById("app");
	appDiv.className = "container col-md-5 py-2 px-3 my-5";
	loadTemplate(appDiv, "temp_sign_in");
	loadSignIn();
	return;
}

function deleteFriendship(friendshipId){
	fetch(`/api/friends/${friendshipId}/`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': Get_Cookie('csrftoken')
		}
	})
	.then(response => response.json())
	.then(data => {
		const lang = Get_Cookie("language")
		let err_msg;
		let del_msg;
		switch (lang) {
			case "fr":
				err_msg = "Impossible de supprimer ce lien d'amitié"
				del_msg = "Amitié supprimée avec succès."
				break;
			case "en":
				err_msg = "Impossible to remove this friendship."
				del_msg = "Friendship successfully suppressed."
				break;
			case "es":
				err_msg = "Imposible eliminar este amistad."
				del_msg = "Amistad eliminada con éxito."
			default:
				break;
		}
		
		if (data.success) {
			alert(del_msg)
			friendshipId = -1;
			fetchFriendList(() => {
				loadfriendinput();
				loadfriendmessage();
			});
		} else {
			alert(err_msg)
		}
	})
	.catch(error => console.error('Error deleting friendship:', error));
}

function respondToRequest(action) {
    const friend = friendship_lst.find(line => line.id == id_friend_active).username;
	fetch(`/api/friend-request/${id_friend_active}/`, {
        method: 'PATCH',
        headers: {
			'Content-Type': 'application/json',
            'X-CSRFToken': Get_Cookie('csrftoken')
        },
        body: JSON.stringify({ action: action, username: friend})
    })
    .then(response => response.json())
    .then(data => {
		const lang = Get_Cookie("language")
		let err_msg;
		let ok_info;
		let no_info;
		switch (lang) {
			case "fr":
				err_msg = "Impossible de répondre à ce joueur."
				ok_info = "Demande d'ami acceptée."
				no_info = "Demande d'ami refusée."
				break;
			case "en":
				err_msg = "Impossible to answer this player."
				ok_info = "Friend request accepted."
				no_info = "Friend request refused."
				break;
			case "es":
				err_msg = "Imposible responder a este jugador."
				ok_info = "Solicitud de amistad aceptada."
				no_info = "Solicitud de amistad denegada."
			default:
				break;
		}

		let message;
		if (data.success){
			if (data.status)
				message = ok_info
			else
				message = no_info
		}
		else
			message = err_msg
        alert(message);
		fetchFriendList(() => {
			loadfriendinput();
			loadfriendmessage();
		});
    })
    .catch(error => console.error('Error responding to friend request:', error));
}

// Recuperer les informations de l'ami
function fetchFriendProfile(friendshipId) {
    fetch(`/api/friend-profile/${friendshipId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': Get_Cookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
		if (data.is_blocked)
			document.getElementById('blockFriend').style.display = 'none';
		else
			document.getElementById('deblockFriend').style.display = 'none';
		document.getElementById("span_friend_username").innerText = data.username
		document.getElementById("img_friend_avatar").src = data.avatar
        loadChart(0, data.nb_win, data.nb_lose);
		loadChart(1, data.nb_tournament_win, data.nb_tournament_lose)
		document.getElementById('Win_game').innerHTML = data.nb_win
		document.getElementById('Lose_game').innerHTML = data.nb_lose
		Fill_table(data.history)
    })
    .catch(error => console.error('Error fetching friend profile:', error));
}

// Gestionnaire Chat websocket
function initializeChatWebSocket(roomId) {
    chatSocket = new WebSocket(`wss://${window.location.host}/ws/chat/${roomId}/`);

    // Réception des messages
    chatSocket.onmessage = function (e) {
		const data = JSON.parse(e.data);
		
		const username = document.getElementById("user_connected").innerText;

		if (data.type == 'notif'){
			if (data.sender_username == username){
				updateNotifications(true, data.message);
				document.getElementById('infoco').innerHTML = data.message;
				showSuccessModal();
			}
			return;
		}

		if (data.sender == username)
			Add_message(data.message, true)
		else{
			Add_message(data.message, false)
		}
    };

    // Gestion de l'envoi des messages
	document.getElementById('chat-message-form').addEventListener('submit', function(event) {
		event.preventDefault();
        const message = document.getElementById('chat-message-input').value;
		const lang = Get_Cookie("language")
        chatSocket.send(JSON.stringify({message: message, lang: lang}));
		document.getElementById('chat-message-form').reset();
	});

    chatSocket.onclose = function (e) {
        console.error('WebSocket connection closed');
    };
}