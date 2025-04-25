import React, { useEffect, useState } from 'react';
import { Spinner, Modal, Button, Form } from 'react-bootstrap';

const CustomerOwnOrders = ({ customer_id }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openRows, setOpenRows] = useState({});

  // State for editing detail
  const [editDetail, setEditDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost/customerDsh/src/api/list_orders.php', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const customerOrders = data.orders.filter(o => o.customer_id === customer_id);
          setOrders(customerOrders);
          setFilteredOrders(customerOrders);
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
  }, [customer_id]);

  useEffect(() => {
    const filtered = orders.filter(o => {
      const name = o.customer_name?.toLowerCase() || '';
      const id = o.id?.toString() || '';
      return name.includes(search.toLowerCase()) || id.includes(search);
    });
    setFilteredOrders(filtered);
  }, [search, orders]);

  const toggleRow = (orderId, itemIdx) => {
    setOpenRows(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [itemIdx]: !prev[orderId]?.[itemIdx]
      }
    }));
  };

  const handleDetailEdit = (orderId, itemIdx, detailIdx, item) => {
    setEditDetail({ orderId, itemIdx, detailIdx, data: { ...item } });
    setShowDetailModal(true);
  };

  const handleDetailChange = (field, value) => {
    setEditDetail(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value
      }
    }));
  };

  const handleDetailSave = () => {
    const { orderId, itemIdx, detailIdx, data } = editDetail;
    // API call to update detail
    fetch('http://localhost/customerDsh/src/api/update_order_item_detail.php', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, item_index: itemIdx, detail_index: detailIdx, detail: data })
    })
    .then(res => res.json())
    .then(resp => {
      if (resp.success) {
        setOrders(prevOrders => {
          return prevOrders.map(order => {
            if (order.id === orderId) {
              const newItems = [...order.items];
              const item = newItems[itemIdx];
              // update arrays
              item.serial_number[detailIdx] = data.serial_number;
              item.address[detailIdx] = data.address;
              item.service_name[detailIdx] = data.service_name;
              item.phone_number[detailIdx] = data.phone_number;
              item.job_status[detailIdx] = data.job_status;
              newItems[itemIdx] = item;
              return { ...order, items: newItems };
            }
            return order;
          });
        });
        setFilteredOrders(prev => prev.map(o => o.id === orderId ? orders.find(o2 => o2.id === orderId) : o));
        setShowDetailModal(false);
      } else {
        alert('Detay güncellenemedi');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Sunucu hatası');
    });
  };

  return (
    <div className="mt-3">
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Sipariş numarası veya müşteri adı ile ara..."
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
        <div className="alert alert-info">Bu müşteriye ait sipariş bulunamadı.</div>
      ) : (
        filteredOrders.map(order => (
          <div key={order.id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5>{order.customer_name}</h5>
                <div>
                  <span className="badge bg-secondary">#{order.id}</span><br/>
                  <span className={`badge ${order.status === 'Tamamlandı' ? 'bg-success' : 'bg-secondary'}`}>{order.status}</span>
                </div>
              </div>
              <p className="text-muted mt-2">Oluşturulma: {new Date(order.created_at).toLocaleDateString()}</p>
              <p><strong>Toplam:</strong> {Number(order.total_amount).toFixed(2)} ₺</p>

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
                  {order.items.map((item, idx) => {
                    const maxLength = Math.max(
                      item.serial_number?.length || 0,
                      item.address?.length || 0,
                      item.service_name?.length || 0,
                      item.phone_number?.length || 0,
                      item.job_status?.length || 0
                    );
                    return (
                      <React.Fragment key={idx}>
                        <tr onClick={() => toggleRow(order.id, idx)} style={{ cursor: 'pointer' }}>
                          <td>{item.product_name}</td>
                          <td>{item.quantity}</td>
                          <td>{Number(item.unit_price).toFixed(2)} ₺</td>
                          <td>{Number(item.discount).toFixed(2)}%</td>
                          <td>{Number(item.discounted_unit_price).toFixed(2)} ₺</td>
                          <td>{Number(item.total_amount).toFixed(2)} ₺</td>
                        </tr>
                        {openRows[order.id]?.[idx] && (
                          <tr>
                            <td colSpan={6}>
                              <div className="border p-2 bg-light rounded">
                                <strong>Seri No ve Adres Bilgileri:</strong>
                                <table className="table table-bordered table-sm mt-2 mb-0">
                                  <thead className="table-secondary">
                                    <tr>
                                      <th>#</th>
                                      <th>Seri No</th>
                                      <th>Adres</th>
                                      <th>İsim</th>
                                      <th>Telefon No</th>
                                      <th>İş Durumu</th>
                                      <th>İşlem</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Array.from({ length: maxLength }).map((_, i) => (
                                      <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{item.serial_number?.[i] || '-'}</td>
                                        <td>{item.address?.[i] || '-'}</td>
                                        <td>{item.service_name?.[i] || '-'}</td>
                                        <td>{item.phone_number?.[i] || '-'}</td>
                                        <td>{item.job_status?.[i] || '-'}</td>
                                        <td>
                                          <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => handleDetailEdit(order.id, idx, i, {
                                              serial_number: item.serial_number?.[i] || '',
                                              address: item.address?.[i] || '',
                                              service_name: item.service_name?.[i] || '',
                                              phone_number: item.phone_number?.[i] || '',
                                              job_status: item.job_status?.[i] || ''
                                            })}
                                          >
                                            Düzenle
                                          </Button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {/* Alt Detay Düzenleme Modalı */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detay Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editDetail && (
            <Form>
              {['serial_number', 'address', 'service_name', 'phone_number', 'job_status'].map(field => (
                <Form.Group key={field} className="mb-3">
                  <Form.Label>{field.replace('_', ' ').toUpperCase()}</Form.Label>
                  <Form.Control
                    type="text"
                    value={editDetail.data[field]}
                    onChange={e => handleDetailChange(field, e.target.value)}
                  />
                </Form.Group>
              ))}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Kapat</Button>
          <Button variant="primary" onClick={handleDetailSave}>Kaydet</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerOwnOrders;
