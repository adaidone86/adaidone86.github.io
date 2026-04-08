/**
 * Gestione dello scroll tramite pulsanti e visibilità controlli
 * + Protezione contenuti (Blocco tasto destro e drag immagini)
 */

// 1. Funzione universale per lo scroll
function scrollText(distance) {
    const target = document.getElementById('scroll-target');
    if (target) {
        target.scrollBy({
            top: distance,
            behavior: 'smooth'
        });
    } else {
        console.warn("Elemento 'scroll-target' non trovato in questa pagina.");
    }
}

// 2. Gestione visibilità automatica e Protezioni
document.addEventListener("DOMContentLoaded", () => {
    const controls = document.querySelector('.scroll-controls');
    const body = document.body;

    // --- Gestione Frecce ---
    if (!body.classList.contains('animating')) {
        if (controls) controls.classList.add('visible');
    }

    // --- PROTEZIONE CONTENUTI ---

    // A. Blocca il Menu Contestuale (Tasto Destro) su tutto il documento
    document.addEventListener('contextmenu', (e) => {
        // Permettiamo il tasto destro solo se l'utente clicca su campi di testo (se ne avrai)
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    }, false);

    // B. Blocca il Drag & Drop delle immagini (impedisce di trascinarle fuori dal browser)
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    }, false);

    // C. Opzionale: Blocca combinazioni di tasti comuni per il salvataggio (Ctrl+S, Ctrl+U)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key === 's' || e.key === 'u')) {
            e.preventDefault();
        }
    });
});