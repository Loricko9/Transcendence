import { initAll } from './Game_JS/Gamemain.js';

window.Change_lang = Change_lang;
window.handleFormChangeAvatar = handleFormChangeAvatar;

// fonction pour gerer l'affichage en fonction de si un client est connecte
async function checkAuthentification() {
	try{
		const response = await fetch('/api/check-auth/');
		const data = await response.json();
		if (data.is_authenticated) {
			// Affichage connecte
			document.getElementById('option').style.display = 'flex';
			document.querySelector('.lst_link').style.display = 'flex';
			document.getElementById('bar_sub_login').classList.add('d-none');
			document.getElementById('bar_sub_login').classList.remove('d-flex');
			document.getElementById('user_avatar').innerHTML = data.avatar;
			document.getElementById('user_avatar').style.display = 'block';
			document.getElementById('user_connected').innerHTML = data.user
			document.getElementById('user_connected').style.display = 'block';
			document.getElementById('signin_btn_little').style.display = 'none';
			const nbWinElement = document.getElementById('nbWin');
			const nbLoseElement = document.getElementById('nbLose');
			if (nbWinElement && nbLoseElement) {
				nbWinElement.textContent = data.nb_win;
				nbLoseElement.textContent = data.nb_lose;
			}
			if (data.is_user_42)
				return [true, true];
			return [true, false];
		}
		else {
			// Affichage deconnecte
			const appDiv = document.getElementById("app");
			loadTemplate(appDiv, "temp_index");
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

// Fonction qui permet de ne pas recharger la page (1ère appeler)
function redirect_to(url) {
	const lang_path = window.location.pathname.substring(0, 3);
	let new_url = lang_path + url
	history.pushState(null, null, new_url);
	router();
}

// Fonction pour charger les template dans les div
function loadTemplate(appDiv, Id) {
	const template = document.getElementById(Id);
	appDiv.innerHTML = template ? template.innerHTML : "";
}

// Fonction pour rediriger et obtenir le contenu des pages
let blockage = false;
// document.addEventListener('keydown', (event) => {if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {event.preventDefault();}});
document.addEventListener('keydown', (event) => {if (blockage && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {event.preventDefault();}});
function router(){
	const path = window.location.pathname.substring(3); //chemin demandé par le user
	const appDiv = document.getElementById("app"); // selectionne le div 'app' pour ajouter des truc dedans 
	blockage = false;
	checkAuthentification().then(([isAuthenticated, is_user_42]) => {
		switch (path) {
			case "/":
				if (isAuthenticated)
					loadTemplate(appDiv, "temp_login");
				else
					loadTemplate(appDiv, "temp_index");
				appDiv.className = "container-fluid col-md-10 py-2 px-3 my-5";
				break;
			case "/Game/":
				if (isAuthenticated) {
					loadTemplate(appDiv, "Game");
					appDiv.className = "";
					blockage = true;
					initAll();
				} else
					redirect_to("/");
				break;
			case "/change-password/":
				if (isAuthenticated && !is_user_42) {
					loadTemplate(appDiv, "temp_change_password");
					appDiv.className = "container-fluid col-md-6 py-2 px-3 my-5";
					loadChangePassword();
				}
				else
					redirect_to("/");
				break;
			case "/change-avatar/":
				if (isAuthenticated && !is_user_42) {
					loadTemplate(appDiv, "temp_change_avatar");
					appDiv.className = "container-fluid col-md-10 py-2 px-3 my-5";
					loadChangeAvatar();
				} else
					redirect_to("/");
				break;
			default:
				loadTemplate(appDiv, "temp_notFound");
				appDiv.className = "container-fluid col-md-7 py-2 px-3 my-5";
		}
	});
}

// Fonction pour detecter les click sur le liens / chargement page
document.addEventListener("DOMContentLoaded", () => {
	let lang = Get_Cookie("language");
	if (lang != null) {
		switch (lang) {
			case "fr":
				document.getElementById("btn_fr").classList.add("active")
				break;
			case "en":
				document.getElementById("btn_en").classList.add("active")
				break;
			case "es":
				document.getElementById("btn_es").classList.add("active")
				break;
			default:
				break;
		}
	}

	// fermeture auto de la fenetre de droite
	const offcanvasElement = document.getElementById('offcanvasRight');
	const offcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);

	document.getElementById('logout_btn').addEventListener('click', function () {
		offcanvasInstance.hide();
	});
	document.getElementById('deleteAccountBtn').addEventListener('click', function () {
		offcanvasInstance.hide();
	});
	document.getElementById('change_password_btn').addEventListener('click', function () {
		offcanvasInstance.hide();
	});
	document.getElementById('change_avatar_btn').addEventListener('click', function () {
		offcanvasInstance.hide();
	});
	
	// partie pour gerer empecher les <a data-link> de recharger la page
	document.querySelectorAll('a[data-link]').forEach(link => {
		link.addEventListener('click', (event) => {
			event.preventDefault(); // evite le rechargement de la page
			const target = event.currentTarget.getAttribute('href');
			redirect_to(target); // vers la nouvelle page
		});
	});
	router(); // gère la cas pour rafraichir la page
});

// gère le retour arrière/avant dans l'historique (les flèches)
window.addEventListener('popstate', router);

function Click_login() {
    let dropdownElement = document.getElementById('dropdown_form');
    const dropdown = new bootstrap.Dropdown(dropdownElement);
    dropdown.show();
}

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
		document.getElementById('infoco').innerHTML = data.message
		document.getElementById('dropdown_form').reset(); // reinitialise le form
		showSuccessModal()
		redirect_to("/")
	})
	.catch(error => {
		console.error('Erreur:', error);
	});
});

// Gestion du logout en SPA
document.getElementById('logout_btn').addEventListener('click', function() {
    fetch('/api/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': Get_Cookie('csrftoken')
        },
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('infoco').innerHTML = data.message
		clearFormFields()
		refreshCSRFToken()
		showSuccessModal()
		redirect_to("/")
    })
    .catch(error => console.error('Erreur:', error));
});

function Change_lang(lang) {
	const path = window.location.pathname.substring(3);
	window.location.href = "/api/lang/" + lang + "?prev=" + path
}

// Fonction pour recuperer la valeur d'un cookie
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

// Fonction pour afficher le modal
function showSuccessModal() {
	var successModal = new bootstrap.Modal(document.getElementById('successModal'));
	successModal.show();

	// Disparaît après 3 secondes (3000 ms)
	setTimeout(function() {
		successModal.hide();
	}, 3000); // 3000 ms = 3 secondes
}

// Fonction pour rafraîchir le token CSR
function refreshCSRFToken() {
    fetch('/api/get-csrf-token/')
        .then(response => response.json())
        .then(data => {
            document.querySelector('[name=csrf-token]').content = data.csrfToken;
        })
        .catch(error => console.error('Erreur lors du rafraîchissement du CSRF token:', error));
}

// Fonction pour vider les champs de connexion
function clearFormFields() {
    document.getElementById('Email_input').value = '';
    document.getElementById('Passwd_input').value = '';
}

// delete account
document.getElementById('deleteAccountBtn').addEventListener('click', function() {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
        fetch('/api/delete-account/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            	'X-CSRFToken': Get_Cookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('infoco').innerHTML = data.message
				showSuccessModal()
				redirect_to("/")
            } else {
                alert("Erreur lors de la suppression du compte: " + data.message);
            }
        })
        .catch(error => console.error('Erreur:', error));
    }
});

// change password
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
		document.getElementById('infoco').innerHTML = data.message
		showSuccessModal()
		redirect_to("/")
    })
    .catch(error => console.error('Erreur:', error));
}

// change avatar
function loadChangeAvatar() {
    refreshCSRFToken();

    // Charger dynamiquement les avatars
    fetch('/media/avatars/')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = doc.querySelectorAll('a'); // Récupère tous les fichiers listés
            const avatarContainer = document.getElementById('avatar-container');

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
        alert("Veuillez sélectionner un avatar.");
        return;
    }

    const newAvatar = selectedImg.src.replace(window.location.origin, '');
	console.log("newAvatar : ", newAvatar);
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
        document.getElementById('infoco').innerHTML = data.message;
        if (data.success) {
            showSuccessModal();
			redirect_to("/");
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Erreur:', error));
}