document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('trek-grid');

    fetch('dati/trekking/trekking.json')
        .then(response => response.json())
        .then(data => {
            grid.innerHTML = "";

            data.forEach(trek => {
                const item = document.createElement('div');
                item.className = 'trek-item';

                // Costruiamo il pezzetto HTML della guida solo se esiste il nome
                let guidaHTML = "";
                if (trek.guida_nome && trek.guida_nome !== "") {
                    guidaHTML = `
                        <div class="guida-box">
                            <p class="guida-label">Accompagnato da:</p>
                            <a href="${trek.guida_sito}" target="_blank" class="guida-link" title="Visita il sito di ${trek.guida_nome}">
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

                grid.appendChild(item);
            });
        });
});