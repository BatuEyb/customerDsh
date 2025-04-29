import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { generateOrderPDF } from '../utils/generateOrderPDF';
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import OrderInstallationModal from './InstallationModal';

export default function ListOrders ({ customer_id }) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openRows, setOpenRows] = useState({}); // Satırların açılıp kapanmasını kontrol etmek için
  const [modalOrder, setModalOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  

  // Siparişleri API'den çekme
  useEffect(() => {
    async function fetchOrders() {
      try {
        const url = customer_id
          ? `http://localhost/customerDsh/src/api/list_orders.php?customer_id=${customer_id}`
          : 'http://localhost/customerDsh/src/api/list_orders.php';
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Siparişler alınamadı');
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [customer_id]);

  // Arama filtreleme
  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = orders.filter(order => {
      const name = order.customer_name?.toLowerCase() || '';
      const idStr = order.id?.toString() || '';

      // service_name içinde kontrol edelim
      const serviceMatch = order.items?.some(item => {
        if (Array.isArray(item.service_name)) {
          return item.service_name.some(s => s?.toLowerCase().includes(searchLower));
        } else if (typeof item.service_name === 'string') {
          return item.service_name.toLowerCase().includes(searchLower);
        }
        return false;
      });

      return (
        name.includes(searchLower) ||
        idStr.includes(searchLower) ||
        serviceMatch
      );
    });

    setFilteredOrders(filtered);
  }, [search, orders]);

  // Sipariş silme işlemi
  const deleteOrder = order_id => {
    if (!window.confirm('Bu siparişi silmek istediğinizden emin misiniz?')) return;

    fetch('http://localhost/customerDsh/src/api/delete_order.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ order_id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(prev => prev.filter(o => o.id !== order_id));
          setFilteredOrders(prev => prev.filter(o => o.id !== order_id));
          alert('Sipariş silindi.');
        } else {
          alert('Silme başarısız: ' + data.message);
        }
      })
      .catch(err => {
        console.error(err);
        alert('Hata oluştu');
      });
  };

  // Satır tıklama ile açma / kapama işlemi
  const toggleRow = (orderId, itemIdx) => {
    setOpenRows(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [itemIdx]: !prev[orderId]?.[itemIdx],
      },
    }));
  };

  const loadOrders = () => {
    setLoading(true);
    fetch('http://localhost/customerDsh/src/api/list_orders.php', {
      method: 'GET',
      credentials: 'include',
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
          setFilteredOrders(data.orders);
        } else {
          setError(data.message || 'Siparişler alınamadı');
        }
      })
      .catch(() => setError('Sunucu hatası'))
      .finally(() => setLoading(false));
  };

  const handleInstallationSaved = (orderId, updatedItems) => {
    // Kaydetme sonrası yapılacaklar
    setShowModal(false); // Modalı kapat
    loadOrders();   // Sayfayı yeniden render et (güncel veri çek)
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
          onChange={e => setSearch(e.target.value)}
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
                  <span className="badge bg-warning me-1">#{order.id}</span>
                  <span className="badge bg-primary me-1">{order.status}</span>
                  <span className="badge bg-primary">{order.order_type}</span><br />
                  <span className="badge bg-success w-100">{order.created_by_name}</span><br />
                </div>
              </div>
              <p className="text-muted mt-2">
                Oluşturulma: {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Toplam:</strong> {Number(order.total_amount).toFixed(2)} ₺
              </p>

              {/* Ürün Tablosu */}
              <div className='table-responsive'>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Seri No</th>
                    <th>Birim Fiyat</th>
                    <th>İskonto</th>
                    <th>İskontolu Fiyat</th>
                    <th>Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <tr
                        onClick={() => item.installation && toggleRow(order.id, idx)}
                        className={item.installation ? 'clickable-row position-relative' : ''}
                      >
                        <td>{item.product_name}</td>
                        <td>{item.serial_number}</td>
                        <td>{Number(item.unit_price).toFixed(2)} ₺</td>
                        <td>{Number(item.discount).toFixed(2)}%</td>
                        <td>{Number(item.discounted_unit_price).toFixed(2)} ₺</td>
                        <td>{Number(item.total_amount).toFixed(2)} ₺</td>

                        {/* İkonu TD yerine bağımsız koyuyoruz */}
                        {item.installation && (
                          <div className="expand-icon">
                            {openRows[order.id]?.[idx] ? <FaAngleUp /> : <FaAngleDown />}
                          </div>
                        )}
                      </tr>

                      {/* Detay Satırı */}
                      {openRows[order.id]?.[idx] && item.installation && (
                        <tr>
                          <td colSpan="6">
                            <div className="border py-2 px-3 bg-light rounded">
                              <div className='row'>
                              <div className='col-md-12'>
                                <strong className='kobiGoTitle'>İGDAŞ Bilgileri</strong>
                                  <div className='row'>
                                    <div className='col-md-4 mb-2'>
                                      <strong><small>İGDAŞ Abone Adı</small></strong><br />
                                      {item.installation?.service_name || '-'}
                                    </div>
                                    <div className='col-md-4 mb-2'>
                                      <strong><small>İGDAŞ Tüketim Numarası</small></strong><br />
                                      {item.installation?.tuketim_no || '-'}
                                    </div>
                                    <div className='col-md-4 mb-2'>
                                      <strong><small>Randevu Tarihi</small></strong><br />
                                      {item.installation?.randevu_tarihi || '-'}
                                    </div>
                                  </div>
                                </div>
                                <div className='col-md-12 mt-2'>
                                  <strong className='kobiGoTitle'>İletişim Bilgileri</strong>
                                  <div className='row'>
                                    <div className='col-md-4 mb-2'>
                                      <strong><small>İsim Soyisim</small></strong><br />
                                      {item.installation?.ad_soyad || '-'}
                                    </div>
                                    <div className='col-md-4 mb-2'>
                                      <strong><small>Telefon Numarası</small></strong><br />
                                      {item.installation?.phone_number || '-'}
                                    </div>
                                    <div className='col-md-4 mb-2'>
                                      <strong><small>2. Telefon Numarası</small></strong><br />
                                      {item.installation?.phone_number2 || '-'}
                                    </div>
                                    <div className='col-md-12 mb-2'>
                                      <strong><small>Montaj Adresi</small></strong><br />
                                      {item.installation?.address || '-'}
                                    </div>
                                  </div>
                                </div>

                                <div className='col-md-6 mt-2'>
                                  <strong className='kobiGoTitle'>Hata Bilgisi</strong>
                                  <div className='row'>
                                    <div className='col-md-12'>
                                      {item.installation && (
                                        item.installation.hata_durumu === 0 ? (
                                          <div className="alert alert-success" role="alert">
                                            Ürüne İle Alakalı Hata Kaydı Yoktur.
                                          </div>
                                        ) : (
                                          <div className="alert alert-danger" role="alert">
                                            {item.installation.hata_sebebi || '-'}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className='col-md-6 mt-2'>
                                  <strong className='kobiGoTitle'>Not Bilgisi</strong>
                                  <div className='row'>
                                    <div className='col-md-12'>
                                      <div class="alert alert-info" role="alert">
                                        {item.installation?.not_text || '-'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              </div>
              {/* Silme ve PDF Oluşturma Butonları */}
              <div className="d-flex justify-content-end">
              <button 
                className="btn btn-outline-primary btn-sm me-2"
                onClick={() => { setModalOrder(order); setShowModal(true); }}
              >
                Montaj Bilgilerini Düzenle
              </button>
                <button
                  className="btn btn-outline-danger btn-sm me-2"
                  onClick={() => deleteOrder(order.id)}
                >
                  Sil
                </button>
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => generateOrderPDF(order)}
                >
                  PDF
                </button>
              </div>
            </div>
          </div>
        ))
      )}

{modalOrder && (
  <OrderInstallationModal
    show={showModal}
    onHide={() => setShowModal(false)}
    order={modalOrder}
    onSaved={handleInstallationSaved}
  />
)}
    </div>
  );
};
