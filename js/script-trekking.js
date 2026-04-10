document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('trek-grid');
    const searchInput = document.getElementById('trek-search');
    const modal = document.getElementById('foto-modal');
    const galleryContainer = document.getElementById('gallery-container');
    const mainImg = document.getElementById('active-main-img');
    const closeBtn = document.querySelector('.close-cinema');

    let tuttiITrek = [];

    // --- 1. CARICAMENTO DATI ---
    fetch('dati/trekking/trekking.json')
        .then(res => {
            if (!res.ok) throw new Error("Errore nel caricamento del file JSON");
            return res.json();
        })
        .then(data => {
            tuttiITrek = data.sort((a, b) => {
                const dateA = a.data.split('/');
                const dateB = b.data.split('/');
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
        if (lista.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1/-1; color: #888; margin-top: 20px;">Nessun sentiero trovato...</p>`;
            return;
        }
        lista.forEach(trek => {
            const item = document.createElement('div');
            item.className = 'trek-item';

            let guidaHTML = "";
            if (trek.guida_nome && trek.guida_nome !== "") {
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
                    <p><strong>Data:</strong> ${trek.data}</p>
                    <p><strong>Info:</strong> ${trek["km/dislivello"]}</p>
                </div>
                <p class="desc">${trek.descrizione_breve}</p>
                ${guidaHTML}
            `;

            item.addEventListener('click', (e) => {
                if (e.target.closest('.guida-link')) return;
                if (trek.cartella_foto && trek.numero_foto > 0) {
                    const listaFoto = [];
                    for (let i = 1; i <= trek.numero_foto; i++) {
                        listaFoto.push(`${trek.cartella_foto}/${i}.jpg`);
                    }
                    openModal(listaFoto, trek.titolo, trek.descrizione);
                }
            });
            grid.appendChild(item);
        });
    }

    // --- 3. RICERCA ---
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const termine = e.target.value.toLowerCase().trim();
            const filtrati = tuttiITrek.filter(trek =>
                trek.titolo.toLowerCase().includes(termine) ||
                trek.luogo.toLowerCase().includes(termine) ||
                trek.descrizione.toLowerCase().includes(termine)
            );
            renderTrek(filtrati);
        });
    }

    // --- 4. GESTIONE MODAL CINEMA ---

    const cambiaFoto = (src, thumbElement) => {
        if (!mainImg) return;

        // Effetto transizione: abbassiamo opacità
        mainImg.style.opacity = "0.3";

        // Cambiamo sorgente
        mainImg.src = src;

        // Quando la nuova immagine è effettivamente caricata, riportiamo opacità a 1
        mainImg.onload = () => {
            mainImg.style.opacity = "1";
        };

        // Gestione classi "active" sulle miniature
        const tutteLeThumb = document.querySelectorAll('.thumbnail-img');
        tutteLeThumb.forEach(t => t.classList.remove('active'));
        thumbElement.classList.add('active');

        // Autoscroll della miniatura per tenerla centrata nella barra
        thumbElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };

    window.openModal = function (listaFoto, titolo, descrizione) {
        if (!galleryContainer || !modal || !mainImg) return;

        document.getElementById('modal-title').innerText = titolo;
        document.getElementById('modal-full-desc').innerText = descrizione;

        galleryContainer.innerHTML = "";

        listaFoto.forEach((foto, index) => {
            const thumb = document.createElement('img');
            thumb.src = foto;
            thumb.className = 'thumbnail-img';
            thumb.setAttribute('draggable', false);

            thumb.onerror = () => thumb.remove();

            // ASSEGNAZIONE CLICK DIRETTA (Garantisce che il click venga catturato)
            thumb.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                cambiaFoto(foto, thumb);
            };

            if (index === 0) {
                mainImg.src = foto;
                mainImg.style.opacity = "1";
                thumb.classList.add('active');
            }
            galleryContainer.appendChild(thumb);
        });

        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    };

    // --- 5. LOGICA CHIUSURA E INTERAZIONE ---

    const chiudi = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };

    if (closeBtn) closeBtn.onclick = chiudi;

    // Chiusura con tasto ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") chiudi();
    });

    // Scroll orizzontale gallery con rotellina
    if (galleryContainer) {
        galleryContainer.addEventListener("wheel", (evt) => {
            evt.preventDefault();
            galleryContainer.scrollLeft += evt.deltaY;
        }, { passive: false });
    }

    // Disabilita click destro nel modal
    if (modal) {
        modal.oncontextmenu = (e) => e.preventDefault();
    }
});