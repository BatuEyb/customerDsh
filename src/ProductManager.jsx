import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductFilter from "./components/ProductFilter";

const ProductManager = () => {
  const [urunler, setUrunler] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({});
  const [filters, setFilters] = useState({
    searchInput: '',
    kategori: '',
    marka: ''
  });

  const [allCategories, setAllCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);

  useEffect(() => {
    fetchUrunler();
  }, []);

  const fetchUrunler = async () => {
    const response = await fetch("http://localhost/customerDsh/src/api/product.php");
    const data = await response.json();
    setUrunler(data);

    const categories = [...new Set(data.map((urun) => urun.kategori))];
    const brands = [...new Set(data.map((urun) => urun.marka))];
    setAllCategories(categories);
    setAllBrands(brands);
    setFilteredCategories(categories);
    setFilteredBrands(brands);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCategoryChange = (category) => {
    // Update the category filter, but do not reset the brand filter
    setFilters((prevFilters) => ({
      ...prevFilters,
      kategori: category,
    }));

    // If a category is selected, filter brands based on the selected category
    const brandsForCategory = urunler
      .filter((urun) => urun.kategori === category)
      .map((urun) => urun.marka);
    setFilteredBrands([...new Set(brandsForCategory)]);
  };

  const handleBrandChange = (brand) => {
    // Update the brand filter, but do not reset the category filter
    setFilters((prevFilters) => ({
      ...prevFilters,
      marka: brand,
    }));

    // If a brand is selected, filter categories based on the selected brand
    const categoriesForBrand = urunler
      .filter((urun) => urun.marka === brand)
      .map((urun) => urun.kategori);
    setFilteredCategories([...new Set(categoriesForBrand)]);
  };

  const handleDelete = async (id) => {
    const response = await fetch("http://localhost/customerDsh/src/api/product.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });
    const result = await response.json();
    alert(result.message);
    fetchUrunler();
  };

  const handleEdit = (urun) => {
    setEditMode(urun.id);
    setFormData(urun);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!formData.stok_numarasi || formData.stok_numarasi.trim() === "") {
      alert("Stok numarası boş bırakılamaz!");
      return;
    }
    if (!formData.kategori || formData.kategori.trim() === "") {
      alert("Kategori boş bırakılamaz!");
      return;
    }
    if (!formData.urun_adi || formData.urun_adi.trim() === "") {
      alert("Ürün adı boş bırakılamaz!");
      return;
    }

    const response = await fetch("http://localhost/customerDsh/src/api/product.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    alert(result.message);
    setEditMode(null);
    fetchUrunler();
  };

  const filteredUrunler = urunler.filter((urun) => {
    const { searchInput, kategori, marka } = filters;
    const matchesSearch = urun.urun_adi.toLowerCase().includes(searchInput.toLowerCase()) || urun.stok_numarasi.includes(searchInput);
    const matchesKategori = kategori ? urun.kategori.toLowerCase().includes(kategori.toLowerCase()) : true;
    const matchesMarka = marka ? urun.marka.toLowerCase().includes(marka.toLowerCase()) : true;

    return matchesSearch && matchesKategori && matchesMarka;
  });

  const handleResetFilters = () => {
    setFilters({
      searchInput: '',
      kategori: '',
      marka: ''
    });
    setFilteredCategories(allCategories);
    setFilteredBrands(allBrands);
  };

  return (
    <>
      <div className="mt-4">
        <h2>Ürün Listesi</h2>
        <ProductFilter
            onFilterChange={handleFilterChange}
            filters={filters}
            allCategories={allCategories}
            allBrands={allBrands}
            filteredCategories={filteredCategories}
            filteredBrands={filteredBrands}
            onCategoryChange={handleCategoryChange}
            onBrandChange={handleBrandChange}
            onResetFilters={handleResetFilters}
        />
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Ürün Adı</th>
              <th>Marka</th>
              <th>Stok Numarası</th>
              <th>Stok Adedi</th>
              <th>Fiyat</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredUrunler.map((urun) => (
              <tr key={urun.id}>
                {editMode === urun.id ? (
                  <>
                    <td><input type="text" name="kategori" value={formData.kategori} onChange={handleChange} className="form-control" /></td>
                    <td><input type="text" name="urun_adi" value={formData.urun_adi} onChange={handleChange} className="form-control" /></td>
                    <td><input type="text" name="marka" value={formData.marka} onChange={handleChange} className="form-control" /></td>
                    <td><input type="text" name="stok_numarasi" value={formData.stok_numarasi} onChange={handleChange} className="form-control" /></td>
                    <td><input type="number" name="stok_adedi" value={formData.stok_adedi} onChange={handleChange} className="form-control" /></td>
                    <td><input type="number" name="fiyat" value={formData.fiyat} onChange={handleChange} className="form-control" /></td>
                    <td>
                      <button className="btn btn-success me-2" onClick={handleUpdate}>Kaydet</button>
                      <button className="btn btn-secondary" onClick={() => setEditMode(null)}>İptal</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{urun.kategori}</td>
                    <td>{urun.urun_adi}</td>
                    <td>{urun.marka}</td>
                    <td>{urun.stok_numarasi}</td>
                    <td>{urun.stok_adedi}</td>
                    <td>{urun.fiyat}</td>
                    <td>
                      <button className="btn btn-warning me-2" onClick={() => handleEdit(urun)}>Düzenle</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(urun.id)}>Sil</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductManager;
