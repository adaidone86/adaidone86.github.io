document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('trek-grid');
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

            // Rendering iniziale
            renderTrek(tuttiITrek);

            // Inizializza la ricerca globale (dal file search-handler.js)
            if (typeof initGlobalSearch === "function") {
                initGlobalSearch('trek-search', tuttiITrek, renderTrek, ['titolo', 'luogo']);
            }
        })
        .catch(err => {
            console.error("Errore caricamento JSON:", err);
            if (grid) grid.innerHTML = "<p style='color:red;'>Errore nel caricamento dei dati.</p>";
        });

    // --- 2. FUNZIONE RENDERING CARD ---
    function renderTrek(lista) {
        if (!grid) return;
        grid.innerHTML = "";

        lista.forEach(trek => {
            const item = document.createElement('div');
            item.className = 'trek-item';

            // Gestione stato "In programma"
            if (trek.stato === "p") {
                item.title = "Questo trekking è in programma. Foto non ancora disponibili!";
                item.style.cursor = "not-allowed";
            }

            // Bollini Stato
            let bollinoHTML = trek.stato ? `
                <div class="status-badge badge-${trek.stato}" title="${trek.stato === 'c' ? 'Completato' : (trek.stato === 'w' ? 'In lavorazione' : 'In programma')}">
                    <img src="img/trekking/${trek.stato}.png" alt="${trek.stato}" class="status-icon-img" onerror="this.style.display='none'">
                </div>` : "";

            // Guida / Organizzatore
            let guidaHTML = (trek.guida_foto && trek.guida_foto !== "-") ? `
                <div class="guida-box">
                    <p class="guida-label">Organizzato da:</p>
                    <a href="${trek.guida_sito}" target="_blank" class="guida-link" onclick="event.stopPropagation();">
                        <img src="${trek.guida_foto}" alt="${trek.guida_nome}" class="guida-img">
                        <span>${trek.guida_nome !== "-" ? trek.guida_nome : "Sito Ufficiale"}</span>
                    </a>
                </div>` : "";

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

            item.onclick = () => {
                if (trek.stato !== "p") openModal(trek);
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
        if (modalFullDesc) {
            modalFullDesc.scrollTop = 0;
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

            img.onerror = function() { this.remove(); };

            img.addEventListener('click', function() {
                if (mainImg) {
                    mainImg.style.opacity = "0.5";
                    mainImg.src = imgSrc;
                    mainImg.onload = () => mainImg.style.opacity = "1";
                }
                document.querySelectorAll('.thumbnail-img').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });

            if (!primaTrovata) {
                if (mainImg) mainImg.src = imgSrc;
                img.classList.add('active');
                primaTrovata = true;
            }
            galleryContainer.appendChild(img);
        }
        galleryContainer.scrollLeft = 0;
    }

    const chiudiModal = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };

    if (closeBtn) closeBtn.onclick = chiudiModal;
    window.addEventListener('click', (e) => { if (e.target === modal) chiudiModal(); });
});