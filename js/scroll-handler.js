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

// --- SCROLL UNIVERSALE (Mouse e Tastiera) ---

document.addEventListener("wheel", (e) => {
    const target = document.getElementById('scroll-target');
    if (target) {
        // Trasmette il movimento della rotellina al contenitore del testo
        target.scrollBy({
            top: e.deltaY,
            behavior: 'auto' // 'auto' è più fluido per la rotellina rispetto a 'smooth'
        });
    }
}, { passive: true });

document.addEventListener("keydown", (e) => {
    const target = document.getElementById('scroll-target');
    if (!target) return;

    const step = 100; // Quanti pixel scorrere a ogni pressione

    if (e.key === "ArrowDown") {
        target.scrollBy({ top: step, behavior: 'smooth' });
    } else if (e.key === "ArrowUp") {
        target.scrollBy({ top: -step, behavior: 'smooth' });
    } else if (e.key === "PageDown") {
        target.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    } else if (e.key === "PageUp") {
        target.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
    } else if (e.key === " ") { // Barra spaziatrice
        e.preventDefault(); // Impedisce il salto pagina standard
        target.scrollBy({ top: window.innerHeight * 0.5, behavior: 'smooth' });
    }
});