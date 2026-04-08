document.addEventListener("DOMContentLoaded", () => {
    const img = document.querySelector('.profile-img');
    const topWrapper = document.querySelector('.top-wrapper');
    const body = document.body;
    const controls = document.querySelector('.scroll-controls');

    if (!img) return;

    body.classList.add('animating');
    img.classList.add('intro-animation');

    img.addEventListener('animationend', (e) => {
        if (e.animationName === 'growAndShrink') {
            topWrapper.classList.add('header-ready');
            body.classList.remove('animating');
            img.style.opacity = "1";

            // Mostriamo le frecce solo dopo l'intro
            if(controls) controls.classList.add('visible');
        }
    });
});