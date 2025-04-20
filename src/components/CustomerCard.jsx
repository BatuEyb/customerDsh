import React, { useState } from "react";
import CustomerEditModal from "./CustomerEditModal.jsx";
import { FaEllipsisV } from "react-icons/fa";
import DejaVuSans from "../assets/DejaVuSans-normal.js";
import { jsPDF } from "jspdf";

const CustomerCard = ({ customer, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const userRole = localStorage.getItem("role");

    const handleOpenAsPdf = () => {
        const doc = new jsPDF();
    
        // 📌 DejaVuSans fontunu ekle
        doc.addFileToVFS("DejaVuSans.ttf", DejaVuSans);
        doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
        doc.setFont("DejaVuSans");
    
        // Set font size and color
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(0, 123, 255);  // Bootstrap primary color
        doc.rect(0, 0, 210, 30, 'F');  // Rectangle for header
        doc.text("Müşteri Bilgileri", 105, 20, { align: 'center' });
    
        // Customer Details Section
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
    
        doc.setFontSize(12);
        doc.text(`Müşteri Adı: ${customer.ad_soyad}`, 14, 40);
        doc.text(`Telefon 1: ${customer.telefon1}`, 14, 50);
        doc.text(`Telefon 2: ${customer.telefon2}`, 14, 60);
        doc.text(`İgdaş Abone Adı: ${customer.igdas_sozlesme}`, 14, 70);
        doc.text(`Tüketim Numarası: ${customer.tuketim_no}`, 14, 80);
        doc.text(`Adres: ${customer.il}, ${customer.ilce}, ${customer.mahalle}, ${customer.sokak_adi}, No:${customer.bina_no}, D:${customer.daire_no}`, 14, 90);
    
        // Device Information Section
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Cihaz Bilgileri", 14, 110);
        doc.setFontSize(12);
        doc.text(`Cihaz Türü: ${customer.cihaz_turu}`, 14, 120);
        doc.text(`Cihaz Markası: ${customer.cihaz_markasi}`, 14, 130);
        doc.text(`Cihaz Modeli: ${customer.cihaz_modeli}`, 14, 140);
        doc.text(`Seri Numarası: ${customer.cihaz_seri_numarasi}`, 14, 150);
    
        // Dates Section
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Tarih Bilgileri", 14, 160);
        doc.setFontSize(12);
        doc.text(`Randevu Tarihi: ${formatDate(customer.randevu_tarihi)}`, 14, 170);
        doc.text(`Sipariş Tarihi: ${formatDate(customer.siparis_tarihi)}`, 14, 180);
        doc.text(`Montaj Tarihi: ${formatDate(customer.montaj_tarihi)}`, 14, 190);
        doc.text(`Güncelleme Tarihi: ${formatDate(customer.guncelleme_tarihi)}`, 14, 200);
    
        // Customer Representative
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Müşteri Temsilcisi: ${customer.musteri_temsilcisi}`, 14, 210);
    
        // Alert/Status Section
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const statusText = customer.hata_sebebi ? `Hata Sebebi: ${customer.hata_sebebi}` : "Hata Yoktur";
        doc.text(statusText, 14, 220);
    
        // Footer Section
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);  // Light grey color
        doc.text("Görüşleriniz bizim için önemlidir!", 105, 230, { align: 'center' });
    
        // File name formatting
        const fileName = `${customer.ad_soyad} - ${customer.cihaz_markasi} / ${customer.cihaz_modeli}.pdf`;
    
        // Save the PDF with the custom file name
        doc.save(fileName);
    };
    
    
    return (
        <div className="col-md-6">
            <div className="customer-card card mb-3">
                <h5 className="card-header bg-primary text-white ad_soyad">
                    {customer.ad_soyad}<br />
                    <span className="largeSpan telefon1">{customer.telefon1}</span> /
                    <span className="largeSpan telefon2">{customer.telefon2}</span>
                    {userRole === "admin" && ( 
                    <>
                        <div class="dropdown customer-edit-drp">
                            <span class="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <FaEllipsisV size={32}/>
                            </span>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" onClick={() => setIsModalOpen(true)}>Düzenle / Sil</a></li>
                                <li><hr class="dropdown-divider"/></li>
                                <li>
                                <a
                                    href={`https://wa.me/+90${customer.telefon1}?text=${encodeURIComponent(
                                    `Sayın ${customer.ad_soyad},

Satın almış olduğunuz ${customer.cihaz_markasi} - ${customer.cihaz_modeli} ürününüzün montajı için ekibimiz bugün içerisinde adresinize gelecektir.

Montaj Adresi: ${customer.mahalle} ${customer.sokak_adi}, No:${customer.bina_no}, D:${customer.daire_no}

Montaj ekibimiz gelmeden önce sizi bilgilendirecektir. Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.
İyi günler dileriz.

Eykom Teknik Servis`
                                  )}`}
                                class="dropdown-item"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Montaj Mesajı Gönder
                            </a>
                                </li>
                                <li>
                                    <a class="dropdown-item"
                                    href={`https://wa.me/+90${customer.telefon1}?text=${encodeURIComponent(
                                    `Sayın ${customer.ad_soyad}, montaj işleminiz başarılı bir şekilde tamamlanmıştır.  
                                
Sizlere en iyi hizmeti sunabilmek için geri bildirimleriniz bizim için çok değerli. Hizmetimizle ilgili yorumlarınızı paylaşarak bize destek olabilirsiniz.  
                            
Yorum yapmak için tıklayın: https://g.page/r/CVPuFo8Ysm_eEBM/review  
                            
Görüşleriniz için şimdiden teşekkür ederiz.

Eykom Teknik Servis`
                                )}`}>
                                    Yorum İste
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item"
                                    href={`https://wa.me/+90${customer.telefon1}?text=${encodeURIComponent(
                                    `Sayın ${customer.ad_soyad}, satın almış olduğunuz ${customer.cihaz_markasi} - ${customer.cihaz_modeli} cihazınızın garanti başlangıcı için yetkili servis yönlendirilmiştir.  
                                  
Eykom olarak sürecimizi başarıyla tamamladık.  
                                  
Size keyifli ve sorunsuz bir kullanım dileriz. Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.  
                                  
İyi günler dileriz.

Eykom Teknik Servis`
                                  )}`}>
                                    Servis Gönderildi Mesajı
                                    </a>
                                </li>
                                <li><hr class="dropdown-divider"/></li>
                                <li><a class="dropdown-item" onClick={handleOpenAsPdf}>Fiş Olarak Yazdır</a></li>
                            </ul>
                        </div>
                    </>
                     )}
                </h5>
                <div className="card-body">
                    <h6 className="card-title">İgdaş Abone Adı : <span
                        className="largeSpan igdas_sozlesme">{customer.igdas_sozlesme}</span></h6>
                    <h6 className="card-title">Tüketim Numarası : <span
                        className="largeSpan tuketim_no">{customer.tuketim_no}</span></h6>
                    <p className="card-text">Adres :
                        <span className="il">{customer.il}</span>,
                        <span className="ilce">{customer.ilce}</span>,
                        <span className="mahalle">{customer.mahalle}</span>,
                        <span className="sokak_adi">{customer.sokak_adi}</span>,
                        <span className="bina_no">{customer.bina_no}</span>,
                        <span className="daire_no">{customer.daire_no}</span>
                    </p>
                    <div
                        className={`alert ${customer.hata_sebebi ? 'alert-danger' : 'alert-success'}`}
                        role="alert"
                    >
                        {customer.hata_sebebi ? customer.hata_sebebi : 'Hata Yoktur'}
                    </div>
                    <span className="interests_item bg-primary text-white cihaz_turu inItem mt-2">{customer.is_durumu}</span>
                    <span className="interests_item bg-primary text-white cihaz_turu inItem mt-2">Randevu Tarihi : {formatDate(customer.randevu_tarihi)}</span>
                </div>
                <div className="card-footer">
                    <div className="interests">
                        <span className="interests_item cihaz_turu">{customer.cihaz_turu}</span>
                        <span className="interests_item cihaz_markasi">{customer.cihaz_markasi}</span>
                        <span className="interests_item cihaz_modeli">{customer.cihaz_modeli}</span>
                        <span className="interests_item cihaz_seri_numarasi">{customer.cihaz_seri_numarasi}</span>
                        <span className="interests_item is_tipi">{customer.is_tipi}</span>
                        <br />
                        <span className="interests_item siparis_tarihi">
              <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path opacity="0.5"
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        fill="#343434"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M21.5303 2.46967C21.8232 2.76256 21.8232 3.23744 21.5303 3.53033L13.8107 11.25H17.3438C17.758 11.25 18.0938 11.5858 18.0938 12C18.0938 12.4142 17.758 12.75 17.3438 12.75H12C11.5858 12.75 11.25 12.4142 11.25 12C11.25 11.5858 11.5858 11.25 12 11.25H15.9393L7.46967 3.53033C7.17678 3.23744 7.17678 2.76256 7.46967 2.46967C7.76256 2.17678 8.23744 2.17678 8.53033 2.46967L16.25 10.1893H12.7186C12.3034 10.1893 11.9686 9.85447 11.9686 9.43934C11.9686 9.02421 12.3034 8.68934 12.7186 8.68934H17.3438C17.758 8.68934 18.0938 9.02421 18.0938 9.43934C18.0938 9.85447 17.758 10.1893 17.3438 10.1893H13.8107L21.5303 2.46967Z"
                        fill="#343434"></path>
                </g>
              </svg>
                            {formatDate(customer.siparis_tarihi)}
            </span>
                        <span className="interests_item montaj_tarihi">
              <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path opacity="0.5"
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        fill="#343434"></path>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M21.5303 2.46967C21.8232 2.76256 21.8232 3.23744 21.5303 3.53033L13.8107 11.25H17.3438C17.758 11.25 18.0938 11.5858 18.0938 12C18.0938 12.4142 17.758 12.75 17.3438 12.75H12C11.5858 12.75 11.25 12.4142 11.25 12C11.25 11.5858 11.5858 11.25 12 11.25H15.9393L7.46967 3.53033C7.17678 3.23744 7.17678 2.76256 7.46967 2.46967C7.76256 2.17678 8.23744 2.17678 8.53033 2.46967L16.25 10.1893H12.7186C12.3034 10.1893 11.9686 9.85447 11.9686 9.43934C11.9686 9.02421 12.3034 8.68934 12.7186 8.68934H17.3438C17.758 8.68934 18.0938 9.02421 18.0938 9.43934C18.0938 9.85447 17.758 10.1893 17.3438 10.1893H13.8107L21.5303 2.46967Z"
                        fill="#343434"></path>
                </g>
              </svg>
                            {formatDate(customer.montaj_tarihi)}
            </span>
                        <span className="interests_item musteri_temsilcisi">{customer.musteri_temsilcisi}</span>
                        <span className="interests_item guncelleme_tarihi">{formatDate(customer.guncelleme_tarihi)}</span>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <CustomerEditModal
                    customer={customer}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={onUpdate}
                />
            )}
        </div>
    );
};

export default CustomerCard;
