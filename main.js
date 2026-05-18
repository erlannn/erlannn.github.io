document.addEventListener('DOMContentLoaded', () => {
	const menuButton = document.getElementById('mobile-menu-button');
	const mobileMenu = document.getElementById('mobile-menu');
	const siteHeader = document.getElementById('site-header');
	const siteNav = document.getElementById('site-nav');
	const themeToggle = document.getElementById('theme-toggle');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

	const applyTheme = (theme) => {
		const isDark = theme === 'dark';
		document.body.classList.toggle('dark-mode', isDark);

		if (themeToggle) {
			themeToggle.classList.toggle('is-dark', isDark);
			themeToggle.setAttribute('aria-label', isDark ? 'Aktifkan light mode' : 'Aktifkan dark mode');
			themeToggle.setAttribute('title', isDark ? 'Aktifkan light mode' : 'Aktifkan dark mode');
			themeToggle.setAttribute('aria-pressed', String(isDark));
		}
	};

	const storedTheme = localStorage.getItem('theme');
	const initialTheme = storedTheme || (prefersDark.matches ? 'dark' : 'light');
	applyTheme(initialTheme);

	const revealElements = document.querySelectorAll('.reveal-on-scroll');
	if (revealElements.length > 0 && 'IntersectionObserver' in window) {
		const revealObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			});
		}, {
			threshold: 0.18,
			rootMargin: '0px 0px -80px 0px',
		});

		revealElements.forEach((element) => revealObserver.observe(element));
	} else {
		revealElements.forEach((element) => element.classList.add('is-visible'));
	}

	const animeAvailable = typeof window.anime === 'function';
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	const animationReadyClass = 'animejs-ready';

	const disableAnimePrestate = () => {
		document.documentElement.classList.remove(animationReadyClass);
	};

	const animateHeroSection = () => {
		if (!animeAvailable || prefersReducedMotion.matches) {
			disableAnimePrestate();
			return;
		}

		anime.timeline({
			easing: 'easeOutExpo',
			duration: 700,
		})
			.add({
				targets: '#beranda .hero-animate',
				opacity: [0, 1],
				translateY: [24, 0],
				delay: anime.stagger(120),
			})
			.add({
				targets: '#beranda .hero-cta',
				opacity: [0, 1],
				translateY: [16, 0],
				scale: [0.96, 1],
				duration: 550,
			}, '-=420')
			.add({
				targets: '#beranda .hero-portrait',
				opacity: [0, 1],
				translateX: [28, 0],
				scale: [0.92, 1],
				duration: 850,
			}, '-=680')
			.add({
				targets: '#beranda .hero-shape',
				opacity: [0, 1],
				scale: [0.9, 1],
				duration: 800,
			}, '-=620');
	};

	const animateAboutSection = () => {
		if (!animeAvailable || prefersReducedMotion.matches) {
			disableAnimePrestate();
			return;
		}

		const aboutSection = document.getElementById('tentangsaya');
		if (!aboutSection) {
			return;
		}

		const skillLogos = aboutSection.querySelectorAll('.skill-logo');
		let aboutAnimated = false;

		const playAboutAnimation = () => {
			if (aboutAnimated) {
				return;
			}

			aboutAnimated = true;

			anime.timeline({
				easing: 'easeOutExpo',
				duration: 650,
			})
				.add({
					targets: '#tentangsaya .about-animate',
					opacity: [0, 1],
					translateY: [22, 0],
					delay: anime.stagger(120),
				})
				.add({
					targets: '#tentangsaya .about-visual',
					opacity: [0, 1],
					translateX: [-20, 0],
					scale: [0.94, 1],
					duration: 800,
				}, '-=420')
				.add({
					targets: skillLogos,
					opacity: [0, 1],
					scale: [0.7, 1],
					rotate: [-10, 0],
					delay: anime.stagger(70),
					duration: 700,
				}, '-=360');
		};

		if ('IntersectionObserver' in window) {
			const aboutObserver = new IntersectionObserver((entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						playAboutAnimation();
						observer.disconnect();
					}
				});
			}, {
				threshold: 0.25,
				rootMargin: '0px 0px -120px 0px',
			});

			aboutObserver.observe(aboutSection);
		} else {
			playAboutAnimation();
		}

		skillLogos.forEach((logo) => {
			logo.addEventListener('mouseenter', () => {
				anime.remove(logo);
				anime({
					targets: logo,
					scale: 1.12,
					rotate: 5,
					duration: 220,
					easing: 'easeOutQuad',
				});
			});

			logo.addEventListener('mouseleave', () => {
				anime.remove(logo);
				anime({
					targets: logo,
					scale: 1,
					rotate: 0,
					duration: 260,
					easing: 'easeOutQuad',
				});
			});
		});
	};

	animateHeroSection();
	animateAboutSection();

	if (!menuButton || !mobileMenu) {
		return;
	}

	const setMenuState = (isOpen) => {
		mobileMenu.classList.toggle('max-h-0', !isOpen);
		mobileMenu.classList.toggle('opacity-0', !isOpen);
		mobileMenu.classList.toggle('pointer-events-none', !isOpen);
		mobileMenu.classList.toggle('py-0', !isOpen);
		mobileMenu.classList.toggle('max-h-80', isOpen);
		mobileMenu.classList.toggle('opacity-100', isOpen);
		mobileMenu.classList.toggle('pointer-events-auto', isOpen);
		mobileMenu.classList.toggle('py-3', isOpen);
		menuButton.setAttribute('aria-expanded', String(isOpen));
	};

	setMenuState(false);

	menuButton.addEventListener('click', () => {
		const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
		setMenuState(!isOpen);
	});

	mobileMenu.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => {
			setMenuState(false);
		});
	});

	window.addEventListener('resize', () => {
		if (window.innerWidth >= 1024) {
			setMenuState(false);
		}
	});

	if (themeToggle) {
		themeToggle.addEventListener('click', () => {
			const isDark = document.body.classList.contains('dark-mode');
			const nextTheme = isDark ? 'light' : 'dark';
			localStorage.setItem('theme', nextTheme);
			applyTheme(nextTheme);
			handleNavbarScroll();
		});
	}

	prefersDark.addEventListener('change', (event) => {
		if (!localStorage.getItem('theme')) {
			applyTheme(event.matches ? 'dark' : 'light');
			handleNavbarScroll();
		}
	});

	const handleNavbarScroll = () => {
		const isScrolled = window.scrollY > 20;
		const isDark = document.body.classList.contains('dark-mode');
		if (siteHeader) {
			siteHeader.classList.toggle('shadow-lg', isScrolled);
		}
		if (siteNav) {
			siteNav.classList.toggle('bg-gray-100/70', !isScrolled && !isDark);
			siteNav.classList.toggle('bg-white/95', isScrolled && !isDark);
			siteNav.classList.toggle('bg-slate-900/70', !isScrolled && isDark);
			siteNav.classList.toggle('bg-slate-900/95', isScrolled && isDark);
		}
	};

	handleNavbarScroll();
	window.addEventListener('scroll', handleNavbarScroll, { passive: true });
});

