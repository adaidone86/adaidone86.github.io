const swiper = new Swiper(".mySwiper", {
    effect: "cards",
    grabCursor: true,
    mousewheel: true,
    keyboard: { enabled: true },
    // Queste opzioni ora vanno dentro l'oggetto cardsEffect
    cardsEffect: {
        perSlideOffset: 10,  // Distanza tra i dischi
        perSlideRotate: 2,   // Rotazione dei dischi sotto
        slideShadows: true,  // Ombre
    },
});