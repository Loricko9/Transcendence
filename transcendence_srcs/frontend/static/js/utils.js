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
		loadfriendinput();
		loadfriendmessage();
	});
	if (friend.id == id_friend_active)
		button.classList.add("border-blue");
}

export function loadfriendmessage() {
	const div = document.getElementById("message_lst");
	const friend = friendship_lst.find(line => line.id == id_friend_active);
	if (friend && friend.status == "accepted") {
		div.innerHTML = "";
		div.className = "d-flex flex-column flex-grow-1"
		Add_message("prout", true);
		Add_message("caca", true);
		Add_message("rgrgdfgtezgr", false);
		Add_message("rgrgdfgtezgrgghtgdgdrffssdgfghergdfbfgdsvfgezfvfvbsdfdfgsfefdftezrfesffgtze", false);
		Add_message("rgrgdfgtezgrgghtgdgdrffssdgfghergdfbfgdsvfgezfvfvbsdfdfgsfefdftezrfesffgtze", false);
		Add_message("rgrgdfgtezgrgghtgdgdrffssdgfghergdfbfgdsvfgezfvfvbsdfdfgsfefdftezrfesffgtze", false);
		Add_message("rgrgdfgtezgrgghtgdgdrffssdgfghergdfbfgdsvfgezfvfvbsdfdfgsfefdftezrfesffgtze", false);
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

export function loadfriendinput() {
	const div = document.getElementById("message_input");
	div.style.display = "block";
	const friend = friendship_lst.find(line => line.id == id_friend_active);
	if (friend) {
		if (friend.status == "accepted") {
			div.innerHTML = document.getElementById("temp_send_message").innerHTML;
			document.getElementById("delete_friend").addEventListener('click', () => {
				deleteFriendship(id_friend_active);
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
	document.getElementById("message_lst").appendChild(tempDiv);
}

window.Click_login = Click_login;
window.Change_lang = Change_lang;
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

function deleteFriendship(friendshipId){
	fetch(`/api/friends/${friendshipId}/`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': Get_Cookie('csrftoken')
		}
	})
	.then(response => {
		if (response.ok) {
			console.log('Friendship deleted successfully.');
			friendshipId = -1;
			fetchFriendList(() => {
				loadfriendinput();
				loadfriendmessage();
			});
		} else {
			console.error('Failed to delete friendship.');
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
        alert(data.message || data.error);
		fetchFriendList(() => {
			console.log(friendship_lst);
			loadfriendinput();
			loadfriendmessage();
		});
    })
    .catch(error => console.error('Error responding to friend request:', error));
}
