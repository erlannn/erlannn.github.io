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