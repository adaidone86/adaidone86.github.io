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
"titolo": "Sicilia: la perla nera del mediterraneo tra trekking, capperi e dammusi",
"luogo": "Pantelleria",
"date": {
"da": "07/05/2026",
"al": "10/05/2026"
},
"tappe": [
{ "giorno": 1, "km": 5, "dislivello": 100 },
{ "giorno": 2, "km": 8, "dislivello": 300 },
{ "giorno": 3, "km": 7, "dislivello": 200 }
],
"totale_km": "20km",
"descrizione_breve": "Pantelleria: tra laghi, dammusi e sapori UNESCO, un viaggio unico nella natura selvaggia della Perla Nera",
"descrizione": "...",
"icona": "fa-briefcase",
"guida_nome": "Giacomo Criscenti",
"guida_foto": "img/trekking/escursionisti/itinerrando.png",
"guida_sito": "https://www.itinarrando.com/",
"cartella_foto": "img/trekking/pantelleria",
"numero_foto": 1
}






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