document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('trek-grid');
    const searchInput = document.getElementById('trek-search');
    const modal = document.getElementById('foto-modal');
    const galleryContainer = document.getElementById('gallery-container');
    const mainImg = document.getElementById('active-main-img');
    const closeBtn = document.getElementById('close-modal-btn');

    let tuttiITrek = [];
    let viaggioCorrente = null;

    // --- 1. CARICAMENTO DATI ---
    fetch('dati/trekking/trekking.json')
        .then(res => res.json())
        .then(data => {
            // Ordinamento decrescente per data
            tuttiITrek = data.sort((a, b) => {
                const getStartDate = (t) => t.tipo === "viaggio" ? t.date.da : t.data;
                const d1 = new Date(getStartDate(a).split('/').reverse().join('-'));
                const d2 = new Date(getStartDate(b).split('/').reverse().join('-'));
                return d2 - d1;
            });
            renderTrek(tuttiITrek);
        })
        .catch(err => {
            console.error("Errore caricamento JSON:", err);
            if(grid) grid.innerHTML = "<p style='color:red;'>Errore nel caricamento dei dati.</p>";
        });

    // --- 2. FUNZIONE RENDERING CARD ---
    function renderTrek(lista) {
        if (!grid) return;
        grid.innerHTML = "";

        lista.forEach(trek => {
            const item = document.createElement('div');
            item.className = 'trek-item';

            // BOLLINI STATO
            let bollinoHTML = "";
            if (trek.stato) {
                bollinoHTML = `<div class="status-badge badge-${trek.stato}" title="${trek.stato === 'c' ? 'Completato' : (trek.stato === 'w' ? 'In lavorazione' : 'In programma')}">
                    <img src="img/trekking/${trek.stato}.png" alt="${trek.stato}" class="status-icon-img" onerror="this.style.display='none'">
                </div>`;
            }

            // GUIDA / ORGANIZZATORE
            let guidaHTML = "";
            if (trek.guida_foto && trek.guida_foto !== "-") {
                guidaHTML = `
                    <div class="guida-box">
                        <p class="guida-label">Organizzato da:</p>
                        <a href="${trek.guida_sito}" target="_blank" class="guida-link" onclick="event.stopPropagation();">
                            <img src="${trek.guida_foto}" alt="${trek.guida_nome}" class="guida-img">
                            <span>${trek.guida_nome !== "-" ? trek.guida_nome : "Sito Ufficiale"}</span>
                        </a>
                    </div>`;
            }

            const dataMostrata = trek.tipo === "viaggio" ? `Dal ${trek.date.da} al ${trek.date.al}` : trek.data;
            const infoMostrata = trek.tipo === "viaggio" ? "Multi-tappa" : trek["km/dislivello"];

            item.innerHTML = `
                ${bollinoHTML}
                <i class="fa-solid ${trek.icona} item-icon"></i>
                <h3>${trek.titolo}</h3>
                <span class="tag">${trek.luogo}</span>
                <div class="trek-details">
                    <p><strong>Data:</strong> ${dataMostrata}</p>
                    <p><strong>Info:</strong> ${infoMostrata}</p>
                </div>
                <p class="desc">${trek.descrizione_breve}</p>
                ${guidaHTML}
            `;

            // EVENTO CLICK CARD (Apre modal solo se non è 'p')
            item.onclick = () => {
                if (trek.stato === "p") {
                    alert("Questo trekking è in programma. Foto non ancora disponibili!");
                    return;
                }
                openModal(trek);
            };

            grid.appendChild(item);
        });
    }

    // --- 3. GESTIONE MODAL ---
    window.openModal = function (trek) {
        if (!modal) return;
        viaggioCorrente = trek;

        const modalTitle = document.getElementById('modal-title');
        const modalFullDesc = document.getElementById('modal-full-desc');

        if (modalTitle) modalTitle.innerText = trek.titolo;

        // Reset scroll della descrizione
        if (modalFullDesc) modalFullDesc.scrollTop = 0;

        if (trek.tipo === "viaggio") {
            modalFullDesc.innerHTML = `
                <div class="viaggio-header">
                    <p class="intro-desc">${trek.descrizione}</p>
                    <div class="giorni-nav">
                        ${trek.tappe.map((_, i) => `<button class="tappa-btn" onclick="mostraTappa(${i})">Giorno ${i+1}</button>`).join('')}
                    </div>
                </div>
                <div id="tappa-content" class="tappa-content"></div>
            `;
            mostraTappa(0);
        } else {
            modalFullDesc.innerHTML = `<p>${trek.descrizione}</p>`;
            caricaGallery(trek.cartella_foto, trek.numero_foto);
        }

        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    };

    window.mostraTappa = function (idx) {
        if (!viaggioCorrente) return;
        const tappa = viaggioCorrente.tappe[idx];
        const content = document.getElementById('tappa-content');
        if (content) {
            content.innerHTML = `
                <div class="tappa-info-header"><span>${tappa.giorno}</span><span>${tappa["km/dislivello"]}</span></div>
                <p class="tappa-desc-text">${tappa.descrizione_tappa}</p>
            `;
        }
        document.querySelectorAll('.tappa-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
        caricaGallery(tappa.cartella_foto, tappa.numero_foto);
    };

function caricaGallery(folder, num) {
    if (!galleryContainer) return;
    galleryContainer.innerHTML = "";

    if (!num || num === 0) {
        if (mainImg) mainImg.src = "";
        return;
    }

    let primaTrovata = false;

    for (let i = 1; i <= num; i++) {
        const imgSrc = `${folder}/${i}.jpg`;
        const img = document.createElement('img');

        img.src = imgSrc;
        img.className = 'thumbnail-img';

        // Gestione errore: se la foto non esiste, sparisce
        img.onerror = function() {
            console.warn("Immagine non trovata, la salto:", imgSrc);
            this.remove();

            // Se abbiamo rimosso quella che doveva essere la "active" e non ne abbiamo altre,
            // il mainImg potrebbe rimanere vuoto. Gestiamolo se necessario.
        };

        // Gestione click: usiamo addEventListener che è più pulito
        img.addEventListener('click', function() {
            if (mainImg) {
                mainImg.style.opacity = "0.5"; // Effetto transizione veloce
                mainImg.src = imgSrc;
                mainImg.onload = () => mainImg.style.opacity = "1";
            }

            // Rimuovi active da tutte e mettila a questa
            document.querySelectorAll('.thumbnail-img').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });

        // Impostiamo la prima immagine del ciclo come "principale" di partenza
        if (!primaTrovata) {
            if (mainImg) mainImg.src = imgSrc;
            img.classList.add('active');
            primaTrovata = true;
        }

        galleryContainer.appendChild(img);
    }

    galleryContainer.scrollLeft = 0;
}

    window.cambiaFoto = function(src, el) {
        if (!mainImg) return;
        mainImg.src = src;
        document.querySelectorAll('.thumbnail-img').forEach(t => t.classList.remove('active'));
        if(el) el.classList.add('active');
    };

    const chiudiModal = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };

    if (closeBtn) closeBtn.onclick = chiudiModal;

    window.addEventListener('click', (e) => {
        if (e.target === modal) chiudiModal();
    });

    // --- 4. RICERCA ---
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const filtrati = tuttiITrek.filter(t =>
                t.titolo.toLowerCase().includes(val) ||
                t.luogo.toLowerCase().includes(val)
            );
            renderTrek(filtrati);
        });
    }
});