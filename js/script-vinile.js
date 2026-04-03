// CONFIGURAZIONE
const username = "adaidone86";
const repo = "adaidone86.github.io";

async function caricaCollezioneAutonoma() {
    const wrapper = document.getElementById('album-wrapper');
    const swiperElement = document.querySelector('.mySwiper');
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/img/vinile`;

    try {
        const response = await fetch(apiUrl);
        const cartelle = await response.json();
        if (!Array.isArray(cartelle)) return;

        wrapper.innerHTML = "";
        const promesseImmagini = [];

        for (const item of cartelle) {
            if (item.type === "dir") {
                const nomeCartella = item.name;
                try {
                    const resJson = await fetch(`img/vinile/${nomeCartella}/info.json`);
                    const dati = await resJson.json();
                    const coverPath = `img/vinile/${nomeCartella}/cover.jpg`;

                    // Creiamo l'elemento HTML
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide album-item';
                    slide.innerHTML = `
                        <img src="${coverPath}" alt="${dati.album}" class="album-cover">
                        <div class="album-info">
                            <h3>${dati.album}</h3>
                            <p><strong>${dati.artista}</strong> | ${dati.anno || ''}</p>
                            <span class="genere-tag" style="font-size: 0.8em; color: #0077b5;">${dati.genere}</span>
                        </div>
                    `;
                    wrapper.appendChild(slide);

                    // Precaricamento immagine
                    promesseImmagini.push(new Promise(resolve => {
                        const img = new Image();
                        img.src = coverPath;
                        img.onload = resolve;
                        img.onerror = resolve;
                    }));
                } catch (e) { console.error(e); }
            }
        }

        // Aspettiamo che tutto sia pronto "dietro le quinte"
        await Promise.all(promesseImmagini);

// Inizializziamo lo Swiper con le immagini già in memoria
        new Swiper(".mySwiper", {
            effect: "cards",
            grabCursor: true,
            mousewheel: true,
            // RIABILITIAMO LA TASTIERA QUI SOTTO
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            cardsEffect: {
                perSlideOffset: 12,
                perSlideRotate: 2,
                slideShadows: true,
            }
        });

        // SOLO ORA mostriamo tutto con un unico movimento fluido
        swiperElement.style.opacity = "1";

    } catch (error) {
        console.error("Errore:", error);
    }
}

caricaCollezioneAutonoma();