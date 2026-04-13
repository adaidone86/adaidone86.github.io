document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('trek-grid');
    const searchInput = document.getElementById('trek-search');
    const modal = document.getElementById('foto-modal');
    const galleryContainer = document.getElementById('gallery-container');
    const mainImg = document.getElementById('active-main-img');
    const closeBtn = document.querySelector('.close-cinema');

    let tuttiITrek = [];
    let viaggioCorrente = null;

    // --- 1. CARICAMENTO DATI ---
    fetch('dati/trekking/trekking.json')
        .then(res => res.json())
        .then(data => {
            tuttiITrek = data.sort((a, b) => {
                const getStartDate = (t) => t.tipo === "viaggio" ? t.date.da : t.data;
                const d1 = new Date(getStartDate(a).split('/').reverse().join('-'));
                const d2 = new Date(getStartDate(b).split('/').reverse().join('-'));
                return d2 - d1;
            });
            renderTrek(tuttiITrek);
        });

    // --- 2. FUNZIONE RENDERING CARD ---
function renderTrek(lista) {
    if (!grid) return;
    grid.innerHTML = "";

    lista.forEach(trek => {
        const item = document.createElement('div');
        item.className = 'trek-item';
        // Assicuriamoci che la card abbia posizione relativa
        item.style.position = "relative";

        // --- NUOVA LOGICA BOLLINI CON IMMAGINI ---
        let bollinoHTML = "";
        const imgPath = "img/trekking/"; // Percorso base delle immagini stato

        if (trek.stato === "c") {
            bollinoHTML = `
                <div class="status-badge badge-c" title="Completato">
                    <img src="${imgPath}c.png" alt="C" class="status-icon-img">
                </div>`;
        } else if (trek.stato === "w") {
            bollinoHTML = `
                <div class="status-badge badge-w" title="In lavorazione">
                    <img src="${imgPath}w.png" alt="W" class="status-icon-img pulse-wip">
                </div>`;
        } else if (trek.stato === "p") {
            bollinoHTML = `
                <div class="status-badge badge-p" title="In programma">
                    <img src="${imgPath}p.png" alt="P" class="status-icon-img">
                </div>`;
        }

        // --- GESTIONE FALLBACK (Se l'immagine non carica) ---
        // Questa logica serve se per caso un file PNG manca.
        // Verrà aggiunto un listener 'onerror' all'immagine appena creata.

        // ... resto della logica per date e info (invariata) ...
        const dataMostrata = trek.tipo === "viaggio" ? `Dal ${trek.date.da} al ${trek.date.al}` : trek.data;
        const infoMostrata = trek.tipo === "viaggio" ? "Multi-tappa" : trek["km/dislivello"];

        item.innerHTML = `
            ${bollinoHTML}
            <i class="fa-solid ${trek.icona} item-icon"></i>
            <h3>${trek.titolo}</h3>
            <p class="tag">${trek.luogo}</p>
            <div class="trek-details">
                <p><strong>Data:</strong> ${dataMostrata}</p>
                <p><strong>Info:</strong> ${infoMostrata}</p>
            </div>
            <p class="desc">${trek.descrizione_breve}</p>
        `;

        // --- GESTIONE CLICK SULLA CARD ---
        item.addEventListener('click', () => {
            // Se lo stato è 'p' (programmato), non apriamo il modal
            if (trek.stato === "p") return;
            openModal(trek);
        });

        grid.appendChild(item);
    });

    // --- LOGICA DI FALLBACK POST-RENDERING ---
    // Cerca tutte le immagini dei bollini e, se danno errore, applica lo stile testuale vecchio.
    document.querySelectorAll('.status-icon-img').forEach(img => {
        img.onerror = function() {
            const container = this.parentElement;
            // Rimuove l'immagine corrotta
            this.remove();
            // Inietta il testo (C, W, P) come fallback
            const stato = container.classList.contains('badge-c') ? 'C' :
                          container.classList.contains('badge-w') ? 'W' : 'P';
            container.innerText = stato;
            container.classList.add('fallback-text'); // Aggiunge classe per stile testo
        };
    });
}
    // --- 3. GESTIONE MODAL ---
    window.openModal = function (trek) {
        viaggioCorrente = trek;
        document.getElementById('modal-title').innerText = trek.titolo;
        const descContainer = document.getElementById('modal-full-desc');

        if (trek.tipo === "viaggio") {
            descContainer.innerHTML = `
                <div class="viaggio-header">
                    <p class="intro-desc">${trek.descrizione}</p>
                    <div class="giorni-nav">${trek.tappe.map((_, i) => `<button class="tappa-btn" onclick="mostraTappa(${i})">Giorno ${i+1}</button>`).join('')}</div>
                </div>
                <div id="tappa-content" class="tappa-content"></div>
            `;
            mostraTappa(0);
        } else {
            descContainer.innerHTML = `<p>${trek.descrizione}</p>`;
            const foto = Array.from({length: trek.numero_foto}, (_, i) => `${trek.cartella_foto}/${i+1}.jpg`);
            caricaGallery(foto);
        }
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    };

    window.mostraTappa = function (idx) {
        const tappa = viaggioCorrente.tappe[idx];
        document.getElementById('tappa-content').innerHTML = `
            <div class="tappa-info-header"><span>${tappa.giorno}</span><span>${tappa["km/dislivello"]}</span></div>
            <p class="tappa-desc-text">${tappa.descrizione_tappa}</p>
        `;
        document.querySelectorAll('.tappa-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
        const foto = Array.from({length: tappa.numero_foto}, (_, i) => `${tappa.cartella_foto}/${i+1}.jpg`);
        caricaGallery(foto);
    };

    function caricaGallery(lista) {
        galleryContainer.innerHTML = "";
        lista.forEach((f, i) => {
            const img = document.createElement('img');
            img.src = f; img.className = 'thumbnail-img';
            img.onclick = () => cambiaFoto(f, img);
            if (i === 0) cambiaFoto(f, img);
            galleryContainer.appendChild(img);
        });
    }

    const cambiaFoto = (src, el) => {
        mainImg.src = src;
        document.querySelectorAll('.thumbnail-img').forEach(t => t.classList.remove('active'));
        el.classList.add('active');
    };

    const chiudi = () => { modal.style.display = "none"; document.body.style.overflow = "auto"; };
    closeBtn.onclick = chiudi;
});