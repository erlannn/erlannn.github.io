document.addEventListener('DOMContentLoaded', () => {
	const menuButton = document.getElementById('mobile-menu-button');
	const mobileMenu = document.getElementById('mobile-menu');
	const siteHeader = document.getElementById('site-header');
	const siteNav = document.getElementById('site-nav');
	const themeToggle = document.getElementById('theme-toggle');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
	const animeApi = window.anime || {};
	const animate = animeApi.animate;
	const stagger = animeApi.stagger || animeApi.utils?.stagger;
	const random = animeApi.random || animeApi.utils?.random;
	const playMotion = (target, options) => {
		const motion = animate(target, options);
		if (motion && typeof motion.play === 'function') {
			motion.play();
		}
		return motion;
	};

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

	const animeAvailable = typeof animate === 'function' && typeof stagger === 'function' && typeof random === 'function';
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

		playMotion('#beranda .hero-animate', {
			opacity: [0, 1],
			y: [24, 0],
			delay: stagger(120),
			duration: 700,
			ease: 'out(4)',
		});

		playMotion('#beranda .hero-cta', {
			opacity: [0, 1],
			y: [16, 0],
			scale: [0.96, 1],
			duration: 550,
			ease: 'out(4)',
		});

		playMotion('#beranda .hero-portrait', {
			opacity: [0, 1],
			x: [28, 0],
			y: [-10, 0],
			scale: [0.92, 1],
			rotate: [-6, 0],
			duration: 1000,
			ease: 'out(4)',
		});

		playMotion('#beranda .hero-portrait', {
			x: () => random(-10, 10),
			y: () => random(-8, 8),
			rotate: () => random(-4, 4),
			duration: () => random(700, 1000),
			ease: 'out(2)',
			composition: 'blend',
		});

		playMotion('#beranda .hero-shape path', {
			x: () => random(-24, 24),
			y: () => random(-24, 24),
			rotate: () => random(-8, 8),
			duration: () => random(900, 1300),
			ease: 'out(3)',
			composition: 'blend',
		});
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

			playMotion('#tentangsaya .about-animate', {
				opacity: [0, 1],
				y: [22, 0],
				delay: stagger(120),
				duration: 650,
				ease: 'out(4)',
			});

			playMotion('#tentangsaya .about-visual', {
				opacity: [0, 1],
				x: [-20, 0],
				y: [12, 0],
				scale: [0.94, 1],
				rotate: [-5, 0],
				duration: 800,
				ease: 'out(4)',
			});

			playMotion('#tentangsaya .about-visual', {
				x: () => random(-8, 8),
				y: () => random(-8, 8),
				rotate: () => random(-3, 3),
				duration: () => random(700, 1100),
				ease: 'out(2)',
				composition: 'blend',
			});

			playMotion(skillLogos, {
				opacity: [0, 1],
				x: [0, 0],
				y: [18, 0],
				scale: [0.7, 1],
				rotate: [-10, 0],
				delay: stagger(70),
				duration: 700,
				ease: 'out(4)',
			});

			playMotion(skillLogos, {
				x: () => random(-6, 6),
				y: () => random(-6, 6),
				rotate: () => random(-10, 10),
				duration: () => random(500, 900),
				ease: 'out(2)',
				composition: 'blend',
				delay: stagger(70),
			});
		};

		const triggerAboutAnimation = () => {
			if (aboutAnimated) {
				return;
			}

			const aboutRect = aboutSection.getBoundingClientRect();
			const triggerPoint = window.innerHeight * 0.8;

			if (aboutRect.top <= triggerPoint && aboutRect.bottom >= 0) {
				playAboutAnimation();
				window.removeEventListener('scroll', handleAboutScroll);
				window.removeEventListener('resize', handleAboutScroll);
			}
		};

		const handleAboutScroll = () => {
			window.requestAnimationFrame(triggerAboutAnimation);
		};

		window.addEventListener('scroll', handleAboutScroll, { passive: true });
		window.addEventListener('resize', handleAboutScroll);
		triggerAboutAnimation();
		window.setTimeout(triggerAboutAnimation, 800);

		skillLogos.forEach((logo) => {
			logo.addEventListener('mouseenter', () => {
				playMotion(logo, {
					scale: 1.12,
					rotate: 5,
					duration: 220,
					ease: 'out(2)',
				});
			});

			logo.addEventListener('mouseleave', () => {
				playMotion(logo, {
					scale: 1,
					rotate: 0,
					duration: 260,
					ease: 'out(2)',
				});
			});
		});
	};

	const animateExperienceSection = () => {
		if (!animeAvailable || prefersReducedMotion.matches) {
			return;
		}

		const experienceSection = document.getElementById('pengalaman');
		if (!experienceSection) {
			return;
		}

		const marqueeViewport = experienceSection.querySelector('.experience-marquee');
		const marqueeTrack = experienceSection.querySelector('.experience-track');
		if (!marqueeViewport || !marqueeTrack) {
			return;
		}

		let marqueeInitialized = false;
		let trackMotion = null;
		let hoverReady = false;

		const originalLogos = Array.from(marqueeTrack.querySelectorAll('.experience-logo'));
		if (originalLogos.length === 0) {
			return;
		}

		const prepareMarquee = () => {
			if (marqueeInitialized) {
				return true;
			}

			const trackWidth = marqueeTrack.scrollWidth / 2;
			if (!trackWidth) {
				return false;
			}

			const cloneGroup = document.createElement('div');
			cloneGroup.className = 'experience-group flex flex-nowrap items-center gap-3 sm:gap-4';
			originalLogos.forEach((logo) => {
				cloneGroup.appendChild(logo.cloneNode(true));
			});
			marqueeTrack.appendChild(cloneGroup);

			marqueeViewport.style.position = 'relative';
			marqueeViewport.style.overflow = 'hidden';
			marqueeTrack.style.width = 'max-content';
			marqueeTrack.style.flexWrap = 'nowrap';
			marqueeTrack.style.willChange = 'transform';

			const startTrackMotion = () => {
				trackMotion = animate(marqueeTrack, {
					x: -trackWidth,
					duration: 16000,
					ease: 'linear',
					onComplete: () => {
						marqueeTrack.style.transform = 'translateX(0px)';
						if (!prefersReducedMotion.matches) {
							startTrackMotion();
						}
					},
				});

				if (trackMotion && typeof trackMotion.play === 'function') {
					trackMotion.play();
				}

				return trackMotion;
			};

			startTrackMotion();
			marqueeInitialized = true;
			hoverReady = true;
			return true;
		};

		const setLogoHoverState = (logo, isHovering) => {
			if (!hoverReady) {
				return;
			}

			if (isHovering) {
				if (trackMotion && typeof trackMotion.pause === 'function') {
					trackMotion.pause();
				}
				logo.style.zIndex = '20';
				playMotion(logo, {
					scale: 1.18,
					rotate: 0,
					duration: 280,
					ease: 'out(2)',
				});
				return;
			}

			playMotion(logo, {
				scale: 1,
				rotate: 0,
				duration: 260,
				ease: 'out(2)',
			});
			logo.style.zIndex = '';

			if (trackMotion && typeof trackMotion.play === 'function') {
				trackMotion.play();
			}
		};

		const attachHoverHandlers = () => {
			marqueeTrack.querySelectorAll('.experience-logo').forEach((logo) => {
				logo.addEventListener('mouseenter', () => setLogoHoverState(logo, true));
				logo.addEventListener('mouseleave', () => setLogoHoverState(logo, false));
			});
		};

		const tryStartExperienceMarquee = () => {
			if (marqueeInitialized) {
				return;
			}

			const sectionRect = experienceSection.getBoundingClientRect();
			const triggerPoint = window.innerHeight * 0.9;

			if (sectionRect.top <= triggerPoint && sectionRect.bottom >= 0 && prepareMarquee()) {
				attachHoverHandlers();
				window.removeEventListener('scroll', onExperienceScroll);
				window.removeEventListener('resize', onExperienceScroll);
			}
		};

		const onExperienceScroll = () => {
			window.requestAnimationFrame(tryStartExperienceMarquee);
		};

		window.addEventListener('scroll', onExperienceScroll, { passive: true });
		window.addEventListener('resize', onExperienceScroll);
		tryStartExperienceMarquee();
		window.setTimeout(tryStartExperienceMarquee, 700);
	};

	animateHeroSection();
	animateAboutSection();
	animateExperienceSection();

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

