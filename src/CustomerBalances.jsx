import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AllCustomerBalances({ customerId = null }) {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'customer_name', direction: 'asc' });
  const [expandedRows, setExpandedRows] = useState({});
  const [transactionsMap, setTransactionsMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  useEffect(() => {
    fetch('http://localhost/customerDsh/src/api/get_balances.php', {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.success) setBalances(data.balances);
        else setError('Veri alınamadı');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Filtreleme: müşteri detayı için customerId kullanılır
  const filtered = balances
    .filter(c => {
      if (customerId !== null) return c.customer_id === customerId;
      return c.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter(c => {
      if (customerId !== null) return true;
      if (statusFilter === 'debtor') return c.balance > 0;
      if (statusFilter === 'creditor') return c.balance < 0;
      if (statusFilter === 'zero') return c.balance === 0;
      return true;
    });

  // Sıralama
  const sorted = [...filtered].sort((a, b) => {
    const { key, direction } = sortConfig;
    const order = direction === 'asc' ? 1 : -1;
    let aVal = a[key];
    let bVal = b[key];
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    if (aVal < bVal) return -1 * order;
    if (aVal > bVal) return 1 * order;
    return 0;
  });

  const requestSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // Satır detayları
  const toggleRow = customer => {
    const id = customer.customer_id;
    const isOpen = expandedRows[id];
    if (isOpen) {
      setExpandedRows(prev => ({ ...prev, [id]: false }));
    } else {
      setExpandedRows(prev => ({ ...prev, [id]: true }));
      if (!transactionsMap[id]) {
        setLoadingMap(prev => ({ ...prev, [id]: true }));
        fetch(`http://localhost/customerDsh/src/api/get_transactions.php?customer_id=${id}`, {
          credentials: 'include',
        })
          .then(res => res.json())
          .then(data => {
            setTransactionsMap(prev => ({ ...prev, [id]: data.success ? data.transactions : [] }));
          })
          .catch(() => setTransactionsMap(prev => ({ ...prev, [id]: [] })))
          .finally(() => setLoadingMap(prev => ({ ...prev, [id]: false })));
      }
    }
  };

  const getSortIndicator = key => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className="py-3">
      <h1 className="mb-4 text-primary">
        {customerId !== null ? 'Müşteri Bakiyesi' : 'Tüm Müşteri Bakiyeleri'}
      </h1>

      {!customerId && (
        <div className="row mb-3">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Müşteri adı ile ara..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-4 mb-2">
            <select
              className="form-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">Hepsi</option>
              <option value="debtor">Borçlu</option>
              <option value="creditor">Alacaklı</option>
              <option value="zero">Bakiye Yok</option>
            </select>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th onClick={() => requestSort('customer_id')} style={{ cursor: 'pointer' }}>
                  ID{getSortIndicator('customer_id')}
                </th>
                <th onClick={() => requestSort('customer_name')} style={{ cursor: 'pointer' }}>
                  İsim{getSortIndicator('customer_name')}
                </th>
                <th onClick={() => requestSort('email')} style={{ cursor: 'pointer' }}>
                  Email{getSortIndicator('email')}
                </th>
                <th onClick={() => requestSort('phone')} style={{ cursor: 'pointer' }}>
                  Telefon{getSortIndicator('phone')}
                </th>
                <th onClick={() => requestSort('total_debt')} style={{ cursor: 'pointer' }}>
                  Borç (₺){getSortIndicator('total_debt')}
                </th>
                <th onClick={() => requestSort('total_payment')} style={{ cursor: 'pointer' }}>
                  Ödeme (₺){getSortIndicator('total_payment')}
                </th>
                <th onClick={() => requestSort('balance')} style={{ cursor: 'pointer' }}>
                  Bakiye (₺){getSortIndicator('balance')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(c => (
                <React.Fragment key={c.customer_id}>
                  <tr onClick={() => toggleRow(c)} style={{ cursor: 'pointer' }}>
                    <td>{c.customer_id}</td>
                    <td>{c.customer_name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td className="text-danger fw-semibold">{Number(c.total_debt).toFixed(2)}</td>
                    <td className="text-success fw-semibold">{Number(c.total_payment).toFixed(2)}</td>
                    <td 
                      className={
                        c.balance > 0
                          ? 'text-danger fw-bold'
                          : c.balance < 0
                          ? 'text-success fw-bold'
                          : 'text-secondary fw-bold'
                      }
                    >
                      {Number(c.balance).toFixed(2)}
                    </td>
                  </tr>
                  {expandedRows[c.customer_id] && (
                    <tr>
                      <td colSpan="7" className="bg-white">
                        {loadingMap[c.customer_id] ? (
                          <div>İşlemler yükleniyor...</div>
                        ) : (
                          <>
                            <h6 className="mt-2">Sipariş Borçları</h6>
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>Sipariş ID</th>
                                  <th>Açıklama</th>
                                  <th>Tutar</th>
                                  <th>Tarih</th>
                                </tr>
                              </thead>
                              <tbody>
                                {transactionsMap[c.customer_id]
                                  .filter(t => t.type === 'Borç')
                                  .map((t, i) => (
                                    <tr key={i}>
                                      <td>{t.order_id}</td>
                                      <td>{t.description}</td>
                                      <td className="text-danger">₺{Number(t.amount).toFixed(2)}</td>
                                      <td>{new Date(t.transaction_date).toLocaleDateString()}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                            <h6 className="mt-3">Ödeme Geçmişi</h6>
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>Açıklama</th>
                                  <th>Tutar</th>
                                  <th>Tarih</th>
                                </tr>
                              </thead>
                              <tbody>
                                {transactionsMap[c.customer_id]
                                  .filter(t => t.type === 'Ödeme')
                                  .map((t, i) => (
                                    <tr key={i}>
                                      <td>{t.description}</td>
                                      <td className="text-success">₺{Number(t.amount).toFixed(2)}</td>
                                      <td>{new Date(t.transaction_date).toLocaleDateString()}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
