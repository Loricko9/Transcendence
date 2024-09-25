//Fonction qui permet de ne pas recharger la page (1ère appeler)
const redirect_to = (url) => {
	history.pushState(null, null, url);
	router();
}

// fonction pour rediriger et obtenir le contenu des pages
const router = () => {
	const path = window.location.pathname; //chemin demandé par le user
	const appDiv = document.getElementById("app"); //selectionne le div 'app' pour ajouter des truc dedans 
	
	switch (path) {
		case "/":
			appDiv.innerHTML = "<h2>C'est ici la page principale !</h2>";
			break;
		case "/page1/":
			appDiv.innerHTML = "<h2>C'est la page 1</h2>";
			break;
		case "/page2/":
			appDiv.innerHTML = "<h2>C'est la superbe page 2</h2>";
			break;
		case "/page3/":
			appDiv.innerHTML = "<h2>C'est la magnifique et dernière page</h2>";
			break;
		default:
			appDiv.innerHTML = "<h2>Page non trouvée !! PRANKED</h2>";
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
