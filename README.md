# antoninodaidone

PAGINA TREKKING
Di seguito le icone da poter usare per la pagina trekking:
# ---------------------------------------------------------#
# || Attività      ||  Codice da mettere nel JSON (icona)  ||
# ---------------------------------------------------------#
Montagna                fa-mountain
Vulcani / Fuoco         fa-fire-flame-curved (Ottima per l'Etna)
Mappa                   fa-map-location-dot
Albero / Bosco          fa-tree
Zaino                   fa-briefcase (o fa-bag-shopping se non hai il pack Pro)
Neve / Ghiaccio         fa-snowflake
Impronte                fa-shoe-prints
Bussola                 fa-compass
Tenda / Campeggio       fa-tent
Mare                    fa-water
Foglia / Natura         fa-leaf / fa-seedling
Indicazioni             fa-map-signs
----------------------------------------------------------------------------------------------------------------------------------
Il Json deve essere così composto.
Se Trekking giornaliero:
{
"tipo": "giornaliero",
"stato": "c",
"titolo": "Mare, trekking e nuove amicizie",
"luogo": "Scarlino",
"data": "25/04/2026",
"km_dislivello": "11km / 350m",
"descrizione_breve": "Anello da Scarlino a Cala Violina: profumi di macchia mediterranea, mare blu e sabbia finissima",
"descrizione": "...",
"icona": "fa-map-location-dot",
"guida_nome": "Filippo Bianchi",
"guida_foto": "img/trekking/escursionisti/wemeet.png",
"guida_sito": "https://www.meetup.com/it-it/wemeet-toscana/",
"cartella_foto": "img/trekking/scarlino",
"numero_foto": 1
}


Se invece è un viaggio Trekking:
{
"tipo": "viaggio",
"stato": "c",
"titolo": "Sicilia: la perla nera del mediterraneo tra trekking, capperi e dammusi",
"luogo": "Pantelleria",
"date": {
"da": "07/05/2026",
"al": "10/05/2026"
},
"tappe": [
{
"giorno": "07/05/2026",
"km/dislivello": "8.5km/50m",
"descrizione_tappa": "Lago di Venere e Punta Spadillo - Trekking di benvenuto alla scoperta dell’incantevole costa nord Dati tecnici: Lunghezza: 8,5 km - Dislivello: +50 m/-300 m - Difficoltà: poco impegnativo.",
"cartella_foto": "img/trekking/pantelleria/g01",
"numero_foto": 1
},
{
"giorno": "08/05/2026",
"km/dislivello": "11km/500m",
"descrizione_tappa": "Piana di Ghirlanda - Un’immersione nel paesaggio pantesco, tra dammusi, capperi e passito Dati Tecnici: Lunghezza: 11 km - Dislivello: +300 m/-400 - Difficoltà: mediamente impegnativo.",
"cartella_foto": "img/trekking/pantelleria/g02",
"numero_foto": 1
},
{
"giorno": "09/05/2026",
"km/dislivello": "12km/650m",
"descrizione_tappa": "Montagna Grande - Trekking nel cuore dell’Isola, tra verdi crateri spenti e surreali fumarole attive Dati Tecnici: Lunghezza: 12 km - Dislivello: +650 m - Difficoltà: mediamente  impegnativo.",
"cartella_foto": "img/trekking/pantelleria/g03",
"numero_foto": 1
},
{
"giorno": "10/05/2026",
"km/dislivello": "0km/0m",
"descrizione_tappa": "Testimonianze del passato di un’isola straordinaria - sito archeologico del Sesi.",
"cartella_foto": "img/trekking/pantelleria/g04",
"numero_foto": 1
}
],
"descrizione_breve": "Pantelleria: tra laghi, dammusi e sapori UNESCO, un viaggio unico nella natura selvaggia della Perla Nera",
"descrizione": "Pantelleria è un'isola unica, sospesa tra influenze tunisine e siciliane, resa straordinaria dalla sua posizione che ha favorito un mix eccezionale di elementi naturali e culturali. La visita al Parco Nazionale dell'isola, il primo e unico in Sicilia, offre un’immersione totale in questo paesaggio esotico e affascinante: dal Lago di Venere all'Arco dell'Elefante, dai boschi di Montagna Grande alle vedute sconfinanti sul mare. Tra crateri spenti, piane fumaroliche e scogliere imponenti, Pantelleria rivela il suo carattere autentico, con i tipici dammusi, i muretti a secco e i giardini panteschi. In questa terra apparentemente ostile, nascono eccellenze gastronomiche come il cappero e il passito, riconosciute come patrimonio UNESCO. Un viaggio che unisce natura e sapori intensi, svelando il fascino della “Perla Nera” del Mediterraneo.",
"icona": "fa-compass",
"guida_nome": "Giacomo Criscenti",
"guida_foto": "img/trekking/escursionisti/itinerrando.png",
"guida_sito": "https://www.itinarrando.com/"
}
------------------------------------------------------------------------------------------------------------------------
Ricordo che il campo:
"stato": può avere i seguenti valori:
"c" = completato
"w" = work in progress
"p" = programmato

------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
PAGINA VINILI
Aggiungere Manualmente traccia audio sul json:
{
    "artista": "Jackson 5",
    "album": "ABC",
    "anno": "1970",
    "genere": "R&B/Soul",
    "descrizione": "L'energia contagiosa di un giovanissimo Michael Jackson.",
    "video": "https://www.youtube.com/watch?v=gjWbaCLq6L4&list=PL2720135626C6DF05",
    "tracklist": [
        {
        "disco": 1,
        "lato": "A",
        "n": 1,
        "titolo": "The Love You Save",
        "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d3/cc/ad/d3ccadba-3063-760d-73bb-eb8887432eb0/mzaf_12878611304078062054.plus.aac.p.m4a"
        },
        
        ......
    
    ]
}




// URL di esempio per il satellite (Esri è ottimo perché non richiede API key immediate)
private satelliteUrl: string =
'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
// Layer per le VIE (quello che stai usando ora)
private roadsUrl: string =
'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/%7Bz%7D/%7By%7D/%7Bx%7D';

// Layer per CITTA' e CONFINI
private placesUrl: string =
'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/%7Bz%7D/%7By%7D/%7Bx%7D';