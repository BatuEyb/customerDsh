import React, { useEffect, useState } from 'react';
import { FaPlusSquare,FaChevronLeft,FaChevronRight,FaTrash  } from "react-icons/fa";

const CreateQuote = () => {
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]); // Markalar
  const [stocks, setStocks] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Veri çekme
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost/customerDsh/src/api/list_customer.php', { method: 'GET', credentials: 'include' }),
      fetch('http://localhost/customerDsh/src/api/categories.php', { method: 'GET', credentials: 'include' }),
      fetch('http://localhost/customerDsh/src/api/stock_management.php', { method: 'GET', credentials: 'include' })
    ])
      .then(([customerRes, categoryRes, stockRes]) => 
        Promise.all([customerRes.json(), categoryRes.json(), stockRes.json()])
      )
      .then(([customerData, categoryData, stockData]) => {
        setCustomers(customerData);
        setCategories(categoryData);
        setStocks(stockData);
        setFilteredStocks(stockData);

      // Markaları stocks tablosundaki unique brand değerlerinden çekiyoruz
      const uniqueBrands = [...new Set(stockData.map(stock => stock.brand))];
      setBrands(uniqueBrands);
      setFilteredStocks(stockData);

      })
      .catch((err) => setError('Veriler yüklenirken bir hata oluştu.'))
      .finally(() => setLoading(false));
  }, []);

  // Ürünleri filtrele
  useEffect(() => {
    let filtered = stocks;

    if (selectedCategory) {
      filtered = filtered.filter(s => s.category_id === selectedCategory);
    }
    
    if (selectedBrand) {
      filtered = filtered.filter(s => s.brand === selectedBrand); // brand'ı buradan alıyoruz
    }

    if (searchTerm) {
      filtered = filtered.filter(s => s.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setFilteredStocks(filtered);
  }, [selectedCategory, selectedBrand, searchTerm, stocks]);

  // Toplam tutarı hesapla
  useEffect(() => {
    const total = selectedItems.reduce((sum, item) => sum + item.total_price, 0);
    setTotalAmount(total);
  }, [selectedItems]);

  // Ürün ekleme
  const addItem = (stock) => {
    const exists = selectedItems.find(item => item.stock_id === stock.id);
    if (exists) return;

    const item = {
      stock_id: stock.id,
      product_name: stock.product_name,
      quantity: 1,
      unit_price: parseFloat(stock.price),
      discount: 0,
      discounted_unit_price: parseFloat(stock.price), // ilk başta aynı
      total_price: parseFloat(stock.price)
    };

    setSelectedItems([...selectedItems, item]);
  };

  // Miktar güncelleme
  const updateQuantity = (index, quantity) => {
    const items = [...selectedItems];
    items[index].quantity = quantity;
    items[index].total_price = quantity * items[index].unit_price;
    setSelectedItems(items);
  };

  // İskonto Güncelleme
  const updateDiscount = (index, discount) => {
    const items = [...selectedItems];
    const item = items[index];
    item.discount = discount;
    item.discounted_unit_price = item.unit_price * (1 - discount / 100); // İskontolu fiyatı güncelle
    item.total_price = item.discounted_unit_price * item.quantity; // Toplam fiyatı güncelle
    setSelectedItems(items);
  };

  const updateDiscountedPrice = (index, discountedPrice) => {
    const items = [...selectedItems];
    const item = items[index];
    item.discounted_unit_price = discountedPrice;
    item.discount = 100 - (discountedPrice / item.unit_price) * 100; // İskonto oranını hesapla
    item.total_price = discountedPrice * item.quantity; // Toplam fiyatı güncelle
    setSelectedItems(items);
  };

  // Ürün silme
  const removeItem = (index) => {
    const items = [...selectedItems];
    items.splice(index, 1);
    setSelectedItems(items);
  };

  // Teklif gönderme
  const submitQuote = () => {
    setLoading(true);
    setError(null);

    const payload = {
      customer_id: selectedCustomer,
      total_amount: totalAmount,
      quote_items: selectedItems
    };

    fetch('http://localhost/customerDsh/src/api/create_quote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Teklif başarıyla oluşturuldu!');
          // Temizleme
          setSelectedCustomer('');
          setSelectedCategory('');
          setSelectedItems([]);
        } else {
          setError(data.message || 'Teklif oluşturulamadı');
        }
      })
      .catch((err) => {
        setError('Bir hata oluştu');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  // Pagination hesaplama
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredStocks.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredStocks.length / productsPerPage);

  return (
    <div className="mt-3">
  <h3>Teklif Oluştur</h3>

  {loading && <div className="alert alert-info">Yükleniyor...</div>}
  {error && <div className="alert alert-danger">{error}</div>}

  <div className="row">
        {/* Kategori ve Marka Filtreleri */}
        <div className="col-md-3">
          <div className="form-group mt-4">
            <h5>Filtre Seçenekleri</h5>
            <label>Müşteri Seç</label>
            <select className="form-control" value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}>
              <option value="">Seçiniz</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group mt-3">
            <label>Kategori Seç</label>
            <select className="form-control" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              <option value="">Tümü</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group mt-3">
            <label>Marka Seç</label>
            <select className="form-control" value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
              <option value="">Tümü</option>
              {brands.map((brand, index) => (
                <option key={index} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className="form-group mt-3">
            <label>Ürün Ara</label>
            <input 
              type="text" 
              className="form-control" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              placeholder="Ürün ismiyle ara" 
            />
          </div>
        </div>

        <div className='col-md-9'>
          <div className="mt-4">
            <h5>Ürünler</h5>
            <table className="table table-bordered table-hover table-responsive-sm quote_items_table ">
              <caption>
                <a 
                  className="cursor-pointer" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft />
                </a>
                <span className="mx-2">Sayfa {currentPage} / {totalPages}</span>
                <a 
                  className="cursor-pointer" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <FaChevronRight />
                </a>
              </caption>
              <thead>
                <tr>
                  <th>Ürün Adı</th>
                  <th>Marka</th>
                  <th>Fiyat</th>
                  <th>Seç</th>
                </tr>
              </thead>
              <tbody>
              {currentProducts.map(stock => (
                    <tr key={stock.id}>
                      <td>{stock.product_name}</td>
                      <td>{stock.brand}</td> {/* Markayı buradan alıyoruz */}
                      <td>{stock.price} ₺</td>
                      <td>
                        <a className="cursor-pointer" onClick={() => addItem(stock)}><FaPlusSquare />
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

          </div>
        </div>
    </div>

    {/* Seçilen Ürünler ve Teklif Bilgileri */}
    <div className="col-md-12">
      <div className="sticky-header" style={{ position: 'sticky', top: '0' }}>
        <h5>Teklif Ürünleri</h5>
      </div>
      
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Ürün</th>
            <th>Adet</th>
            <th>Birim Fiyat</th>
            <th>İskonto (%)</th>
            <th>İskontolu Fiyat</th>
            <th>Toplam</th>
            <th>Sil</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.map((item, idx) => (
            <tr key={idx}>
              <td>{item.product_name}</td>

              {/* Quantity Input */}
              <td>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  className="form-control"
                  onChange={(e) => updateQuantity(idx, parseInt(e.target.value) || 1)} // Varsayılan 1
                />
              </td>

              {/* Unit Price */}
              <td>{item.unit_price.toFixed(2)}</td>

              {/* Discount Input */}
              <td>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={isNaN(item.discount) ? '' : item.discount.toFixed(2)} // İskonto oranı
                  className="form-control"
                  onChange={(e) => {
                    const discount = parseFloat(e.target.value) || 0; // İskonto değeri 0'dan küçük olamaz
                    updateDiscount(idx, discount); // İskontoyu güncelle
                  }}
                />
              </td>

              {/* Discounted Unit Price */}
              <td>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={isNaN(item.discounted_unit_price) ? '' : item.discounted_unit_price} // İskontolu fiyat
                  className="form-control"
                  onChange={(e) => {
                    const discountedPrice = parseFloat(e.target.value) || 0; // İskontolu fiyatı güncelle
                    updateDiscountedPrice(idx, discountedPrice);
                  }}
                />
              </td>

              {/* Total Price */}
              <td>{item.total_price.toFixed(2)} ₺</td>

              {/* Remove Button */}
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => removeItem(idx)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h5 className="mt-3">Toplam Tutar: {totalAmount.toFixed(2)} ₺</h5>

      <button
        className="btn btn-success mt-4"
        onClick={submitQuote}
        disabled={!selectedCustomer || selectedItems.length === 0 || loading}
      >
        Teklifi Oluştur
      </button>
    </div>
  </div>


  );
};

export default CreateQuote;
