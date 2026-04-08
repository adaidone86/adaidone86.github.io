/**
 * Gestione dello scroll tramite pulsanti e visibilità controlli
 */

// 1. Funzione universale per lo scroll
function scrollText(distance) {
    const target = document.getElementById('scroll-target');
    if (target) {
        target.scrollBy({
            top: distance,
            behavior: 'smooth'
        });
    } else {
        console.warn("Elemento 'scroll-target' non trovato in questa pagina.");
    }
}

// 2. Gestione visibilità automatica
document.addEventListener("DOMContentLoaded", () => {
    const controls = document.querySelector('.scroll-controls');
    const body = document.body;

    // Se non siamo nella home (dove c'è l'animazione), mostriamo subito le frecce
    if (!body.classList.contains('animating')) {
        if (controls) controls.classList.add('visible');
    }

    // Nota: Se la pagina ha l'animazione intro, sarà il file index-animation.js
    // a chiamare controls.classList.add('visible') al termine del growAndShrink.
});