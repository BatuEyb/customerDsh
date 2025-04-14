import React, { useEffect, useState } from 'react';
import { FaPlusSquare, FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';

const CreateOrder = () => {
    const [customers, setCustomers] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [filteredStocks, setFilteredStocks] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
  
    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch('http://localhost/customerDsh/src/api/list_customer.php', { method: 'GET', credentials: 'include' }),
            fetch('http://localhost/customerDsh/src/api/stock_management.php', { method: 'GET', credentials: 'include' }),
            fetch('http://localhost/customerDsh/src/api/categories.php', { method: 'GET', credentials: 'include' })
        ])
            .then(([customerRes, stockRes, categoryRes]) =>
                Promise.all([customerRes.json(), stockRes.json(), categoryRes.json()])
            )
            .then(([customerData, stockData, categoryData]) => {
                setCustomers(customerData);
                setStocks(stockData);
                setCategories(categoryData);
                const uniqueBrands = Array.from(new Set(stockData.map((item) => item.brand)));
                setBrands(uniqueBrands);
                setFilteredStocks(stockData);
            })
            .catch(() => setError('Veriler yüklenirken bir hata oluştu.'))
            .finally(() => setLoading(false));
    }, []);
  
    useEffect(() => {
        let filtered = stocks;
        if (searchTerm) {
            filtered = filtered.filter((s) => s.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (selectedCategory) {
            filtered = filtered.filter((s) => s.category_id === selectedCategory);
        }
        if (selectedBrand) {
            filtered = filtered.filter((s) => s.brand === selectedBrand);
        }
        setFilteredStocks(filtered);
    }, [searchTerm, selectedCategory, selectedBrand, stocks]);
  
    useEffect(() => {
        const total = selectedItems.reduce((sum, item) => sum + item.total_price, 0);
        setTotalAmount(total);
    }, [selectedItems]);
  
    const addItem = (stock) => {
        const exists = selectedItems.find((item) => item.stock_id === stock.id);
        if (exists) return;
    
        const item = {
            stock_id: stock.id,
            product_name: stock.product_name,
            quantity: 1,
            unit_price: parseFloat(stock.price),
            discount: 0,
            discounted_unit_price: parseFloat(stock.price),
            total_price: parseFloat(stock.price),
            serial_number: [''],
            address: [''],
            service_name: [''],
            phone_number: [''],
            job_status: ['']
        };
    
        setSelectedItems([...selectedItems, item]);
    };
  
    const updateQuantity = (index, quantity) => {
        const items = [...selectedItems];
        const qty = parseInt(quantity, 10) || 1;
        items[index].quantity = qty;
        items[index].total_price = qty * items[index].discounted_unit_price;
        items[index].serial_number = Array(qty).fill('').map((_, i) => items[index].serial_number[i] || '');
        items[index].address = Array(qty).fill('').map((_, i) => items[index].address[i] || '');
        items[index].service_name = Array(qty).fill('').map((_, i) => items[index].service_name?.[i] || '');
        items[index].phone_number = Array(qty).fill('').map((_, i) => items[index].phone_number?.[i] || '');
        items[index].job_status = Array(qty).fill('').map((_, i) => items[index].job_status?.[i] || '');
        setSelectedItems(items);
    };
  
    const updateDiscount = (index, discount) => {
        const items = [...selectedItems];
        const item = items[index];
        item.discount = discount;
        item.discounted_unit_price = item.unit_price * (1 - discount / 100);
        item.total_price = item.discounted_unit_price * item.quantity;
        setSelectedItems(items);
    };
  
    const updateDiscountedPrice = (index, discountedPrice) => {
        const items = [...selectedItems];
        const item = items[index];
        item.discounted_unit_price = discountedPrice;
        item.discount = 100 - (discountedPrice / item.unit_price) * 100;
        item.total_price = discountedPrice * item.quantity;
        setSelectedItems(items);
    };
  
    const updateSerialNumber = (itemIndex, serialIndex, value) => {
        const items = [...selectedItems];
        items[itemIndex].serial_number[serialIndex] = value;
        setSelectedItems(items);
    };

    const updateAddress = (itemIndex, addressIndex, value) => {
        const items = [...selectedItems];
        items[itemIndex].address[addressIndex] = value;
        setSelectedItems(items);
    };

    const updateServiceName = (itemIndex, serviceIndex, value) => {
        const items = [...selectedItems];
        items[itemIndex].service_name[serviceIndex] = value;
        setSelectedItems(items);
    };
    
    const updatePhoneNumber = (itemIndex, phoneIndex, value) => {
        const items = [...selectedItems];
        items[itemIndex].phone_number[phoneIndex] = value;
        setSelectedItems(items);
    };
    
    const updateJobStatus = (itemIndex, jobIndex, value) => {
        const items = [...selectedItems];
        items[itemIndex].job_status[jobIndex] = value;
        setSelectedItems(items);
    };
  
    const removeItem = (index) => {
        const items = [...selectedItems];
        items.splice(index, 1);
        setSelectedItems(items);
    };
  
    const submitOrder = () => {
        if (!selectedCustomer || selectedItems.length === 0) {
            setError("Lütfen müşteri seçin ve en az bir ürün ekleyin.");
            return;
        }

        setLoading(true);
        setError(null);
    
        const payload = {
            customer_id: selectedCustomer,
            total_amount: totalAmount,
            order_items: selectedItems.map(item => ({
                stock_id: item.stock_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                discounted_unit_price: item.discounted_unit_price,
                total_amount: item.total_price,
                serial_number: item.serial_number,
                address: item.address,
                discount: item.discount,
                service_name: item.service_name,
                phone_number: item.phone_number,
                job_status: item.job_status
            }))
        };
    
        fetch('http://localhost/customerDsh/src/api/create_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    alert('Sipariş başarıyla oluşturuldu!');
                    setSelectedCustomer('');
                    setSelectedItems([]);
                } else {
                    setError(data.message || 'Sipariş oluşturulamadı');
                }
            })
            .catch((err) => {
                setError('Bir hata oluştu');
                console.error(err);
            })
            .finally(() => setLoading(false));
    };
  
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredStocks.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredStocks.length / productsPerPage);

    const toggleDetails = (index) => {
    const items = [...selectedItems];
    items[index].showDetails = !items[index].showDetails;
    setSelectedItems(items);
    };

    const updateItemDetail = (itemIndex, serialIndex, detailType, value) => {
        const items = [...selectedItems];
        items[itemIndex][detailType][serialIndex] = value;
        setSelectedItems(items);
    };

    return (
        <div className="mt-3">
            <h3>Sipariş Oluştur</h3>

            {loading && <div className="alert alert-info">Yükleniyor...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row">
                {/* Müşteri Seçimi */}
                <div className="col-md-3">
                    <div className="form-group mt-4">
                        <label>Müşteri Seç</label>
                        <select className="form-control" value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
                            <option value="">Seçiniz</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ürün Ara */}
                    <div className="form-group mt-3">
                        <label>Ürün Ara</label>
                        <input
                            type="text"
                            className="form-control"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Ürün ismiyle ara"
                        />
                    </div>

                    {/* Kategori Filtreleme */}
                    <div className="form-group mt-3">
                        <label>Kategori Seç</label>
                        <select className="form-control" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                            <option value="">Tümü</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Marka Filtreleme */}
                    <div className="form-group mt-3">
                        <label>Marka Seç</label>
                        <select className="form-control" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                            <option value="">Tüm Markalar</option>
                            {brands.map((brand, index) => (
                                <option key={index} value={brand}>
                                    {brand}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="col-md-9">
                    <div className="mt-4">
                        <h5>Ürünler</h5>
                        <table className="table table-bordered table-hover table-responsive-sm quote_items_table">
                            <caption>
                                <a
                                    className="cursor-pointer"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <FaChevronLeft />
                                </a>
                                <span className="mx-2">
                                    Sayfa {currentPage} / {totalPages}
                                </span>
                                <a
                                    className="cursor-pointer"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
                                {currentProducts.map((stock) => (
                                    <tr key={stock.id}>
                                        <td>{stock.product_name}</td>
                                        <td>{stock.brand}</td>
                                        <td>{stock.price} ₺</td>
                                        <td>
                                            <a className="cursor-pointer" onClick={() => addItem(stock)}>
                                                <FaPlusSquare />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <h5>Sepet</h5>
                <table className="table table-bordered">
  <thead>
    <tr>
      <th>Ürün Adı</th>
      <th>Adet</th>
      <th>Birim Fiyat</th>
      <th>İskonto</th>
      <th>İskontolu Fiyat</th>
      <th>Toplam</th>
      <th>Detay</th>
      <th>Sil</th>
    </tr>
  </thead>
  <tbody>
    {selectedItems.map((item, index) => (
      <React.Fragment key={index}>
        <tr>
          <td>{item.product_name}</td>
          <td>
            <input
              type="number"
              className="form-control"
              value={item.quantity}
              onChange={(e) => updateQuantity(index, e.target.value)}
            />
          </td>
          <td>{item.unit_price} ₺</td>
          <td>
            <input
              type="number"
              className="form-control"
              value={item.discount}
              onChange={(e) => updateDiscount(index, e.target.value)}
            />
          </td>
          <td>
            <input
              type="number"
              className="form-control"
              value={item.discounted_unit_price}
              onChange={(e) => updateDiscountedPrice(index, e.target.value)}
            />
          </td>
          <td>{item.total_price.toFixed(2)} ₺</td>
          <td>
            <button
              className="btn btn-outline-primary btn-sm"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#details-${index}`}
              aria-expanded="false"
              aria-controls={`details-${index}`}
            >
              Detaylar
            </button>
          </td>
          <td>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => removeItem(index)}
            >
              Sil
            </button>
          </td>
        </tr>

        <tr className="collapse" id={`details-${index}`}>
        <td colSpan="8" className="p-0">
            <div className="collapse" id={`details-${index}`}>
              <div className="border p-2 bg-light rounded m-2">
                <strong>Seri No ve Adres Bilgileri:</strong>
                <table className="table table-bordered table-sm mt-2 mb-0">
                  <thead className="table-secondary">
                    <tr>
                      <th>#</th>
                      <th>Seri No</th>
                      <th>Adres</th>
                      <th>İsim</th>
                      <th>Telefon</th>
                      <th>İş Durumu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: item.quantity }).map((_, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={item.serial_number?.[i] || ''}
                            onChange={(e) =>
                              updateItemDetail(index, i, 'serial_number', e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={item.address?.[i] || ''}
                            onChange={(e) =>
                              updateItemDetail(index, i, 'address', e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={item.service_name?.[i] || ''}
                            onChange={(e) =>
                              updateItemDetail(index, i, 'service_name', e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={item.phone_number?.[i] || ''}
                            onChange={(e) =>
                              updateItemDetail(index, i, 'phone_number', e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <select
                            className="form-select"
                            value={item.job_status?.[i] || ''}
                            onChange={(e) =>
                                updateItemDetail(index, i, 'job_status', e.target.value)
                            }
                          >
                            <option value="Bekliyor">Bekliyor</option>
                            <option value="Tamamlandı">Tamamlandı</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      </React.Fragment>
    ))}
  </tbody>
</table>
            </div>

            <div className="mt-3 text-right">
                <h5>Toplam Tutar: {totalAmount.toFixed(2)} ₺</h5>
            </div>

            <div className="mt-3">
                <button className="btn btn-primary" onClick={submitOrder}>Siparişi Oluştur</button>
            </div>
        </div>
    );
};

export default CreateOrder;
