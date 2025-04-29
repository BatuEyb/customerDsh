import html2pdf from 'html2pdf.js';

export const generateOrderPDF = (order) => {
  // 1. Container
  const content = document.createElement('div');
  content.style.padding = '20px';
  content.style.fontFamily = 'Arial, sans-serif';
  content.style.color = '#333';

  const reportDate = new Date().toLocaleDateString('tr-TR');

  // 2. HTML
  content.innerHTML = `
    <div style="text-align:center; margin-bottom:30px;">
      <h5 style="margin:0;">Sipariş Raporu</h5>
      <p style="margin:5px 0;">#${order.id} — ${new Date(order.created_at).toLocaleDateString('tr-TR')}</p>
    </div>

    <!-- Genel Bilgiler -->
    <section style="margin-bottom:20px;">
      <strong style="border-bottom:1px solid #ccc; padding-bottom:5px;">Genel Bilgiler</strong>
      <div style="display:flex; flex-wrap:wrap; gap:10px; font-size:14px;">
        <div style="flex:1 1 200px;"><strong>Müşteri:</strong> ${order.customer_name}</div>
        <div style="flex:1 1 200px;"><strong>Adres:</strong> ${order.customer_address || '-'}</div>
        <div style="flex:1 1 200px;"><strong>Telefon:</strong> ${order.customer_phone || '-'}</div>
        <div style="flex:1 1 200px;"><strong>E-Posta:</strong> ${order.customer_email || '-'}</div>
        <div style="flex:1 1 200px;"><strong>Durum:</strong> ${order.status}</div>
        <div style="flex:1 1 200px;"><strong>Tip:</strong> ${order.order_type}</div>
      </div>
    </section>

    <!-- Ürün ve Montaj Kartları -->
    <section>
      <strong style="border-bottom:1px solid #ccc; padding-bottom:5px; margin-bottom:10px;">Ürün Detayları</strong>
      ${order.items.map((item, idx) => `
        <div style="border:1px solid #ddd; border-radius:8px; padding:15px; margin-bottom:15px;">
          <strong style="margin-top:0;">${idx+1}. ${item.product_name}</strong>
          <div style="display:flex; flex-wrap:wrap; gap:10px; font-size:13px; margin-bottom:10px;">
            <div><strong>Adet:</strong> ${item.quantity || 1}</div>
            <div><strong>Birim Fiyat:</strong> ${Number(item.unit_price).toFixed(2)} ₺</div>
            <div><strong>İskonto:</strong> ${Number(item.discount).toFixed(2)}%</div>
            <div><strong>İsk. Fiyat:</strong> ${Number(item.discounted_unit_price).toFixed(2)} ₺</div>
            <div><strong>Toplam:</strong> ${Number(item.total_amount).toFixed(2)} ₺</div>
          </div>

          ${item.installation ? `
            <div style="background:#f9f9f9; padding:10px; border-radius:6px;">
              <strong style="margin:0 0 8px 0;">Montaj Bilgileri</strong>
              <div style="display:flex; flex-wrap:wrap; gap:10px; font-size:13px;">
                <div><strong>Seri No:</strong> ${item.serial_number || '-'}</div>
                <div><strong>Abone Adı:</strong> ${item.installation.service_name}</div>
                <div><strong>Tüketim No:</strong> ${item.installation.tuketim_no}</div>
                <div><strong>Randevu:</strong> ${item.installation.randevu_tarihi || '-'}</div>
                <div><strong>İsim:</strong> ${item.installation.ad_soyad}</div>
                <div><strong>Telefon 1:</strong> ${item.installation.phone_number}</div>
                <div><strong>Telefon 2:</strong> ${item.installation.phone_number2}</div>
                <div style="flex:1 1 100%;"><strong>Adres:</strong> ${item.installation.address}</div>
                <div><strong>Durum:</strong> ${item.installation.job_status}</div>
                <div style="flex:1 1 100%;"><strong>Not:</strong> ${item.installation.not_text || '-'}</div>
                <div><strong>Hata Durumu:</strong> ${
                  item.installation.hata_durumu === 0
                    ? '<span style="color:green;">Hata Yok</span>'
                    : `<span style="color:red;">${item.installation.hata_sebebi}</span>`
                }</div>
              </div>
            </div>
          ` : `
            <div style="font-style:italic; color:#666; font-size:13px;">Montaj bilgisi bulunamadı.</div>
          `}
        </div>
      `).join('')}
    </section>

    <!-- Alt Bilgiler -->
    <section style="margin-top:30px; text-align:right;">
      <div style="font-size:16px; margin-bottom:20px;"><strong>Genel Toplam:</strong> ${Number(order.total_amount).toFixed(2)} ₺</div>
      <div style="font-size:10px; color:#555;">Rapor Tarihi: ${reportDate}</div>
    </section>
  `;

  // 3. PDF Ayarları
  const opt = {
    margin: [10, 10, 20, 10],
    filename: `siparis_${order.id}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  // 4. Oluştur ve Sayfa Numarası Ekle
  html2pdf().set(opt).from(content).toPdf().get('pdf').then(pdf => {
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.text(`Sayfa ${i} / ${pageCount}`, pdf.internal.pageSize.getWidth()/2, pdf.internal.pageSize.getHeight() - 10, {
        align: 'center'
      });
    }
  }).save();
};
