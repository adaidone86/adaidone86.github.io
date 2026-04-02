// CONFIGURAZIONE
const username = "adaidone86";
const repo = "adaidone86.github.io";

async function caricaCollezioneAutonoma() {
    const wrapper = document.getElementById('album-wrapper');
    // Puntiamo alla cartella dove hai le sottocartelle dei vinili
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/img/vinile`;

    try {
        const response = await fetch(apiUrl);
        const cartelle = await response.json();

        if (!Array.isArray(cartelle)) {
            console.error("Cartelle non trovate. Verifica il percorso su GitHub.");
            return;
        }

        wrapper.innerHTML = "";

        for (const item of cartelle) {
            if (item.type === "dir") {
                const nomeCartella = item.name;

                try {
                    // 1. Leggiamo il JSON locale
                    const resJson = await fetch(`img/vinile/${nomeCartella}/info.json`);
                    const dati = await resJson.json();

                    // 2. Creiamo la slide
                    // L'attributo 'onerror' è la nostra "IA" che interviene se manca la foto
                    const slide = `
                        <div class="swiper-slide album-item">
                            <img src="img/vinile/${nomeCartella}/cover.jpg"
                                 alt="${dati.album}"
                                 class="album-cover"
                                 onerror="recuperaCoverOnline(this, '${dati.artista}', '${dati.album}')">
                            <div class="album-info">
                                <h3>${dati.album}</h3>
                                <p><strong>${dati.artista}</strong> | ${dati.anno || ''}</p>
                                <span class="genere-tag" style="font-size: 0.8em; color: #0077b5;">${dati.genere}</span>
                            </div>
                        </div>
                    `;
                    wrapper.innerHTML += slide;
                } catch (e) {
                    console.error("Errore nel caricamento dei dati per: " + nomeCartella, e);
                }
            }
        }

        // 3. Inizializziamo Swiper (solo dopo aver caricato i dati)
        new Swiper(".mySwiper", {
            effect: "cards",
            grabCursor: true,
            mousewheel: true,
            keyboard: { enabled: true },
            cardsEffect: {
                perSlideOffset: 12,
                perSlideRotate: 2,
                slideShadows: true,
            },
            pagination: { el: ".swiper-pagination" },
        });

    } catch (error) {
        console.error("Errore API GitHub:", error);
    }
}

// FUNZIONE DI RECUPERO ONLINE (iTunes API)
// Si attiva solo se il file 'cover.jpg' nella cartella del vinile non viene trovato
async function recuperaCoverOnline(imgElement, artista, album) {
    if (imgElement.dataset.tried === "true") return;
    imgElement.dataset.tried = "true";

    const query = encodeURIComponent(`${artista} ${album}`);
    try {
        const response = await fetch(`https://itunes.apple.com/search?term=${query}&entity=album&limit=1`);
        const data = await response.json();

        if (data.results.length > 0) {
            let highResCover = data.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
            imgElement.src = highResCover;
        } else {
            imgElement.src = "https://via.placeholder.com/600/2d3748/ffffff?text=Cover+non+trovata";
        }
    } catch (error) {
        console.error("Errore ricerca online:", error);
    }
}

caricaCollezioneAutonoma();