document.addEventListener("DOMContentLoaded", () => {
    const img = document.querySelector('.profile-img');
    const topWrapper = document.querySelector('.top-wrapper');
    const body = document.body;

    if (!img) return;

    // 1. Facciamo partire l'animazione sulla foto originale
    body.classList.add('animating');
    img.classList.add('intro-animation');

    // 2. Ascoltiamo la fine dell'animazione
    img.addEventListener('animationend', (e) => {
        if (e.animationName === 'growAndShrink') {

            // 3. Mostriamo i testi e il menu
            topWrapper.classList.add('header-ready');

            // 4. Sblocchiamo la pagina
            body.classList.remove('animating');

            // Pulizia opzionale: lasciamo l'immagine nel suo stato finale
            img.style.opacity = "1";
        }
    });
});