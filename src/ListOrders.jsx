import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { generateOrderPDF } from './utils/generateOrderPDF';  // './utils' doğru yol

const ListOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openRows, setOpenRows] = useState({}); // Satırların açılıp kapanmasını kontrol etmek için

  // Siparişleri API'den çekme
  useEffect(() => {
    fetch('http://localhost/customerDsh/src/api/list_orders.php', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
          setFilteredOrders(data.orders);
        } else {
          setError(data.message || 'Siparişler alınamadı');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Sunucuya bağlanırken hata oluştu');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order => {
      const name = order.customer_name?.toLowerCase() || '';
      const id = order.id?.toString() || '';
      const searchLower = search.toLowerCase();
  
      // order.items içinde service_name array ise her bir elemanı kontrol et
      const serviceMatch = order.items?.some(item => {
        if (Array.isArray(item.service_name)) {
          return item.service_name.some(s => s?.toLowerCase().includes(searchLower));
        } else if (typeof item.service_name === 'string') {
          return item.service_name.toLowerCase().includes(searchLower);
        }
        return false;
      });
  
      return name.includes(searchLower) || id.includes(search) || serviceMatch;
    });
  
    setFilteredOrders(filtered);
  }, [search, orders]);

  // Sipariş silme işlemi
  const deleteOrder = (order_id) => {
    if (!window.confirm("Bu siparişi silmek istediğinizden emin misiniz?")) return;

    fetch('http://localhost/customerDsh/src/api/delete_order.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ order_id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(prev => prev.filter(o => o.id !== order_id));
          setFilteredOrders(prev => prev.filter(o => o.id !== order_id));
          alert("Sipariş silindi.");
        } else {
          alert("Silme başarısız: " + data.message);
        }
      })
      .catch(err => {
        console.error(err);
        alert("Hata oluştu");
      });
  };

  // Satır tıklama ile açma / kapama işlemi
  const toggleRow = (orderId, itemIdx) => {
    setOpenRows((prevState) => ({
      ...prevState,
      [orderId]: {
        ...prevState[orderId],
        [itemIdx]: !prevState[orderId]?.[itemIdx],
      },
    }));
  };

  return (
    <div className="mt-3">
      <h3 className="mb-4">Sipariş Listesi</h3>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Müşteri adı veya sipariş no ile ara..."
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p>Siparişler yükleniyor...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="alert alert-info">Herhangi bir sipariş bulunamadı.</div>
      ) : (
        filteredOrders.map(order => (
          <div key={order.id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5>{order.customer_name}</h5>
                <div>
                  <span className="badge bg-secondary">#{order.id}</span><br />
                  <span className="badge bg-info">{order.status}</span>
                </div>
              </div>
              <p className="text-muted mt-2">Oluşturulma: {new Date(order.created_at).toLocaleDateString()}</p>
              <p><strong>Toplam:</strong> {Number(order.total_amount).toFixed(2)} ₺</p>

              {/* Ürün Tablosu */}
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Adet</th>
                    <th>Birim Fiyat</th>
                    <th>İskonto</th>
                    <th>İskontolu Fiyat</th>
                    <th>Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <tr onClick={() => toggleRow(order.id, idx)} style={{ cursor: 'pointer' }}>
                        <td>{item.product_name}</td>
                        <td>{item.quantity}</td>
                        <td>{Number(item.unit_price).toFixed(2)} ₺</td>
                        <td>{Number(item.discount).toFixed(2)}%</td>
                        <td>{Number(item.discounted_unit_price).toFixed(2)} ₺</td>
                        <td>{Number(item.total_amount).toFixed(2)} ₺</td>
                      </tr>

                      {/* Alt Tablolar */}
                      {openRows[order.id]?.[idx] && (
                        <tr>
                          <td colSpan="6">
                            <div className="border p-2 bg-light rounded">
                              <strong>Seri No ve Adres Bilgileri:</strong>
                              <table className="table table-bordered table-sm mt-2 mb-0">
                                <thead className="table-secondary">
                                  <tr>
                                    <th>#</th>
                                    <th>Seri No</th>
                                    <th>Adres</th>
                                    <th>İsim</th>
                                    <th>Telefon No:</th>
                                    <th>İş Durumu</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Array.from({ length: item.serial_number.length || item.address.length || item.service_name.length || item.phone_number.length || item.job_status.length}).map((_, i) => (
                                    <tr key={i}>
                                      <td>{i + 1}</td>
                                      <td>{item.serial_number[i] || '-'}</td>
                                      <td>{item.address[i] || '-'}</td>
                                      <td>{item.service_name[i] || '-'}</td>
                                      <td>{item.phone_number[i] || '-'}</td>
                                      <td>{item.job_status[i] || '-'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {/* Silme ve PDF Oluşturma Butonları */}
              <div className="d-flex justify-content-end">
                <button className="btn btn-outline-danger btn-sm me-2" onClick={() => deleteOrder(order.id)}>Sil</button>
                <button className="btn btn-outline-success btn-sm" onClick={() => generateOrderPDF(order)}>PDF</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListOrders;
