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
