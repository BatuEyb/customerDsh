import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { generatePDF } from '../utils/generatePDF';
import EditQuoteModal from '../components/EditQuoteModal';

const CustomerOwnQuotes = ({ customer_id }) => {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [editedQuote, setEditedQuote] = useState({
    id: null,
    customer_name: '',
    customer_address: '',
    status: 'Bekliyor',
    total_amount: 0,
    items: [],
  });

  useEffect(() => {
    fetch('http://localhost/customerDsh/src/api/list_quotes.php', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const customerQuotes = data.quotes.filter(q => q.customer_id === customer_id);
          setQuotes(customerQuotes);
          setFilteredQuotes(customerQuotes);
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
  }, [customer_id]);

  useEffect(() => {
    const filtered = quotes.filter(q => {
      const name = q.customer_name?.toLowerCase() || '';
      const id = q.id?.toString() || '';
      return name.includes(search.toLowerCase()) || id.includes(search);
    });
    setFilteredQuotes(filtered);
  }, [search, quotes]);

  const deleteQuote = (quote_id) => {
    if (!window.confirm("Bu teklifi silmek istediğinizden emin misiniz?")) return;

    fetch('http://localhost/customerDsh/src/api/delete_quote.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ quote_id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Teklif başarıyla silindi!');
          setQuotes(prev => prev.filter(q => q.id !== quote_id));
          setFilteredQuotes(prev => prev.filter(q => q.id !== quote_id));
        } else {
          alert('Silme işlemi başarısız: ' + data.message);
        }
      })
      .catch(err => {
        console.error(err);
        alert('Bir hata oluştu');
      });
  };

  const handleSaveChanges = () => {
    if (!editedQuote.id) {
      alert("Teklif ID'si geçersiz.");
      return;
    }

    const payload = {
      id: editedQuote.id,
      customer_id: editedQuote.customer_id,
      total_amount: Number(editedQuote.total_amount),
      status: editedQuote.status,
      updated_by: 'admin_user',
      updated_at: new Date().toISOString(),
      items: editedQuote.items.map(item => ({
        id: item.id || 0,
        quote_id: editedQuote.id,
        stock_id: item.stock_id,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        discounted_unit_price: Number(item.discounted_unit_price),
        discount: Number(item.discount),
        total_price: Number(item.total_price),
        created_at: item.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
    };

    fetch('http://localhost/customerDsh/src/api/update_quote.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const updated = data.quote;
          setQuotes(prev => prev.map(q => q.id === updated.id ? { ...q, ...updated } : q));
          setFilteredQuotes(prev => prev.map(q => q.id === updated.id ? { ...q, ...updated } : q));
          setShowEditModal(false);
          alert('Güncelleme Başarılı');
        } else {
          alert('Güncelleme başarısız: ' + data.message);
        }
      });
  };

  return (
    <div className="mt-3">
        <div className="mb-3">
        <input
            type="text"
            className="form-control"
            placeholder="Teklif numarası veya müşteri adı ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
        </div>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p>Teklifler yükleniyor...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filteredQuotes.length === 0 ? (
        <div className="alert alert-info">Bu müşteriye ait teklif bulunamadı.</div>
      ) : (
        filteredQuotes.map((quote) => (
          <div key={quote.id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5>{quote.customer_name}</h5>
                <div>
                  <span className="badge bg-secondary">#{quote.id}</span><br />
                  <span className={`badge ${quote.status === 'Onaylandı' ? 'bg-success' : quote.status === 'Reddedildi' ? 'bg-warning' : 'bg-secondary'}`}>
                    {quote.status}
                  </span>
                </div>
              </div>
              <p className="text-muted mt-2">Oluşturulma: {new Date(quote.created_at).toLocaleDateString()}</p>
              <p><strong>Toplam:</strong> {Number(quote.total_amount).toFixed(2)} ₺</p>

              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Adet</th>
                    <th>Fiyat</th>
                    <th>İskonto</th>
                    <th>Net Fiyat</th>
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

              <div className="d-flex justify-content-end">
                <button className="btn btn-outline-primary btn-sm me-2" onClick={() => { setSelectedQuote(quote); setEditedQuote(quote); setShowEditModal(true); }}>
                  Düzenle
                </button>
                <button className="btn btn-outline-danger btn-sm me-2" onClick={() => deleteQuote(quote.id)}>Sil</button>
                <button className="btn btn-outline-success btn-sm" onClick={() => generatePDF(quote)}>PDF</button>
              </div>
            </div>
          </div>
        ))
      )}

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

export default CustomerOwnQuotes;
