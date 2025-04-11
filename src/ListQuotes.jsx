import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { generatePDF } from './utils/generatePDF';  // './utils' doğru yol
import EditQuoteModal from './components/EditQuoteModal';

const ListQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null); // Düzenlenecek teklif
  const [editedQuote, setEditedQuote] = useState({
    quote_id: null,
    customer_name: '',
    customer_address: '',
    status: 'Bekliyor',
    total_amount: 0,
    items: [],  // Ürünler için item listesi
  });

  // Teklifleri çekme
  useEffect(() => {
    fetch('http://localhost/customerDsh/src/api/list_quotes.php', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setQuotes(data.quotes);
          setFilteredQuotes(data.quotes);
        } else {
          setError(data.message || 'Teklifler alınamadı');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Sunucuya bağlanırken hata oluştu');
        setLoading(false);
      });
  }, []);

  const deleteQuote = (quote_id) => {
    const confirmDelete = window.confirm("Bu teklifi silmek istediğinizden emin misiniz?");
    if (!confirmDelete) return;
  
    fetch('http://localhost/customerDsh/src/api/delete_quote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ quote_id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Teklif başarıyla silindi!');
          
          // Teklif listelerinden ilgili teklifi filtreleyerek çıkartıyoruz
          setQuotes(prevQuotes => prevQuotes.filter(quote => quote.id !== quote_id));
  
          // Silinen teklifi filteredQuotes'dan da çıkarıyoruz
          setFilteredQuotes(prevFilteredQuotes => prevFilteredQuotes.filter(quote => quote.id !== quote_id));
        } else {
          alert('Silme işlemi başarısız: ' + data.message);
        }
      })
      .catch(err => {
        console.error(err);
        alert('Bir hata oluştu');
      });
  };

  // Arama işlemi
  useEffect(() => {
    const filtered = quotes.filter(q => {
      const name = q.customer_name ? q.customer_name.toLowerCase() : '';
      const id = q.id ? q.id.toString() : '';
      return name.includes(search.toLowerCase()) || id.includes(search);
    });
    setFilteredQuotes(filtered);
  }, [search, quotes]);

  const handleSaveChanges = () => {
    if (!editedQuote.id) {  // 'quote_id' yerine 'id' kullanıyoruz
      alert("Teklif ID'si geçersiz.");
      return;
    }

    // Teklifin tüm bilgilerini ve içindeki ürünleri içeren payload oluşturuyoruz
    const payload = {
      id: editedQuote.id,  // 'quote_id' yerine 'id' kullanıyoruz
      customer_id: editedQuote.customer_id, // Müşteri ID'si
      total_amount: Number(editedQuote.total_amount), // Toplam tutar
      status: editedQuote.status, // Teklif durumu
      updated_by: 'admin_user', // Güncellemeyi yapan kullanıcı adı (örneğin admin)
      updated_at: new Date().toISOString(), // Güncellenme tarihi
      items: editedQuote.items.map(item => ({
        id: item.id || 0,  // 'item_id' yerine 'id' kullanıyoruz, eğer item.id yoksa 0 gönder
        quote_id: editedQuote.id, // Her item için teklif ID'si
        stock_id: item.stock_id, // Ürün ID'si
        quantity: Number(item.quantity), // Adet
        unit_price: Number(item.unit_price), // Birim fiyat
        discounted_unit_price: Number(item.discounted_unit_price), // İskontolu birim fiyat
        discount: Number(item.discount), // İskonto oranı
        total_price: Number(item.total_price), // Toplam fiyat
        created_at: item.created_at || new Date().toISOString(), // Oluşturulma tarihi
        updated_at: new Date().toISOString(), // Güncellenme tarihi
      }))
    };

    fetch('http://localhost/customerDsh/src/api/update_quote.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const updatedQuote = data.quote;
          
          // Müşteri bilgileri
          const customer = updatedQuote.customer;
      
          // Güncellenmiş teklif verisini render etmek için state'i güncelle
          setQuotes((prevQuotes) => 
            prevQuotes.map((quote) =>
              quote.id === updatedQuote.id ? { ...quote, ...updatedQuote } : quote
            )
          );
      
          // Modali kapat
          setShowEditModal(false);
          alert('Güncelleme Başarılı');
        } else {
          alert('Güncelleme başarısız: ' + data.message);
        }
      })
};

  return (
    <div className="mt-3">
      <h3 className="mb-4">Teklif Listesi</h3>

      {/* Arama */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Müşteri adı veya teklif no ile ara..."
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Hata veya Yükleniyor */}
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p>Teklifler yükleniyor...</p>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Teklif Listesi */}
      {filteredQuotes.length === 0 && !loading && !error && (
        <div className="alert alert-info">Gösterilecek teklif bulunamadı.</div>
      )}

      {filteredQuotes.map((quote) => (
        <div key={quote.id} className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">{quote.customer_name}</h5>
              <span>
                <span className="badge bg-secondary">Teklif No: #{quote.id}</span>
                <br />
                <span className={`badge ${quote.status === 'Onaylandı' ? 'bg-success' : quote.status === 'Reddedildi' ? 'bg-warning' : 'bg-secondary'}`}>
                  {quote.status}
                </span>
              </span>
            </div>
            <p className="text-muted mb-2">
              Oluşturulma Tarihi: {new Date(quote.created_at).toLocaleDateString()}
            </p>
            <h6 className="mb-3">💰 Toplam: <strong>{Number(quote.total_amount).toFixed(2)} ₺</strong></h6>

            {/* Ürünler */}
            <table className="table table-sm table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Ürün</th>
                  <th>Adet</th>
                  <th>Birim Fiyat</th>
                  <th>İskonto Oranı</th>
                  <th>İskontolu Birim Fiyat</th>
                  <th>Toplam</th>
                </tr>
              </thead>
              <tbody>
              {quote.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>{Number(item.unit_price).toFixed(2)} ₺</td>
                  <td>{Number(item.discount).toFixed(2)}%</td>
                  <td>{Number(item.discounted_unit_price).toFixed(2)} ₺</td>
                  <td>{Number(item.total_price).toFixed(2)} ₺</td>
                </tr>
              ))}
              </tbody>
            </table>

            {/* Aksiyonlar */}
            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn btn-outline-primary btn-sm me-2"
                onClick={() => {
                  setSelectedQuote(quote);
                  setEditedQuote(quote);
                  setShowEditModal(true);
                }}
              >
                Düzenle
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={() => deleteQuote(quote.id)}>Sil</button>
              <button className="btn btn-outline-success btn-sm ms-2" onClick={() => generatePDF(quote)}>PDF Olarak İndir</button>
            </div>
          </div>
        </div>
      ))}

      {/* Teklif Düzenleme Modalı */}
      <EditQuoteModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        quote={selectedQuote}
        onSaveChanges={handleSaveChanges}
        editedQuote={editedQuote}
        setEditedQuote={setEditedQuote}
      />
    </div>
  );
};

export default ListQuotes;
