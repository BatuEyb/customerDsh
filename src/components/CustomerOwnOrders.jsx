import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';

const CustomerOwnOrders = ({ customer_id }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openRows, setOpenRows] = useState({}); // Satırların açılıp kapanmasını kontrol etmek için

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
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Sipariş numarası veya müşteri adı ile ara..."
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
        <div className="alert alert-info">Bu müşteriye ait sipariş bulunamadı.</div>
      ) : (
        filteredOrders.map((order) => (
          <div key={order.id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5>{order.customer_name}</h5>
                <div>
                  <span className="badge bg-secondary">#{order.id}</span><br />
                  <span className={`badge ${order.status === 'Tamamlandı' ? 'bg-success' : 'bg-secondary'}`}>
                    {order.status}
                  </span>
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
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CustomerOwnOrders;
