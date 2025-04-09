// PDF'yi oluşturma
const generatePDF = (quote) => {
    const quoteHTML = `
        <html>
<head>
<style>
body{
    font-size:12px;
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
.bankAccounts, .approvement, .heading-information, .companyInfo, .products, .bankAccounts{
	margin-top:5px;
    display: inline-table;
}
.quoteAmounts{
	border-left: 0!important;
}
.quoteDetails, .quoteAmounts{
	border-top: 0!important;
	border: 1px solid #343434;
}

.quoteDetails tr, .quoteAmounts tr{
	border-bottom:1px solid #343434;
}
.quoteDetails{
	width:70%;
    float:left;
}
.quoteAmounts{
	width:30%;
    float:left;
}

.heading, .heading-information, .companyInfo, .products, .bankAccounts, .approvement{
border: 1px solid #343434;
}
.heading td, th {
  border: none;
  text-align: left;
  padding: 10px;
}

td, th {
  text-align: left;
  padding: 2px 10px;
}

.products tr:nth-child(even) {
  background-color: #dddddd;
}
.heading-information td, .approvement tr td {
  text-align: center;
}
.approvement tr:nth-child(2) {
  text-align: center;
  height:100px;
}
.products tr:first-child td {
  background-color: #3f75d7;
  color: #ffffff;
}
.products tr:first-child td {
  text-align: center;
}
.products td, th, .approvement td{
  border: 1px solid #343434;
  text-align: left;
  padding: 3px;
}
</style>
</head>
<body>
<table class="heading">
  <tr>
    <td>
        <img src="data:image/png;base64,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" />
    </td>
    <td>
    	<span class="companyInformations"><strong>Türkiş Çevre İklimlendirme İnş. Taah. San. ve Tic. Ltd. Şti.</strong></span>
        <br>
        <span class="companyInformations"><strong>Adres:</strong> Karlıktepe Mh. Yakacık Cd. No:9 Kartal/İstanbul</span>
        <br>
        <span class="companyInformations"><strong>Telefon:</strong> 444 17 10</span>
        <br>
        <span class="companyInformations"><strong>eykom.com - info@eykom.com</strong></span>
    </td>
  </tr>
</table>

<table class="heading-information">
  <tr>
    <td >
    	<span class="companyInformations"><strong>PROFORMA FATURA</strong></span>
        <br>
    </td>
  </tr>
</table>

<table class="companyInfo">
  <tr>
    <td>
    	ALICI
    </td>
    <td>
    	:
    </td>
    <td colspan="3">
    	${quote.customer_name}
    </td>
  </tr>
  <tr>
    <td>
    	ADRES
    </td>
    <td>
    	:
    </td>
    <td>
        ${quote.customer_address}
    </td>
    <td colspan="2">
    	TEKLİF NO: #${quote.quote_id}
    </td>
  </tr>
  <tr>
    <td>
    	TELEFON
    </td>
    <td>
    	:
    </td>
    <td>
    	${quote.customer_phone}
    </td>
    <td colspan="2">
    	TEKLİF TARİHİ: ${new Date(quote.created_at).toLocaleDateString()}
    </td>
</table>

<small>
Sayın ${quote.customer_name},<br>
Talebiniz olan ürün/lere ilişkin teklifimiz aşağıdaki gibidir. Formu onaylayarak tarafımıza iletmeniz ve ödeme yükümlülüklerini yerine getirmeniz ile
siparişiniz olarak işleme alınacaktır. Teklifimizin uygun karşılanacağını ümit eder, iyi çalışmalar dileriz.
Saygılarımızla.
</small>

<table class="products">
  <tr>
    <td >
    	<strong>No</strong>
    </td>
    <td >
    	<strong>Ürün Adı</strong>
    </td>
    <td >
    	<strong>Miktar</strong>
    </td>
    <td >
    	<strong>Birim Fiyatı</strong>
    </td>
    <td >
    	<strong>Ara Toplam</strong>
    </td>
  </tr>
  ${quote.items.map((item, index) => `
    <!--Tekrarlanacak Kisim Baslangic-->
    <tr>
      <td><strong>${index + 1}</strong></td>
      <td>${item.product_name}</td>
      <td>${Number(item.quantity)}</td>
      <td>${(Number(item.unit_price)* 0.80).toFixed(2)} ₺</td>
      <td>${(Number(item.total_price)* 0.80).toFixed(2)} ₺</td>
    </tr>
    <!--Tekrarlanacak Kisim Bitis-->
  `).join('')}
</table>

<table class="quoteDetails">
  <tr>
    <td >
    	<strong>TESLİMAT</strong>
    </td>
    <td >
    	:
    </td>
    <td >
    	SİPARİŞ ONAYINI TAKİBEN BELİRLENECEKTİR
    </td>
  </tr>
  <tr>
    <td >
    	<strong>OPSİYON</strong>
    </td>
    <td >
    	:
    </td>
    <td >
    	TEKLİFİMİZ 1 GÜN GEÇERLİDİR
    </td>
  </tr>
  <tr>
    <td >
    	<strong>ÖDEME ŞEKLİ</strong>
    </td>
    <td >
    	:
    </td>
    <td >
    	NAKİT / HAVALE
    </td>
  </tr>
  <tr>
    <td >
    	<strong>NAKLİYE</strong>
    </td>
    <td >
    	:
    </td>
    <td >
    	NAKLİYE ÜCRETİ ALICIYA AİTTİR
    </td>
  </tr>
  <tr>
    <td >
    	<strong>NOT</strong>
    </td>
    <td >
    	:
    </td>
    <td >
    	
    </td>
  </tr>
</table>
<table class="quoteAmounts">
  <tr>
    <td >
    	<strong>Toplam Tutar</strong>
    </td>
    <td >
    	:
    </td>
    <td >
    	${ (Number(quote.total_amount) * 0.80).toFixed(2) } ₺
    </td>
  </tr>
  <tr>
    <td >
    	<strong>KDV %20</strong>
    </td>
    <td >
    	:
    </td>
    <td >
    	${ (Number(quote.total_amount) * 0.20).toFixed(2) } ₺
    </td>
  </tr>
  <tr>
    <td >
    	<strong>Genel Toplam</strong>
    </td>
    <td >
    	:
    </td>
    <td >
    	${Number(quote.total_amount).toFixed(2)} ₺
    </td>
  </tr>
</table>

<table class="bankAccounts">
  <tr>
    <td >
    	QNB BANK
    </td>
    <td >
    	:
    </td>
    <td >
    	TR53 0011 1000 0000 0095 6853 01
    </td>
  </tr>
  <tr>
    <td >
    	HALKBANK
    </td>
    <td >
    	:
    </td>
    <td >
    	TR87 0001 2001 3080 0010 1007 51
    </td>
  </tr>
</table>

<table class="approvement">
  <tr>
    <td >
    	<strong>SATICI FİRMA ONAYI</strong>
    </td>
    <td >
    	<strong>ALICI FİRMA ONAYI</strong>
    </td>
  </tr>
  <tr style={{ verticalAlign: "top" }}>
    <td >
    	<small>
    		${quote.created_by_name}
        </small>
    </td>
    <td >
    	<small>
        	Yukarıdaki şartları kabul ederek siparişimizi verdiğimizi bildiririz
            <br>
            <strong>Tarih / Kaşe / İmza
</strong>
        </small>
    </td>
  </tr>
</table>

</body>
</html>
    `;

    // PDF oluşturma
    const element = document.createElement('div');
    element.innerHTML = quoteHTML;
    element.style.display = 'block'; // Görünür olması şart değil ama render için DOM'da olmalı
    document.body.appendChild(element); // DOM’a ekle

    // Küçük bir gecikme ver (render edilmesini sağlamak için)
    setTimeout(() => {
    html2pdf()
        .set({
        margin:       10,
        filename:     `Teklif_No_${quote.quote_id}_${quote.customer_name}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  {
            useCORS: true,
            allowTaint: true,
            scale: 2
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(element)
        .save()
        .then(() => {
        // PDF oluşturulduktan sonra DOM’dan kaldır
        document.body.removeChild(element);
        });
    }, 500); // 300-500ms genelde yeterli olur  
  };