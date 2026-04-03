// CONFIGURAZIONE
const username = "adaidone86";
const repo = "adaidone86.github.io";

async function caricaCollezioneAutonoma() {
    const wrapper = document.getElementById('album-wrapper');
    const swiperElement = document.querySelector('.mySwiper');
    const loader = document.getElementById('loader-container');

    // Assicuriamoci che lo swiper sia invisibile prima di iniziare
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
                    wrapper.appendChild(slide);

                    // Precaricamento immagine nella cache
                    promesseImmagini.push(new Promise(resolve => {
                        const img = new Image();
                        img.src = coverPath;
                        img.onload = resolve;
                        img.onerror = resolve;
                    }));
                } catch (e) { console.error("Errore caricamento disco:", e); }
            }
        }

        // Attendiamo che GitHub risponda e che le immagini siano caricate
        await Promise.all(promesseImmagini);

// Mostriamo lo swiper a livello di blocco prima di inizializzarlo
        swiperElement.style.display = "block";

        // Inizializziamo lo Swiper
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

        // NASCONDI LOADER E MOSTRA SWIPER
        if (loader) loader.style.display = "none";
        swiperElement.style.opacity = "1";

    } catch (error) {
        console.error("Errore generale:", error);
        if (loader) loader.innerHTML = "<p>Errore nel caricamento dei vinili.</p>";
    }
}

caricaCollezioneAutonoma();