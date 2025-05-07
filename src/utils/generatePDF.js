
import html2pdf from 'html2pdf.js';

 export const generatePDF = (quote) => {
    const quoteHTML = `
      <html>
        <head>
          <style>
            body {
              font-size: 12px;
            }

            table {
              font-family: arial, sans-serif;
              border-collapse: collapse;
              width: 100%;
            }

            .bankAccounts,
            .approvement,
            .heading-information,
            .companyInfo,
            .products,
            .bankAccounts {
              margin-top: 5px;
              display: inline-table;
            }

            .quoteAmounts {
              border-left: 0 !important;
            }

            .quoteDetails,
            .quoteAmounts {
              border-top: 0 !important;
              border: 1px solid #343434;
            }

            .quoteDetails tr,
            .quoteAmounts tr {
              border-bottom: 1px solid #343434;
            }

            .quoteDetails {
              width: 65%;
              float: left;
            }

            .quoteAmounts {
              width: 35%;
              float: left;
            }

            .heading,
            .heading-information,
            .companyInfo,
            .products,
            .bankAccounts,
            .approvement {
              border: 1px solid #343434;
            }

            .heading td,
            th {
              border: none;
              text-align: left;
              padding: 10px;
            }

            td,
            th {
              text-align: left;
              padding: 2px 10px;
            }

            .products tr:nth-child(even) {
              background-color: #dddddd;
            }

            .heading-information td,
            .approvement tr td {
              text-align: center;
            }

            .approvement tr:nth-child(2) {
              text-align: center;
              height: 100px;
            }

            .products tr:first-child td {
              background-color: #3f75d7;
              color: #ffffff;
            }

            .products tr:first-child td {
              text-align: center;
            }

            .products td,
            th,
            .approvement td {
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
              
              </td>
              <td>
                <span class="companyInformations">
                  <strong>Türkiş Çevre İklimlendirme İnş. Taah. San. ve Tic. Ltd. Şti.</strong>
                </span>
                <br>
                <span class="companyInformations">
                  <strong>Adres:</strong> Karlıktepe Mh. Yakacık Cd. No:9 Kartal/İstanbul </span>
                <br>
                <span class="companyInformations">
                  <strong>Telefon:</strong> 444 17 10 </span>
                <br>
                <span class="companyInformations">
                  <strong>eykom.com - info@eykom.com</strong>
                </span>
              </td>
            </tr>
          </table>
          <table class="heading-information">
            <tr>
              <td>
                <span class="companyInformations">
                  <strong>PROFORMA FATURA</strong>
                </span>
                <br>
              </td>
            </tr>
          </table>
          <table class="companyInfo">
            <tr>
              <td> ALICI </td>
              <td> : </td>
              <td colspan="3"> ${quote.customer_name} </td>
            </tr>
            <tr>
              <td> ADRES </td>
              <td> : </td>
              <td> ${quote.customer_address} </td>
              <td colspan="2"> TEKLİF NO: #${quote.id} </td>
            </tr>
            <tr>
              <td> TELEFON </td>
              <td> : </td>
              <td> ${quote.customer_phone} </td>
              <td colspan="2"> TEKLİF TARİHİ: ${new Date(quote.created_at).toLocaleDateString()} </td>
          </table>
          <small> Sayın ${quote.customer_name}, <br> Talebiniz olan ürün/lere ilişkin teklifimiz aşağıdaki gibidir. Formu onaylayarak tarafımıza iletmeniz ve ödeme yükümlülüklerini yerine getirmeniz ile siparişiniz olarak işleme alınacaktır. Teklifimizin uygun karşılanacağını ümit eder, iyi çalışmalar dileriz. Saygılarımızla. </small>
          <table class="products">
            <tr>
              <td>
                <strong>No</strong>
              </td>
              <td>
                <strong>Ürün Adı</strong>
              </td>
              <td>
                <strong>Miktar</strong>
              </td>
              <td>
                <strong>Birim Fiyatı</strong>
              </td>
              <td>
                <strong>İskonto</strong>
              </td>
              <td>
                <strong>İskontolu Birim Fiyatı</strong>
              </td>
              <td>
                <strong>Ara Toplam</strong>
              </td>
            </tr> ${quote.items.map((item, index) => `
            <!--Tekrarlanacak Kisim Baslangic-->
            <tr>
              <td>
                <strong>${index + 1}</strong>
              </td>
              <td>${item.product_name}</td>
              <td>${Number(item.quantity)}</td>
              <td>${(Number(item.unit_price)* 0.80).toFixed(2)} ₺</td>
              <td>${Number(item.discount).toFixed(2)} ₺</td>
              <td>${(Number(item.discounted_unit_price)* 0.80).toFixed(2)} ₺</td>
              <td>${(Number(item.total_price)* 0.80).toFixed(2)} ₺</td>
            </tr>
            <!--Tekrarlanacak Kisim Bitis--> `).join('')}
          </table>
          <table class="quoteDetails">
            <tr>
              <td>
                <strong>TESLİMAT</strong>
              </td>
              <td> : </td>
              <td> SİPARİŞ ONAYINI TAKİBEN BELİRLENECEKTİR </td>
            </tr>
            <tr>
              <td>
                <strong>OPSİYON</strong>
              </td>
              <td> : </td>
              <td> TEKLİFİMİZ 1 GÜN GEÇERLİDİR </td>
            </tr>
            <tr>
              <td>
                <strong>ÖDEME ŞEKLİ</strong>
              </td>
              <td> : </td>
              <td> NAKİT / HAVALE </td>
            </tr>
            <tr>
              <td>
                <strong>NAKLİYE</strong>
              </td>
              <td> : </td>
              <td> NAKLİYE ÜCRETİ ALICIYA AİTTİR </td>
            </tr>
            <tr>
              <td>
                <strong>NOT</strong>
              </td>
              <td> : </td>
              <td></td>
            </tr>
          </table>
          <table class="quoteAmounts">
            <tr>
              <td>
                <strong>Toplam Tutar</strong>
              </td>
              <td> : </td>
              <td> ${ (Number(quote.total_amount) * 0.80).toFixed(2) } ₺ </td>
            </tr>
            <tr>
              <td>
                <strong>KDV %20</strong>
              </td>
              <td> : </td>
              <td> ${ (Number(quote.total_amount) * 0.20).toFixed(2) } ₺ </td>
            </tr>
            <tr>
              <td>
                <strong>Genel Toplam</strong>
              </td>
              <td> : </td>
              <td> ${Number(quote.total_amount).toFixed(2)} ₺ </td>
            </tr>
          </table>
          <table class="bankAccounts">
            <tr>
              <td> QNB BANK </td>
              <td> : </td>
              <td> TR53 0011 1000 0000 0095 6853 01 </td>
            </tr>
            <tr>
              <td> HALKBANK </td>
              <td> : </td>
              <td> TR87 0001 2001 3080 0010 1007 51 </td>
            </tr>
          </table>
          <table class="approvement">
            <tr>
              <td>
                <strong>SATICI FİRMA ONAYI</strong>
              </td>
              <td>
                <strong>ALICI FİRMA ONAYI</strong>
              </td>
            </tr>
            <tr>
              <td  style={{ verticalAlign: "top!important" }}>
                <small> ${quote.created_by_name} </small>
              </td>
              <td  style={{ verticalAlign: "top!important" }}>
                <small> Yukarıdaki şartları kabul ederek siparişimizi verdiğimizi bildiririz <br>
                  <strong>Tarih / Kaşe / İmza </strong>
                </small>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

  const element = document.createElement('div');
  element.innerHTML = quoteHTML;
  element.style.display = 'blcok';  // Sayfada görünmesini engellemek için display: none kullanıyoruz
  document.body.appendChild(element);

  // PDF'yi oluşturma ve indirme işlemi
  html2pdf()
    .set({
      margin: 10,
      filename: `Teklif_No_${quote.id}_${quote.customer_name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { useCORS: true, allowTaint: true, scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(element)
    .save()
    .then(() => {
      // PDF oluşturulduktan sonra DOM'dan kaldır
      document.body.removeChild(element);
    })
    .catch((err) => {
      console.error('PDF oluşturulurken hata oluştu:', err);
      document.body.removeChild(element); // Hata durumunda DOM'dan kaldır
    });
  
  };