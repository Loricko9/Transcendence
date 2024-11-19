// fonction pour gerer l'affichage en fonction de si un client est connecte
async function checkAuthentification() {
	try{
		const response = await fetch('/check-auth/');
		const data = await response.json();
		if (data.is_authenticated) {
			// Affichage connecte
			document.getElementById('option').style.display = 'inline-block';
			document.getElementById('bar_sub_login').classList.add('d-none');
			document.getElementById('bar_sub_login').classList.remove('d-flex');
			document.getElementById('user_avatar').innerHTML = data.avatar;
			document.getElementById('user_avatar').style.display = 'block';
			document.getElementById('user_connected').innerHTML = data.user
			document.getElementById('user_connected').style.display = 'block';
			const nbWinElement = document.getElementById('nbWin');
			const nbLoseElement = document.getElementById('nbLose');
			if (nbWinElement && nbLoseElement) {
				nbWinElement.textContent = data.nb_win;
				nbLoseElement.textContent = data.nb_lose;
			}
			return true;
		}
		else {
			// Affichage deconnecte
			const appDiv = document.getElementById("app");
			loadTemplate(appDiv, "temp_index");
			document.getElementById('option').style.display = 'none';
			document.getElementById('bar_sub_login').classList.remove('d-none');
			document.getElementById('bar_sub_login').classList.add('d-flex');
			document.getElementById('user_avatar').style.display = 'none';
			document.getElementById('user_connected').style.display = 'none';
			return false;
		}
	}
	catch (error) {
		console.error('Erreur:', error);
		return false; // Retourne false en cas d'erreur
	}
}

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
			checkAuthentification().then(isAuthenticated => {
				if (isAuthenticated) {
					loadTemplate(appDiv, "temp_login");
					console.log("connect");
				} else {
					loadTemplate(appDiv, "temp_index");
					console.log("disconnect");
				}
			});
			appDiv.className = "container-fluid col-md-10 py-2 px-3 my-5";
			break;
		case "/page2/":
			loadTemplate(appDiv, "temp_page2");
			appDiv.className = "container-fluid col-md-10 py-2 px-3 my-5";
			break;
		case "/change-password/":
			checkAuthentification().then(isAuthenticated => {
				if (isAuthenticated) {
					loadTemplate(appDiv, "temp_change_password");
					appDiv.className = "container-fluid col-md-10 py-2 px-3 my-5";
				} else {
					const lang_path = window.location.pathname.substring(0, 3);
					redirect_to(lang_path + "/");
				}
			});
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
	const csrfToken = document.querySelector('[name=csrf-token]').content
	console.log(inputEmail)

	fetch('/login/', {
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
		checkAuthentification()
		const appDiv = document.getElementById("app");
		loadTemplate(appDiv, "temp_login");
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
		clearFormFields()
		refreshCSRFToken()
		showSuccessModal()
		checkAuthentification()
		const appDiv = document.getElementById("app");
		loadTemplate(appDiv, "temp_index");
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
	checkAuthentification().then(isAuthenticated => {
		if (isAuthenticated) {
			const appDiv = document.getElementById("app");
			loadTemplate(appDiv, "temp_login");
			console.log("connect");
		} else {
			const appDiv = document.getElementById("app");
			loadTemplate(appDiv, "temp_index");
			console.log("disconnect");
		}
	});
});


// Fonction pour rafraîchir le token CSR
function refreshCSRFToken() {
    fetch('/get-csrf-token/')
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
        fetch('/delete-account/', {
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
				checkAuthentification()
				const appDiv = document.getElementById("app");
				loadTemplate(appDiv, "temp_index");
            } else {
                alert("Erreur lors de la suppression du compte: " + data.message);
            }
        })
        .catch(error => console.error('Erreur:', error));
    }
});

// change password
document.getElementById('change_password_btn').addEventListener('click', function() {
	const appDiv = document.getElementById("app");
	loadTemplate(appDiv, "temp_change_password");
	console.log("template load")
	refreshCSRFToken()
	console.log("csrfToken refresh")
	const form = document.getElementById('change-password-form');
	if (form) {
		console.log("form trouve")
		form.addEventListener('submit', function(event) {
			event.preventDefault();
			handleFormChangePassword();
		});
	}
	else
		console.log("form pas trouve")
});

function handleFormChangePassword() {

	const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
	const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
	console.log(csrfToken);
	console.log("old-passWord: ", oldPassword)
	console.log("new-passWord: ", newPassword)

    fetch('/change-password/', {
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
		checkAuthentification()
		const appDiv = document.getElementById("app");
		loadTemplate(appDiv, "temp_login");
    })
    .catch(error => console.error('Erreur:', error));
}
