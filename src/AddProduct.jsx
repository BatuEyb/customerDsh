import React, { useState } from "react";

const AddProduct = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    kategori: "",
    marka: "",
    urun_adi: "",
    stok_numarasi: "",
    stok_adedi: "",
    fiyat: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Form verisini console.log ile kontrol et
    console.log("Gönderilen Veri:", formData);
  
    if (!formData.kategori || !formData.marka || !formData.urun_adi || !formData.stok_numarasi || !formData.stok_adedi || !formData.fiyat) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
  
    const response = await fetch("http://localhost/customerDsh/src/api/product.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  
    const result = await response.json();
    alert(result.message);
    setFormData({ kategori: "", marka: "", urun_adi: "", stok_numarasi: "", stok_adedi: "", fiyat: "" });
    onProductAdded();
  };


  return (
    <div className="mt-4">
      <h2>Ürün Ekle</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input type="text" name="kategori" value={formData.kategori} onChange={handleChange} className="form-control" placeholder="Kategori" />
        </div>
        <div className="mb-3">
          <input type="text" name="marka" value={formData.marka} onChange={handleChange} className="form-control" placeholder="Marka" />
        </div>
        <div className="mb-3">
          <input type="text" name="urun_adi" value={formData.urun_adi} onChange={handleChange} className="form-control" placeholder="Ürün Adı" />
        </div>
        <div className="mb-3">
          <input type="text" name="stok_numarasi" value={formData.stok_numarasi} onChange={handleChange} className="form-control" placeholder="Stok Numarası" />
        </div>
        <div className="mb-3">
          <input type="number" name="stok_adedi" value={formData.stok_adedi} onChange={handleChange} className="form-control" placeholder="Stok Adedi" />
        </div>
        <div className="mb-3">
          <input type="number" name="fiyat" value={formData.fiyat} onChange={handleChange} className="form-control" placeholder="Fiyat" />
        </div>
        <button type="submit" className="btn btn-primary">Ekle</button>
      </form>
    </div>
  );
};

export default AddProduct;
