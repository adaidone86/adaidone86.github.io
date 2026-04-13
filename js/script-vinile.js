// CONFIGURAZIONE
const username = "adaidone86";
const repo = "adaidone86.github.io";

// --- FUNZIONI PER IL MODAL (POP-UP) ---

// --- FUNZIONI PER IL MODAL (POP-UP) ---

function openVinylModal(dati, folderName) {
    const modal = document.getElementById('vinyl-modal');
    const videoContainer = document.getElementById('modal-video');

    if (!modal || !videoContainer) return;

    document.getElementById('modal-title').innerText = dati.album;
    document.getElementById('modal-artist').innerText = dati.artista;
    document.getElementById('modal-description').innerText = dati.descrizione || "Nessun aneddoto disponibile per questo disco.";

    // --- GESTIONE TRACKLIST CON TAB ---
    let tracklistHTML = "";
    if (dati.tracklist && dati.tracklist.length > 0) {
        // 1. Raggruppiamo i brani per Disco e Lato
        const groups = {};
        dati.tracklist.forEach(brano => {
            const key = `Disco ${brano.disco} - Lato ${brano.lato}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(brano);
        });

        const keys = Object.keys(groups); // Es. ["Disco 1 - Lato A", "Disco 1 - Lato B"]

        // 2. Creiamo i bottoncini (Tab)
        let buttonsHTML = `<div class="tracklist-tabs" style="margin-bottom: 15px; display: flex; gap: 10px; flex-wrap: wrap;">`;
        keys.forEach((key, index) => {
            const activeClass = index === 0 ? 'active-tab' : '';
            buttonsHTML += `
                <button class="tab-btn ${activeClass}"
                        onclick="mostraTabTracklist(this, '${key.replace(/\s/g, '-')}')"
                        style="padding: 5px 12px; border: 1px solid #ffdb58; background: transparent; color: #ffdb58; cursor: pointer; border-radius: 5px; font-size: 0.8em;">
                    ${key}
                </button>`;
        });
        buttonsHTML += `</div>`;

        // 3. Creiamo i contenitori delle liste
        let listsHTML = `<div class="tracklist-containers">`;
        keys.forEach((key, index) => {
            const displayStyle = index === 0 ? 'block' : 'none';
            listsHTML += `
                <ul id="${key.replace(/\s/g, '-')}" class="tab-content" style="display: ${displayStyle}; list-style: none; padding-left: 0;">
                    ${groups[key].map(brano => `
                        <li style="margin-bottom: 5px; font-size: 0.9em;">
                            <span style="color: #ffdb58; font-weight: bold; margin-right: 10px;">${brano.n}.</span>
                            ${brano.titolo}
                        </li>
                    `).join('')}
                </ul>`;
        });
        listsHTML += `</div>`;

        tracklistHTML = `
            <div class="modal-tracklist" style="margin-top: 20px; border-top: 1px solid #333; padding-top: 15px;">
                <h4 style="color: #ffdb58; margin-bottom: 15px;"><i class="fas fa-list"></i> Tracce</h4>
                ${buttonsHTML}
                ${listsHTML}
            </div>
        `;
    }

    const infoContainer = document.querySelector('.modal-info');
    const vecchiaTracklist = infoContainer.querySelector('.modal-tracklist');
    if (vecchiaTracklist) vecchiaTracklist.remove();
    infoContainer.insertAdjacentHTML('beforeend', tracklistHTML);

    // Gestione Video
    const videoSource = dati.video || `img/vinile/${folderName}/video.mp4`;
    videoContainer.innerHTML = `
        <video controls autoplay muted loop style="width:100%; height:100%; object-fit:cover;">
            <source src="${videoSource}" type="video/mp4">
            Il tuo browser non supporta il tag video.
        </video>
    `;

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

// Funzione globale per cambiare Tab (deve essere fuori dalle altre funzioni)
window.mostraTabTracklist = function(btn, targetId) {
    // Rimuovi classe active da tutti i bottoni del modal
    const parent = btn.parentElement;
    parent.querySelectorAll('.tab-btn').forEach(b => {
        b.style.background = "transparent";
        b.style.color = "#ffdb58";
    });

    // Nascondi tutte le liste
    const container = parent.nextElementSibling;
    container.querySelectorAll('.tab-content').forEach(ul => ul.style.display = "none");

    // Attiva quello cliccato
    btn.style.background = "#ffdb58";
    btn.style.color = "#000";
    document.getElementById(targetId).style.display = "block";
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

// Chiudi SOLO se clicchi sulla X
document.addEventListener('click', (e) => {
    // Verifichiamo se l'elemento cliccato ha la classe 'close-modal'
    if (e.target.classList.contains('close-modal')) {
        closeModal();
    }
});

// Opzionale: Permetti la chiusura premendo il tasto ESC sulla tastiera
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
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