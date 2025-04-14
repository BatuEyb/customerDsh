import html2pdf from 'html2pdf.js';

export const generateOrderPDF = (order) => {
  const content = document.createElement('div');
  content.style.padding = '20px';
  content.style.fontFamily = 'Arial, sans-serif';

  const reportDate = new Date().toLocaleDateString();

  content.innerHTML = `
    <h2>Sipariş Raporu - #${order.id}</h2>
    <p><strong>Müşteri:</strong> ${order.customer_name}</p>
    <p><strong>Oluşturulma Tarihi:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>

    <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px;">
      <thead style="background-color: #f0f0f0;">
        <tr>
          <th>#</th>
          <th>Ürün</th>
          <th>Adet</th>
          <th>Birim Fiyat</th>
          <th>İskonto (%)</th>
          <th>İskontolu Fiyat</th>
          <th>Toplam</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map((item, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td>${item.product_name}</td>
            <td>${item.quantity}</td>
            <td>${Number(item.unit_price).toFixed(2)} ₺</td>
            <td>${Number(item.discount).toFixed(2)}</td>
            <td>${Number(item.discounted_unit_price).toFixed(2)} ₺</td>
            <td>${Number(item.total_amount).toFixed(2)} ₺</td>
          </tr>
          <tr>
            <td colspan="7">
              <div style="padding: 10px; background-color: #f9f9f9; border: 1px solid #ccc;">
                <strong>Seri Numarası ve Servis Detayları</strong>
                <table border="1" cellspacing="0" cellpadding="4" style="width: 100%; margin-top: 10px; font-size: 11px; border-collapse: collapse;">
                  <thead style="background-color: #eaeaea;">
                    <tr>
                      <th>#</th>
                      <th>Seri No</th>
                      <th>Adres</th>
                      <th>Servis Adı</th>
                      <th>Telefon</th>
                      <th>İş Durumu</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${
                      (item.serial_number || []).map((_, i) => `
                        <tr>
                          <td>${i + 1}</td>
                          <td>${item.serial_number[i] || '-'}</td>
                          <td>${item.address?.[i] || '-'}</td>
                          <td>${item.service_name?.[i] || '-'}</td>
                          <td>${item.phone_number?.[i] || '-'}</td>
                          <td>${item.job_status?.[i] || '-'}</td>
                        </tr>
                      `).join('')
                    }
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div style="text-align: right; font-size: 10px; margin-top: 40px;">
      <span>Rapor Alınma Tarihi: ${reportDate}</span>
    </div>
  `;

  const opt = {
    margin: [10, 10, 20, 10],
    filename: `siparis_${order.id}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  html2pdf().set(opt).from(content).toPdf().get('pdf').then(function (pdf) {
    const pageCount = pdf.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.text(`Sayfa ${i} / ${pageCount}`, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 10, {
        align: 'center'
      });
    }
  }).save();
};
