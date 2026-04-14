function initGlobalSearch(inputId, dataList, renderCallback, keysToSearch) {
    const searchInput = document.getElementById(inputId);
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase().trim();

        if (val === "") {
            renderCallback(dataList);
            return;
        }

        const filtered = dataList.filter(item => {
            return keysToSearch.some(key => {
                // Prova a cercare nel primo livello (Trekking)
                let field = item[key];

                // Se non lo trova, scava in .dati (Vinili)
                if (field === undefined && item.dati) {
                    field = item.dati[key];
                }

                return String(field || "").toLowerCase().includes(val);
            });
        });

        renderCallback(filtered);
    });
}