document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('trek-grid');
    const modal = document.getElementById('foto-modal');
    const galleryContainer = document.getElementById('gallery-container');
    const closeBtn = document.querySelector('.close-modal');

    // 1. Caricamento dati dal JSON
    fetch('dati/trekking/trekking.json')
        .then(response => {
            if (!response.ok) throw new Error("Errore nel caricamento del JSON");
            return response.json();
        })
        .then(data => {
            grid.innerHTML = "";

            data.forEach(trek => {
                const item = document.createElement('div');
                item.className = 'trek-item';

                // Gestione Guida (se presente)
                let guidaHTML = "";
                if (trek.guida_nome && trek.guida_nome !== "") {
                    guidaHTML = `
                        <div class="guida-box">
                            <p class="guida-label">Accompagnato da:</p>
                            <a href="${trek.guida_sito}" target="_blank" class="guida-link" title="Sito di ${trek.guida_nome}">
                                <img src="${trek.guida_foto}" alt="${trek.guida_nome}" class="guida-img">
                                <span>${trek.guida_nome}</span>
                            </a>
                        </div>
                    `;
                }

                item.innerHTML = `
                    <i class="fa-solid ${trek.icona} item-icon"></i>
                    <h3>${trek.titolo}</h3>
                    <p class="tag">${trek.luogo}</p>
                    <div class="trek-details">
                        <p><strong>Difficoltà:</strong> ${trek.difficolta}</p>
                        <p><strong>Durata:</strong> ${trek.durata}</p>
                    </div>
                    <p class="desc">${trek.descrizione}</p>
                    ${guidaHTML}
                `;

                // 2. LOGICA APERTURA GALLERIA (Automatizzata)
                item.addEventListener('click', (e) => {
                    // Non aprire se clicchi sul link della guida
                    if (e.target.closest('.guida-link')) return;

                    galleryContainer.innerHTML = ""; // Pulisce foto vecchie

                    if (trek.cartella_foto && trek.numero_foto > 0) {
                        // Ciclo per generare i nomi file 1.jpg, 2.jpg...
                        for (let i = 1; i <= trek.numero_foto; i++) {
                            const img = document.createElement('img');
                            img.src = `${trek.cartella_foto}/${i}.jpg`;
                            img.className = "gallery-img";
                            // Gestione errore se una foto manca
                            img.onerror = () => img.style.display = 'none';
                            galleryContainer.appendChild(img);
                        }

                        modal.style.display = "block";
                        document.body.style.overflow = "hidden"; // Blocca lo scroll della pagina
                    } else {
                        alert("Non ci sono ancora foto per questo trekking!");
                    }
                });

                grid.appendChild(item);
            });
        })
        .catch(error => console.error("Errore:", error));

    // 3. FUNZIONI DI CHIUSURA
    const chiudiTutto = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Riattiva lo scroll della pagina
    };

    closeBtn.onclick = chiudiTutto;

    // Chiudi cliccando fuori dalle foto
    window.onclick = (event) => {
        if (event.target == modal) chiudiTutto();
    };

    // Chiudi con il tasto ESC per comodità
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") chiudiTutto();
    });
});