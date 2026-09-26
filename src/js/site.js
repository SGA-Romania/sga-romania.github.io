(function () {
    const initStickyHeader = () => {
        const header = document.querySelector('header');
        if (!header) return;

        const mediaQuery = window.matchMedia('(max-width: 700px)');

        const updateHeaderState = () => {
            const shouldStick = mediaQuery.matches && window.scrollY > 8;
            header.classList.toggle('is-scrolled', shouldStick);
        };

        updateHeaderState();
        window.addEventListener('scroll', updateHeaderState, { passive: true });
        window.addEventListener('resize', updateHeaderState);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStickyHeader);
        return;
    }

    initStickyHeader();
})();
