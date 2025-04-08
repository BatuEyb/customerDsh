import React, { useEffect, useState } from 'react';

const CreateQuote = () => {
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Veri çekme
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost/customerDsh/src/api/list_customer.php', { method: 'GET', credentials: 'include' }),
      fetch('http://localhost/customerDsh/src/api/categories.php', { method: 'GET', credentials: 'include' }),
      fetch('http://localhost/customerDsh/src/api/stock_management.php', { method: 'GET', credentials: 'include' })
    ])
      .then(([customerRes, categoryRes, stockRes]) => 
        Promise.all([customerRes.json(), categoryRes.json(), stockRes.json()])
      )
      .then(([customerData, categoryData, stockData]) => {
        setCustomers(customerData);
        setCategories(categoryData);
        setStocks(stockData);
        setFilteredStocks(stockData);
      })
      .catch((err) => setError('Veriler yüklenirken bir hata oluştu.'))
      .finally(() => setLoading(false));
  }, []);

  // Kategoriye göre ürünleri filtrele
  useEffect(() => {
    if (selectedCategory) {
      setFilteredStocks(stocks.filter(s => s.category_id === selectedCategory));
    } else {
      setFilteredStocks(stocks);
    }
  }, [selectedCategory, stocks]);

  // Toplam tutarı hesapla
  useEffect(() => {
    const total = selectedItems.reduce((sum, item) => sum + item.total_price, 0);
    setTotalAmount(total);
  }, [selectedItems]);

  // Ürün ekleme
  const addItem = (stock) => {
    const exists = selectedItems.find(item => item.stock_id === stock.id);
    if (exists) return;

    const item = {
      stock_id: stock.id,
      product_name: stock.product_name,
      quantity: 1,
      unit_price: parseFloat(stock.price),
      total_price: parseFloat(stock.price)
    };

    setSelectedItems([...selectedItems, item]);
  };

  // Miktar güncelleme
  const updateQuantity = (index, quantity) => {
    const items = [...selectedItems];
    items[index].quantity = quantity;
    items[index].total_price = quantity * items[index].unit_price;
    setSelectedItems(items);
  };

  // Ürün silme
  const removeItem = (index) => {
    const items = [...selectedItems];
    items.splice(index, 1);
    setSelectedItems(items);
  };

  // Teklif gönderme
  const submitQuote = () => {
    setLoading(true);
    setError(null);

    const payload = {
      customer_id: selectedCustomer,
      total_amount: totalAmount,
      quote_items: selectedItems
    };

    fetch('http://localhost/customerDsh/src/api/create_quote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Teklif başarıyla oluşturuldu!');
          // Temizleme
          setSelectedCustomer('');
          setSelectedCategory('');
          setSelectedItems([]);
        } else {
          setError(data.message || 'Teklif oluşturulamadı');
        }
      })
      .catch((err) => {
        setError('Bir hata oluştu');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mt-4">
      <h3>Teklif Oluştur</h3>

      {loading && <div className="alert alert-info">Yükleniyor...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="form-group">
        <label>Müşteri Seç</label>
        <select className="form-control" value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}>
          <option value="">Seçiniz</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group mt-3">
        <label>Kategori Seç</label>
        <select className="form-control" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">Tümü</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <h5>Ürünler</h5>
        <div className="row">
          {filteredStocks.map(stock => (
            <div className="col-md-4" key={stock.id}>
              <div className="card mb-3">
                <div className="card-body">
                  <h6>{stock.product_name}</h6>
                  <p>Fiyat: {stock.price} ₺</p>
                  <button className="btn btn-sm btn-primary" onClick={() => addItem(stock)}>Ekle</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h5>Teklif Ürünleri</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Adet</th>
              <th>Birim Fiyat</th>
              <th>Toplam</th>
              <th>Sil</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, idx) => (
              <tr key={idx}>
                <td>{item.product_name}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    className="form-control"
                    onChange={(e) => updateQuantity(idx, parseInt(e.target.value))}
                  />
                </td>
                <td>{item.unit_price}</td>
                <td>{item.total_price.toFixed(2)}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => removeItem(idx)}>Sil</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <h5 className="mt-3">Toplam Tutar: {totalAmount.toFixed(2)} ₺</h5>
      </div>

      <button
        className="btn btn-success mt-4"
        onClick={submitQuote}
        disabled={!selectedCustomer || selectedItems.length === 0 || loading}
      >
        Teklifi Oluştur
      </button>
    </div>
  );
};

export default CreateQuote;
