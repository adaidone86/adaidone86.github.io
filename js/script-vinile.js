// CONFIGURAZIONE
const username = "adaidone86";
const repo = "adaidone86.github.io";

// --- FUNZIONI PER IL MODAL (POP-UP) ---

function openVinylModal(dati, folderName) {
    const modal = document.getElementById('vinyl-modal');
    const videoContainer = document.getElementById('modal-video');

    if (!modal || !videoContainer) return;

    // Inseriamo i testi
    document.getElementById('modal-title').innerText = dati.album;
    document.getElementById('modal-artist').innerText = dati.artista;
    document.getElementById('modal-description').innerText = dati.descrizione || "Nessun aneddoto disponibile per questo disco.";

    // Gestione Video (Cerca il file video.mp4 nella cartella del disco)
    const videoSource = dati.video || `img/vinile/${folderName}/video.mp4`;

    videoContainer.innerHTML = `
        <video controls autoplay muted loop style="width:100%; height:100%; object-fit:cover;">
            <source src="${videoSource}" type="video/mp4">
            Il tuo browser non supporta il tag video.
        </video>
    `;

    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Blocca lo scroll della pagina di sfondo
}

function closeModal() {
    const modal = document.getElementById('vinyl-modal');
    if (modal) {
        modal.style.display = "none";
        const videoContainer = document.getElementById('modal-video');
        if (videoContainer) videoContainer.innerHTML = ""; // Stoppa il video
        document.body.style.overflow = ""; // Riattiva lo scroll
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

    if (!wrapper || !swiperElement) return;

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
                            <span class="genere-tag" style="font-size: 0.8em; color: #ffdb58; background: #000; padding: 2px 8px; border-radius: 10px;">${dati.genere}</span>
                        </div>
                    `;

                    // Evento click per aprire il modal
                    slide.addEventListener('click', () => {
                        openVinylModal(dati, nomeCartella);
                    });

                    wrapper.appendChild(slide);

                    // Pre-caricamento immagini per evitare scatti allo Swiper
                    promesseImmagini.push(new Promise(resolve => {
                        const img = new Image();
                        img.src = coverPath;
                        img.onload = resolve;
                        img.onerror = resolve;
                    }));
                } catch (e) {
                    console.error("Errore caricamento disco:", nomeCartella, e);
                }
            }
        }

        // Aspetta che le immagini siano pronte
        await Promise.all(promesseImmagini);

        if (loader) loader.style.display = "none";
        swiperElement.style.opacity = "1";

        // --- INIZIALIZZAZIONE SWIPER ---
        const swiper = new Swiper(".mySwiper", {
            effect: "cards",
            grabCursor: true,
            initialSlide: 0,
            speed: 350, // Velocità aumentata (era 600ms)
            mousewheel: {
                invert: false,
                releaseOnEdges: false,
                sensitivity: 1, // Puoi alzare a 2 o 3 se vuoi che basti un tocco minimo
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            cardsEffect: {
                perSlideOffset: 12,
                perSlideRotate: 2,
                slideShadows: true,
            }
        });

        // --- FIX SCROLL: Blocca lo scroll della pagina quando il mouse è sopra lo Swiper ---
        swiperElement.addEventListener('wheel', (e) => {
            // Blocca la propagazione dell'evento wheel così scroll-handler.js non lo riceve
            e.stopPropagation();
        }, { passive: false });

    } catch (error) {
        console.error("Errore generale durante il caricamento:", error);
        if (loader) loader.innerHTML = "<p style='color: white;'>Errore nel caricamento della collezione.</p>";
    }
}

// Avvio
document.addEventListener("DOMContentLoaded", caricaCollezioneAutonoma);