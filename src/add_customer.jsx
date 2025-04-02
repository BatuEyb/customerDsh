import { useState } from "react";
import './add_customer.css';

function Add_customer() {
    // Form verilerini tutacak state'ler
    const [tuketimNo, setTuketimNo] = useState('');
    const [adSoyad, setAdSoyad] = useState('');
    const [igdasSozlesme, setIgdasSozlesme] = useState('');
    const [telefon1, setTelefon1] = useState('');
    const [telefon2, setTelefon2] = useState('');
    const [il, setIl] = useState('');
    const [ilce, setIlce] = useState('');
    const [mahalle, setMahalle] = useState('');
    const [sokakAdi, setSokakAdi] = useState('');
    const [binaNo, setBinaNo] = useState('');
    const [daireNo, setDaireNo] = useState('');
    const [cihazTuru, setCihazTuru] = useState('');
    const [cihazMarkasi, setCihazMarkasi] = useState('');
    const [cihazModeli, setCihazModeli] = useState('');
    const [cihazSeriNo, setCihazSeriNo] = useState('');
    const [siparisTarihi, setSiparisTarihi] = useState('');
    const [montajTarihi, setMontajTarihi] = useState('');
    const [musteriTemsilcisi, setMusteriTemsilcisi] = useState('');
    const [isTipi, setIsTipi] = useState('');
    const [isDurumu, setIsDurumu] = useState('');

    const [ilceler, setIlceler] = useState([]);
    const [mahalleler, setMahalleler] = useState([]);

    // İl değiştiğinde ilçe listesini güncelleme
    const handleIlChange = (event) => {
        const selectedIl = event.target.value;
        setIl(selectedIl);

        // İl seçimine göre ilçe verilerini güncelle
        if (selectedIl === 'İstanbul') {
            setIlceler(['Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü',
                'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüp', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane',
                'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye',
                'Üsküdar', 'Zeytinburnu']); // Örnek ilçeler
        } else if (selectedIl === 'Kocaeli') {
            setIlceler(['Başiskele', 'Çayırova', 'Darıca', 'Derince', 'Dilovası', 'Gebze', 'Gölcük', 'İzmit', 'Kandıra', 'Karamürsel', 'Kartepe', 'Körfez']);
        } else {
            setIlceler([]);
        }
    };

    // İlçe değiştiğinde mahalle listesini güncelleme
    const handleIlceChange = (event) => {
        const selectedIlce = event.target.value;
        setIlce(selectedIlce);

        // İlçe seçimine göre mahalle verilerini güncelle
        if (selectedIlce === 'Adalar') {
            setMahalleler(['Burgazada', 'Heybeliada', 'Kınalıada', 'Maden', 'Nizam']);
        } else if (selectedIlce === 'Arnavutköy') {
            setMahalleler(['Adnan Menderes', 'Anadolu', 'Arnavutköy Merkez', 'Atatürk', 'Baklalı', 'Balaban', 'Boğazköy İstiklal', 'Bolluca', 'Boyalık', 'Çilingir', 'Deliklikaya', 'Dursunköy', 'Durusu', 'Fatih', 'Hacımaşlı', 'Hadımköy', 'Haraççı', 'Hastane', 'Hicret', 'İmrahor', 'İslambey', 'Karaburun', 'Karlıbayır', 'Mavigöl', 'Mollafeneri', 'Mustafa Kemal Paşa', 'Nakkaş', 'Nenehatun', 'Ömerli', 'Sazlıbosna', 'Taşoluk', 'Terkos', 'Yassıören', 'Yavuz Selim', 'Yeniköy', 'Yeşilbayır']);
        } else if (selectedIlce === 'Ataşehir') {
            setMahalleler(['Aşık Veysel', 'Atatürk', 'Barbaros', 'Esatpaşa', 'Ferhatpaşa', 'Fetih', 'İçerenköy', 'İnönü', 'Kayışdağı', 'Küçükbakkalköy', 'Mevlana', 'Mimar Sinan', 'Mustafa Kemal', 'Örnek', 'Yeni Çamlıca', 'Yeni Sahra', 'Yenişehir']);
        } else if (selectedIlce === 'Avcılar') {
            setMahalleler(['Ambarlı', 'Cihangir', 'Denizköşkler', 'Firuzköy', 'Gümüşpala', 'Mustafa Kemal Paşa', 'Tahtakale', 'Üniversite', 'Yeşilkent']);
        } else if (selectedIlce === 'Bağcılar') {
            setMahalleler(['15 Temmuz', '100. Yıl', 'Bağlar', 'Barbaros', 'Çınar', 'Demirkapı', 'Evren', 'Fatih', 'Fevzi Çakmak', 'Göztepe', 'Güneşli', 'Hürriyet', 'İnönü', 'Kazım Karabekir', 'Kemalpaşa', 'Kirazlı', 'Mahmutbey', 'Merkez', 'Sancaktepe', 'Yavuz Selim', 'Yenigün', 'Yenimahalle', 'Yıldıztepe']);
        } else if (selectedIlce === 'Bahçelievler') {
            setMahalleler(['Bahçelievler', 'Cumhuriyet', 'Çobançeşme', 'Fevzi Çakmak', 'Hürriyet', 'Kocasinan Merkez', 'Siyavuşpaşa', 'Soğanlı', 'Şirinevler', 'Yenibosna Merkez', 'Zafer']);
        } else if (selectedIlce === 'Bakırköy') {
            setMahalleler(['Ataköy 1. Kısım', 'Ataköy 2-5-6. Kısım', 'Ataköy 3-4-11. Kısım', 'Ataköy 7-8-9-10. Kısım', 'Basınköy', 'Cevizlik', 'Kartaltepe', 'Osmaniye', 'Sakızağacı', 'Şenlikköy', 'Yenimahalle', 'Yeşilköy', 'Yeşilyurt', 'Zeytinlik', 'Zuhuratbaba']);
        } else if (selectedIlce === 'Başakşehir') {
            setMahalleler(['Altınşehir', 'Bahçeşehir 1. Kısım', 'Bahçeşehir 2. Kısım', 'Başak', 'Başakşehir', 'Güvercintepe', 'İkitelli', 'Kayabaşı', 'Şahintepe', 'Ziya Gökalp']);
        } else if (selectedIlce === 'Bayrampaşa') {
            setMahalleler(['Altıntepsi', 'Cevatpaşa', 'İsmetpaşa', 'Kartaltepe', 'Kocatepe', 'Muratpaşa', 'Orta', 'Terazidere', 'Vatan', 'Yenidoğan', 'Yıldırım']);
        } else if (selectedIlce === 'Beşiktaş') {
            setMahalleler(['Abbasağa', 'Akatlar', 'Arnavutköy', 'Balmumcu', 'Bebek', 'Cihannüma', 'Dikilitaş', 'Etiler', 'Gayrettepe', 'Konaklar', 'Kuruçeşme', 'Kültür', 'Levazım', 'Levent', 'Mecidiye', 'Muradiye', 'Nisbetiye', 'Ortaköy', 'Sinanpaşa', 'Türkali', 'Ulus', 'Vişnezade', 'Yıldız']);
        } else if (selectedIlce === 'Beykoz') {
            setMahalleler(['Acarlar', 'Akbaba', 'Alibahadır', 'Anadoluhisarı', 'Anadolukavağı', 'Baklacı', 'Bozhane', 'Cumhuriyet', 'Çamlıbahçe', 'Çengeldere', 'Çiftlik', 'Çiğdem', 'Çubuklu', 'Dereseki', 'Elmalı', 'Fatih', 'Göksu', 'Göllü', 'Göztepe', 'Gümüşsuyu', 'İncirköy', 'İshaklı', 'Kanlıca', 'Kavacık', 'Kaynarca', 'Kılıçlı', 'Mahmutşevketpaşa', 'Merkez', 'Öğümce', 'Ortaçeşme', 'Örnekköy', 'Paşabahçe', 'Paşamandıra', 'Polonezköy', 'Poyrazköy', 'Riva', 'Rüzgarlıbahçe', 'Soğuksu', 'Tokatköy', 'Yalıköy', 'Yavuz Selim', 'Yenimahalle']);
        } else if (selectedIlce === 'Beylikdüzü') {
            setMahalleler(['Adnan Kahveci', 'Barış', 'Büyükşehir', 'Cumhuriyet', 'Dereağzı', 'Gürpınar', 'Kavaklı', 'Marmara', 'Sahil', 'Yakuplu']);
        } else if (selectedIlce === 'Beyoğlu') {
            setMahalleler(['Arap Cami', 'Asmalı Mescit', 'Bedrettin', 'Bereketzade', 'Cihangir', 'Çukurcuma', 'Demirtaş', 'Fındıklı', 'Galata', 'Gedikpaşa', 'Gümüşsuyu', 'Hacımimi', 'Halıcıoğlu', 'Hüseyinağa', 'İstiklal', 'Kasımpaşa', 'Kemankeş', 'Kılıçali Paşa', 'Kuloğlu', 'Kurtuluş', 'Laleli', 'Müeyyetzade', 'Ömer Avni', 'Pürtelaş Hasan Efendi', 'Sütlüce', 'Şahkulu', 'Şehit Muhtar', 'Süleymaniye', 'Tarlabaşı', 'Taksim', 'Tomtom', 'Vakıf', 'Yüksek Kaldırım', 'Hasköy', 'Kadirgalar', 'Kasımpaşalı', 'Kocatepe', 'Kurtuluş', 'Müze', 'Piyalepaşa', 'Sütlüce']);
        } else if (selectedIlce === 'Büyükçekmece') {
            setMahalleler(['19 Mayıs', 'Atatürk', 'Bahçelievler', 'Batıköy', 'Celâliye', 'Çakmaklı', 'Çatalca', 'Çatalca Merkez', 'Çatalca Sanayi', 'Cumhuriyet', 'Fatih', 'Güzelce', 'Kamiloba', 'Kavaklı', 'Kumburgaz', 'Mimarsinan', 'Muradiye', 'Muratbey', 'Pınartepe', 'Sahil', 'Türkoba', 'Yakuplu', 'Yenimahalle', 'Zeytinlik']);
        } else if (selectedIlce === 'Çatalca') {
            setMahalleler(['Ahmediye', 'Akalan', 'Alipaşa', 'Aşağı Yazıcı', 'Ataköy', 'Büyükbaba', 'Büyükçekmece', 'Çakıl', 'Çakılköy', 'Çanakça', 'Çavuşlar', 'Çayırdere', 'Çatalca Merkez', 'Çatalca Sanayi', 'Çavuşbaşı', 'Çekmeköy', 'Çiftlik', 'Çilingir', 'Çukurca', 'Davutpaşa', 'Durusu', 'Elbasan', 'Gökçeali', 'Gökçebey', 'Gökçebeyli', 'Göllü', 'Gümüşpınar', 'Hallaçlı', 'Hekimköy', 'Kalfa', 'Kaleiçi', 'Karaağaç', 'Karamandere', 'Kavaklı', 'Kızılcaali', 'Muratbey', 'Muratbey Merkez', 'Oklalı']);
        } else if (selectedIlce === 'Çekmeköy') {
            setMahalleler(['Alemdağ', 'Aydınlar', 'Ekşioğlu', 'Hamidiye', 'Hüseyinli', 'İMES', 'İMES Sanayi', 'Madenler', 'Mehmet Akif', 'Merkez', 'Mimarsinan', 'Ömerli', 'Reşadiye', 'Sancaktepe', 'Sultanbeyli', 'Sultançiftliği', 'Taşdelen', 'Yenidoğan', 'Yunus Emre']);
        } else if (selectedIlce === 'Esenler') {
            setMahalleler(['15 Temmuz Mahallesi', 'Atışalanı Mahallesi', 'Birlik Mahallesi', 'Çiftehavuzlar Mahallesi', 'Davutpaşa Mahallesi', 'Fatih Mahallesi', 'Fevzi Çakmak Mahallesi', 'Havaalanı Mahallesi', 'Kazım Karabekir Mahallesi', 'Kemer Mahallesi', 'Menderes Mahallesi', 'Mimarsinan Mahallesi', 'Namık Kemal Mahallesi', 'Nine Hatun Mahallesi', 'Oruçreis Mahallesi', 'Tuna Mahallesi', 'Turgut Reis Mahallesi', 'Yavuz Selim Mahallesi']);
        } else if (selectedIlce === 'Eyüp') {
            setMahalleler(['Ağaçlı', 'Akpınar', 'Akşemsettin', 'Alibeyköy', 'Çırçır', 'Çiftalan', 'Defterdar', 'Düğmeciler', 'Emniyettepe', 'Esentepe', 'Eyüp Merkez', 'Göktürk Merkez', 'Güzeltepe', 'İhsaniye', 'Işıklar', 'İslambey', 'Karadolap', 'Mimarsinan', 'Mithatpaşa', 'Nişancı', 'Odayeri', 'Pirinççi', 'Rami Cuma', 'Rami Yeni', 'Sakarya', 'Silahtarağa', 'Topçular', 'Yeşilpınar']);
        } else if (selectedIlce === 'Fatih') {
            setMahalleler(['Aksaray', 'Akşemsettin', 'Alemdar', 'Ali Kuşçu', 'Atikali', 'Ayvansaray', 'Balabanağa', 'Balat', 'Beyazıt', 'Binbirdirek', 'Cankurtaran', 'Cerrahpaşa', 'Cibali', 'Demirtaş', 'Derviş Ali', 'Eminsinan', 'Hacı Kadın', 'Haseki Sultan', 'Hırka-i Şerif', 'Hobyar', 'Hoca Gıyasettin', 'Hocapaşa', 'İskenderpaşa', 'Kalenderhane', 'Karagümrük', 'Katip Kasım', 'Kemalpaşa', 'Koca Mustafapaşa', 'Küçük Ayasofya', 'Mercan', 'Mesihpaşa', 'Mevlanakapı', 'Mimar Hayrettin', 'Mimar Kemaletin', 'Molla Fenari', 'Molla Gürani', 'Molla Hüsrev', 'Muhsine Hatun', 'Nişanca', 'Rüstempaşa', 'Saraç İshak', 'Seyyid Ömer', 'Silivrikapı', 'Sultan Ahmet', 'Sururi', 'Süleymaniye', 'Sümbül Efendi', 'Şehremini', 'Şehsuvar Bey', 'Taya Hatun', 'Topkapı', 'Vefa', 'Yavuz Sinan', 'Yavuz Sultan Selim', 'Yedikule', 'Zeyrek']);
        } else if (selectedIlce === 'Gaziosmanpaşa') {
            setMahalleler(['Bağlarbaşı', 'Barbaros Hayrettin Paşa', 'Fevzi Çakmak', 'Hürriyet', 'Karadeniz', 'Karayolları', 'Karlıtepe', 'Kazım Karabekir', 'Merkez', 'Mevlana', 'Pazariçi', 'Sarıgöl', 'Şemsipaşa', 'Yeni Mahalle', 'Yenidoğan', 'Yıldıztabya']);
        } else if (selectedIlce === 'Güngören') {
            setMahalleler(['Abdurrahman Nafız Gürman', 'Akıncılar', 'Gençosman', 'Güneştepe', 'Güven', 'Haznedar', 'Mareşal Çakmak', 'Mehmet Nesih Özmen', 'Merkez', 'Sanayi', 'Tozkoparan']);
        } else if (selectedIlce === 'Kadıköy') {
            setMahalleler(['19 Mayıs', 'Acıbadem', 'Bostancı', 'Caddebostan', 'Caferağa', 'Dumlupınar', 'Eğitim', 'Erenköy', 'Fenerbahçe', 'Feneryolu', 'Fikirtepe', 'Göztepe', 'Hasanpaşa', 'Koşuyolu', 'Kozyatağı', 'Merdivenköy', 'Osmanağa', 'Rasimpaşa', 'Sahrayıcedit', 'Suadiye', 'Zühtüpaşa']);
        } else if (selectedIlce === 'Kağıthane') {
            setMahalleler(['Çağlayan', 'Çeliktepe', 'Emniyetevleri', 'Gültepe', 'Gürsel', 'Hamidiye', 'Harmantepe', 'Hürriyet', 'Kağıthane Merkez', 'Mehmet Akif Ersoy', 'Nurtepe', 'Ortabayır', 'Sanayi', 'Seyrantepe', 'Şirintepe', 'Talatpaşa', 'Telsizler', 'Yahyakemal', 'Yeşilce']);
        } else if (selectedIlce === 'Kartal') {
            setMahalleler(['Atalar', 'Cevizli', 'Cumhuriyet', 'Çavuşoğlu', 'Esentepe', 'Gümüşpınar', 'Hürriyet', 'Karlıktepe', 'Kordonboyu', 'Orhantepe', 'Orta', 'Petrol-İş', 'Soğanlık Yeni', 'Soğanlık', 'Topselvi', 'Uğur Mumcu', 'Yakacık Merkez', 'Yakacık Yeni', 'Yalı', 'Yukarı']);
        } else if (selectedIlce === 'Küçükçekmece') {
            setMahalleler(['Atakent', 'Atatürk', 'Beşyol', 'Cennet', 'Cumhuriyet', 'Fatih', 'Fevzi Çakmak', 'Gültepe', 'Halkalı Merkez', 'İnönü', 'İstasyon', 'Kanarya', 'Kartaltepe', 'Kemalpaşa', 'Mehmet Akif', 'Söğütlüçeşme', 'Sultanmurat', 'Tevfikbey', 'Yarımburgaz', 'Yeni Mahalle', 'Yeşilova']);
        } else if (selectedIlce === 'Maltepe') {
            setMahalleler(['Altayçeşme', 'Altıntepe', 'Aydınevler', 'Bağlarbaşı', 'Başıbüyük', 'Büyükbakkalköy', 'Cevizli', 'Çınar', 'Esenkent', 'Feyzullah', 'Fındıklı', 'Girne', 'Gülensu', 'Gülsuyu', 'İdealtepe', 'Küçükyalı', 'Yalı', 'Zümrütevler']);
        } else if (selectedIlce === 'Pendik') {
            setMahalleler(['Ahmet Yesevi', 'Bahçelievler', 'Ballıca', 'Batı', 'Çamçeşme', 'Çamlık', 'Çınardere', 'Doğu', 'Dumlupınar', 'Emirli', 'Ertuğrulgazi', 'Esenler', 'Esenyalı', 'Fatih', 'Fevzi Çakmak', 'Göçbeyli', 'Güllübağlar', 'Güzelyalı', 'Harmandere', 'Kavakpınar', 'Kaynarca', 'Kurna', 'Kurtdoğmuş', 'Kurtköy', 'Orhangazi', 'Orta', 'Ramazanoğlu', 'Sanayi', 'Sapanbağları', 'Sülüntepe', 'Şeyhli', 'Velibaba', 'Yayalar', 'Yeni', 'Yenişehir', 'Yeşilbağlar']);
        } else if (selectedIlce === 'Sancaktepe') {
            setMahalleler(['Abdurrahmangazi', 'Akpınar', 'Atatürk', 'Emek', 'Eyüpsultan', 'Fatih', 'Hilal', 'İnönü', 'Kemaltürkler', 'Meclis', 'Merve', 'Mevlana', 'Osmangazi', 'Paşaköy', 'Safa', 'Sarıgazi', 'Veyselkarani', 'Yenidoğan', 'Yunusemre']);
        } else if (selectedIlce === 'Sarıyer') {
            setMahalleler(['Ayazağa', 'Bahçeköy Kemer', 'Bahçeköy Merkez', 'Bahçeköy Yeni', 'Baltalimanı', 'Büyükdere', 'Cumhuriyet', 'Çamlıtepe', 'Çayırbaşı', 'Darüşşafaka', 'Demirciköy', 'Emirgan', 'Fatih Sultan Mehmet', 'Ferahevler', 'Garipçe', 'Gümüşdere', 'Huzur', 'İstinye', 'Kazım Karabekir Paşa', 'Kısırkaya', 'Kireçburnu', 'Kocataş', 'Kumköy (Kilyos)', 'Maden', 'Maslak', 'Pınar', 'Poligon', 'PTT Evleri', 'Reşitpaşa', 'Rumelifeneri', 'Rumelihisarı', 'Rumelikavağı', 'Sarıyer Merkez', 'Tarabya', 'Uskumruköy', 'Yeni Mahalle', 'Yeniköy', 'Zekeriyaköy']);
        } else if (selectedIlce === 'Silivri') {
            setMahalleler(['Akören', 'Alibey', 'Alipaşa', 'Bekirli', 'Beyciler', 'Büyükçavuşlu', 'Büyükkılıçlı', 'Büyüksinekli', 'Cumhuriyet', 'Çanta Balaban', 'Çanta Mimarsinan', 'Çayırdere', 'Çeltik', 'Danamandıra', 'Değirmenköy Fevzipaşa', 'Değirmenköy İsmetpaşa', 'Fatih', 'Fener', 'Gazitepe', 'Gümüşyaka', 'Kadıköy', 'Kavaklı Cumhuriyet', 'Kavaklı Hürriyet', 'Küçükkılıçlı', 'Küçüksinekli', 'Mimarsinan', 'Ortaköy', 'Piri Mehmet Paşa', 'Sayalar', 'Selimpaşa', 'Semizkumlar', 'Seymen', 'Yeni', 'Yolçatı']);
        } else if (selectedIlce === 'Sultanbeyli') {
            setMahalleler(['Abdurrahmangazi', 'Adil', 'Ahmet Yesevi', 'Akşemsettin', 'Battalgazi', 'Fatih', 'Hamidiye', 'Hasanpaşa', 'Mecidiye', 'Mehmet Akif', 'Mimar Sinan', 'Necip Fazıl', 'Orhangazi', 'Turgut Reis', 'Yavuz Selim']);
        } else if (selectedIlce === 'Sultangazi') {
            setMahalleler(['50. Yıl', '75. Yıl', 'Cebeci', 'Cumhuriyet', 'Esentepe', 'Eski Habipler', 'Gazi', 'Habibler', 'İsmetpaşa', 'Malkoçoğlu', 'Sultançiftliği', 'Uğur Mumcu', 'Yayla', 'Yunus Emre', 'Zübeyde Hanım']);
        } else if (selectedIlce === 'Şile') {
            setMahalleler(['Ağaçdere', 'Ağva Merkez', 'Ahmetli', 'Akçakese', 'Alacalı', 'Avcıkoru', 'Balibey', 'Bıçkıdere', 'Bozgoca', 'Bucaklı', 'Çataklı', 'Çavuş', 'Çayırbaşı', 'Çelebi', 'Çengilli', 'Darlık', 'Değirmençayırı', 'Doğancılı', 'Erenler', 'Esenceli', 'Geredeli', 'Göçe', 'Gökmaslı', 'Hacıllı', 'Hacıkasım', 'Hasanlı', 'Imrenli', 'İmrendere', 'İsaköy', 'Kabakoz', 'Kadıköy', 'Kalem', 'Karabeyli', 'Karacaköy', 'Karakiraz', 'Kervansaray', 'Kızılca', 'Korucuköy', 'Kömürlük', 'Kumbaba', 'Kurfallı', 'Oruçoğlu', 'Osmanköy', 'Örcünlü', 'Sahilköy', 'Satmazlı', 'Sofular', 'Sortullu', 'Suayipli', 'Teke', 'Tekeköy', 'Ulupelit', 'Üvezli', 'Yaka', 'Yaylalı', 'Yazımanayır', 'Yeniköy', 'Yeşilvadi', 'Yıldız', 'Yukarı', 'Yumrutaş']);
        } else if (selectedIlce === 'Tuzla') {
            setMahalleler(['Anadolu', 'Aydınlı', 'Aydıntepe', 'Cami', 'Evliya Çelebi', 'Fatih', 'İçmeler', 'İstasyon', 'Mescit', 'Mimar Sinan', 'Orhanlı', 'Orta', 'Postane', 'Şifa', 'Tepeören', 'Yayla']);
        } else if (selectedIlce === 'Ümraniye') {
            setMahalleler(['Adem Yavuz', 'Altınşehir', 'Armağan Evler', 'Aşağı Dudullu', 'Atakent', 'Atatürk', 'Cemil Meriç', 'Çakmak', 'Çamlık', 'Dumlupınar', 'Elmalıkent', 'Esenevler', 'Esenkent', 'Esenşehir', 'Fatih Sultan Mehmet', 'Hekimbaşı', 'Huzur', 'Ihlamurkuyu', 'İnkılap', 'İstiklal', 'Kazım Karabekir', 'Madenler', 'Mehmet Akif', 'Namık Kemal', 'Necip Fazıl', 'Parseller', 'Saray', 'Şerifali', 'Site', 'Tantavi', 'Tatlısu', 'Tepeüstü', 'Topağacı', 'Yaman Evler', 'Yukarı Dudullu']);
        } else if (selectedIlce === 'Üsküdar') {
            setMahalleler(['Çengelköy', 'Altunizade']);
        } else if (selectedIlce === 'Zeytinburnu') {
            setMahalleler(['Beştelsiz', 'Çırpıcı', 'Gökalp', 'Kazlıçeşme', 'Maltepe', 'Merkezefendi', 'Nuripaşa', 'Seyitnizam', 'Sümer', 'Telsiz', 'Veliefendi', 'Yenidoğan', 'Yeşiltepe']);
        } else if (selectedIlce === 'Başiskele') {
            setMahalleler(['Tümü']);
        } else if (selectedIlce === 'Çayırova') {
            setMahalleler(['Tümü']);
        } else if (selectedIlce === 'Darıca') {
            setMahalleler(['Tümü']);
        } else if (selectedIlce === 'Derince') {
            setMahalleler(['Tümü']);
        } else if (selectedIlce === 'Dilovası') {
            setMahalleler(['Tümü']);
        } else if (selectedIlce === 'Gebze') {
            setMahalleler(['Tümü']);
        } else if (selectedIlce === 'Gebze') {
            setMahalleler(['Tümü']);
        } else if (selectedIlce === 'Gölcük') {
            setMahalleler(['Tümü']);
        } else if (selectedIlce === 'İzmit') {
            setMahalleler(['Tümü']);
        } else if (selectedIlce === 'Kandıra') {
            setMahalleler(['Tümü']);
        } else if (selectedIlce === 'Karamürsel') {
            setMahalleler(['Tümü']);
        } else if (selectedIlce === 'Kartepe') {
            setMahalleler(['Tümü']);
        } else if (selectedIlce === 'Karamürsel') {
            setMahalleler(['Tümü']);
        } else if (selectedIlce === 'Körfez') {
            setMahalleler(['Tümü']);
        }else {
            setMahalleler([]);
        }
    };

    // Form gönderildiğinde veriyi PHP API'ye gönderme
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Veritabanına yalnızca rakamları göndermek için maskelenmiş numarayı temizliyoruz
        const telefon1Raw = telefon1.replace(/\D/g, '').slice(-11); // Telefon1 numarasını yalnızca rakam olarak al
        const telefon2Raw = telefon2.replace(/\D/g, '').slice(-11); // Telefon2 numarasını yalnızca rakam olarak al

        const formData = {
            tuketim_no: tuketimNo,
            ad_soyad: adSoyad,
            igdas_sozlesme: igdasSozlesme,
            telefon1: telefon1Raw,
            telefon2: telefon2Raw,
            il: il,
            ilce: ilce,
            mahalle: mahalle,
            sokak_adi: sokakAdi,
            bina_no: binaNo,
            daire_no: daireNo,
            cihaz_turu: cihazTuru,
            cihaz_markasi: cihazMarkasi,
            cihaz_modeli: cihazModeli,
            cihaz_seri_numarasi: cihazSeriNo,
            siparis_tarihi: siparisTarihi,
            montaj_tarihi: montajTarihi,
            musteri_temsilcisi: musteriTemsilcisi,
            is_tipi: isTipi,
            is_durumu: isDurumu
        };

        try {
            const response = await fetch("http://localhost/customerDsh/src/api/form-handler.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                alert("Müşteri başarıyla eklendi!");
                
                // Formu sıfırlıyoruz
                setTuketimNo('');
                setAdSoyad('');
                setIgdasSozlesme('');
                setTelefon1('');
                setTelefon2('');
                setIl('');
                setIlce('');
                setMahalle('');
                setSokakAdi('');
                setBinaNo('');
                setDaireNo('');
                setCihazTuru('');
                setCihazMarkasi('');
                setCihazModeli('');
                setCihazSeriNo('');
                setSiparisTarihi('');
                setMontajTarihi('');
                setMusteriTemsilcisi('');
                setIsTipi('');
                setIsDurumu('');
            } else {
                alert("Bir hata oluştu: " + data.message);
            }
        } catch (error) {
            console.error('Veri gönderme hatası:', error);
            alert('Bir hata oluştu.');
        }

    };

    // Telefon numarasını +90 (XXX) XXX XX XX formatında maskeleme fonksiyonu
    const maskPhoneNumber = (value) => {
        const cleaned = value.replace(/\D/g, '');  // Yalnızca rakamları al

        if (cleaned.length <= 3) {
            return `+90 (${cleaned}`;
        } else if (cleaned.length <= 6) {
            return `+90 (${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        } else if (cleaned.length <= 8) {
            return `+90 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
        } else {
            return `+90 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
        }
    };

    // Telefon numarasını değiştirme fonksiyonu
    const handleTelefonChange = (e, setTelefon) => {
        const inputValue = e.target.value;

        // "+90" kısmını sabit tutarak maskeleme
        if (inputValue.startsWith('+90')) {
            const maskedValue = maskPhoneNumber(inputValue.slice(3));  // "+90" kısmını atarak maskeleme
            setTelefon('+90' + maskedValue.slice(3));  // "+90" kısmını tekrar ekle
        } else {
            const maskedValue = maskPhoneNumber(inputValue);  // Maskelenmiş değeri al
            setTelefon(maskedValue);
        }
    };
    
  return (
    <>
        <h2>Bireysel Müşteri Ekle</h2>
        <form id="customer-form" onSubmit={handleSubmit}>
            <div class="row mb-2">
                <div class="col-12">
                    <input
                        type="text"
                        className="form-control"
                        name="tuketim_no"
                        placeholder="Müşteri Tüketim Numarası"
                        value={tuketimNo}
                        onChange={(e) => setTuketimNo(e.target.value)}
                    /></div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        name="ad_soyad"
                        placeholder="Müşterinin Adı Soyadı *"
                        value={adSoyad}
                        onChange={(e) => setAdSoyad(e.target.value)}
                        required
                    />
                </div>
                <div class="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        name="igdas_sozlesme"
                        placeholder="İgdaş Sözleşme Adı Soyadı"
                        value={igdasSozlesme}
                        onChange={(e) => setIgdasSozlesme(e.target.value)}
                    />
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-6">
                    <input
                        type="tel"
                        className="form-control"
                        name="telefon1"
                        placeholder="Müşteri Telefon Numarası *"
                        value={telefon1}
                        onChange={(e) => handleTelefonChange(e, setTelefon1)}
                        required
                    />
                </div>
                <div class="col-md-6">
                    <input
                        type="tel"
                        className="form-control"
                        name="telefon2"
                        placeholder="Müşteri 2. Telefon Numarası"
                        value={telefon2}
                        onChange={(e) => handleTelefonChange(e, setTelefon2)}
                    />
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-4">
                    <select
                        className="form-select"
                        name="il"
                        value={il}
                        onChange={handleIlChange}
                        required
                    >
                        <option value="">İl Seçin *</option>
                        <option value="İstanbul">İstanbul</option>
                        <option value="Kocaeli">Kocaeli</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <select
                        className="form-select"
                        name="ilce"
                        value={ilce}
                        onChange={handleIlceChange}
                        required
                    >
                        <option value="">İlçe Seçin *</option>
                        {ilceler.map((ilce) => (
                            <option key={ilce} value={ilce}>
                                {ilce}
                            </option>
                        ))}
                    </select>
                </div>
                <div class="col-md-4">
                    <select className="form-select" name="mahalle" value={mahalle}
                            onChange={(e) => setMahalle(e.target.value)} required>
                        <option value="">Mahalle Seçin *</option>
                        {mahalleler.map((mahalle) => (
                            <option key={mahalle} value={mahalle}>
                                {mahalle}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-4">
                    <input type="text" className="form-control" name="sokak_adi" placeholder="Sokak Adı *"
                           value={sokakAdi} onChange={(e) => setSokakAdi(e.target.value)} required/>
                </div>
                <div class="col-md-4">
                    <input type="text" className="form-control" name="bina_no" placeholder="Bina Numarası *" value={binaNo}
                           onChange={(e) => setBinaNo(e.target.value)} required/>
                </div>
                <div class="col-md-4">
                    <input type="text" className="form-control" name="daire_no" placeholder="Daire Numarası *" value={daireNo}
                           onChange={(e) => setDaireNo(e.target.value)} required/>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-6">
                    <select className="form-select" name="cihaz_turu" value={cihazTuru}
                            onChange={(e) => setCihazTuru(e.target.value)} required>
                        <option value="">Cihaz Türü *</option>
                        <option value="Kombi">Kombi</option>
                        <option value="Şofben">Şofben</option>
                        <option value="Soba">Soba</option>
                        <option value="Kazan">Kazan</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <select className="form-select" name="cihaz_markasi" value={cihazMarkasi}
                            onChange={(e) => setCihazMarkasi(e.target.value)} required>
                        <option value="">Cihazın Markası *</option>
                        <option value="Demirdöküm">Demirdöküm</option>
                        <option value="Baymak">Baymak</option>
                        <option value="Eca">Eca</option>
                        <option value="Buderus">Buderus</option>
                        <option value="Bosch">Bosch</option>
                        <option value="Vaillant">Vaillant</option>
                        <option value="Viessmann">Viessmann</option>
                    </select>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-6">
                    <input type="text" className="form-control" name="cihaz_modeli" placeholder="Cihaz Modeli *"
                           value={cihazModeli} onChange={(e) => setCihazModeli(e.target.value)} required/>
                </div>
                <div class="col-md-6">
                    <input type="text" className="form-control" name="cihaz_seri_numarasi" placeholder="Cihaz Seri Numarası *"
                           value={cihazSeriNo} onChange={(e) => setCihazSeriNo(e.target.value)} required/>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-6">
                    <input type="date" className="form-control" name="siparis_tarihi" value={siparisTarihi}
                           onChange={(e) => setSiparisTarihi(e.target.value)} required/>
                </div>
                <div class="col-md-6">
                    <input type="date" className="form-control" name="montaj_tarihi" value={montajTarihi}
                           onChange={(e) => setMontajTarihi(e.target.value)}/>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-md-4">
                    <select className="form-select" name="musteri_temsilcisi" value={musteriTemsilcisi}
                            onChange={(e) => setMusteriTemsilcisi(e.target.value)} required>
                        <option value="">Müşteri Temsilcisi Seçin *</option>
                        <option value="Batuhan Eyüboğlu">Batuhan Eyüboğlu</option>
                        <option value="Çiler Şahin">Çiler Şahin</option>
                        <option value="Melisa Şimşek">Melisa Şimşek</option>
                        <option value="Selin Beyler">Selin Beyler</option>
                        <option value="Aytekin Demir">Aytekin Demir</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <select name="is_tipi" className="form-select" value={isTipi}
                            onChange={(e) => setIsTipi(e.target.value)} required>
                        <option value="">İş Tipi Seçiniz *</option>
                        <option value="Cihaz Değişimi">Cihaz Değişimi</option>
                        <option value="Sıfır Proje">Sıfır Proje</option>
                        <option value="Tekli Satış">Tekli Satış</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <select name="is_durumu" className="form-select" value={isDurumu}
                            onChange={(e) => setIsDurumu(e.target.value)} required>
                        <option value="">İş Durumunu Seçiniz *</option>
                        <option value="Sipariş Alındı">Sipariş Alındı</option>
                        <option value="Montaj Yapıldı">Montaj Yapıldı</option>
                        <option value="Abonelik Yok">Abonelik Yok</option>
                        <option value="Proje Onayda">Proje Onayda</option>
                        <option value="Sözleşme Yok">Sözleşme Yok</option>
                        <option value="Randevu Bekliyor">Randevu Bekliyor</option>
                        <option value="Randevu Alındı">Randevu Alındı</option>
                        <option value="Gaz Açıldı">Gaz Açıldı</option>
                        <option value="İş Tamamlandı">İş Tamamlandı / Servis Yönlendirildi</option>
                    </select>
                </div>
            </div>
            <button type="submit" class="btn btn-primary w-100 mt-3">Müşteri Ekle</button>
        </form>
    </>
  )
}

export default Add_customer
