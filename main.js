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
		const experienceSection = document.getElementById('pengalaman');
		if (!experienceSection) return;

		const marqueeViewport = experienceSection.querySelector('.experience-marquee');
		const marqueeTrack = experienceSection.querySelector('.experience-track');
		if (!marqueeViewport || !marqueeTrack) return;

		// Matikan animasi CSS agar JS RequestAnimationFrame mengontrol gerakan secara 100% presisi
		marqueeTrack.style.animation = 'none';
		marqueeTrack.style.willChange = 'transform';

		let isPaused = false;
		let currentX = 0;
		const speed = 1.0; // Kecepatan bergerak dari kiri ke kanan (piksel per frame)

		let halfWidth = marqueeTrack.scrollWidth / 2;

		const recalculateWidth = () => {
			halfWidth = marqueeTrack.scrollWidth / 2;
		};

		recalculateWidth();
		window.addEventListener('resize', recalculateWidth);
		window.setTimeout(recalculateWidth, 500);

		currentX = -halfWidth;

		const animateMarqueeFrame = () => {
			if (!isPaused && halfWidth > 0) {
				currentX += speed;
				if (currentX >= 0) {
					currentX = -halfWidth;
				}
				marqueeTrack.style.transform = `translate3d(${currentX}px, 0, 0)`;
			}
			requestAnimationFrame(animateMarqueeFrame);
		};

		requestAnimationFrame(animateMarqueeFrame);

		// Event handlers pause & resume saat kursor mouse di atas logo/marquee
		const pauseMarquee = () => {
			isPaused = true;
		};

		const resumeMarquee = () => {
			isPaused = false;
		};

		marqueeViewport.addEventListener('mouseenter', pauseMarquee);
		marqueeViewport.addEventListener('mouseleave', resumeMarquee);
		marqueeViewport.addEventListener('mouseover', pauseMarquee);
		marqueeViewport.addEventListener('pointerover', pauseMarquee);

		marqueeViewport.addEventListener('mouseout', (e) => {
			if (!marqueeViewport.contains(e.relatedTarget)) {
				resumeMarquee();
			}
		});

		marqueeViewport.addEventListener('pointerout', (e) => {
			if (!marqueeViewport.contains(e.relatedTarget)) {
				resumeMarquee();
			}
		});

		const items = marqueeTrack.querySelectorAll('.experience-item');
		items.forEach((item) => {
			item.addEventListener('mouseenter', pauseMarquee);
			item.addEventListener('mouseleave', resumeMarquee);
			item.addEventListener('mouseover', pauseMarquee);
			item.addEventListener('pointerover', pauseMarquee);
			item.addEventListener('focusin', pauseMarquee);
			item.addEventListener('focusout', resumeMarquee);
			item.addEventListener('touchstart', pauseMarquee, { passive: true });
			item.addEventListener('touchend', resumeMarquee, { passive: true });
		});
	};

	const initHeroTyping = () => {
		const typingElem = document.getElementById('hero-typing');
		if (!typingElem) return;

		const words = ['Full-Stack Developer', 'IT Support Specialist', 'Teknik Informatika Alumni', 'Web Developer'];
		let wordIdx = 0;
		let charIdx = 0;
		let isDeleting = false;
		let typingSpeed = 100;

		const type = () => {
			const currentWord = words[wordIdx];
			if (isDeleting) {
				typingElem.textContent = currentWord.substring(0, charIdx - 1);
				charIdx--;
				typingSpeed = 40;
			} else {
				typingElem.textContent = currentWord.substring(0, charIdx + 1);
				charIdx++;
				typingSpeed = 90;
			}

			if (!isDeleting && charIdx === currentWord.length) {
				typingSpeed = 2200;
				isDeleting = true;
			} else if (isDeleting && charIdx === 0) {
				isDeleting = false;
				wordIdx = (wordIdx + 1) % words.length;
				typingSpeed = 400;
			}

			setTimeout(type, typingSpeed);
		};

		type();
	};

	const initStatsCounter = () => {
		const counters = document.querySelectorAll('.counter');
		if (counters.length === 0) return;

		let animated = false;

		const startCounters = () => {
			if (animated) return;
			animated = true;

			counters.forEach((counter) => {
				const target = +counter.getAttribute('data-target') || 0;
				const duration = 1600;
				const startTime = performance.now();

				const updateCount = (currentTime) => {
					const elapsed = currentTime - startTime;
					const progress = Math.min(elapsed / duration, 1);
					const currentVal = Math.floor(progress * target);

					counter.textContent = currentVal;

					if (progress < 1) {
						requestAnimationFrame(updateCount);
					} else {
						counter.textContent = target;
					}
				};

				requestAnimationFrame(updateCount);
			});
		};

		const statSection = document.getElementById('statistik');
		if (statSection && 'IntersectionObserver' in window) {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						startCounters();
						observer.unobserve(entry.target);
					}
				});
			}, { threshold: 0.3 });
			observer.observe(statSection);
		} else {
			startCounters();
		}
	};

	const initProjectFilters = () => {
		const filterBtns = document.querySelectorAll('.project-filter-btn');
		const projectCards = document.querySelectorAll('.project-card');

		if (filterBtns.length === 0 || projectCards.length === 0) return;

		filterBtns.forEach((btn) => {
			btn.addEventListener('click', () => {
				filterBtns.forEach((b) => b.classList.remove('active'));
				btn.classList.add('active');

				const filterValue = btn.getAttribute('data-filter');

				projectCards.forEach((card) => {
					const categories = card.getAttribute('data-category') || '';
					if (filterValue === 'all' || categories.includes(filterValue)) {
						card.classList.remove('is-hidden');
						card.style.opacity = '0';
						card.style.transform = 'scale(0.95)';
						setTimeout(() => {
							card.style.opacity = '1';
							card.style.transform = 'scale(1)';
						}, 50);
					} else {
						card.classList.add('is-hidden');
					}
				});
			});
		});
	};

	const initModalLightbox = () => {
		const modal = document.getElementById('project-modal');
		if (!modal) return;

		const modalImg = document.getElementById('modal-img');
		const modalTitle = document.getElementById('modal-title');
		const modalDesc = document.getElementById('modal-desc');
		const modalTags = document.getElementById('modal-tags');
		const modalClose = document.getElementById('modal-close');
		const modalCloseBtn = document.getElementById('modal-close-btn');

		const openModal = (imgSrc, title, desc, tagsStr) => {
			if (modalImg) modalImg.src = imgSrc;
			if (modalTitle) modalTitle.textContent = title;
			if (modalDesc) modalDesc.textContent = desc;

			if (modalTags && tagsStr) {
				modalTags.innerHTML = '';
				tagsStr.split(',').forEach((tag) => {
					const span = document.createElement('span');
					span.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-blue-100 dark:bg-sky-900/60 text-[#254ABE] dark:text-sky-300';
					span.textContent = tag.trim();
					modalTags.appendChild(span);
				});
			}

			modal.classList.add('is-open');
			document.body.style.overflow = 'hidden';
		};

		const closeModal = () => {
			modal.classList.remove('is-open');
			document.body.style.overflow = '';
		};

		document.querySelectorAll('.modal-trigger').forEach((trigger) => {
			trigger.addEventListener('click', () => {
				const imgSrc = trigger.getAttribute('data-img');
				const title = trigger.getAttribute('data-title');
				const desc = trigger.getAttribute('data-desc');
				const tags = trigger.getAttribute('data-tags');
				openModal(imgSrc, title, desc, tags);
			});
		});

		if (modalClose) modalClose.addEventListener('click', closeModal);
		if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

		modal.addEventListener('click', (e) => {
			if (e.target === modal) closeModal();
		});

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && modal.classList.contains('is-open')) {
				closeModal();
			}
		});
	};

	const initToastNotif = () => {
		const toast = document.getElementById('toast-notif');
		const toastMsg = document.getElementById('toast-msg');
		const toastIcon = document.getElementById('toast-icon');
		let toastTimer = null;

		window.showToast = (msg, icon = '✨') => {
			if (!toast) return;
			if (toastMsg) toastMsg.textContent = msg;
			if (toastIcon) toastIcon.textContent = icon;

			toast.classList.add('is-show');
			clearTimeout(toastTimer);
			toastTimer = setTimeout(() => {
				toast.classList.remove('is-show');
			}, 3000);
		};

		document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
			link.addEventListener('click', () => {
				window.showToast('Membuka kontak email...', '📧');
			});
		});
	};

	const initBackToTop = () => {
		const btn = document.getElementById('back-to-top');
		if (!btn) return;

		window.addEventListener('scroll', () => {
			if (window.scrollY > 350) {
				btn.classList.add('is-visible');
			} else {
				btn.classList.remove('is-visible');
			}
		}, { passive: true });

		btn.addEventListener('click', () => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	};

	const initCursorSpotlight = () => {
		const spotlight = document.getElementById('cursor-spotlight');
		if (!spotlight || window.innerWidth < 768) return;

		document.addEventListener('mousemove', (e) => {
			spotlight.style.opacity = '1';
			spotlight.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(37, 74, 190, 0.08), transparent 80%)`;
		});

		document.addEventListener('mouseleave', () => {
			spotlight.style.opacity = '0';
		});
	};

	animateHeroSection();
	animateAboutSection();
	animateExperienceSection();
	initHeroTyping();
	initStatsCounter();
	initProjectFilters();
	initModalLightbox();
	initToastNotif();
	initBackToTop();
	initCursorSpotlight();

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

