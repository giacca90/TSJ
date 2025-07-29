/* global gsap */

window.addEventListener('DOMContentLoaded', () => {
	const nav = document.querySelector('nav');
	const logo = document.getElementById('logo');
	const page2 = document.querySelector('.page-2');
	const jump = document.querySelector('.jump');
	const maxScale = 15;
	const windowHeight = window.innerHeight;
	let jumpLoaded = false;
	let scale = 1;
	let touchStartY = 0;
	let currentPosition = 0;

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

	function animateLogo() {
		// Calcular la escala lineal entre 1 y maxScale basada en el scroll
		scale = 1 + (currentPosition / windowHeight) * (maxScale - 1);
		scale = Math.min(maxScale, Math.max(1, scale)); // limitar entre 1 y maxScale

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

	function animateJump() {
		if (!jumpLoaded) {
			jump.src = 'jump.mp4';
			jump.load();
			jump.pause(); // control manual
			jumpLoaded = true;
		}

		gsap.to(page2, {
			autoAlpha: 1,
			duration: 0.5,
			ease: 'power2.out',
		});

		if (jump.readyState >= 2 && jump.duration) {
			const videoLength = jump.duration;
			let second = 0 + ((currentPosition - windowHeight) / windowHeight) * videoLength;
			jump.currentTime = second;
		}
	}

	function updatePosition(deltaY) {
		currentPosition += deltaY;
		if (currentPosition < 0) {
			currentPosition = 0;
		}

		const page = Math.floor(currentPosition / windowHeight);

		switch (page) {
			case 0:
				gsap.to(page2, {
					autoAlpha: 0,
					duration: 0.5,
					ease: 'power2.out',
				});
				animateLogo();
				break;
			case 1:
				animateJump();
				break;
			default:
				break;
		}
	}

	window.addEventListener(
		'wheel',
		(e) => {
			e.preventDefault();
			updatePosition(e.deltaY);
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
			updatePosition(deltaY * 2);
		},
		{passive: false},
	);

	window.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowUp') {
			updatePosition(-Math.floor(windowHeight / 10));
		}
		if (e.key === 'ArrowDown') {
			updatePosition(Math.floor(windowHeight / 10));
		}
	});
});
