/* --- Funzione di ricerca per la collezione di Vinili --- */
function filterAlbums() {
    // 1. Recupera i valori inseriti dall'utente e trasformali in minuscolo
    let titleInput = document.getElementById('searchTitle').value.toLowerCase();
    let artistInput = document.getElementById('searchArtist').value.toLowerCase();

    // 2. Seleziona tutti i quadrettoni degli album
    let albums = document.querySelectorAll('.album-item');

    // 3. Cicla su ogni album per decidere se mostrarlo o nasconderlo
    albums.forEach(album => {
        let title = album.getAttribute('data-title').toLowerCase();
        let artist = album.getAttribute('data-artist').toLowerCase();

        // Verifica se il titolo include il testo cercato E l'artista include il testo cercato
        if (title.includes(titleInput) && artist.includes(artistInput)) {
            album.style.display = "flex"; // Mostra
        } else {
            album.style.display = "none"; // Nascondi
        }
    });
}