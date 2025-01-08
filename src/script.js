let navitems = document.querySelectorAll('.nav-item');
let sections = document.querySelectorAll(".section");

const queryString = window.location.search;
let hash = queryString.replace("?", "");

if (hash) {
	sections.forEach(section => { section.classList.remove('active'); });
	document.querySelector("#" + hash).classList.add('active');

	navitems.forEach(item => { item.classList.remove('active'); });
	document.querySelector(".nav-item-" + hash).classList.add('active');
}

for (let i = 0; i < navitems.length; i++) {
	navitems[i].addEventListener('click', function() {
		for (let j = 0; j < navitems.length; j++) {
			navitems[j].classList.remove('active');
		}
		this.classList.add('active');

		let id = this.getAttribute('data-id');
		sections.forEach(section => { section.classList.remove('active'); });
		document.querySelector("#" + id).classList.add('active');
	});
}