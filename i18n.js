/* eslint-disable no-unused-vars */
(function () {
	const supported = ['en', 'es', 'fr', 'it', 'ca'];
	const flagPath = './flags/'; // Ruta de las banderas

	function detectLanguage() {
		const savedLang = localStorage.getItem('lang');
		if (savedLang && supported.includes(savedLang)) return savedLang;

		const browserLang = navigator.language.slice(0, 2).toLowerCase();
		return supported.includes(browserLang) ? browserLang : 'en';
	}

	async function loadLanguage(lang) {
		try {
			const res = await fetch(`./lang/${lang}.json`, {cache: 'no-cache'});
			if (!res.ok) throw new Error('File not found');
			const translations = await res.json();

			document.documentElement.setAttribute('lang', translations.lang || lang);
			document.querySelectorAll('[data-i18n]').forEach((el) => {
				const key = el.getAttribute('data-i18n');
				if (translations[key]) {
					el.textContent = translations[key];
				}
			});

			// Cambiar bandera del botón
			const flagEl = document.getElementById('current-lang-flag');
			if (flagEl) flagEl.src = `${flagPath}${lang}.svg`;

			// Guardar en localStorage
			localStorage.setItem('lang', lang);
		} catch (err) {
			console.warn(`Could not load language "${lang}", falling back to English`);
			if (lang !== 'en') loadLanguage('en');
		}
	}

	function setupLangSelector() {
		const btn = document.getElementById('current-lang-btn');
		const overlay = document.getElementById('lang-overlay');

		btn.addEventListener('click', () => {
			overlay.classList.toggle('hidden');
		});

		overlay.addEventListener('click', (e) => {
			if (e.target === overlay) {
				overlay.classList.add('hidden');
			}
		});

		document.querySelectorAll('#lang-options button').forEach((button) => {
			button.addEventListener('click', () => {
				const lang = button.getAttribute('data-lang');
				overlay.classList.add('hidden');
				loadLanguage(lang);
			});
		});
	}

	const lang = detectLanguage();
	loadLanguage(lang);
	document.addEventListener('DOMContentLoaded', setupLangSelector);
})();
