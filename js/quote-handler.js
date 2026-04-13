document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById('btn-random-quote');
    const overlay = document.getElementById('quote-overlay');
    const textSpan = document.getElementById('quote-text');
    const authorSpan = document.getElementById('quote-author');
    const closeBtn = document.querySelector('.close-quote');

    let listaFrasi = [];

    // Fetch corretto verso la cartella citazioni
    fetch('dati/citazioni/citazioni.json')
        .then(res => res.json())
        .then(data => { listaFrasi = data; })
        .catch(err => console.error("Errore fetch:", err));

    // Apri citazione
    btn.addEventListener('click', () => {
        if (listaFrasi.length === 0) return;

        const casuale = listaFrasi[Math.floor(Math.random() * listaFrasi.length)];
        textSpan.innerText = `"${casuale.frase}"`;
        authorSpan.innerText = `- ${casuale.autore}`;

        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Blocca lo scroll della pagina
    });

    // Chiudi citazione
    const closeQuote = () => {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto'; // Riabilita lo scroll
    };

    closeBtn.addEventListener('click', closeQuote);

    // Chiudi se clicchi fuori dal box giallo
    overlay.addEventListener('click', (e) => {
        if(e.target === overlay) closeQuote();
    });
});