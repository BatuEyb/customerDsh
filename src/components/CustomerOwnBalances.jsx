import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DejaVuSans from "../assets/DejaVuSans-normal.js"; // Dosya yolunu doğru şekilde düzelt
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CustomerOwnBalance({ customer_id }) {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTrans, setLoadingTrans] = useState(false);
  const [error, setError] = useState(null);
  const [showPdfContent, setShowPdfContent] = useState(false);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch('http://localhost/customerDsh/src/api/get_balances.php', { credentials: 'include' });
        if (!res.ok) throw new Error(`Summary HTTP error! Status: ${res.status}`);
        const data = await res.json();
        if (data.success) {
          const record = data.balances.find(c => c.customer_id === customer_id);
          if (record) setSummary(record);
          else throw new Error('Müşteri bulunamadı');
        } else {
          throw new Error('Özet verisi alınamadı');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingSummary(false);
      }
    }
    fetchSummary();
  }, [customer_id]);

  useEffect(() => {
    if (!summary) return;
    setLoadingTrans(true);
    fetch(`http://localhost/customerDsh/src/api/get_transactions.php?customer_id=${customer_id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setTransactions(data.success ? data.transactions : []))
      .catch(() => setTransactions([]))
      .finally(() => setLoadingTrans(false));
  }, [summary, customer_id]);

  const handleDownloadPDF = async () => {
    setShowPdfContent(true);
    await new Promise(r => setTimeout(r, 100)); // render olması için küçük bekleme

    const element = document.getElementById('pdf-content');
    if (!element) {
      console.error('PDF içerik alanı bulunamadı');
      return;
    }
  
    // Canvas üzerinden görüntü al
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#fff' });
    const imgData = canvas.toDataURL('image/png');
  
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
  
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    // 📌 DejaVuSans fontunu ekle
    pdf.addFileToVFS("DejaVuSans.ttf", DejaVuSans);
    pdf.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
    pdf.setFont("DejaVuSans");
  
    let y = margin;
    let remainingHeight = imgHeight;
    let position = 0;
    let pageNumber = 1;
  
    while (remainingHeight > 0) {
      pdf.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight, '', 'FAST', 0, position);
  
      // Dinamik footer
      const date = new Date().toLocaleDateString();
      pdf.setFontSize(6);
      pdf.text(`Oluşturma Tarihi: ${date}`, margin, pageHeight - 10);
      pdf.text(`Oluşturan Kullanıcı: admin`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text(`Sayfa ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  
      remainingHeight -= pageHeight - margin * 2;
      position += pageHeight - margin * 2;
  
      if (remainingHeight > 0) {
        pdf.addPage();
        pageNumber++;
      }
    }
  
    pdf.save(`Musteri_${customer_id}_Bakiye.pdf`);
    setShowPdfContent(false);
  };

  if (loadingSummary) return <div className="text-center py-3"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Yükleniyor...</span></div></div>;
  if (error) return <div className="alert alert-danger">Hata: {error}</div>;

  const debts = transactions.filter(t => t.type === 'Borç');
  const payments = transactions.filter(t => t.type === 'Ödeme');

  return (
    <div className="py-4">
      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-outline-secondary" onClick={handleDownloadPDF}>
          PDF Olarak İndir
        </button>
      </div>
      <div>
        {/* Summary Card */}
        <div className="card mb-4" aria-labelledby="summary-heading">
          <div className="card-header bg-primary text-white">
            <h2 id="summary-heading" className="h5 mb-0">Müşteri Bakiye Özeti</h2>
          </div>
          <div className="card-body">
            <p><strong>İsim:</strong> {summary.customer_name}</p>
            <p><strong>Email:</strong> {summary.email}</p>
            <p><strong>Telefon:</strong> {summary.phone}</p>
            <div className="d-flex justify-content-between mt-3">
              <div>
                <span className="text-danger">Toplam Borç:</span>
                <span className="ms-2">₺{Number(summary.total_debt).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-success">Toplam Ödeme:</span>
                <span className="ms-2">₺{Number(summary.total_payment).toFixed(2)}</span>
              </div>
              <div>
                <span className={summary.balance > 0 ? 'text-danger' : summary.balance < 0 ? 'text-success' : 'text-secondary'}>Bakiye:</span>
                <span className="ms-2">₺{Number(summary.balance).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Sections */}
        <div className="row">
          <div className="col-md-6 mb-4" aria-labelledby="debts-heading">
            <h3 id="debts-heading" className="h6">Sipariş Borçları</h3>
            {loadingTrans ? (
              <div>Yükleniyor...</div>
            ) : debts.length > 0 ? (
              <ul className="list-group">
                {debts.map((t, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-start">
                    <div>
                      <div><strong>Sipariş #{t.order_id}</strong></div>
                      <div className="small text-muted">{t.description}</div>
                    </div>
                    <div className="text-end">
                      <div className="text-danger fw-bold">₺{Number(t.amount).toFixed(2)}</div>
                      <div className="small text-muted">{new Date(t.transaction_date).toLocaleDateString()}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">Borç kaydı bulunamadı.</p>
            )}
          </div>
          <div className="col-md-6 mb-4" aria-labelledby="payments-heading">
            <h3 id="payments-heading" className="h6">Ödeme Geçmişi</h3>
            {loadingTrans ? (
              <div>Yükleniyor...</div>
            ) : payments.length > 0 ? (
              <ul className="list-group">
                {payments.map((t, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-start">
                    <div>
                      <div><strong>{t.description}</strong></div>
                    </div>
                    <div className="text-end">
                      <div className="text-success fw-bold">₺{Number(t.amount).toFixed(2)}</div>
                      <div className="small text-muted">{new Date(t.transaction_date).toLocaleDateString()}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">Ödeme kaydı bulunamadı.</p>
            )}
          </div>
        </div>
      </div>

      {showPdfContent && (
        <div id="pdf-content" style={{
            width: '800px',
            margin: '0 auto',
            padding: '30px',
            background: '#fff',
            fontSize: '12px',
            lineHeight: 1.5
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Müşteri Bakiye Özeti</h2>
        
            <div style={{ marginBottom: '20px' }}>
            <strong>İsim:</strong> {summary.customer_name}<br />
            <strong>Email:</strong> {summary.email}<br />
            <strong>Telefon:</strong> {summary.phone}
            </div>
        
            <div style={{
            marginBottom: '20px',
            padding: '10px',
            border: '1px solid #ddd',
            background: '#f8f9fa'
            }}>
            <strong>Toplam Borç:</strong> ₺{Number(summary.total_debt).toFixed(2)}<br />
            <strong>Toplam Ödeme:</strong> ₺{Number(summary.total_payment).toFixed(2)}<br />
            <strong>Bakiye:</strong> ₺{Number(summary.balance).toFixed(2)}
            </div>
        
            <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>İşlem Geçmişi</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
            {[...transactions]
                .sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date))
                .map((t, i) => (
                <li key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #eee',
                    padding: '6px 4px',
                    background: i % 2 === 0 ? '#fdfdfd' : '#f4f4f4'
                }}>
                    <div style={{ width: '20%' }}>{new Date(t.transaction_date).toLocaleDateString()}</div>
                    <div style={{ width: '60%' }}>
                    {t.type === 'Borç' ? `Borç - Sipariş #${t.order_id}` : `Ödeme - ${t.description}`}
                    </div>
                    <div style={{
                    width: '20%',
                    textAlign: 'right',
                    color: t.type === 'Borç' ? '#dc3545' : '#198754',
                    fontWeight: 'bold'
                    }}>
                    ₺{Number(t.amount).toFixed(2)}
                    </div>
                </li>
                ))}
            </ul>
        </div>
        )}
        
    </div>
  );
}
