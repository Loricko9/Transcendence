//Fonction qui permet de ne pas recharger la page (1ère appeler)
function redirect_to(url) {
	history.pushState(null, null, url);
	router();
}

// Fonction pour charger les template dans les div
function loadTemplate(appDiv, Id) {
	const template = document.getElementById(Id);
	appDiv.innerHTML = template ? template.innerHTML : "";
}

// fonction pour rediriger et obtenir le contenu des pages
function router(){
	const path = window.location.pathname; //chemin demandé par le user
	const appDiv = document.getElementById("app"); //selectionne le div 'app' pour ajouter des truc dedans 
	
	switch (path) {
		case "/":
			loadTemplate(appDiv, "temp_index");
			appDiv.className = "container-fluid col-md-10 py-2 px-3 my-5";
			break;
		case "/page1/":
			loadTemplate(appDiv, "temp_page1");
			appDiv.className = "container-fluid col-md-10 py-2 px-3 my-5";
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

//fonction pour detecter les click sur le liens
document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll('a[data-link]').forEach(link => {
		link.addEventListener('click', (event) => {
			event.preventDefault(); //evite le rechargement de la page
			const target = event.target.getAttribute('href');
			redirect_to(target); // vers la nouvelle page
		});
	});
	
	router(); //gère la cas pour rafraichir la page
});

//gère le retour arrière/avant dans l'historique (les flèches)
window.addEventListener('popstate', router);

function Click_login() {
    const dropdownElement = document.getElementById('dropdown_form');    
    const dropdown = new bootstrap.Dropdown(dropdownElement);
    dropdown.show();
}

// fonction pour gerer les connexion avec ajax
$(document).ready(function(){
	let csrftoken = $('meta[name=csrf-token]').attr('content');

	$.ajaxSetup({
		beforeSend: function(xhr, settings) {
			if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		}
	});

    $('#dropdown_form').on('submit', function(event){
        event.preventDefault();
		console.log('Formulaire soumis');  // Log de débogage

        let email = $('#email').val();
        let password = $('#password').val();
        console.log('Email:', email, 'Mot de passe:', password);  // Vérifiez que les valeurs sont récupérées correctement

		$.ajax({
            url: '/login/',  // L'URL du backend pour le login
            method: 'POST',
            data: {
                'email': email,
                'password': password,
                'csrfmiddlewaretoken': '{{ csrf_token }}'  // Important pour la sécurité
            },
            success: function(response){
                if (response.success) {
					console.log('Réponse du serveur:', response);  // Log pour afficher la réponse du serveur
                    // Redirection ou mise à jour de l'interface utilisateur pour un utilisateur connecté
                    $('#login-message').html('<p>Connexion réussie !</p>');
                } else {
                    $('#login-message').html('<p>' + response.error + '</p>');
                }
            },
            error: function(xhr, status, error){
				console.log('Erreur AJAX:', error);  // Log pour afficher les erreurs AJAX
                $('#login-message').html('<p>Erreur lors de la connexion. Veuillez réessayer.</p>');
            }
        });
    });
});
