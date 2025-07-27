window.addEventListener('DOMContentLoaded', () => {
	const nav = document.querySelector('nav');
	const logo = document.getElementById('logo');
	const page2 = document.querySelector('.page-2');
	const jump = document.querySelector('.tobogan');
	let jumpLoaded = false;
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

	setTimeout(() => {
		gsap.to(nav, {
			top: 0,
			duration: 0.5,
			ease: 'power2.out',
		});
	}, 500);

	function updateLogo(deltaY) {
		// Caso 1: si estamos en escala máxima, controlamos el vídeo
		if (scale >= maxScale) {
			gsap.to(page2, {
				autoAlpha: 1,
				duration: 0.5,
				ease: 'power2.out',
			});

			if (!jumpLoaded) {
				jump.src = 'jump.mp4';
				jump.load();
				jump.pause(); // control manual
				jumpLoaded = true;
			}

			if (jump.readyState >= 2 && jump.duration) {
				const framesPerScroll = 0.5; // segundos que avanza por tick
				const direction = Math.sign(deltaY);

				jump.currentTime = Math.max(0, Math.min(jump.duration, jump.currentTime + direction * framesPerScroll));

				// Solo cuando el vídeo vuelve al principio permitimos reducir la escala
				if (jump.currentTime <= 0.1 && direction < 0) {
					scale = maxScale - 0.1; // bajamos un poco para salir del "modo vídeo"
				}
			}
		}

		// Caso 2: si el logo no está en escala máxima, seguimos escalando el logo
		if (scale < maxScale) {
			scale += deltaY * 0.005;
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

			if (scale < maxScale) {
				gsap.to(page2, {
					autoAlpha: 0,
					duration: 0.5,
					ease: 'power2.out',
				});
			}
		}
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
