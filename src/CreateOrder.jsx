import React, { useState, useEffect } from 'react';
import { apiFetch } from './api';
import { FaPlusSquare, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CreateOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderType, setOrderType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [customerType,       setCustomerType]       = useState('');   // '' | 'Bireysel' | 'Kurumsal'
  const [searchTermCustomer,         setSearchTermCustomer]         = useState('');   // arama input’u

  const productsPerPage = 10;

  // İlçe ve mahalle verileri
  const ilcelerMap = {
    İstanbul: ['Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü',
                'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüp', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane',
                'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye',
                'Üsküdar', 'Zeytinburnu'],
    Kocaeli: ['Başiskele', 'Çayırova', 'Darıca', 'Derince', 'Dilovası', 'Gebze', 'Gölcük', 'İzmit', 'Kandıra', 'Karamürsel', 'Kartepe', 'Körfez']
  };
  const mahalleMap = {
    Adalar: ['Burgazada', 'Heybeliada', 'Kınalıada', 'Maden', 'Nizam'],
    Arnavutköy: ['Adnan Menderes', 'Anadolu', 'Arnavutköy Merkez', 'Atatürk', 'Baklalı', 'Balaban', 'Boğazköy İstiklal', 'Bolluca', 'Boyalık', 'Çilingir', 'Deliklikaya', 'Dursunköy', 'Durusu', 'Fatih', 'Hacımaşlı', 'Hadımköy', 'Haraççı', 'Hastane', 'Hicret', 'İmrahor', 'İslambey', 'Karaburun', 'Karlıbayır', 'Mavigöl', 'Mollafeneri', 'Mustafa Kemal Paşa', 'Nakkaş', 'Nenehatun', 'Ömerli', 'Sazlıbosna', 'Taşoluk', 'Terkos', 'Yassıören', 'Yavuz Selim', 'Yeniköy', 'Yeşilbayır'],
    Ataşehir: ['Aşık Veysel', 'Atatürk', 'Barbaros', 'Esatpaşa', 'Ferhatpaşa', 'Fetih', 'İçerenköy', 'İnönü', 'Kayışdağı', 'Küçükbakkalköy', 'Mevlana', 'Mimar Sinan', 'Mustafa Kemal', 'Örnek', 'Yeni Çamlıca', 'Yeni Sahra', 'Yenişehir'],
    Avcılar: ['Ambarlı', 'Cihangir', 'Denizköşkler', 'Firuzköy', 'Gümüşpala', 'Mustafa Kemal Paşa', 'Tahtakale', 'Üniversite', 'Yeşilkent'],
    Bağcılar: ['15 Temmuz', '100. Yıl', 'Bağlar', 'Barbaros', 'Çınar', 'Demirkapı', 'Evren', 'Fatih', 'Fevzi Çakmak', 'Göztepe', 'Güneşli', 'Hürriyet', 'İnönü', 'Kazım Karabekir', 'Kemalpaşa', 'Kirazlı', 'Mahmutbey', 'Merkez', 'Sancaktepe', 'Yavuz Selim', 'Yenigün', 'Yenimahalle', 'Yıldıztepe'],
    Bahçelievler: ['Bahçelievler', 'Cumhuriyet', 'Çobançeşme', 'Fevzi Çakmak', 'Hürriyet', 'Kocasinan Merkez', 'Siyavuşpaşa', 'Soğanlı', 'Şirinevler', 'Yenibosna Merkez', 'Zafer'],
    Bakırköy: ['Ataköy 1. Kısım', 'Ataköy 2-5-6. Kısım', 'Ataköy 3-4-11. Kısım', 'Ataköy 7-8-9-10. Kısım', 'Basınköy', 'Cevizlik', 'Kartaltepe', 'Osmaniye', 'Sakızağacı', 'Şenlikköy', 'Yenimahalle', 'Yeşilköy', 'Yeşilyurt', 'Zeytinlik', 'Zuhuratbaba'],
    Başakşehir: ['Altınşehir', 'Bahçeşehir 1. Kısım', 'Bahçeşehir 2. Kısım', 'Başak', 'Başakşehir', 'Güvercintepe', 'İkitelli', 'Kayabaşı', 'Şahintepe', 'Ziya Gökalp'],
    Bayrampaşa: ['Altıntepsi', 'Cevatpaşa', 'İsmetpaşa', 'Kartaltepe', 'Kocatepe', 'Muratpaşa', 'Orta', 'Terazidere', 'Vatan', 'Yenidoğan', 'Yıldırım'],
    Beşiktaş: ['Abbasağa', 'Akatlar', 'Arnavutköy', 'Balmumcu', 'Bebek', 'Cihannüma', 'Dikilitaş', 'Etiler', 'Gayrettepe', 'Konaklar', 'Kuruçeşme', 'Kültür', 'Levazım', 'Levent', 'Mecidiye', 'Muradiye', 'Nisbetiye', 'Ortaköy', 'Sinanpaşa', 'Türkali', 'Ulus', 'Vişnezade', 'Yıldız'],
    Beykoz: ['Acarlar', 'Akbaba', 'Alibahadır', 'Anadoluhisarı', 'Anadolukavağı', 'Baklacı', 'Bozhane', 'Cumhuriyet', 'Çamlıbahçe', 'Çengeldere', 'Çiftlik', 'Çiğdem', 'Çubuklu', 'Dereseki', 'Elmalı', 'Fatih', 'Göksu', 'Göllü', 'Göztepe', 'Gümüşsuyu', 'İncirköy', 'İshaklı', 'Kanlıca', 'Kavacık', 'Kaynarca', 'Kılıçlı', 'Mahmutşevketpaşa', 'Merkez', 'Öğümce', 'Ortaçeşme', 'Örnekköy', 'Paşabahçe', 'Paşamandıra', 'Polonezköy', 'Poyrazköy', 'Riva', 'Rüzgarlıbahçe', 'Soğuksu', 'Tokatköy', 'Yalıköy', 'Yavuz Selim', 'Yenimahalle'],
    Beylikdüzü: ['Adnan Kahveci', 'Barış', 'Büyükşehir', 'Cumhuriyet', 'Dereağzı', 'Gürpınar', 'Kavaklı', 'Marmara', 'Sahil', 'Yakuplu'],
    Beyoğlu: ['Arap Cami', 'Asmalı Mescit', 'Bedrettin', 'Bereketzade', 'Cihangir', 'Çukurcuma', 'Demirtaş', 'Fındıklı', 'Galata', 'Gedikpaşa', 'Gümüşsuyu', 'Hacımimi', 'Halıcıoğlu', 'Hüseyinağa', 'İstiklal', 'Kasımpaşa', 'Kemankeş', 'Kılıçali Paşa', 'Kuloğlu', 'Kurtuluş', 'Laleli', 'Müeyyetzade', 'Ömer Avni', 'Pürtelaş Hasan Efendi', 'Sütlüce', 'Şahkulu', 'Şehit Muhtar', 'Süleymaniye', 'Tarlabaşı', 'Taksim', 'Tomtom', 'Vakıf', 'Yüksek Kaldırım', 'Hasköy', 'Kadirgalar', 'Kasımpaşalı', 'Kocatepe', 'Müze', 'Piyalepaşa'],
    Büyükçekmece: ['19 Mayıs', 'Atatürk', 'Bahçelievler', 'Batıköy', 'Celâliye', 'Çakmaklı', 'Çatalca', 'Çatalca Merkez', 'Çatalca Sanayi', 'Cumhuriyet', 'Fatih', 'Güzelce', 'Kamiloba', 'Kavaklı', 'Kumburgaz', 'Mimarsinan', 'Muradiye', 'Muratbey', 'Pınartepe', 'Sahil', 'Türkoba', 'Yakuplu', 'Yenimahalle', 'Zeytinlik'],
    Çatalca: ['Ahmediye', 'Akalan', 'Alipaşa', 'Aşağı Yazıcı', 'Ataköy', 'Büyükbaba', 'Büyükçekmece', 'Çakıl', 'Çakılköy', 'Çanakça', 'Çavuşlar', 'Çayırdere', 'Çatalca Merkez', 'Çatalca Sanayi', 'Çavuşbaşı', 'Çekmeköy', 'Çiftlik', 'Çilingir', 'Çukurca', 'Davutpaşa', 'Durusu', 'Elbasan', 'Gökçeali', 'Gökçebey', 'Gümüşpınar', 'Hallaçlı', 'Hekimköy', 'Kalfa', 'Kaleiçi', 'Karaağaç', 'Karamandere', 'Kavaklı', 'Kızılcaali', 'Muratbey', 'Muratbey Merkez', 'Oklalı'],
    Çekmeköy: ['Alemdağ', 'Aydınlar', 'Ekşioğlu', 'Hamidiye', 'Hüseyinli', 'İMES', 'İMES Sanayi', 'Madenler', 'Mehmet Akif', 'Merkez', 'Mimarsinan', 'Ömerli', 'Reşadiye', 'Sancaktepe', 'Sultanbeyli', 'Sultançiftliği', 'Taşdelen', 'Yenidoğan', 'Yunus Emre'],
    Esenler: ['15 Temmuz Mahallesi', 'Atışalanı Mahallesi', 'Birlik Mahallesi', 'Çiftehavuzlar Mahallesi', 'Davutpaşa Mahallesi', 'Fatih Mahallesi', 'Fevzi Çakmak Mahallesi', 'Havaalanı Mahallesi', 'Kazım Karabekir Mahallesi', 'Kemer Mahallesi', 'Menderes Mahallesi', 'Mimarsinan Mahallesi', 'Namık Kemal Mahallesi', 'Nine Hatun Mahallesi', 'Oruçreis Mahallesi', 'Tuna Mahallesi', 'Turgut Reis Mahallesi', 'Yavuz Selim Mahallesi'],
    Eyüp: ['Ağaçlı', 'Akpınar', 'Akşemsettin', 'Alibeyköy', 'Çırçır', 'Çiftalan', 'Defterdar', 'Düğmeciler', 'Emniyettepe', 'Esentepe', 'Eyüp Merkez', 'Göktürk Merkez', 'Güzeltepe', 'İhsaniye', 'Işıklar', 'İslambey', 'Karadolap', 'Mimarsinan', 'Mithatpaşa', 'Nişancı', 'Odayeri', 'Pirinççi', 'Rami Cuma', 'Rami Yeni', 'Sakarya', 'Silahtarağa', 'Topçular', 'Yeşilpınar'],
    Fatih: ['Aksaray', 'Akşemsettin', 'Alemdar', 'Ali Kuşçu', 'Atikali', 'Ayvansaray', 'Balabanağa', 'Balat', 'Beyazıt', 'Binbirdirek', 'Cankurtaran', 'Cerrahpaşa', 'Cibali', 'Demirtaş', 'Derviş Ali', 'Eminsinan', 'Hacı Kadın', 'Haseki Sultan', 'Hırka-i Şerif', 'Hobyar', 'Hoca Gıyasettin', 'Hocapaşa', 'İskenderpaşa', 'Kalenderhane', 'Karagümrük', 'Katip Kasım', 'Kemalpaşa', 'Koca Mustafapaşa', 'Küçük Ayasofya', 'Mercan', 'Mesihpaşa', 'Mevlanakapı', 'Mimar Hayrettin', 'Mimar Kemaletin', 'Molla Fenari', 'Molla Gürani', 'Molla Hüsrev', 'Muhsine Hatun', 'Nişanca', 'Rüstempaşa', 'Saraç İshak', 'Seyyid Ömer', 'Silivrikapı', 'Sultan Ahmet', 'Sururi', 'Süleymaniye', 'Sümbül Efendi', 'Şehremini', 'Şehsuvar Bey', 'Taya Hatun', 'Topkapı', 'Vefa', 'Yavuz Sinan', 'Yavuz Sultan Selim', 'Yedikule', 'Zeyrek'],
    Gaziosmanpaşa: ['Bağlarbaşı', 'Barbaros Hayrettin Paşa', 'Fevzi Çakmak', 'Hürriyet', 'Karadeniz', 'Karayolları', 'Karlıtepe', 'Kazım Karabekir', 'Merkez', 'Mevlana', 'Pazariçi', 'Sarıgöl', 'Şemsipaşa', 'Yeni Mahalle', 'Yenidoğan', 'Yıldıztabya'],
    Güngören: ['Abdurrahman Nafız Gürman', 'Akıncılar', 'Gençosman', 'Güneştepe', 'Güven', 'Haznedar', 'Mareşal Çakmak', 'Mehmet Nesih Özmen', 'Merkez', 'Sanayi', 'Tozkoparan'],
    Kadıköy: ['19 Mayıs', 'Acıbadem', 'Bostancı', 'Caddebostan', 'Caferağa', 'Dumlupınar', 'Eğitim', 'Erenköy', 'Fenerbahçe', 'Feneryolu', 'Fikirtepe', 'Göztepe', 'Hasanpaşa', 'Koşuyolu', 'Kozyatağı', 'Merdivenköy', 'Osmanağa', 'Rasimpaşa', 'Sahrayıcedit', 'Suadiye', 'Zühtüpaşa'],
    Kağıthane: ['Çağlayan', 'Çeliktepe', 'Emniyetevleri', 'Gültepe', 'Gürsel', 'Hamidiye', 'Harmantepe', 'Hürriyet', 'Kağıthane Merkez', 'Mehmet Akif Ersoy', 'Nurtepe', 'Ortabayır', 'Sanayi', 'Seyrantepe', 'Şirintepe', 'Talatpaşa', 'Telsizler', 'Yahyakemal', 'Yeşilce'],
    Kartal: ['Atalar', 'Cevizli', 'Cumhuriyet', 'Çavuşoğlu', 'Esentepe', 'Gümüşpınar', 'Hürriyet', 'Karlıktepe', 'Kordonboyu', 'Orhantepe', 'Orta', 'Petrol-İş', 'Soğanlık Yeni', 'Soğanlık', 'Topselvi', 'Uğur Mumcu', 'Yakacık Merkez', 'Yakacık Yeni', 'Yalı', 'Yukarı'],
    Küçükçekmece: ['Atakent', 'Atatürk', 'Beşyol', 'Cennet', 'Cumhuriyet', 'Fatih', 'Fevzi Çakmak', 'Gültepe', 'Halkalı Merkez', 'İnönü', 'İstasyon', 'Kanarya', 'Kartaltepe', 'Kemalpaşa', 'Mehmet Akif', 'Söğütlüçeşme', 'Sultanmurat', 'Tevfikbey', 'Yarımburgaz', 'Yeni Mahalle', 'Yeşilova'],
    Maltepe: ['Altayçeşme', 'Altıntepe', 'Aydınevler', 'Bağlarbaşı', 'Başıbüyük', 'Büyükbakkalköy', 'Cevizli', 'Çınar', 'Esenkent', 'Feyzullah', 'Fındıklı', 'Girne', 'Gülensu', 'Gülsuyu', 'İdealtepe', 'Küçükyalı', 'Yalı', 'Zümrütevler'],
    Pendik: ['Ahmet Yesevi', 'Bahçelievler', 'Ballıca', 'Batı', 'Çamçeşme', 'Çamlık', 'Çınardere', 'Doğu', 'Dumlupınar', 'Emirli', 'Ertuğrulgazi', 'Esenler', 'Esenyalı', 'Fatih', 'Fevzi Çakmak', 'Göçbeyli', 'Güllübağlar', 'Güzelyalı', 'Harmandere', 'Kavakpınar', 'Kaynarca', 'Kurna', 'Kurtdoğmuş', 'Kurtköy', 'Orhangazi', 'Orta', 'Ramazanoğlu', 'Sanayi', 'Sapanbağları', 'Sülüntepe', 'Şeyhli', 'Velibaba', 'Yayalar', 'Yeni', 'Yenişehir', 'Yeşilbağlar'],
    Sancaktepe: ['Abdurrahmangazi', 'Akpınar', 'Atatürk', 'Emek', 'Eyüpsultan', 'Fatih', 'Hilal', 'İnönü', 'Kemaltürkler', 'Meclis', 'Merve', 'Mevlana', 'Osmangazi', 'Paşaköy', 'Safa', 'Sarıgazi', 'Veyselkarani', 'Yenidoğan', 'Yunusemre'],
    Sarıyer: ['Ayazağa', 'Bahçeköy Kemer', 'Bahçeköy Merkez', 'Bahçeköy Yeni', 'Baltalimanı', 'Büyükdere', 'Cumhuriyet', 'Çamlıtepe', 'Çayırbaşı', 'Darüşşafaka', 'Demirciköy', 'Emirgan', 'Fatih Sultan Mehmet', 'Ferahevler', 'Garipçe', 'Gümüşdere', 'Huzur', 'İstinye', 'Kazım Karabekir Paşa', 'Kısırkaya', 'Kireçburnu', 'Kocataş', 'Kumköy (Kilyos)', 'Maden', 'Maslak', 'Pınar', 'Poligon', 'PTT Evleri', 'Reşitpaşa', 'Rumelifeneri', 'Rumelihisarı', 'Rumelikavağı', 'Sarıyer Merkez', 'Tarabya', 'Uskumruköy', 'Yeni Mahalle', 'Yeniköy', 'Zekeriyaköy'],
    Silivri: ['Akören', 'Alibey', 'Alipaşa', 'Bekirli', 'Beyciler', 'Büyükçavuşlu', 'Büyükkılıçlı', 'Büyüksinekli', 'Cumhuriyet', 'Çanta Balaban', 'Çanta Mimarsinan', 'Çayırdere', 'Çeltik', 'Danamandıra', 'Değirmenköy Fevzipaşa', 'Değirmenköy İsmetpaşa', 'Fatih', 'Fener', 'Gazitepe', 'Gümüşyaka', 'Kadıköy', 'Kavaklı Cumhuriyet', 'Kavaklı Hürriyet', 'Küçükkılıçlı', 'Küçüksinekli', 'Mimarsinan', 'Ortaköy', 'Piri Mehmet Paşa', 'Sayalar', 'Selimpaşa', 'Semizkumlar', 'Seymen', 'Yeni', 'Yolçatı'],
    Sultanbeyli: ['Abdurrahmangazi', 'Adil', 'Ahmet Yesevi', 'Akşemsettin', 'Battalgazi', 'Fatih', 'Hamidiye', 'Hasanpaşa', 'Mecidiye', 'Mehmet Akif', 'Mimar Sinan', 'Necip Fazıl', 'Orhangazi', 'Turgut Reis', 'Yavuz Selim'],
    Sultangazi: ['50. Yıl', '75. Yıl', 'Cebeci', 'Cumhuriyet', 'Esentepe', 'Eski Habipler', 'Gazi', 'Habibler', 'İsmetpaşa', 'Malkoçoğlu', 'Sultançiftliği', 'Uğur Mumcu', 'Yayla', 'Yunus Emre', 'Zübeyde Hanım'],
    Şile: ['Ağaçdere', 'Ağva Merkez', 'Ahmetli', 'Akçakese', 'Alacalı', 'Avcıkoru', 'Balibey', 'Bıçkıdere', 'Bozgoca', 'Bucaklı', 'Çataklı', 'Çavuş', 'Çayırbaşı', 'Çelebi', 'Çengilli', 'Darlık', 'Değirmençayırı', 'Doğancılı', 'Erenler', 'Esenceli', 'Geredeli', 'Göçe', 'Gökmaslı', 'Hacıllı', 'Hacıkasım', 'Hasanlı', 'İmrenli', 'İmrendere', 'İsaköy', 'Kabakoz', 'Kadıköy', 'Kalem', 'Karabeyli', 'Karacaköy', 'Karakiraz', 'Kervansaray', 'Kızılca', 'Korucuköy', 'Kömürlük', 'Kumbaba', 'Kurfallı', 'Oruçoğlu', 'Osmanköy', 'Örcünlü', 'Sahilköy', 'Satmazlı', 'Sofular', 'Sortullu', 'Suayipli', 'Teke', 'Tekeköy', 'Ulupelit', 'Üvezli', 'Yaka', 'Yaylalı', 'Yazımanayır', 'Yeniköy', 'Yeşilvadi', 'Yıldız', 'Yukarı', 'Yumrutaş'],
    Tuzla: ['Anadolu', 'Aydınlı', 'Aydıntepe', 'Cami', 'Evliya Çelebi', 'Fatih', 'İçmeler', 'İstasyon', 'Mescit', 'Mimar Sinan', 'Orhanlı', 'Orta', 'Postane', 'Şifa', 'Tepeören', 'Yayla'],
    Ümraniye: ['Adem Yavuz', 'Altınşehir', 'Armağan Evler', 'Aşağı Dudullu', 'Atakent', 'Atatürk', 'Cemil Meriç', 'Çakmak', 'Çamlık', 'Dumlupınar', 'Elmalıkent', 'Esenevler', 'Esenkent', 'Esenşehir', 'Fatih Sultan Mehmet', 'Hekimbaşı', 'Huzur', 'Ihlamurkuyu', 'İnkılap', 'İstiklal', 'Kazım Karabekir', 'Madenler', 'Mehmet Akif', 'Namık Kemal', 'Necip Fazıl', 'Parseller', 'Saray', 'Şerifali', 'Site', 'Tantavi', 'Tatlısu', 'Tepeüstü', 'Topağacı', 'Yaman Evler', 'Yukarı Dudullu'],
    Üsküdar: ['Çengelköy', 'Altunizade'],
    Zeytinburnu: ['Beştelsiz', 'Çırpıcı', 'Gökalp', 'Kazlıçeşme', 'Maltepe', 'Merkezefendi', 'Nuripaşa', 'Seyitnizam', 'Sümer', 'Telsiz', 'Veliefendi', 'Yenidoğan', 'Yeşiltepe'],
    // Kocaeli ilçeleri
    Başiskele: ['Tümü'],
    Çayırova: ['Tümü'],
    Darıca: ['Tümü'],
    Derince: ['Tümü'],
    Dilovası: ['Tümü'],
    Gebze: ['Tümü'],
    Gölcük: ['Tümü'],
    İzmit: ['Tümü'],
    Kandıra: ['Tümü'],
    Karamürsel: ['Tümü'],
    Kartepe: ['Tümü'],
    Körfez: ['Tümü']
  };

  const maskPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return `0 (${cleaned}`;
    if (cleaned.length <= 6) return `0 (${cleaned.slice(0,3)}) ${cleaned.slice(3)}`;
    if (cleaned.length <= 8) return `0 (${cleaned.slice(0,3)}) ${cleaned.slice(3,6)} ${cleaned.slice(6)}`;
    return `0 (${cleaned.slice(0,3)}) ${cleaned.slice(3,6)} ${cleaned.slice(6,8)} ${cleaned.slice(8,10)}`;
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiFetch('list_customer.php', { credentials: 'include' }),
      apiFetch('stock_management.php', { credentials: 'include' }),
      apiFetch('categories.php', { credentials: 'include' })
    ])
      .then(([cRes, sRes, catRes]) => Promise.all([cRes.json(), sRes.json(), catRes.json()]))
      .then(([custData, stockData, catData]) => {
        setCustomers(custData);
        setStocks(stockData);
        setCategories(catData);
        setBrands([...new Set(stockData.map(i => i.brand))]);
        setFilteredStocks(stockData);
      })
      .catch(() => setError('Veriler yüklenirken bir hata oluştu.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = stocks;
    if (searchTerm) result = result.filter(s => s.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedCategory) result = result.filter(s => s.category_id === selectedCategory);
    if (selectedBrand) result = result.filter(s => s.brand === selectedBrand);
    setFilteredStocks(result);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedBrand, stocks]);

  useEffect(() => {
    setTotalAmount(selectedItems.reduce((acc, it) => acc + it.total_price, 0));
  }, [selectedItems]);

  const addItem = stock => {
    setSelectedItems(prev => [...prev, {
      id: `${stock.id}-${Date.now()}`,
      stock_id: stock.id,
      product_name: stock.product_name,
      unit_price: parseFloat(stock.price),
      discount: 0,
      discounted_unit_price: parseFloat(stock.price),
      total_price: parseFloat(stock.price),
      serial_number: '',
      service_name: '',
      adSoyad: '',
      telefon1: '',
      telefon2: '',
      il: '', ilce: '', mahalle: '', sokakAdi: '', binaNo: '', daireNo: '',
      igdasSozlesme: '', tuketimNo: '',
      isInstallation: false,
      collapsed: false
    }]);
  };

  const updateField = (index, field, value) => {
    const items = [...selectedItems];
    const item = items[index];
    if (field === 'discount') {
      const disc = parseFloat(value) || 0;
      item.discount = disc;
      item.discounted_unit_price = item.unit_price * (1 - disc / 100);
      item.total_price = item.discounted_unit_price;
    } else if (field === 'discounted_unit_price') {
      const dprice = parseFloat(value) || 0;
      item.discounted_unit_price = dprice;
      item.discount = item.unit_price ? Math.round((1 - dprice / item.unit_price) * 100) : 0;
      item.total_price = dprice;
    } else {
      item[field] = value;
    }
    setSelectedItems(items);
  };

  const handleTelefonChangeItem = (e, index, field) => {
    const val = e.target.value;
    const cleaned = val.startsWith('0') ? val.slice(1) : val;
    updateField(index, field, maskPhoneNumber(cleaned));
  };

  const handleIlChangeItem = (index, value) => {
    const items = [...selectedItems];
    items[index].il = value;
    items[index].ilce = '';
    items[index].mahalle = '';
    setSelectedItems(items);
  };

  const handleIlceChangeItem = (index, value) => {
    const items = [...selectedItems];
    items[index].ilce = value;
    items[index].mahalle = '';
    setSelectedItems(items);
  };

  const toggleCollapse = index => {
    const items = [...selectedItems];
    items[index].collapsed = !items[index].collapsed;
    setSelectedItems(items);
  };

  const removeItem = idx => {
    const items = [...selectedItems]; items.splice(idx, 1); setSelectedItems(items);
  };

  const submitOrder = () => {
    if (!selectedCustomer || !selectedItems.length) {
      setError('Lütfen müşteri seçin ve en az bir ürün ekleyin.'); return;
    }
    setLoading(true);
    setError(null);
    const payload = {
      customer_id: selectedCustomer,
      total_amount: totalAmount,
      order_type: orderType,
      order_items: selectedItems.map(it => ({
        stock_id: it.stock_id,
        unit_price: it.unit_price,
        discount: it.discount,
        discounted_unit_price: it.discounted_unit_price,
        total_amount: it.total_price,
        serial_number: it.serial_number,
        is_installation_required: it.isInstallation,
        // sadece işaretliyse montaj bilgileri:
        ...(it.isInstallation && {
          adSoyad: it.adSoyad,
          telefon1: it.telefon1,
          telefon2: it.telefon2,
          il: it.il,
          ilce: it.ilce,
          mahalle: it.mahalle,
          sokakAdi: it.sokakAdi,
          binaNo: it.binaNo,
          daireNo: it.daireNo,
          igdasSozlesme: it.igdasSozlesme,
          tuketimNo: it.tuketimNo
        })
      }))
    };
    console.log('Payload:', payload);
    apiFetch('create_order.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) alert('Sipariş başarıyla oluşturuldu!');
        else setError(data.message || 'Sipariş oluşturulamadı.');
        setSelectedCustomer(''); setSelectedItems([]);
      })
      .catch(() => setError('Bir hata oluştu.'))
      .finally(() => setLoading(false));
  };

  const last = currentPage * productsPerPage;
  const first = last - productsPerPage;
  const pageStocks = filteredStocks.slice(first, last);
  const totalPages = Math.ceil(filteredStocks.length / productsPerPage);

  return (
    <div className="mt-3">
      <h3>Sipariş Oluştur</h3>
      {loading && <div className="alert alert-info">Yükleniyor...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {/* — Tip Filtrelemesi — */}
        <div className="col-md-3">
          <label>Müşteri Tipi</label>
          <select
            className="form-control"
            value={customerType}
            onChange={e => {
              setCustomerType(e.target.value);
              setSelectedCustomerId('');   // tipi değişince seçimi sıfırla
            }}
          >
            <option value="">Tümü</option>
            <option value="Bireysel">Bireysel</option>
            <option value="Kurumsal">Kurumsal</option>
          </select>
        </div>

        {/* — İsimle Ara — */}
        <div className="col-md-3">
          <label>İsimle Ara</label>
          <input
            type="text"
            className="form-control"
            placeholder="En az 2 harf"
            value={searchTermCustomer}
            onChange={e => setSearchTermCustomer(e.target.value)}
          />
        </div>

        {/* — Filtrelenmiş Select — */}
        <div className="col-md-3">
          <label>Müşteri Seç</label>
          <select
            className="form-control"
            value={selectedCustomer}
            onChange={e => setSelectedCustomer(e.target.value)}
          >
            <option value="">Seçiniz</option>
            {customers
              // önce tipe göre filtrele
              .filter(c => customerType ? c.customer_type === customerType : true)
              // sonra ada göre filtrele (en az 2 harf girildiğinde)
              .filter(c => {
                if (searchTermCustomer.length < 2) return true;
                return c.name.toLowerCase().includes(searchTermCustomer.toLowerCase());
              })
              .map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} / TC: {c.tc_identity_number} / TEL: ({c.phone})
                </option>
              ))
            }
          </select>
        </div>

        <div className="col-md-3">
          <label>İş Tipi Seç</label>
          <select className="form-control" name="order_type" value={orderType} onChange={(e) => setOrderType(e.target.value)}>
            <option value="Tekli Satış">Tekli Satış</option>
            <option value="Cihaz Değişimi">Cihaz Değişimi</option>
            <option value="Yeni Proje">Yeni Proje</option>
          </select>
        </div>

        <div className="col-md-12 mt-4">
          <h5>Ürünler</h5>
          <div className='row mb-2'>
            <div className='col-md-4'>
              <label>Ürün Ara</label>
              <input type="text" className="form-control" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className='col-md-4'>
            <label>Kategori Seç</label>
              <select className="form-control" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                <option value="">Tümü</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className='col-md-4'>
              <label>Marka Seç</label>
              <select className="form-control" value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
                <option value="">Tüm Markalar</option>
                {brands.map((b, i) => <option key={i} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <table className="table table-bordered table-hover">
            <caption>
              <FaChevronLeft className="cursor-pointer" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} />
              <span className="mx-2">Sayfa {currentPage} / {totalPages}</span>
              <FaChevronRight className="cursor-pointer" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} />
            </caption>
            <thead>
              <tr>
                <th>Ürün Adı</th>
                <th>Marka</th>
                <th>Fiyat</th>
                <th>Seç</th>
              </tr>
            </thead>
            <tbody>
              {pageStocks.map(stock => (
                <tr key={stock.id}>
                  <td>{stock.product_name}</td>
                  <td>{stock.brand}</td>
                  <td>{stock.price} ₺</td>
                  <td><FaPlusSquare className="cursor-pointer" onClick={() => addItem(stock)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <h5>Sepet</h5>
        <table className="table table-stripped">
          <thead>
            <tr>
              <th>#</th>
              <th>Ürün Adı</th>
              <th>Birim Fiyat</th>
              <th>İskonto (%)</th>
              <th>İskonto Fiyatı</th>
              <th>Toplam</th>
              <th>Seri No</th>
              <th>Montaj Yapılacak mı?</th>
              <th>Sil</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((it, i) => (
              <React.Fragment key={it.id}>
                <tr>
                  <td>{i + 1}</td>
                  <td>{it.product_name}</td>
                  <td>{it.unit_price.toFixed(2)} ₺</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={it.discount}
                      onChange={e => updateField(i, 'discount', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={it.discounted_unit_price}
                      onChange={e => updateField(i, 'discounted_unit_price', e.target.value)}
                    />
                  </td>
                  <td>{it.total_price.toFixed(2)} ₺</td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={it.serial_number}
                      onChange={e => updateField(i, 'serial_number', e.target.value)}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={it.isInstallation}
                      onChange={e => {
                        const items = [...selectedItems];
                        items[i].isInstallation = e.target.checked;
                        setSelectedItems(items);
                      }}
                    />
                  </td>
                  <td>
                    <FaTrash className="text-danger cursor-pointer" onClick={() => removeItem(i)} />
                  </td>
                </tr>
                {it.isInstallation  && (
                  <tr>
                    <td colSpan="9" className='px-4 py-3'>
                      <div className="row">
                        <h5>İletişim Bilgileri</h5>
                        <div className="col-md-4">
                          <label>Ad Soyad</label>
                          <input
                            type="text"
                            className="form-control"
                            value={it.adSoyad}
                            onChange={e => updateField(i, 'adSoyad', e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <label>Telefon 1</label>
                          <input
                            type="text"
                            className="form-control"
                            value={it.telefon1}
                            onChange={e => handleTelefonChangeItem(e, i, 'telefon1')}
                          />
                        </div>
                        <div className="col-md-4">
                          <label>Telefon 2</label>
                          <input
                            type="text"
                            className="form-control"
                            value={it.telefon2}
                            onChange={e => handleTelefonChangeItem(e, i, 'telefon2')}
                          />
                        </div>
                      </div>
                      <div className="row mt-2">
                        <h5>Montaj Bilgileri</h5>
                        <div className="col-md-4">
                          <label>İl</label>
                          <select className="form-control" value={it.il} onChange={e => handleIlChangeItem(i, e.target.value)}>
                            <option value="">Seçiniz</option>
                            {Object.keys(ilcelerMap).map(il => (
                              <option key={il} value={il}>{il}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label>İlçe</label>
                          <select className="form-control" value={it.ilce} onChange={e => handleIlceChangeItem(i, e.target.value)}>
                            <option value="">Seçiniz</option>
                            {(ilcelerMap[it.il] || []).map(ilce => (
                              <option key={ilce} value={ilce}>{ilce}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label>Mahalle</label>
                          <select className="form-control" value={it.mahalle} onChange={e => updateField(i, 'mahalle', e.target.value)}>
                            <option value="">Seçiniz</option>
                            {(mahalleMap[it.ilce] || []).map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='row mt-2'>
                        <div className="col-md-4">
                          <label>Sokak Adı</label>
                          <input type="text" className="form-control" value={it.sokakAdi} onChange={e => updateField(i, 'sokakAdi', e.target.value)} />
                        </div>
                        <div className="col-md-4">
                          <label>Bina No</label>
                          <input type="text" className="form-control" value={it.binaNo} onChange={e => updateField(i, 'binaNo', e.target.value)} />
                        </div>
                        <div className="col-md-4">
                          <label>Daire No</label>
                          <input type="text" className="form-control" value={it.daireNo} onChange={e => updateField(i, 'daireNo', e.target.value)} />
                        </div>
                      </div>
                      <div className='row mt-2'>
                        <h5>İgdaş Bilgileri</h5>
                        <div className="col-md-6">
                          <label>İGDAŞ Sözleşme No</label>
                          <input type="text" className="form-control" value={it.igdasSozlesme} onChange={e => updateField(i, 'igdasSozlesme', e.target.value)} />
                        </div>
                        <div className="col-md-6">
                          <label>Tüketim No</label>
                          <input type="text" className="form-control" value={it.tuketimNo} onChange={e => updateField(i, 'tuketimNo', e.target.value)} />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="mt-3 text-right">
          <h5>Toplam Tutar: {totalAmount.toFixed(2)} ₺</h5>
        </div>
        <div className="mt-3">
          <button className="btn btn-primary" onClick={submitOrder}>Siparişi Oluştur</button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;