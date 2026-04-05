// CONFIGURAZIONE
const username = "adaidone86";
const repo = "adaidone86.github.io";

// --- FUNZIONI PER IL MODAL (POP-UP) ---

function openVinylModal(dati, folderName) {
    const modal = document.getElementById('vinyl-modal');
    const videoContainer = document.getElementById('modal-video');

    // Inseriamo i testi
    document.getElementById('modal-title').innerText = dati.album;
    document.getElementById('modal-artist').innerText = dati.artista;
    document.getElementById('modal-description').innerText = dati.descrizione || "Nessun aneddoto disponibile per questo disco.";

    // Gestione Video (Cerca il file video.mp4 nella cartella del disco)
    // Se nel JSON hai specificato un link diverso usa quello, altrimenti usa il default locale
    const videoSource = dati.video || `img/vinile/${folderName}/video.mp4`;

    videoContainer.innerHTML = `
        <video controls autoplay muted loop>
            <source src="${videoSource}" type="video/mp4">
            Il tuo browser non supporta il tag video.
        </video>
    `;

    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Blocca lo scroll della pagina
}

function closeModal() {
    const modal = document.getElementById('vinyl-modal');
    if (modal) {
        modal.style.display = "none";
        document.getElementById('modal-video').innerHTML = ""; // Stoppa il video svuotando il contenitore
        document.body.style.overflow = "auto"; // Riattiva lo scroll
    }
}

// Chiudi cliccando sulla X o fuori dal modal
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-modal') || e.target.id === 'vinyl-modal') {
        closeModal();
    }
});

// --- CARICAMENTO COLLEZIONE ---

async function caricaCollezioneAutonoma() {
    const wrapper = document.getElementById('album-wrapper');
    const swiperElement = document.querySelector('.mySwiper');
    const loader = document.getElementById('loader-container');

    swiperElement.style.opacity = "0";

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

                    // --- AGGIUNGIAMO L'EVENTO CLICK PER IL MODAL ---
                    slide.addEventListener('click', () => {
                        openVinylModal(dati, nomeCartella);
                    });

                    wrapper.appendChild(slide);

                    promesseImmagini.push(new Promise(resolve => {
                        const img = new Image();
                        img.src = coverPath;
                        img.onload = resolve;
                        img.onerror = resolve;
                    }));
                } catch (e) { console.error("Errore caricamento disco:", e); }
            }
        }

        await Promise.all(promesseImmagini);

        swiperElement.style.display = "block";

        new Swiper(".mySwiper", {
            effect: "cards",
            grabCursor: true,
            mousewheel: true,
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

        if (loader) loader.style.display = "none";
        swiperElement.style.opacity = "1";

    } catch (error) {
        console.error("Errore generale:", error);
        if (loader) loader.innerHTML = "<p>Errore nel caricamento dei vinili.</p>";
    }
}

caricaCollezioneAutonoma();