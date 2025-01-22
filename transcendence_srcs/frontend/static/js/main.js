import { initAll, closeMatchmakingSocket } from './pong.js';
import { loadChart, ActChart, DestroyCharts, loadTemplate, Fill_table,
	Get_Cookie, showSuccessModal, refreshCSRFToken, clearFormFields, closeChatSocket,
	fetchFriendList, loadfriendinput, loadPrivacyPolicy, loadIndex, loadChangeLang,
	loadfriendmessage} from './utils.js';

// fonction pour gerer l'affichage en fonction de si un client est connecte
async function checkAuthentification() {
	try{
		const response = await fetch('/api/check-auth/');
		const data = await response.json();
		if (data.is_authenticated) {
			if (!socket)
			{
				InitializeWebsocket();
				if (data.friend_lst)
					connexion_info(data.friend_lst)
				updateNotifications(true, null);
			}
			document.getElementById('notif-div').style.display = 'flex';
			document.getElementById('notif-div-little').style.display = 'flex';
			document.getElementById('option').style.display = 'flex';
			document.querySelector('.lst_link').style.display = 'flex';
			document.getElementById('bar_sub_login').classList.add('d-none');
			document.getElementById('bar_sub_login').classList.remove('d-flex');
			document.getElementById('user_avatar').src = data.avatar;
			document.getElementById('user_avatar').style.display = 'block';
			document.getElementById('user_connected').innerHTML = data.user
			document.getElementById('user_connected').style.display = 'block';
			document.getElementById('signin_btn_little').style.display = 'none';
			if (data.is_user_42)
				return [true, true];
			return [true, false];
		}
		else {
			document.getElementById('notif-div').style.display = 'none';
			document.getElementById('notif-div-little').style.display = 'none';
			document.getElementById('option').style.display = 'none';
			document.querySelector('.lst_link').style.display = 'none';
			document.getElementById('bar_sub_login').classList.remove('d-none');
			document.getElementById('bar_sub_login').classList.add('d-flex');
			document.getElementById('user_avatar').style.display = 'none';
			document.getElementById('user_connected').style.display = 'none';
			document.getElementById('signin_btn_little').style.display = 'block';
			return [false, false];
		}
	}
	catch (error) {
		console.error('Erreur:', error);
		return [false, false]; // Retourne false en cas d'erreur
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const notif_btn = Array.from(document.getElementsByClassName("notifications"));
	notif_btn.forEach(btn => {
		btn.addEventListener('click', () => {
			updateNotifications(false, null);
			setTimeout(() => {
				var modalElement = document.getElementById('notifModal');
				var successModal = new bootstrap.Modal(modalElement);
				successModal.show();
			}, 300);
		});
	});
	loadChangeLang();	
	handle_datalink();
	router();
});

function redirect_to(url) {
	const lang_path = window.location.pathname.substring(0, 3);
	let new_url = lang_path + url
	history.pushState(null, null, new_url);
	router();
}

function handle_datalink() {
	document.querySelectorAll('a[data-link]').forEach(link => {
		link.addEventListener('click', (event) => {
			event.preventDefault();
			const target = event.currentTarget.getAttribute('href');
			redirect_to(target);
		});
	});
}

let blockage = false;
document.addEventListener('keydown', (event) => {
	if (blockage && (event.key === 'ArrowUp' || event.key === 'ArrowDown'))
		event.preventDefault();
});

// Fonction pour rediriger et obtenir le contenu des pages
function router(){
	const path = window.location.pathname.substring(3); //chemin demandé par le user
	const appDiv = document.getElementById("app");
	blockage = false;
	DestroyCharts();
	checkAuthentification().then(([isAuthenticated, is_user_42]) => {
		switch (path) {
			case "/":
				if (isAuthenticated) {
					loadTemplate(appDiv, "temp_login");
					loadIndexLogin();
				}
				else {
					loadTemplate(appDiv, "temp_index");
					handle_datalink();
					loadIndex();
				}
				appDiv.className = "container col-md-10 py-2 px-3 my-5";
				break;
			case "/sign_in/":
				loadTemplate(appDiv, "temp_sign_in");
				appDiv.className = "container col-md-6 py-3 px-4 my-5";
				loadSignIn();
				break;
			case "/Game/":
				if (isAuthenticated) {
					loadTemplate(appDiv, "Game");
					appDiv.className = "container-md col-md-10 py-2 px-3 mt-4 mb-1 div-empty";
					blockage = true;
					initAll(false, null);
				} else
					redirect_to("/");
				break;
			case "/change-password/":
				if (isAuthenticated && !is_user_42) {
					loadTemplate(appDiv, "temp_change_password");
					appDiv.className = "container col-md-6 py-2 px-3 my-5";
					loadChangePassword();
				}
				else if (isAuthenticated && is_user_42)
					alert("You can't change your password because you are a 42 user.");
				else
					redirect_to("/");
				break;
			case "/change-avatar/":
				if (isAuthenticated && !is_user_42) {
					loadTemplate(appDiv, "temp_change_avatar");
					appDiv.className = "container col-md-10 py-2 px-3 my-5";
					loadChangeAvatar();
				}
				else if (isAuthenticated && is_user_42)
					alert("You can't change your avatar because you are a 42 user.");
				else
					redirect_to("/");
				break;
			case "/stats/":
				if (isAuthenticated) {
					loadTemplate(appDiv, "temp_stats");
					appDiv.className = "container col-md-10 py-2 px-3 my-5";
					get_stats();
				}
				else
					redirect_to("/");
				break;
			case "/privacy-policy/":
				loadPrivacyPolicy(appDiv);
				appDiv.className = "container col-md-10 py-2 px-3 my-5";
				break;
			default:
				loadTemplate(appDiv, "temp_notFound");
				appDiv.className = "container col-md-7 py-2 px-3 my-5";
		}
	});
}

export function loadSignIn() {
	refreshCSRFToken()
	const form = document.getElementById('sub_form');
	if (form) {
		form.addEventListener('submit', function(event) {
			event.preventDefault();
			handleFormSignIn();
		});
	}
	else {
		console.error("Form error");
		redirect_to("/error/")
	}
}

function handleFormSignIn() {
	const email = document.getElementById('email_input').value;
    const username = document.getElementById('username_input').value;
	const password = document.getElementById('passwd_input').value;
    const confirmPassword = document.getElementById('passwd_input2').value;
	const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
	
    fetch('/sign_in/', {
        method: 'POST',
        headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrfToken,
        },
        body: new URLSearchParams({
            'email': email,
			'username': username,
            'password': password,
            'confirm_password': confirmPassword
        })
    })
    .then(response => response.json())
    .then(data => {
		if (data.success){
			alert(data.info_msg);
			const appDiv = document.getElementById("app");
			appDiv.className = "container col-md-10 py-2 px-3 my-5";
			loadTemplate(appDiv, "temp_index");
			const div_info_msg = document.getElementById('alert_info_msg');
			div_info_msg.style.display = 'block';
			div_info_msg.textContent = data.info_msg;
		} else {
			const errList = document.querySelector('#err_sign_in ul');
			errList.innerHTML = '';
			data.err_list.forEach(err => {
				const newErr = document.createElement('li');
				newErr.style.color = 'red';
				newErr.textContent = err;
				errList.appendChild(newErr);
			});
		}
    })
    .catch(error => console.error('Erreur:', error));
}

// gère le retour arrière/avant dans l'historique (les flèches)
window.addEventListener('popstate', router);

// fonction pour gerer les connexion avec fetch en mode dynamique
document.getElementById('dropdown_form').addEventListener('submit', function(event) {
	event.preventDefault();  // Empêche le rechargement de la page
	
	const inputEmail = document.getElementById('Email_input').value;
	const inputPwd = document.getElementById('Passwd_input').value;
	const csrfToken = document.querySelector('[name=csrf-token]').content
	
	fetch('/api/login/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'X-CSRFToken': csrfToken
		},
		body: new URLSearchParams({
			'email': inputEmail,
			'password': inputPwd
		})
	})
	.then(response => response.json())
	.then(data => {
		// Affiche le message de réponse
		const lang = Get_Cookie("language")
		let message = null;
		if (!data.success){
			switch (lang) {
				case "fr":
					message = "Connexion échouée"
					break;
				case "en":
					message = "Connection failed"
					break;
				case "es":
					message = "Error de conexión"
				default:
					break;
			}
			document.getElementById('infoco').innerHTML = message
			showSuccessModal()
		}
		document.getElementById('dropdown_form').reset();
		redirect_to("/");
	})
	.catch(error => {
		console.error('Erreur:', error);
	});
});

// envoit l'info de connexion ou de deconnexion aux amis
function connexion_info(friend_lst) {
	setTimeout(() => {
		friend_lst.forEach(friend => {
			socket.send(JSON.stringify({
				command: 'connexion_info',
				friend_username: friend,
			}));
		});
	}, 3000);
}

function deconnexion_info(friend_lst) {
	friend_lst.forEach(friend => {
		socket.send(JSON.stringify({
			command: 'connexion_info',
			friend_username: friend,
		}));
	});
}

// Gestion du logout en SPA
document.getElementById('logout_btn').addEventListener('click', function() {
	logout()
});
	
function logout(){
	fetch('/api/logout/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': Get_Cookie('csrftoken')
		},
	})
	.then(response => response.json())
	.then(data => {
		if (data.success){
			clearFormFields()
			refreshCSRFToken()
			if (socket){
				if (data.friend_lst)
					deconnexion_info(data.friend_lst)
				socket.close()
				socket = null
			}
			closeChatSocket()
			closeMatchmakingSocket()
		}
		redirect_to("/")
	})
	.catch(error => console.error('Erreur:', error));
}

// delete account
document.getElementById('delete_account').addEventListener('click', function() {
	fetch('/api/delete-account/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': Get_Cookie('csrftoken')
		}
	})
	.then(response => response.json())
	.then(data => {
		const lang = Get_Cookie("language")
		let message = null;
		if (data.success) {
			switch (lang) {
				case "fr":
					message = "Compte supprimé avec succés"
					break;
				case "en":
					message = "Account successfully deleted"
					break;
				case "es":
					message = "Cuenta eliminada correctamente"
				default:
					break;
			}
			document.getElementById('infoco').innerHTML = message
			showSuccessModal()
			redirect_to("/")
		} else {
			alert("Error on delete account");
		}
	})
	.catch(error => console.error('Erreur:', error));
});

function loadIndexLogin() {
	document.getElementById('username_login').innerHTML = document.getElementById('user_connected').innerText;
	fetchFriendList();
	handle_datalink();
	closeChatSocket();
	document.getElementById("Openfriends_menu").addEventListener("click", function() {
		document.getElementById("friends_menu").classList.add("open");
	});
	document.getElementById("Closefriends_menu").addEventListener("click", function() {
		document.getElementById("friends_menu").classList.remove("open");
	});
	const form_AddFriend = document.getElementById('dropdown_AddFriend');
	if (form_AddFriend) {
		form_AddFriend.addEventListener('submit', function(event) {
			event.preventDefault();
			sendFriendRequest();
		});
	}
	else
		console.error("form_AddFriend not found")
}

function loadChangePassword() {
	refreshCSRFToken()
	const form = document.getElementById('change-password-form');
	if (form) {
		form.addEventListener('submit', function(event) {
			event.preventDefault();
			handleFormChangePassword();
		});
	}
	else {
		console.error("Form error");
		redirect_to("/error/")
	}
}

function handleFormChangePassword() {
	const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
	const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
	
    fetch('/api/change-password/', {
        method: 'POST',
        headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrfToken,
        },
        body: new URLSearchParams({
            'old_password': oldPassword,
            'new_password': newPassword,
            'confirm_password': confirmPassword
        })
    })
    .then(response => response.json())
    .then(data => {
		const lang = Get_Cookie("language")
		let message = null;
		if (data.success){
			switch (lang) {
				case "fr":
					message = "Mot de passe changé avec succés"
					break;
				case "en":
					message = "Password successfully changed"
					break;
				case "es":
					message = "Contraseña modificada correctamente"
				default:
					break;
			}
			document.getElementById('infoco').innerHTML = message
			showSuccessModal()
			redirect_to("/")
		} else {
			const errList = document.querySelector('#err_change_pwd ul');
			errList.innerHTML = ''; // Supprime tous les <li>
			data.err_list.forEach(err => {
				const newErr = document.createElement('li');
				newErr.style.color = 'red';
				newErr.textContent = err;
				errList.appendChild(newErr);
			});
		}
    })
    .catch(error => console.error('Erreur:', error));
}

// change avatar
function loadChangeAvatar() {
    refreshCSRFToken();
	const btn = document.getElementById('ChangeAvatar_btn');
	if (btn)
		btn.addEventListener('click', handleFormChangeAvatar);

    // Charger dynamiquement les avatars
    fetch('/media/avatars/')
        .then(response => response.text())
        .then(html => {
			const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = doc.querySelectorAll('a'); // Récupère tous les fichiers listés
            const avatarContainer = document.getElementById('avatar-container');
			avatarContainer.innerHTML = ''
            links.forEach(link => {
				const href = link.getAttribute('href');
                if (href.endsWith('.png') || href.endsWith('.jpg') || href.endsWith('.jpeg')) {
					// Ajouter chaque image dans le conteneur
                    const img = document.createElement('img');
                    img.src = `/media/avatars/${href}`;
                    img.width = 120;
                    img.height = 120;
                    img.style.cursor = 'pointer';
					img.classList.add('avatar-img');
                    img.addEventListener('click', function() {
						document.querySelectorAll('.avatar-img.selected').forEach(el => el.classList.remove('selected'));
                        img.classList.add('selected');
                        img.dataset.selected = true;
                    });
                    avatarContainer.appendChild(img);
                }
            });
        })
        .catch(error => console.error('Erreur:', error));
	};

// Fonction pour récupérer l'avatar sélectionné
function handleFormChangeAvatar() {
    const selectedImg = document.querySelector('img.selected');
    if (!selectedImg) {
		const lang = Get_Cookie("language")
		let err_msg = null;
		switch (lang) {
			case "fr":
				err_msg = "Veuillez sélectionner un avatar."
				break;
			case "en":
				err_msg = "Please select an avatar."
				break;
			case "es":
				err_msg = "Seleccione un avatar."
			default:
				break;
		}
		alert(err_msg);
        return;
    }

    const newAvatar = selectedImg.src.replace(window.location.origin, '');
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    fetch('/api/change-avatar/', {
        method: 'POST',
        headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrfToken,
        },
        body: new URLSearchParams({
            'avatar': newAvatar,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success)
			redirect_to("/");
        else {
			const lang = Get_Cookie("language")
			let err_msg = null;
			switch (lang) {
				case "fr":
					err_msg = "Echec du changement d'avatar."
					break;
				case "en":
					err_msg = "Failed to change avatar."
					break;
				case "es":
					err_msg = "El cambio de avatar falla."
				default:
					break;
			}
            alert(err_msg);
        }
    })
    .catch(error => console.error('Erreur:', error));
}

function get_stats() {
	fetch('/api/get_stats/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': Get_Cookie('csrftoken')
		}
	})
	.then(response => response.json())
    .then(data => {
		loadChart(0, data.win, data.lose);
		loadChart(1, data.Twin, data.Tlose);
		document.getElementById('Win_game').innerHTML = data.win
		document.getElementById('Lose_game').innerHTML = data.lose
		document.getElementById('Win_tournament').innerHTML = data.Twin
		document.getElementById('Lose_tournament').innerHTML = data.Tlose
		Fill_table(data.history)
	})
	.catch(error => console.error('Error fetching stats', error));
}

// Envoyer une demande d'amis
function sendFriendRequest() {
	const username = document.getElementById('AddFriend_input').value;
	document.getElementById('AddFriend_input').value = '';
    fetch('/api/friend-request/', {
        method: 'POST',
        headers: {
			'Content-Type': 'application/json',
            'X-CSRFToken': Get_Cookie('csrftoken')
        },
        body: JSON.stringify({ receiver_username: username })
    })
    .then(response => response.json())
    .then(data => {
		const lang = Get_Cookie("language")
		let msg_info;
		let err_msg;
		switch (lang) {
			case "fr":
				msg_info = "Demande d'ami envoyée à " + username
				err_msg = "Impossible d'inviter ce joueur."
				break;
			case "en":
				msg_info = "Friend request sent to " + username
				err_msg = "Impossible to invite this player."
				break;
			case "es":
				msg_info = "Solicitud de amistad enviada a " + username
				err_msg = "Imposible invitar a este jugador."
			default:
				break;
		}
		if (data.success)
			alert(msg_info);
		else
			alert(err_msg)
		fetchFriendList(); // Rafraîchir la liste des amis
    })
    .catch(error => console.error('Error sending friend request:', error));
}

// Variables globales Websocket
export let socket = null;

// Gestionnaire Friendship web socket
function InitializeWebsocket(){
	socket = new WebSocket(`wss://${window.location.host}/ws/friendship/`);
	
	socket.onmessage = function (event) {

		const data = JSON.parse(event.data);
		
		const lang = Get_Cookie("language")

		if (data.type === 'invite') {
            // Afficher le modal avec l'invitation
            showInvitationModal(data.sender_username);
			return
        }

		if (data.type === 'invite_response') {
			let ok_msg = null;
			let no_msg = null;
			switch (lang) {
				case "fr":
					ok_msg = "Invitation acceptée"
					no_msg = "Invitation refusée"
					break;
				case "en":
					ok_msg = "Invitation accepted"
					no_msg = "Invitation refused"
					break;
				case "es":
					ok_msg = "Invitación aceptada"
					no_msg = "Invitación denegada"
				default:
					break;
			}
			if (data.response === 'accepte'){
				alert(ok_msg);
				const appDiv = document.getElementById("app");
				loadTemplate(appDiv, "Game");
				appDiv.className = "container-md col-md-10 py-2 px-3 mt-4 mb-1 div-empty";
				blockage = true;
				initAll(true, data.sender_username);
			}
			else
				alert(no_msg);
			return
		}

		if (data.type === 'connexion'){
			fetchFriendList(() => {
				loadfriendinput();
				loadfriendmessage();
			});
			return;
		}

		let msg_to_send;
		let ok_msg;
		let no_msg;
		let del_msg;
		switch (lang) {
			case "fr":
				msg_to_send = "Vous avez une nouvelle demande d'ami de " + data.sender_username
				ok_msg = data.sender_username + " a accepté votre demande d'ami."
				no_msg = data.sender_username + " a refusé votre demande d'ami."
				del_msg = data.sender_username + " a supprimé votre lien d'amitié."
				break;
			case "en":
				msg_to_send = "You have a new friend request from " + data.sender_username
				ok_msg = data.sender_username + " has accepted your friend request."
				no_msg = data.sender_username + " has rejected your friend request."
				del_msg = data.sender_username + " removed your friendship."
				break;
			case "es":
				msg_to_send = "Tienes una nueva solicitud de amistad de " +  data.sender_username
				ok_msg = data.sender_username + " aceptó su solicitud de amistad."
				no_msg = data.sender_username + " rechazó tu solicitud de amistad."
				del_msg = data.sender_username + " cortó tu amistad."
			default:
				break;
		}
		let message;
		if (data.type_msg == 'request')
			message = msg_to_send
		else if (data.type_msg == 'response')
			if (data.status)
				message = ok_msg
			else
				message = no_msg
		else if (data.type_msg == 'delete')
			message = del_msg
		updateNotifications(true, message)
		alert(message);
		fetchFriendList(() => {
			loadfriendinput();
			loadfriendmessage();
		});
	};
	
	socket.onclose = function () {
		console.error("WebSocket connection closed.");
	};
};

// afficher le modal d'invitation a jouer
export function showInvitationModal(sender_username){
	var modalElement = document.getElementById('inviteModal');
	var invite_modal = new bootstrap.Modal(modalElement);
	invite_modal.show();
	document.getElementById('inviteSender').innerText = sender_username
	document.getElementById("inviteAccepte").addEventListener('click', () => {
		respondToInvite('accepte', sender_username)
	});
	document.getElementById("inviteRefuse").addEventListener('click', () => {
		respondToInvite('refuse', sender_username)
	});
}

// Repondre a l'inviation
function respondToInvite(response, sender_username) {
	// Envoyer la réponse au serveur via WebSocket
	socket.send(JSON.stringify({
		command: 'respond_to_invite',
		response: response,
		sender_username: sender_username,
	}));

	// Supprimer le modal
	const modal = document.getElementById('inviteModal');
	if (modal) modal.remove();

	if (response == "accepte"){
		const lang = Get_Cookie("language")
		let continue_msg = null;
		switch (lang) {
			case "fr":
				continue_msg = " vous attend a son poste"
				break;
			case "en":
				continue_msg = " is waiting for you at his post."
				break;
			case "es":
				continue_msg = " te espera en su puesto."
			default:
				break;
		}
		const message = sender_username + continue_msg
		updateNotifications(true, message)
		document.getElementById('infoco').innerText = message
		showSuccessModal()
	}
}

// Ajouter ou lister les notifications
// Ajouter avec param (true, message), lister avec param (false, null)
export function updateNotifications(update_notif_nb, message){
	fetch('/api/notifications/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': Get_Cookie('csrftoken')
		},
		body: JSON.stringify({
			update_notif_nb: update_notif_nb,
			message: message
		})
	})
	.then(response => response.json())
	.then(data => {
		const badge_notif = Array.from(document.getElementsByClassName("notif_nb"));
		if (data.update_notif_nb){
			badge_notif.forEach(badge => {
				badge.style.display = 'inline'
				badge.textContent = data.notif_nb
			});
			return
		}
		if (data.success){
			const notificationList = document.querySelector('#lst_notif ul');
			notificationList.innerHTML = '';
			data.messages.forEach(message => {
				const newNotification = document.createElement('li');
				newNotification.classList.add('list-group-item');
				newNotification.textContent = message;
				notificationList.appendChild(newNotification);
			});
			badge_notif.forEach(badge => {
				badge.style.display = 'none';
				badge.textContent = '';
			});
		}
		else{
			const notificationList = document.querySelector('#lst_notif ul');
			notificationList.innerHTML = '';
			const newNotification = document.createElement('li');
			newNotification.classList.add('list-group-item');
			newNotification.textContent = data.message;
			notificationList.appendChild(newNotification);
		}
	})
	.catch(error => console.error('Error update notifications:', error));
}
