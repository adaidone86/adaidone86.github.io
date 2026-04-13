import os
import json
import urllib.request
import urllib.parse

# ==========================================
# IMPOSTAZIONI
# ==========================================
DOWNLOAD_COVERS = False      # Metti True se vuoi scaricare cover.jpg
RECUPERA_TRACKLIST = True   # Metti True per avere le canzoni nel JSON
INCLUDI_LINK_AUDIO = False   # Se False, non inserisce il campo "audio" nel JSON (il JS li cercherà al volo)
# ==========================================

# Struttura: [Artista, Album, Anno, Genere, NomeCartella, Descrizione (opzionale), Video (opzionale)]
vinili = [
    ["Miles Davis", "Kind of Blue", "1959", "Modal jazz", "kind-of-blue", "Il capolavoro del jazz modale, un disco che non stanca mai.", ""],
    ["Sam Smith", "In The Lonely Hour", "2014", "Pop / Soul / R&B", "in-the-lonely-hour", "Una voce incredibile che arriva dritta al cuore.", ""],
    ["King E. Ben", "Don'T Play That Song", "1962", "Soul", "dont-play-that-song", "Puro soul anni '60, un classico intramontabile.", ""],
    ["Tiromancino", "Ho Cambiato Tante Case", "2021", "Pop", "ho-cambiato-tante-case", "Testi profondi e melodie avvolgenti di Federico Zampaglione.", ""],
    ["Ray Charles", "What'd I Say", "1959", "Rhythm and blues / Soul", "whatd-i-say", "Il disco che ha fuso gospel e blues creando il soul.", ""],
    ["Ray Charles", "Genius Sings The Blues", "1961", "R&B / Blues / Soul", "genius-sings-the-blues", "Ray Charles nel suo elemento naturale: il blues.", ""],
    ["The Doors", "The Doors", "1967", "Rock psichedelico", "the-doors", "L'esordio folgorante di Jim Morrison e soci.", ""],
    ["Ozzy Osbourne", "Blizzard of Ozz", "1980", "Heavy metal", "blizzard-of-ozz", "L'inizio della carriera solista del Principe delle Tenebre.", ""],
    ["Guns N' Roses", "Appetite for destruction", "1987", "Hard rock", "appetite-for-destruction", "Energia pura, il miglior album d'esordio hard rock di sempre.", ""],
    ["Pino Daniele", "Nero a Metà", "1980", "Blues / Canzone napoletana", "nero-a-meta", "Il blues mediterraneo che ha cambiato la musica italiana.", ""],
    ["Goo Goo Dolls", "Dizzy Up the Girl", "1998", "Rock alternativo", "dizzy-up-the-girl", "Contiene la celeberrima Iris, un pezzo di storia degli anni '90.", ""],
    ["Pearl Jam", "Ten", "1991", "Grunge / Rock alternativo", "ten", "L'anima di Seattle racchiusa in un disco potente e cupo.", ""],
    ["Metallica", "Metallica (The Black Album)", "1991", "Heavy metal", "metallica-black", "Il disco che ha portato il metal nelle classifiche mondiali.", ""],
    ["Michael Jackson", "Bad", "1987", "Pop / Dance", "bad", "Il re del pop al suo apice creativo dopo Thriller.", ""],
    ["AC/DC", "Back in Black", "1980", "Hard rock", "back-in-black", "Un muro di suono dedicato alla memoria di Bon Scott.", ""],
    ["Greta Van Fleet", "From The Fires", "2017", "Hard rock", "from-the-fires", "Il ritorno del rock classico con una voce che ricorda i Led Zeppelin.", ""],
    ["Adele", "21", "2011", "Pop soul", "adele-21", "Emozioni crude e una potenza vocale senza precedenti.", ""],
    ["Arctic Monkeys", "AM", "2013", "Indie rock", "am", "Riff magnetici e un sound notturno e sexy.", ""],
    ["Nirvana", "Nevermind", "1991", "Grunge", "nevermind", "Il disco che ha definito una generazione.", ""],
    ["Nina Simone", "Little Girl Blue", "1958", "Jazz", "little-girl-blue", "L'eleganza e la forza di una delle voci più iconiche del jazz.", ""],
    ["Imagine Dragons", "Night Visions", "2012", "Rock alternativo", "night-visions", "L'esordio che ha dominato le radio di tutto il mondo.", ""],
    ["Mannarino", "Supersantos", "2011", "Folk rock", "supersantos", "Storie di strada e poesia popolare romana.", ""],
    ["Franz Ferdinand", "Franz Ferdinand", "2004", "Indie rock", "franz-ferdinand", "Il disco che ha fatto ballare tutta l'Europa indie.", ""],
    ["Articolo 31", "Italiano Medio", "2003", "Rap rock", "italiano-medio", "L'ironia di J-Ax che fotografa i vizi dell'Italia.", ""],
    ["The Fray", "The Fray", "2009", "Rock alternativo", "the-fray", "Melodie al pianoforte cariche di emozione.", ""],
    ["The Verve", "Urban Hymns", "1997", "Britpop", "urban-hymns", "Contiene Bitter Sweet Symphony, un inno generazionale.", ""],
    ["Radiohead", "The Bends", "1995", "Alternative rock", "the-bends", "Il passaggio verso il rock sperimentale e malinconico.", ""],
    ["Muse", "Black Holes & Revelations", "2006", "Rock alternativo", "black-holes", "Un mix epico di rock, elettronica e fantascienza.", ""],
    ["Corinne Bailey Rae", "Corinne Bailey Rae", "2006", "R&B", "corinne-bailey-rae", "Soul delicato e solare, perfetto per il relax.", ""],
    ["The Cranberries", "No Need to Argue", "1994", "Rock Alternativo", "no-need-to-argue", "Il disco di Zombie, un capolavoro di Dolores O'Riordan.", ""],
    ["Amy Winehouse", "Back To Black", "2006", "Contemporary R&B", "back-to-black-amy", "Un'anima tormentata e una voce jazz prestata al soul moderno.", ""],
    ["883", "Nord sud ovest est", "1993", "Pop", "nord-sud-ovest-est", "Il viaggio zaino in spalla della generazione anni '90.", ""],
    ["Linkin Park", "From Zero", "2024", "Alternative metal", "from-zero", "Il nuovo inizio dopo anni di silenzio.", ""],
    ["Queen", "A Night At The Opera", "1975", "Progressive rock", "night-at-the-opera", "L'opera rock definitiva, contiene Bohemian Rhapsody.", ""],
    ["Evanescence", "Fallen", "2003", "Nu metal", "fallen", "Gothic rock potente con la voce angelica di Amy Lee.", ""],
    ["Goo Goo Dolls", "Chaos In Bloom", "2022", "Rock Alternativo", "chaos-in-bloom", "Il ritorno alle sonorità rock più classiche della band.", ""],
    ["Etta James", "At Last!", "1960", "R&B / Blues", "at-last", "La voce definitiva del blues e dell'R&B classico.", ""],
    ["Lewis Capaldi", "Broken By Desire", "2023", "Pop/Soul", "broken-by-desire", "Canzoni d'amore struggenti e sincerità disarmante.", ""],
    ["Lewis Capaldi", "Divinely Uninspired", "2019", "Pop/Soul", "divinely-uninspired", "L'esordio record del re delle ballate moderne.", ""],
    ["Santana", "Moonflower", "1977", "Rock", "moonflower", "Un mix perfetto di energia live e precisione in studio.", ""],
    ["Jackson 5", "ABC", "1970", "R&B/Soul", "abc", "L'energia contagiosa di un giovanissimo Michael Jackson.", ""],
    ["Earth, Wind & Fire", "Greatest Hits Vol 1", "1978", "R&B", "earth-wind-fire-hits", "Il groove assoluto che ha fatto ballare il mondo intero.", ""]
]

def recupera_dati_album(artista, album):
    query = urllib.parse.quote(f"{artista} {album}")
    url_ricerca = f"https://itunes.apple.com/search?term={query}&entity=album&limit=1"
    risultato = {"cover_url": None, "canzoni": []}

    try:
        with urllib.request.urlopen(url_ricerca) as response:
            data = json.loads(response.read().decode())
            if data['results']:
                album_id = data['results'][0]['collectionId']
                risultato["cover_url"] = data['results'][0]['artworkUrl100'].replace('100x100bb', '600x600bb')

                url_brani = f"https://itunes.apple.com/lookup?id={album_id}&entity=song"
                with urllib.request.urlopen(url_brani) as resp_brani:
                    data_brani = json.loads(resp_brani.read().decode())

                    brani_temporanei = []
                    for item in data_brani['results']:
                        if item.get('wrapperType') == 'track':
                            disco = item.get('discNumber', 1)
                            traccia = item.get('trackNumber', 0)
                            lato = "A" if traccia <= 6 else "B"

                            # Costruiamo l'oggetto brano
                            brano = {
                                "disco": disco,
                                "lato": lato,
                                "n": traccia,
                                "titolo": item.get('trackName', 'Unknown')
                            }

                            # Inseriamo il link audio solo se il flag è True
                            if INCLUDI_LINK_AUDIO:
                                brano["audio"] = item.get('previewUrl', '')

                            brani_temporanei.append(brano)

                    brani_temporanei.sort(key=lambda x: (x['disco'], x['n']))
                    risultato["canzoni"] = brani_temporanei

    except Exception as e:
        print(f"Errore API per {album}: {e}")
    return risultato

print(f"🚀 Avvio procedura di aggiornamento collezione...")

for v in vinili:
    artista_nome = v[0]
    album_nome = v[1]
    nome_cartella = v[4]

    folder_path = os.path.join("img", "vinile", nome_cartella)
    os.makedirs(folder_path, exist_ok=True)

    descrizione_disco = v[5] if (len(v) > 5 and v[5]) else "Questo disco fa parte della mia collezione personale."
    percorso_video = v[6] if (len(v) > 6 and v[6]) else f"img/vinile/{nome_cartella}/video.mp4"

    dati_api = {"cover_url": None, "canzoni": []}
    if DOWNLOAD_COVERS or RECUPERA_TRACKLIST:
        dati_api = recupera_dati_album(artista_nome, album_nome)

    json_data = {
        "artista": artista_nome,
        "album": album_nome,
        "anno": v[2],
        "genere": v[3],
        "descrizione": descrizione_disco,
        "video": percorso_video,
        "tracklist": dati_api["canzoni"]
    }

    with open(os.path.join(folder_path, "info.json"), "w", encoding="utf-8") as f:
        json.dump(json_data, f, indent=4, ensure_ascii=False)

    messaggio_cover = "⏸️ Saltato"
    if DOWNLOAD_COVERS and dati_api["cover_url"]:
        cover_file = os.path.join(folder_path, "cover.jpg")
        if not os.path.exists(cover_file):
            try:
                urllib.request.urlretrieve(dati_api["cover_url"], cover_file)
                messaggio_cover = "✅ Scaricata"
            except:
                messaggio_cover = "⚠️ Errore download"
        else:
            messaggio_cover = "⏭️ Esistente"

    status_track = f"🎵 {len(dati_api['canzoni'])} brani" if dati_api["canzoni"] else "❌ No tracklist"
    status_audio = "(Link ON)" if INCLUDI_LINK_AUDIO else "(Link OFF - Dinamico)"
    print(f"📦 {album_nome.ljust(30)} | {status_track} {status_audio} | Cover: {messaggio_cover}")

print("\n✨ Procedura completata con successo!")