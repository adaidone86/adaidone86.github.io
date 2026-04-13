document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('trek-grid');
    const searchInput = document.getElementById('trek-search');
    const modal = document.getElementById('foto-modal');
    const galleryContainer = document.getElementById('gallery-container');
    const mainImg = document.getElementById('active-main-img');
    const closeBtn = document.querySelector('.close-cinema');

    let tuttiITrek = [];
    let viaggioCorrente = null; // Memorizza i dati del viaggio aperto per i Tab

    // --- 1. CARICAMENTO DATI ---
    fetch('dati/trekking/trekking.json')
        .then(res => {
            if (!res.ok) throw new Error("Errore nel caricamento del file JSON");
            return res.json();
        })
        .then(data => {
            tuttiITrek = data.sort((a, b) => {
                const getStartDate = (t) => t.tipo === "viaggio" ? t.date.da : t.data;
                const dateA = getStartDate(a).split('/');
                const dateB = getStartDate(b).split('/');
                const d1 = new Date(dateA[2], dateA[1] - 1, dateA[0]);
                const d2 = new Date(dateB[2], dateB[1] - 1, dateB[0]);
                return d2 - d1;
            });
            renderTrek(tuttiITrek);
        })
        .catch(err => {
            console.error("Errore:", err);
            if(grid) grid.innerHTML = `<p style="color: red;">Errore nel caricamento dei sentieri.</p>`;
        });

    // --- 2. FUNZIONE RENDERING CARD ---
    function renderTrek(lista) {
        if (!grid) return;
        grid.innerHTML = "";

        lista.forEach(trek => {
            const item = document.createElement('div');
            item.className = 'trek-item';

            const dataMostrata = trek.tipo === "viaggio"
                ? `Dal ${trek.date.da} al ${trek.date.al}`
                : trek.data;

            const infoMostrata = trek.tipo === "viaggio"
                ? "Multi-tappa"
                : trek["km/dislivello"];

            let guidaHTML = "";
            if (trek.guida_nome) {
                guidaHTML = `
                    <div class="guida-box">
                        <p class="guida-label">Accompagnato da:</p>
                        <a href="${trek.guida_sito}" target="_blank" class="guida-link">
                            <img src="${trek.guida_foto}" alt="${trek.guida_nome}" class="guida-img">
                            <span>${trek.guida_nome}</span>
                        </a>
                    </div>`;
            }

            item.innerHTML = `
                <i class="fa-solid ${trek.icona} item-icon"></i>
                <h3>${trek.titolo}</h3>
                <p class="tag">${trek.luogo}</p>
                <div class="trek-details">
                    <p><strong>Data:</strong> ${dataMostrata}</p>
                    <p><strong>Info:</strong> ${infoMostrata}</p>
                </div>
                <p class="desc">${trek.descrizione_breve}</p>
                ${guidaHTML}
            `;

            item.addEventListener('click', (e) => {
                if (e.target.closest('.guida-link')) return;
                openModal(trek);
            });
            grid.appendChild(item);
        });
    }

    // --- 3. GESTIONE MODAL CINEMA ---

    window.openModal = function (trek) {
        if (!modal || !mainImg) return;
        viaggioCorrente = trek;

        document.getElementById('modal-title').innerText = trek.titolo;
        const descContainer = document.getElementById('modal-full-desc');

        if (trek.tipo === "viaggio") {
            // Layout VIAGGIO: Descrizione fissa + Bottoni + Area Tappa
            descContainer.innerHTML = `
                <div class="viaggio-header">
                    <p class="intro-desc">${trek.descrizione}</p>
                    <div class="giorni-nav" id="giorni-nav">
                        ${trek.tappe.map((_, idx) => `
                            <button class="tappa-btn" onclick="mostraTappa(${idx})">Giorno ${idx + 1}</button>
                        `).join('')}
                    </div>
                </div>
                <div id="tappa-content" class="tappa-content"></div>
            `;
            // Attiva automaticamente il primo giorno
            mostraTappa(0);
        } else {
            // Layout GIORNALIERO: Classico come prima
            descContainer.innerHTML = `<p>${trek.descrizione}</p>`;
            const listaFoto = [];
            for (let i = 1; i <= trek.numero_foto; i++) {
                listaFoto.push(`${trek.cartella_foto}/${i}.jpg`);
            }
            caricaGallery(listaFoto);
        }

        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    };

    // FUNZIONE PER CAMBIARE TAPPA (Solo per Viaggi)
    window.mostraTappa = function (indice) {
        const tappa = viaggioCorrente.tappe[indice];
        const contentArea = document.getElementById('tappa-content');
        const btns = document.querySelectorAll('.tappa-btn');

        // Gestione stato bottoni
        btns.forEach((b, i) => b.classList.toggle('active', i === indice));

        // Iniezione testo tappa
        contentArea.innerHTML = `
            <div class="tappa-info-header">
                <span class="tappa-data"><i class="far fa-calendar"></i> ${tappa.giorno}</span>
                <span class="tappa-stats"><i class="fas fa-route"></i> ${tappa["km/dislivello"]}</span>
            </div>
            <p class="tappa-desc-text">${tappa.descrizione_tappa}</p>
        `;

        // Caricamento foto della tappa specifica
        const listaFotoTappa = [];
        for (let i = 1; i <= tappa.numero_foto; i++) {
            listaFotoTappa.push(`${tappa.cartella_foto}/${i}.jpg`);
        }
        caricaGallery(listaFotoTappa);
    };

    // FUNZIONE PER POPOLARE LA GALLERY
    function caricaGallery(lista) {
        galleryContainer.innerHTML = "";
        if (lista.length === 0) {
            mainImg.src = ""; // O un'immagine di default
            mainImg.alt = "Nessuna foto disponibile";
            return;
        }

        lista.forEach((foto, index) => {
            const thumb = document.createElement('img');
            thumb.src = foto;
            thumb.className = 'thumbnail-img';
            thumb.onclick = () => cambiaFoto(foto, thumb);

            if (index === 0) {
                cambiaFoto(foto, thumb);
            }
            galleryContainer.appendChild(thumb);
        });
    }

    const cambiaFoto = (src, thumbElement) => {
        mainImg.style.opacity = "0.3";
        mainImg.src = src;
        mainImg.onload = () => mainImg.style.opacity = "1";

        document.querySelectorAll('.thumbnail-img').forEach(t => t.classList.remove('active'));
        thumbElement.classList.add('active');
        thumbElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };

    // --- 4. CHIUSURA E UTILITY ---
    const chiudi = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };

    if (closeBtn) closeBtn.onclick = chiudi;
    document.addEventListener('keydown', (e) => { if (e.key === "Escape") chiudi(); });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const t = e.target.value.toLowerCase();
            const f = tuttiITrek.filter(x =>
                x.titolo.toLowerCase().includes(t) ||
                x.luogo.toLowerCase().includes(t) ||
                x.descrizione.toLowerCase().includes(t)
            );
            renderTrek(f);
        });
    }

    // Scroll gallery orizzontale
    if (galleryContainer) {
        galleryContainer.addEventListener("wheel", (evt) => {
            evt.preventDefault();
            galleryContainer.scrollLeft += evt.deltaY;
        }, { passive: false });
    }
});