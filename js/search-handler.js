/**
 * Inizializza la ricerca globale con fix per lo spazio e sfarfallio
 */
function initGlobalSearch(inputId, dataList, renderCallback, keysToSearch) {
    const searchInput = document.getElementById(inputId);
    if (!searchInput) return;

    // --- FIX BUG SPAZIO ---
    // Impedisce che la barra spaziatrice faccia scorrere la pagina
    // mentre l'utente sta scrivendo nel campo di ricerca
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === " " || e.code === "Space") {
            e.stopPropagation();
        }
    });

    let searchTimeout;

    // --- LOGICA DI RICERCA CON DEBOUNCE ---
    searchInput.addEventListener('input', (e) => {
        // Puliamo il timeout precedente per evitare sfarfallii
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            const val = e.target.value.toLowerCase().trim();

            // Se il campo è vuoto, mostriamo tutto
            if (val === "") {
                renderCallback(dataList);
                return;
            }

            // Filtraggio dei dati
            const filtered = dataList.filter(item => {
                return keysToSearch.some(key => {
                    // Cerca nel primo livello (es. Trekking)
                    let field = item[key];

                    // Se non lo trova, scava in .dati (es. Vinili)
                    if (field === undefined && item.dati) {
                        field = item.dati[key];
                    }

                    return String(field || "").toLowerCase().includes(val);
                });
            });

            // Esegue il rendering dei risultati filtrati
            renderCallback(filtered);

        }, 150); // Attesa di 150ms per fluidità visiva
    });
}