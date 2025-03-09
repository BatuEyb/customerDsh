import React, { useState, useEffect } from "react";

const CustomerEditModal = ({ customer, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        ad_soyad: "",
        igdas_sozlesme:"",
        telefon1: "",
        telefon2: "",
        tuketim_no: "",
        il: "",
        ilce: "",
        mahalle: "",
        sokak_adi: "",
        bina_no: "",
        daire_no: "",
        cihaz_turu: "",
        cihaz_markasi: "",
        cihaz_modeli: "",
        cihaz_seri_numarasi: "",
        siparis_tarihi: "",
        montaj_tarihi: "",
        musteri_temsilcisi: "",
        is_tipi: "",
        hata_sebebi: "",
        not_text: "",
        randevu_tarihi: ""
    });

    useEffect(() => {
        if (customer) {
            setFormData({ ...customer });
        }
    }, [customer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost/reactDashboard/src/api/update-customer.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Müşteri başarıyla güncellendi!");
                onUpdate();
                onClose();
            } else {
                alert("Güncelleme başarısız oldu!");
            }
        } catch (error) {
            console.error("Güncelleme hatası:", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Bu müşteriyi silmek istediğinizden emin misiniz?")) return;

        try {
            const response = await fetch(`http://localhost/reactDashboard/src/api/delete-customer.php?id=${customer.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Müşteri başarıyla silindi!");
                onUpdate();
                onClose();
            } else {
                alert("Silme işlemi başarısız oldu!");
            }
        } catch (error) {
            console.error("Silme hatası:", error);
        }
    };

    return (
        <div className="modal show d-block" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Müşteri Bilgilerini Düzenle</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-1">
                                    <label className="form-label">İgdaş Sözleşme Adı</label>
                                    <input type="text" name="igdas_sozlesme" value={formData.igdas_sozlesme}
                                           onChange={handleChange}
                                           className="form-control"/>
                                </div>
                                <div className="col-md-6 mb-1">
                                    <label className="form-label">Tüketim No</label>
                                    <input type="text" name="tuketim_no" value={formData.tuketim_no}
                                           onChange={handleChange}
                                           className="form-control"/>
                                </div>
                            </div>
                            <div className="mb-1">
                                <label className="form-label">Ad Soyad</label>
                                <input type="text" name="ad_soyad" value={formData.ad_soyad} onChange={handleChange}
                                       className="form-control"/>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-1">
                                    <label className="form-label">Telefon 1</label>
                                    <input type="text" name="telefon1" value={formData.telefon1} onChange={handleChange}
                                           className="form-control"/>
                                </div>
                                <div className="col-md-6 mb-1">
                                    <label className="form-label">Telefon 2</label>
                                    <input type="text" name="telefon2" value={formData.telefon2} onChange={handleChange}
                                           className="form-control"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-1">
                                    <label className="form-label">Cihaz Turu</label>
                                    <select
                                        className="form-select"
                                        name="cihaz_turu"
                                        value={formData.cihaz_turu} // React'ta value ile kontrol edilir
                                        onChange={handleChange} // Değişim ile güncellenir
                                        required
                                    >
                                        <option value="">Cihaz Türü</option>
                                        <option value="Kombi">Kombi</option>
                                        <option value="Şofben">Şofben</option>
                                        <option value="Soba">Soba</option>
                                        <option value="Kazan">Kazan</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-1">
                                    <label className="form-label">Cihaz Markası</label>
                                    <select
                                        className="form-select"
                                        name="cihaz_markasi"
                                        value={formData.cihaz_markasi} // React'ta value ile kontrol edilir
                                        onChange={handleChange} // Değişim ile güncellenir
                                        required
                                    >
                                        <option value="">Cihazın Markası</option>
                                        <option value="Demirdöküm">Demirdöküm</option>
                                        <option value="Baymak">Baymak</option>
                                        <option value="Eca">Eca</option>
                                        <option value="Buderus">Buderus</option>
                                        <option value="Bosch">Bosch</option>
                                        <option value="Vaillant">Vaillant</option>
                                        <option value="Viessmann">Viessmann</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-1">
                                    <label className="form-label">Cihaz Modeli</label>
                                    <input type="text" name="cihaz_modeli" value={formData.cihaz_modeli}
                                           onChange={handleChange}
                                           className="form-control"/>
                                </div>
                                <div className="col-md-6 mb-1">
                                    <label className="form-label">Cihaz Seri No</label>
                                    <input type="text" name="cihaz_seri_numarasi" value={formData.cihaz_seri_numarasi}
                                           onChange={handleChange}
                                           className="form-control"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-1">
                                    <label className="form-label">Sipariş Tarihi</label>
                                    <input type="date" name="siparis_tarihi" value={formData.siparis_tarihi}
                                           onChange={handleChange}
                                           className="form-control"/>
                                </div>
                                <div className="col-md-6 mb-1">
                                    <label className="form-label">Montaj Tarihi</label>
                                    <input type="date" name="montaj_tarihi" value={formData.montaj_tarihi}
                                           onChange={handleChange}
                                           className="form-control"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-1">
                                    <label className="form-label">Müşteri Temsilcisi</label>
                                    <select
                                        className="form-select"
                                        name="musteri_temsilcisi"
                                        value={formData.musteri_temsilcisi} // React'ta value ile kontrol edilir
                                        onChange={handleChange} // Değişim ile güncellenir
                                        required
                                    >
                                        <option value="">Müşteri Temsilcisi Seçin</option>
                                        <option value="Batuhan Eyüboğlu">Batuhan Eyüboğlu</option>
                                        <option value="Çiler Şahin">Çiler Şahin</option>
                                        <option value="Melisa Şimşek">Melisa Şimşek</option>
                                        <option value="Selin Beyler">Selin Beyler</option>
                                        <option value="Aytekin Demir">Aytekin Demir</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-header">
                                <h5 className="modal-title">Projesel İşler</h5>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-1">
                                    <label className="form-label">İş Tipi</label>
                                    <select
                                        className="form-select"
                                        name="is_tipi"
                                        value={formData.is_tipi} // React'ta value ile kontrol edilir
                                        onChange={handleChange} // Değişim ile güncellenir
                                        required
                                    >
                                        <option value="">İş Tipi Seçiniz</option>
                                        <option value="Cihaz Değişimi">Cihaz Değişimi</option>
                                        <option value="Sıfır Proje">Sıfır Proje</option>
                                        <option value="Tekli Satış">Tekli Satış</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-1">
                                    <label className="form-label">İş Durumu</label>
                                    <select
                                        className="form-select"
                                        name="is_durumu"
                                        value={formData.is_durumu} // React'ta value ile kontrol edilir
                                        onChange={handleChange} // Değişim ile güncellenir
                                        required
                                    >
                                        <option value="">İş Durumunu Seçiniz</option>
                                        <option value="Sipariş Alındı">Sipariş Alındı</option>
                                        <option value="Montaj Yapıldı">Montaj Yapıldı</option>
                                        <option value="Abonelik Yok">Abonelik Yok</option>
                                        <option value="Proje Onayda">Proje Onayda</option>
                                        <option value="Sözleşme Yok">Sözleşme Yok</option>
                                        <option value="Randevu Bekliyor">Randevu Bekliyor</option>
                                        <option value="Randevu Alındı">Randevu Alındı</option>
                                        <option value="Gaz Açıldı">Gaz Açıldı</option>
                                        <option value="İş Tamamlandı">İş Tamamlandı / Servis Yönlendirildi</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-1">
                                    <label className="form-label">Hata Sebebi</label>
                                    <input type="text" name="hata_sebebi" value={formData.hata_sebebi}
                                           onChange={handleChange}
                                           className="form-control"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-1">
                                    <label className="form-label">Not</label>
                                    <input type="text" name="not_text" value={formData.not_text}
                                           onChange={handleChange}
                                           className="form-control"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-1">
                                    <label className="form-label">Randevu Tarihi</label>
                                    <input type="date" name="randevu_tarihi" value={formData.randevu_tarihi}
                                           onChange={handleChange}
                                           className="form-control"/>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Kaydet</button>
                            <button type="button" className="btn btn-secondary ms-2" onClick={onClose}>İptal
                            </button>
                            <button type="button" className="btn btn-danger ms-2" onClick={handleDelete}>Sil
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerEditModal;
