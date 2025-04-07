import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEllipsisV } from "react-icons/fa";
import FilterPanel from './components/FilterPanel';

const StockManagement = () => {
    const [stocks, setStocks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [filter, setFilter] = useState({
        search: '',
        quantity: '',
        quantity_operator: '>=',
        category_id: '',
        brand: '',
    });

    const filteredStocks = stocks.filter((stock) => {
        const searchMatch =
            stock.product_name.toLowerCase().includes(filter.search.toLowerCase()) ||
            stock.stock_code.toLowerCase().includes(filter.search.toLowerCase());
    
        const quantity = parseFloat(stock.quantity);
        const target = parseFloat(filter.quantity);
    
        let quantityMatch = true;
        if (!isNaN(target)) {
            switch (filter.quantity_operator) {
                case '>=':
                    quantityMatch = quantity >= target;
                    break;
                case '<=':
                    quantityMatch = quantity <= target;
                    break;
                case '=':
                    quantityMatch = quantity === target;
                    break;
                default:
                    quantityMatch = true;
            }
        }
    
        const categoryMatch = filter.category_id ? stock.category_id === filter.category_id : true;
        const brandMatch = filter.brand ? stock.brand === filter.brand : true;
    
        return searchMatch && quantityMatch && categoryMatch && brandMatch;
    });
    

    useEffect(() => {
        fetchStocks();
        fetchCategories();
    }, []);

    // Stokları yükleme
    const fetchStocks = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost/customerDsh/src/api/stock_management.php', {
                credentials: 'include'
            });
    
            const data = await response.json();
            console.log("Gelen veri:", data); // ✨ Ekledik
    
            if (Array.isArray(data)) {
                setStocks(data);
            } else if (Array.isArray(data.stocks)) {
                setStocks(data.stocks);
            } else {
                setStocks([]);
                console.error("Beklenen dizi değil:", data); // ✨ Hata logu
            }
        } catch (error) {
            console.error("Fetch hatası:", error); // ✨
            setError('Veriler yüklenirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // Kategorileri yükleme
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost/customerDsh/src/api/categories.php', {
                credentials: 'include', // Bunu da eklemelisin session için
            });
            const data = await response.json();
    
            // Eğer veri bir dizi değilse düzelt
            if (Array.isArray(data)) {
                setCategories(data);
            } else if (Array.isArray(data.categories)) {
                setCategories(data.categories);
            } else {
                setCategories([]);
                console.error("Beklenen dizi değil:", data);
            }
        } catch (error) {
            setError('Kategoriler yüklenirken hata oluştu.');
        }
    };

    // Düzenleme modalı için
    const handleShow = (product) => {
        setSelectedProduct(product);
        setShow(true);
    };

    const handleClose = () => setShow(false);

    const handleSave = async () => {
        if (!selectedProduct) return;
        
        const response = await fetch('http://localhost/customerDsh/src/api/stock_management.php', {
            method: 'POST',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedProduct),
        });

        const data = await response.json();
        if (data.success) {
            fetchStocks(); // Verileri yeniden yükle
            handleClose(); // Modalı kapat
        } else {
            setError(data.message || 'Güncelleme hatası');
        }
    };

    // Ürün silme
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Silmek istediğinizden emin misiniz?');
        if (!confirmDelete) return;

        const response = await fetch('http://localhost/customerDsh/src/api/stock_management.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });

        const data = await response.json();
        if (data.success) {
            fetchStocks(); // Verileri yeniden yükle
        } else {
            setError(data.message || 'Silme hatası');
        }
    };

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    const userRole = localStorage.getItem("role");

    return (
        <div>
            <h2>Stok Takibi</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <FilterPanel
                filter={filter}
                setFilter={setFilter}
                categories={categories}
                stocks={stocks}
            />
            <div className="row">
            {filteredStocks.map((stock) => {
            // JSX başlamadan önce değişkenleri tanımlıyoruz
            let cardClass = 'bg-primary'; // Varsayılan olarak mavi
            if (stock.quantity <= 2) {
                cardClass = 'bg-danger'; // 2 ve altı için kırmızı
            } else if (stock.quantity <= 5) {
                cardClass = 'bg-warning'; // 5'ten az ama 2'den büyükse sarı
            }

            return (
                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={stock.id}>
                    <div className="card h-100">
                        <div className={`position-relative card-header ${cardClass} text-white`}>
                            <h5 className="card-title m-0">{stock.product_name}</h5>
                            <span className='stockCard-sCode'><b>{stock.stock_code}</b></span>
                            {userRole === "admin" && (
                                <div className="dropdown customer-edit-drp">
                                    <span className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <FaEllipsisV size={24} />
                                    </span>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <a className="dropdown-item" onClick={() => handleShow(stock)}>
                                                Düzenle
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" onClick={() => handleDelete(stock.id)}>
                                                Sil
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="card-body">
                            <p className="card-text">
                                <strong>Marka:</strong> {stock.brand}
                            </p>
                            <p className="card-text">
                                <strong>Stok Miktarı:</strong> {stock.quantity}
                            </p>
                            <p className="card-text">
                                <strong>Kategori:</strong> 
                                {categories.find(cat => cat.id === stock.category_id)?.name || "Bilinmiyor"}
                            </p>
                        </div>
                        <div className="card-footer text-center">
                            <p className="card-text">
                                <strong>Fiyat:</strong> {stock.price} TL
                            </p>
                        </div>
                    </div>
                </div>
            );
        })}
            </div>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ürün Düzenle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Ürün Adı</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedProduct?.stock_code || ''}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, stock_code: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Kategori</Form.Label>
                            <Form.Select 
                                value={selectedProduct?.category_id || ''}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, category_id: e.target.value })}
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ürün Adı</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedProduct?.product_name || ''}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, product_name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Marka</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedProduct?.brand || ''}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, brand: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Stok Miktarı</Form.Label>
                            <Form.Control
                                type="number"
                                value={selectedProduct?.quantity || ''}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Fiyat</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedProduct?.price || ''}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Kapat</Button>
                    <Button variant="primary" onClick={handleSave}>Güncelle</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default StockManagement;