// CONFIGURAZIONE
const username = "adaidone86";
const repo = "adaidone86.github.io";

// Variabili globali per gestire l'audio
let audioCorrente = null;
let bottoneCorrente = null;

// --- FUNZIONI PER IL MODAL (POP-UP) ---

function openVinylModal(dati, folderName) {
    const modal = document.getElementById('vinyl-modal');
    const videoContainer = document.getElementById('modal-video');

    if (!modal || !videoContainer) return;

    // Reset audio se si apre un nuovo modal
    fermaAudio();

    document.getElementById('modal-title').innerText = dati.album;
    document.getElementById('modal-artist').innerText = dati.artista;
    document.getElementById('modal-description').innerText = dati.descrizione || "Nessun aneddoto disponibile per questo disco.";

    // --- GESTIONE TRACKLIST CON TAB ---
    let tracklistHTML = "";
    if (dati.tracklist && dati.tracklist.length > 0) {
        const groups = {};
        dati.tracklist.forEach(brano => {
            const key = `Disco ${brano.disco} - Lato ${brano.lato}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(brano);
        });

        const keys = Object.keys(groups);

        // 2. Creiamo i bottoncini (Tab)
        let buttonsHTML = `<div class="tracklist-tabs" style="margin-bottom: 15px; display: flex; gap: 10px; flex-wrap: wrap;">`;
        keys.forEach((key, index) => {
            const activeStyle = index === 0 ? 'background: #ffdb58; color: #000;' : '';
            buttonsHTML += `
                <button class="tab-btn"
                        onclick="mostraTabTracklist(this, '${key.replace(/\s/g, '-')}')"
                        style="padding: 5px 12px; border: 1px solid #ffdb58; background: transparent; color: #ffdb58; cursor: pointer; border-radius: 5px; font-size: 0.8em; ${activeStyle}">
                    ${key}
                </button>`;
        });
        buttonsHTML += `</div>`;

        // 3. Creiamo i contenitori delle liste (con tasto Play)
        let listsHTML = `<div class="tracklist-containers">`;
        keys.forEach((key, index) => {
            const displayStyle = index === 0 ? 'block' : 'none';
            listsHTML += `
                <ul id="${key.replace(/\s/g, '-')}" class="tab-content" style="display: ${displayStyle}; list-style: none; padding-left: 0;">
                    ${groups[key].map(brano => `
                        <li style="margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #222; padding-bottom: 5px; font-size: 0.9em;">
                            <div style="flex: 1;">
                                <span style="color: #ffdb58; font-weight: bold; margin-right: 10px;">${brano.n}.</span>
                                <span>${brano.titolo}</span>
                            </div>
                            ${brano.audio ? `
                                <button class="play-btn" onclick="gestisciAudio('${brano.audio}', this)"
                                        style="background: transparent; border: none; color: #ffdb58; cursor: pointer; font-size: 1.2em; padding: 0 5px;">
                                    <i class="fas fa-play-circle"></i>
                                </button>
                            ` : ''}
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

    const videoSource = dati.video || `img/vinile/${folderName}/video.mp4`;
// --- GESTIONE VIDEO (YouTube o File Locale) ---
const videoUrl = dati.video;
const youtubeEmbed = ottieniEmbedYouTube(videoUrl);

if (youtubeEmbed) {
    // Se è un link YouTube, usiamo un iframe
    videoContainer.innerHTML = `
        <iframe
            src="${youtubeEmbed}"
            style="width:100%; height:100%; border:none;"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>
    `;
} else {
    // Se non è YouTube, prova a caricarlo come file locale .mp4
    const videoSource = videoUrl || `img/vinile/${folderName}/video.mp4`;
    videoContainer.innerHTML = `
        <video controls autoplay muted loop style="width:100%; height:100%; object-fit:cover;">
            <source src="${videoSource}" type="video/mp4">
            Il tuo browser non supporta il tag video.
        </video>
    `;
}

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

// --- GESTIONE AUDIO ---

window.gestisciAudio = function(url, btn) {
    const icon = btn.querySelector('i');

    // Se stiamo già riproducendo questo brano, lo mettiamo in pausa
    if (audioCorrente && audioCorrente.src === url) {
        if (audioCorrente.paused) {
            audioCorrente.play();
            icon.classList.replace('fa-play-circle', 'fa-pause-circle');
        } else {
            audioCorrente.pause();
            icon.classList.replace('fa-pause-circle', 'fa-play-circle');
        }
        return;
    }

    // Se clicchiamo un altro brano, fermiamo quello precedente
    fermaAudio();

    // Avviamo il nuovo audio
    audioCorrente = new Audio(url);
    bottoneCorrente = btn;
    audioCorrente.play();
    icon.classList.replace('fa-play-circle', 'fa-pause-circle');

    // Quando l'anteprima finisce
    audioCorrente.onended = () => {
        icon.classList.replace('fa-pause-circle', 'fa-play-circle');
        audioCorrente = null;
        bottoneCorrente = null;
    };
};

function fermaAudio() {
    if (audioCorrente) {
        audioCorrente.pause();
        if (bottoneCorrente) {
            bottoneCorrente.querySelector('i').classList.replace('fa-pause-circle', 'fa-play-circle');
        }
        audioCorrente = null;
        bottoneCorrente = null;
    }
}

// --- ALTRE FUNZIONI ---

window.mostraTabTracklist = function(btn, targetId) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.tab-btn').forEach(b => {
        b.style.background = "transparent";
        b.style.color = "#ffdb58";
    });

    const container = parent.nextElementSibling;
    container.querySelectorAll('.tab-content').forEach(ul => ul.style.display = "none");

    btn.style.background = "#ffdb58";
    btn.style.color = "#000";
    document.getElementById(targetId).style.display = "block";
}

function closeModal() {
    const modal = document.getElementById('vinyl-modal');
    if (modal) {
        modal.style.display = "none";
        fermaAudio(); // Ferma l'audio alla chiusura
        const videoContainer = document.getElementById('modal-video');
        if (videoContainer) videoContainer.innerHTML = "";
        document.body.style.overflow = "";
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-modal')) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        closeModal();
    }
});

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
                } catch (e) {
                    console.error("Errore caricamento disco:", nomeCartella, e);
                }
            }
        }

        await Promise.all(promesseImmagini);

        if (loader) loader.style.display = "none";
        swiperElement.style.opacity = "1";

        const swiper = new Swiper(".mySwiper", {
            effect: "cards",
            grabCursor: true,
            initialSlide: 0,
            speed: 350,
            mousewheel: { invert: false, releaseOnEdges: false, sensitivity: 1 },
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
            cardsEffect: { perSlideOffset: 12, perSlideRotate: 2, slideShadows: true }
        });

        swiperElement.addEventListener('wheel', (e) => {
            e.stopPropagation();
        }, { passive: false });

    } catch (error) {
        console.error("Errore generale durante il caricamento:", error);
        if (loader) loader.innerHTML = "<p style='color: white;'>Errore nel caricamento della collezione.</p>";
    }
}

document.addEventListener("DOMContentLoaded", caricaCollezioneAutonoma);

function ottieniEmbedYouTube(url) {
    if (!url) return null;
    let videoId = "";

    // Se è un link standard (watch?v=)
    if (url.includes("v=")) {
        videoId = url.split("v=")[1].split("&")[0];
    }
    // Se è un link breve (youtu.be/)
    else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1` : null;
}