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
            tuttiITrek = data;
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
            grid.innerHTML = `<p style="grid-column: 1/-1; color: #888; margin-top: 20px;">Nessun sentiero trovato con questi criteri...</p>`;
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
                <p class="desc">${trek.descrizione}</p>
                ${guidaHTML}
            `;

            item.addEventListener('click', (e) => {
                // Non apre il modal se l'utente clicca sul link della guida
                if (e.target.closest('.guida-link')) return;

                if (trek.cartella_foto && trek.numero_foto > 0) {
                    const listaFoto = [];
                    for (let i = 1; i <= trek.numero_foto; i++) {
                        listaFoto.push(`${trek.cartella_foto}/${i}.jpg`);
                    }
                    openModal(listaFoto);
                }
            });
            grid.appendChild(item);
        });
    }

    // --- 3. LOGICA DI RICERCA (Filtro Dinamico) ---
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
    const aggiornaFotoGrande = (src, thumbElement) => {
        if (!mainImg) return;
        mainImg.style.opacity = 0;
        setTimeout(() => {
            mainImg.src = src;
            mainImg.style.opacity = 1;
        }, 100);

        document.querySelectorAll('.thumbnail-img').forEach(t => t.classList.remove('active'));
        if (thumbElement) thumbElement.classList.add('active');
    };

    window.openModal = function (listaFoto) {
        if (!galleryContainer || !modal) return;
        galleryContainer.innerHTML = "";

        listaFoto.forEach((foto, index) => {
            const thumb = document.createElement('img');
            thumb.src = foto;
            thumb.className = 'thumbnail-img';
            thumb.oncontextmenu = () => false;
            thumb.setAttribute('draggable', false);

            thumb.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                aggiornaFotoGrande(foto, thumb);
            });

            thumb.onerror = () => thumb.remove();

            if (index === 0) {
                if (mainImg) mainImg.src = foto;
                thumb.classList.add('active');
            }
            galleryContainer.appendChild(thumb);
        });

        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    };

    const chiudi = () => {
        if (modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    };

    if (closeBtn) closeBtn.onclick = chiudi;

    window.onclick = (e) => {
        if (e.target == modal) chiudi();
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") chiudi();
    });

    // Protezione click destro nel modal
    if (modal) modal.oncontextmenu = (e) => e.preventDefault();
});