document.addEventListener('DOMContentLoaded', () => {
	const menuButton = document.getElementById('mobile-menu-button');
	const mobileMenu = document.getElementById('mobile-menu');
	const siteHeader = document.getElementById('site-header');
	const siteNav = document.getElementById('site-nav');

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

	const handleNavbarScroll = () => {
		const isScrolled = window.scrollY > 20;
		if (siteHeader) {
			siteHeader.classList.toggle('shadow-lg', isScrolled);
		}
		if (siteNav) {
			siteNav.classList.toggle('bg-gray-100/70', !isScrolled);
			siteNav.classList.toggle('bg-white/95', isScrolled);
		}
	};

	handleNavbarScroll();
	window.addEventListener('scroll', handleNavbarScroll, { passive: true });
});