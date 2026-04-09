document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('trek-grid');
    const modal = document.getElementById('foto-modal');
    const galleryContainer = document.getElementById('gallery-container');
    const mainImg = document.getElementById('active-main-img');
    const closeBtn = document.querySelector('.close-cinema');

    // 1. Caricamento dati Trekking
    fetch('dati/trekking/trekking.json')
        .then(res => {
            if (!res.ok) throw new Error("Errore JSON");
            return res.json();
        })
        .then(data => {
            grid.innerHTML = "";
            data.forEach(trek => {
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

                // Visualizzazione aggiornata: Data e Km/Dislivello
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
                    if (e.target.closest('.guida-link')) return;
                    if (trek.cartella_foto && trek.numero_foto > 0) {
                        const lista = [];
                        for(let i=1; i<=trek.numero_foto; i++) {
                            lista.push(`${trek.cartella_foto}/${i}.jpg`);
                        }
                        openModal(lista);
                    }
                });
                grid.appendChild(item);
            });
        })
        .catch(err => console.error("Errore:", err));

    const aggiornaFotoGrande = (src, thumbElement) => {
        mainImg.style.opacity = 0;
        setTimeout(() => {
            mainImg.src = src;
            mainImg.style.opacity = 1;
        }, 100);
        document.querySelectorAll('.thumbnail-img').forEach(t => t.classList.remove('active'));
        if(thumbElement) thumbElement.classList.add('active');
    };

    window.openModal = function(listaFoto) {
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
            if(index === 0) {
                mainImg.src = foto;
                thumb.classList.add('active');
            }
            galleryContainer.appendChild(thumb);
        });
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    };

    const chiudi = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };

    if (closeBtn) closeBtn.onclick = chiudi;
    window.onclick = (e) => { if(e.target == modal) chiudi(); };
    document.addEventListener('keydown', (e) => { if (e.key === "Escape") chiudi(); });
    modal.oncontextmenu = (e) => e.preventDefault();
});