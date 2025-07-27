window.addEventListener('DOMContentLoaded', () => {
	const logo = document.getElementById('logo');
	let scale = 1;
	const maxScale = 15;
	let touchStartY = 0;

	// Guardamos la posición inicial del logo
	const rect = logo.getBoundingClientRect();
	const logoInitialCenterX = rect.left + rect.width / 2;
	const logoInitialCenterY = rect.top + rect.height / 2;

	const centerX = window.innerWidth / 2;
	const centerY = window.innerHeight / 2;

	const moveX = centerX - logoInitialCenterX;
	const moveY = centerY - logoInitialCenterY;

	function updateLogo(deltaY) {
		scale += deltaY * 0.005; // sensibilidad general
		scale = Math.max(1, Math.min(maxScale, scale));

		const progress = (scale - 1) / (maxScale - 1);
		const easedProgress = Math.pow(progress, 0.8);

		gsap.to(logo, {
			scale: scale,
			x: moveX * easedProgress,
			y: moveY * easedProgress,
			duration: 0.3,
			ease: 'power2.out',
		});
	}

	window.addEventListener(
		'wheel',
		(e) => {
			e.preventDefault();
			updateLogo(e.deltaY * 3);
		},
		{passive: false},
	);

	window.addEventListener(
		'touchstart',
		(e) => {
			touchStartY = e.touches[0].clientY;
		},
		{passive: true},
	);

	window.addEventListener(
		'touchmove',
		(e) => {
			e.preventDefault();
			const deltaY = touchStartY - e.touches[0].clientY;
			touchStartY = e.touches[0].clientY;
			updateLogo(deltaY * 10); // prueba con 0.01 o 0.005
		},
		{passive: false},
	);
});
