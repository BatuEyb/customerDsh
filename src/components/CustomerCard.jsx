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
                        <svg width="34px" height="34px" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path opacity="0.15" d="M4 20H8L18 10L14 6L4 16V20Z" fill="#ffffff"></path>
                                <path d="M18 10L21 7L17 3L14 6M18 10L8 20H4V16L14 6M18 10L14 6" stroke="#ffffff"
                                      stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </g>
                        </svg>
                    </button>
                     )}
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
