// CONFIGURAZIONE
const username = "adaidone86";
const repo = "adaidone86.github.io";

async function caricaCollezioneAutonoma() {
    const wrapper = document.getElementById('album-wrapper');
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/img/vinile`;

    try {
        const response = await fetch(apiUrl);
        const cartelle = await response.json();

        if (!Array.isArray(cartelle)) {
            console.error("Non ho trovato cartelle al percorso specificato");
            return;
        }

        wrapper.innerHTML = "";

        // Usiamo un ciclo for...of per gestire meglio le chiamate async
        for (const item of cartelle) {
            if (item.type === "dir") {
                const nomeCartella = item.name;

                try {
                    const resJson = await fetch(`img/vinile/${nomeCartella}/info.json`);
                    const dati = await resJson.json();

                    const slide = `
                        <div class="swiper-slide album-item">
                            <img src="img/vinile/${nomeCartella}/cover.jpg" alt="${dati.album}" class="album-cover">
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

        // INIZIALIZZAZIONE SWIPER SENZA PAGINATION
        new Swiper(".mySwiper", {
            effect: "cards",
            grabCursor: true,
            mousewheel: true,
            keyboard: { enabled: true },
            cardsEffect: {
                perSlideOffset: 12,
                perSlideRotate: 2,
                slideShadows: true,
            }
            // Rimosso l'oggetto pagination: { el: ".swiper-pagination" }
        });

    } catch (error) {
        console.error("Errore API GitHub:", error);
    }
}

caricaCollezioneAutonoma();