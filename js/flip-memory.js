document.addEventListener("DOMContentLoaded", () => {
    const frontImg = document.querySelector('.profile-flip-card .front');
    const container = document.querySelector('.profile-flip-container');

    // Recupera l'ultima immagine dal localStorage
    const lastImage = localStorage.getItem('lastProfileImage');

    if (lastImage && frontImg) {
        // Applichiamo subito l'immagine precedente
        frontImg.src = lastImage;

        // Rendiamo visibile solo dopo un micro-ritardo per essere sicuri che il browser l'abbia caricata
        setTimeout(() => {
            container.classList.add('flip-ready');
        }, 50);
    } else if (container) {
        // Se è la prima volta, rendiamo visibile quella di default
        container.classList.add('flip-ready');
    }

    // SALVATAGGIO: Salviamo sempre l'immagine "finale" (quella back)
    const currentBackImg = document.querySelector('.profile-flip-card .back');
    const indexImg = document.querySelector('.main-header .profile-img:not(.back)');

    if (currentBackImg) {
        localStorage.setItem('lastProfileImage', currentBackImg.getAttribute('src'));
    } else if (indexImg) {
        localStorage.setItem('lastProfileImage', indexImg.getAttribute('src'));
    }
});