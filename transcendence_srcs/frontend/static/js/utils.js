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
                backgroundColor: ['red', 'green'],
				hoverOffset: 4
            }]
        },
        options: {
			plugins: {
				responsive: false,
				maintainAspectRatio: false,
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

    // Supprimer aria-hidden et déplacer le focus sur la modale
    modalElement.removeAttribute('aria-hidden');
    modalElement.querySelector('.modal-content').focus();

    // Afficher la modale
    successModal.show();

	// Disparaît après 3 secondes (3000 ms)
	setTimeout(function() {
		successModal.hide();
		modalElement.setAttribute('aria-hidden', 'true');
	}, 3000); // 3000 ms = 3 secondes
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

window.Click_login = Click_login;
window.Change_lang = Change_lang;

function Click_login() {
    let dropdownElement = document.getElementById('dropdown_form');
    const dropdown = new bootstrap.Dropdown(dropdownElement);
    dropdown.show();
}

function Change_lang(lang) {
	const path = window.location.pathname.substring(3);
	window.location.href = "/api/lang/" + lang + "?prev=" + path
}
