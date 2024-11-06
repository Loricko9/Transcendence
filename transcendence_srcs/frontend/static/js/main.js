// Fonction qui permet de ne pas recharger la page (1ère appeler)
function redirect_to(url) {
	history.pushState(null, null, url);
	router();
}

// Fonction pour charger les template dans les div
function loadTemplate(appDiv, Id) {
	const template = document.getElementById(Id);
	appDiv.innerHTML = template ? template.innerHTML : "";
}

// Fonction pour rediriger et obtenir le contenu des pages
function router(){
	const path = window.location.pathname.substring(3); //chemin demandé par le user
	const appDiv = document.getElementById("app"); // selectionne le div 'app' pour ajouter des truc dedans 

	switch (path) {
		case "/":
			loadTemplate(appDiv, "temp_index");
			appDiv.className = "container-fluid col-md-10 py-2 px-3 my-5";
			break;
		case "/page1/":
			loadTemplate(appDiv, "temp_page1");
			appDiv.className = "NaN";
			break;
		case "/page2/":
			loadTemplate(appDiv, "temp_page2");
			appDiv.className = "container-fluid col-md-10 py-2 px-3 my-5";
			break;
		case "/page3/":
			loadTemplate(appDiv, "temp_page3");
			appDiv.className = "container-fluid col-md-10 py-2 px-3 my-5";
			break;
		default:
			loadTemplate(appDiv, "temp_notFound");
			appDiv.className = "container-fluid col-md-7 py-2 px-3 my-5";
	}
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
	
	// partie pour gerer empecher les <a data-link> de recharger la page
	document.querySelectorAll('a[data-link]').forEach(link => {
		link.addEventListener('click', (event) => {
			event.preventDefault(); // evite le rechargement de la page
			const target = event.currentTarget.getAttribute('href');
			const lang_path = window.location.pathname.substring(0, 3);
			redirect_to(lang_path + target); // vers la nouvelle page
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

	fetch('/login/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'X-CSRFToken': document.querySelector('[name=csrf-token]').content
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
		showSuccessModal()
		checkAuthentification()
	})
	.catch(error => {
		console.error('Erreur:', error);
	});
});

// Gestion du logout en SPA
document.getElementById('logout_btn').addEventListener('click', function() {
    fetch('/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': Get_Cookie('csrftoken')
        },
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('infoco').innerHTML = data.message
		showSuccessModal()
		checkAuthentification()
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

// gestion du display au moment du click sur le logo
document.getElementById('logo').addEventListener('click', function() {
	checkAuthentification()
});

// Gestion du display en fonction de si l'utilisateur est connecte ou pas en mode dynamique
document.addEventListener('DOMContentLoaded', function() {
	checkAuthentification()
});

function checkAuthentification() {
	fetch('/check-auth/')
		.then(response => response.json())
		.then(data => {
			if (data.is_authenticated) {
				// Affichage connecte
				document.getElementById('logout_btn').style.display = 'inline-block';
				document.getElementById('bar_sub_login').classList.add('d-none');
				document.getElementById('bar_sub_login').classList.remove('d-flex');
				document.getElementById('user_connected').innerHTML = data.user
				document.getElementById('user_connected').style.display = 'block';
				document.getElementById('sign_log').style.display = 'none';
				const nbWinElement = document.getElementById('nbWin');
				const nbLoseElement = document.getElementById('nbLose');
				if (nbWinElement && nbLoseElement) {
					nbWinElement.textContent = data.nb_win;
					nbLoseElement.textContent = data.nb_lose;
				}
				document.getElementById('stats').style.display = 'flex';
				document.getElementById('game').style.display = 'block';
				
			} else {
				// Affichage deconnecte
				document.getElementById('logout_btn').style.display = 'none';
				document.getElementById('bar_sub_login').classList.remove('d-none');
				document.getElementById('bar_sub_login').classList.add('d-flex');
				document.getElementById('user_connected').style.display = 'none';
				document.getElementById('sign_log').style.display = 'flex';
				document.getElementById('stats').style.display = 'none';
				document.getElementById('game').style.display = 'none';
			}
		})
		.catch(error => console.error('Erreur:', error));
}