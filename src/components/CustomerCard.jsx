import React, { useState } from "react";
import CustomerEditModal from "./CustomerEditModal.jsx";

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
    return (
        <div className="col-md-6">
            <div className="card mb-3">
                <h5 className="card-header bg-primary text-white ad_soyad">
                    {customer.ad_soyad}<br />
                    <span className="largeSpan telefon1">{customer.telefon1}</span> /
                    <span className="largeSpan telefon2">{customer.telefon2}</span>
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
                    <span className="interests_item cihaz_turu inItem mt-2">{customer.is_durumu}</span>
                    <span className="interests_item cihaz_turu inItem mt-2">Randevu Tarihi : {formatDate(customer.randevu_tarihi)}</span>
                    {userRole === "admin" && (
                    <button className="btn edit-btn" onClick={() => setIsModalOpen(true)}>
                        <img src="src\assets\svg\edit.svg" alt="" />
                    </button>
                     )}
                    <div class="dropdown message_drp">
                        <span class="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="src/assets/svg/messages.svg"/>
                        </span>
                        <ul class="dropdown-menu">
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
                            <li><a class="dropdown-item"
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
                        </ul>
                    </div>
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
