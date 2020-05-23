document
	.querySelector('.custom-select-wrapper')
	.addEventListener('click', function () {
		this.querySelector('.custom-select1').classList.toggle('open');
	});
for (const option of document.querySelectorAll('.custom-option')) {
	option.addEventListener('click', function () {
		this.parentNode
			.querySelector('.custom-option.selected')
			.classList.remove('selected');
		this.classList.add('selected');
		if (this.textContent !== 'Other') {
			this.closest('.custom-select1').querySelector(
				'.custom-select__trigger span'
			).textContent = this.textContent;
			document.querySelector('.inp').value = this.textContent;
		}

		if (this.textContent === 'Other') {
			document.querySelector('.inp').type = 'text';
			document.querySelector('.inp').value = '';
			document.querySelector('.custom-select-wrapper').classList.add('hidden');
			//console.log(b);
		}
	});
}
window.addEventListener('click', function (e) {
	const select = document.querySelector('.custom-select1');
	if (!select.contains(e.target)) {
		select.classList.remove('open');
	}
});
