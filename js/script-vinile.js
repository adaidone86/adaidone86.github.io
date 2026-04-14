// CONFIGURAZIONE
const username = "adaidone86";
const repo = "adaidone86.github.io";

// Variabili globali
let audioCorrente = null;
let bottoneCorrente = null;
let allAlbums = [];
let swiperInstance = null;

// --- 1. FUNZIONE RENDERING SLIDE ---
function renderAlbumSlides(albums) {
    const wrapper = document.getElementById('album-wrapper');
    const swiperContainer = document.querySelector('.mySwiper');
    if (!wrapper) return;

    // Distruggi swiper esistente prima di svuotare
    if (swiperInstance) {
        swiperInstance.destroy(true, true);
        swiperInstance = null;
    }

    wrapper.innerHTML = "";

    if (albums.length === 0) {
        wrapper.innerHTML = `<div class="swiper-slide" style="display:flex; align-items:center; justify-content:center; color:#ffdb58; text-align:center; padding:20px;">Nessun vinile trovato</div>`;
    } else {
        albums.forEach(item => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide album-item';
            slide.innerHTML = `
                <img src="${item.coverPath}" alt="${item.dati.album}" class="album-cover">
                <div class="album-info">
                    <h3>${item.dati.album}</h3>
                    <p><strong>${item.dati.artista}</strong> | ${item.dati.anno || ''}</p>
                    <span class="genere-tag" style="font-size: 0.8em; color: #ffdb58; background: #000; padding: 2px 8px; border-radius: 10px;">${item.dati.genere}</span>
                </div>`;

            slide.addEventListener('click', () => openVinylModal(item.dati, item.folderName));
            wrapper.appendChild(slide);
        });
    }

    // Re-inizializza Swiper
    setTimeout(() => {
        initOrUpdateSwiper();
        if (swiperContainer) swiperContainer.style.opacity = "1";
    }, 50);
}

function initOrUpdateSwiper() {
    if (swiperInstance) swiperInstance.destroy(true, true);

    swiperInstance = new Swiper(".mySwiper", {
        effect: "cards",
        grabCursor: true,
        speed: 350,
        mousewheel: { invert: false, sensitivity: 1 },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    });
}

// --- 2. CARICAMENTO DATI ---
async function caricaCollezioneAutonoma() {
    const swiperElement = document.querySelector('.mySwiper');
    const loader = document.getElementById('loader-container');

    if (!swiperElement) return;

    swiperElement.style.opacity = "0";
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/img/vinile`;

    try {
        const response = await fetch(apiUrl);
        const cartelle = await response.json();
        if (!Array.isArray(cartelle)) return;

        const promesseDati = cartelle
            .filter(item => item.type === "dir")
            .map(item => {
                return fetch(`img/vinile/${item.name}/info.json`)
                    .then(res => res.json())
                    .then(dati => ({
                        dati: dati,
                        folderName: item.name,
                        coverPath: `img/vinile/${item.name}/cover.jpg`
                    }))
                    .catch(() => console.error("Errore disco:", item.name));
            });

        const risultati = await Promise.all(promesseDati);
        allAlbums = risultati.filter(r => r !== undefined);

        // Rendering iniziale
        renderAlbumSlides(allAlbums);

        // --- INIZIALIZZA RICERCA GLOBALE ---
        if (typeof initGlobalSearch === "function") {
            // Usiamo le chiavi "semplici" perché il nuovo handler ibrido
            // cercherà da solo dentro l'oggetto .dati
            initGlobalSearch('vinyl-search', allAlbums, renderAlbumSlides, ['artista', 'album', 'genere']);
        }

        if (loader) loader.style.display = "none";
        swiperElement.style.opacity = "1";

    } catch (error) { console.error("Errore caricamento:", error); }
}

// --- 3. GESTIONE FILTRI GENERE ---
// (Manteniamo i bottoni Filtro Rapido se presenti nel tuo HTML)
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const genere = btn.getAttribute('data-genre');
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (genere === "all") {
            renderAlbumSlides(allAlbums);
        } else {
            const filtrati = allAlbums.filter(a => a.dati.genere.toLowerCase() === genere.toLowerCase());
            renderAlbumSlides(filtrati);
        }
    });
});

// --- 4. FUNZIONI MODAL & AUDIO ---
function openVinylModal(dati, folderName) {
    const modal = document.getElementById('vinyl-modal');
    const videoContainer = document.getElementById('modal-video');
    if (!modal || !videoContainer) return;

    fermaAudio();

    document.getElementById('modal-title').innerText = dati.album;
    document.getElementById('modal-artist').innerText = dati.artista;
    document.getElementById('modal-description').innerText = dati.descrizione || "Nessun aneddoto disponibile.";

    // Generazione Tracklist (Logica invariata per funzionalità specifica)
    let tracklistHTML = "";
    if (dati.tracklist && dati.tracklist.length > 0) {
        const groups = {};
        dati.tracklist.forEach(brano => {
            const key = `Disco ${brano.disco} - Lato ${brano.lato}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(brano);
        });

        const keys = Object.keys(groups);
        let buttonsHTML = `<div class="tracklist-tabs" style="margin-bottom: 15px; display: flex; gap: 10px; flex-wrap: wrap;">`;
        keys.forEach((key, index) => {
            const activeStyle = index === 0 ? 'background: #ffdb58; color: #000;' : '';
            buttonsHTML += `<button class="tab-btn" onclick="mostraTabTracklist(this, '${key.replace(/\s/g, '-')}')" style="padding: 5px 12px; border: 1px solid #ffdb58; background: transparent; color: #ffdb58; cursor: pointer; border-radius: 5px; font-size: 0.8em; ${activeStyle}">${key}</button>`;
        });
        buttonsHTML += `</div>`;

        let listsHTML = `<div class="tracklist-containers">`;
        keys.forEach((key, index) => {
            const displayStyle = index === 0 ? 'block' : 'none';
            listsHTML += `<ul id="${key.replace(/\s/g, '-')}" class="tab-content" style="display: ${displayStyle}; list-style: none; padding-left: 0;">
                ${groups[key].map(brano => {
                    const paramAudio = brano.audio ? `'${brano.audio}'` : 'null';
                    const art = dati.artista.replace(/'/g, "\\'");
                    const tit = brano.titolo.replace(/'/g, "\\'");
                    return `
                    <li style="margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #222; padding-bottom: 5px; font-size: 0.9em;">
                        <div style="flex: 1;"><span style="color: #ffdb58; font-weight: bold; margin-right: 10px;">${brano.n}.</span><span>${brano.titolo}</span></div>
                        <button class="play-btn" onclick="gestisciAudio(this, ${paramAudio}, '${art}', '${tit}')" style="background: transparent; border: none; color: #ffdb58; cursor: pointer; font-size: 1.2em; padding: 0 5px;"><i class="fas fa-play-circle"></i></button>
                    </li>`;
                }).join('')}</ul>`;
        });
        listsHTML += `</div>`;

        tracklistHTML = `<div class="modal-tracklist" style="margin-top: 20px; border-top: 1px solid #333; padding-top: 15px;"><h4 style="color: #ffdb58; margin-bottom: 15px;"><i class="fas fa-list"></i> Tracce</h4>${buttonsHTML}${listsHTML}</div>`;
    }

    const infoContainer = document.querySelector('.modal-info');
    const vecchiaTracklist = infoContainer.querySelector('.modal-tracklist');
    if (vecchiaTracklist) vecchiaTracklist.remove();
    infoContainer.insertAdjacentHTML('beforeend', tracklistHTML);

    const videoUrl = dati.video;
    const youtubeEmbed = ottieniEmbedYouTube(videoUrl);

    if (youtubeEmbed) {
        videoContainer.innerHTML = `<iframe src="${youtubeEmbed}" style="width:100%; height:100%; border:none;" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    } else {
        const videoSource = videoUrl || `img/vinile/${folderName}/video.mp4`;
        videoContainer.innerHTML = `<video controls autoplay muted loop style="width:100%; height:100%; object-fit:cover;"><source src="${videoSource}" type="video/mp4"></video>`;
    }

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

window.gestisciAudio = async function(btn, audioFisso, artista, titolo) {
    const icon = btn.querySelector('i');
    if (audioCorrente && audioCorrente.dataset.titolo === titolo) {
        if (audioCorrente.paused) { audioCorrente.play(); icon.classList.replace('fa-play-circle', 'fa-pause-circle'); }
        else { audioCorrente.pause(); icon.classList.replace('fa-pause-circle', 'fa-play-circle'); }
        return;
    }
    fermaAudio();
    let urlDaRiprodurre = audioFisso;
    if (!urlDaRiprodurre) {
        icon.classList.replace('fa-play-circle', 'fa-spinner'); icon.classList.add('fa-spin');
        try {
            const query = encodeURIComponent(`${artista} ${titolo}`);
            const res = await fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=1`);
            const data = await res.json();
            if (data.results.length > 0) urlDaRiprodurre = data.results[0].previewUrl;
        } catch (e) {}
    }
    if (urlDaRiprodurre) {
        audioCorrente = new Audio(urlDaRiprodurre);
        audioCorrente.dataset.titolo = titolo;
        bottoneCorrente = btn;
        audioCorrente.play();
        icon.classList.remove('fa-spin');
        icon.classList.replace('fa-play-circle', 'fa-pause-circle');
        icon.classList.replace('fa-spinner', 'fa-pause-circle');
        audioCorrente.onended = () => fermaAudio();
    } else {
        alert("Anteprima non disponibile.");
        icon.classList.remove('fa-spin'); icon.classList.replace('fa-spinner', 'fa-play-circle');
    }
};

function fermaAudio() {
    if (audioCorrente) {
        audioCorrente.pause();
        if (bottoneCorrente) {
            const icon = bottoneCorrente.querySelector('i');
            icon.classList.remove('fa-spin');
            icon.className = 'fas fa-play-circle';
        }
        audioCorrente = null; bottoneCorrente = null;
    }
}

window.mostraTabTracklist = function(btn, targetId) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.tab-btn').forEach(b => { b.style.background = "transparent"; b.style.color = "#ffdb58"; });
    const container = parent.nextElementSibling;
    container.querySelectorAll('.tab-content').forEach(ul => ul.style.display = "none");
    btn.style.background = "#ffdb58"; btn.style.color = "#000";
    document.getElementById(targetId).style.display = "block";
}

function closeModal() {
    const modal = document.getElementById('vinyl-modal');
    if (modal) {
        modal.style.display = "none";
        fermaAudio();
        document.getElementById('modal-video').innerHTML = "";
        document.body.style.overflow = "";
    }
}

function ottieniEmbedYouTube(url) {
    if (!url || (!url.includes("youtube.com") && !url.includes("youtu.be"))) return null;
    let videoId = "";
    if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1` : null;
}

document.addEventListener("DOMContentLoaded", caricaCollezioneAutonoma);
document.addEventListener('click', (e) => { if (e.target.classList.contains('close-modal') || e.target.id === 'vinyl-modal') closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeModal(); });