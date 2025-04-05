import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const StockAndCategoryManagement = () => {
    // State'ler
    const [categories, setCategories] = useState([]);
    const [newStock, setNewStock] = useState({
        stock_code: '',
        product_name: '',
        brand: '',
        quantity: '',
        price: '',
        category_id: '',
    });
    const [newCategory, setNewCategory] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // Excel dosyası yüklemek için state
    const [file, setFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');

    // Kategorileri yükle
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost/customerDsh/src/api/categories.php');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            setError('Kategoriler yüklenirken bir hata oluştu.');
        }
    };

    // Stok ekleme
    const handleAddStock = async (e) => {
        e.preventDefault();
        if (!newStock.category_id) {
            setError('Lütfen geçerli bir kategori seçin.');
            return;
        }
        try {
            const response = await fetch('http://localhost/customerDsh/src/api/stock_management.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStock),
            });

            const data = await response.json();
            if (data.success) {
                setSuccessMessage('Stok başarıyla eklendi!');
                setNewStock({
                    stock_code: '',
                    product_name: '',
                    brand: '',
                    quantity: '',
                    price: '',
                    category_id: '',
                });
            } else {
                setError(data.message || 'Stok eklenirken bir hata oluştu.');
            }
        } catch (error) {
            setError('Stok eklerken bir hata oluştu.');
        }
    };

    // Kategori ekleme
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory) {
            setError('Kategori adı boş olamaz.');
            return;
        }
        try {
            const response = await fetch('http://localhost/customerDsh/src/api/categories.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newCategory }),
            });

            const data = await response.json();
            if (data.success) {
                setSuccessMessage('Kategori başarıyla eklendi!');
                setNewCategory('');
                fetchCategories(); // Kategorileri güncelle
            } else {
                setError(data.message || 'Kategori eklenirken bir hata oluştu.');
            }
        } catch (error) {
            setError('Kategori eklerken bir hata oluştu.');
        }
    };

    // Excel dosyası yükleme işlemi
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUploadExcel = async (e) => {
        e.preventDefault();
        if (!file) {
            setUploadMessage('Lütfen bir Excel dosyası seçin!');
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch('http://localhost/customerDsh/src/api/upload_excel.php', {
                method: 'POST',
                credentials: "include",
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                setUploadMessage('Excel dosyası başarıyla yüklendi!');
                // İsteğe bağlı: yeni eklenen ürünlerin görünmesi için stokları güncelleyebilirsiniz.
            } else {
                setUploadMessage(data.message || 'Excel dosyası yüklenirken bir hata oluştu.');
            }
        } catch (error) {
            setUploadMessage('Excel dosyası yüklenirken bir hata oluştu: ' + error.message);
        }
    };
    return (
        <div className="container mt-4">
            <h2>Stok ve Kategori Ekleme</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <div className="row">
                {/* Kategori Ekleme */}
                <div className="col-md-6">
                    <h3>Kategori Ekle</h3>
                    <Form onSubmit={handleAddCategory}>
                        <Form.Group>
                            <Form.Label>Kategori Adı</Form.Label>
                            <Form.Control
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Kategori Ekle
                        </Button>
                    </Form>
                </div>

                {/* Stok Ekleme */}
                <div className="col-md-6">
                    <h3>Stok Ekle</h3>
                    <Form onSubmit={handleAddStock}>
                        <Form.Group>
                            <Form.Label>Stok Kodu</Form.Label>
                            <Form.Control
                                type="text"
                                value={newStock.stock_code}
                                onChange={(e) =>
                                    setNewStock({ ...newStock, stock_code: e.target.value })
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Ürün Adı</Form.Label>
                            <Form.Control
                                type="text"
                                value={newStock.product_name}
                                onChange={(e) =>
                                    setNewStock({ ...newStock, product_name: e.target.value })
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Marka</Form.Label>
                            <Form.Control
                                type="text"
                                value={newStock.brand}
                                onChange={(e) => setNewStock({ ...newStock, brand: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Stok Miktarı</Form.Label>
                            <Form.Control
                                type="number"
                                value={newStock.quantity}
                                onChange={(e) =>
                                    setNewStock({ ...newStock, quantity: e.target.value })
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Fiyat</Form.Label>
                            <Form.Control
                                type="number"
                                value={newStock.price}
                                onChange={(e) => setNewStock({ ...newStock, price: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Kategori</Form.Label>
                            <Form.Control
                                as="select"
                                value={newStock.category_id}
                                onChange={(e) =>
                                    setNewStock({ ...newStock, category_id: e.target.value })
                                }
                                required
                            >
                                <option value="">Kategori Seç</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Stok Ekle
                        </Button>
                    </Form>
                </div>
            </div>

            <hr />

            {/* Excel Dosyası Yükleme */}
            <div className="mt-4">
                <h3>Excel Dosyası ile Ürün Yükle</h3>
                {uploadMessage && <Alert variant="info">{uploadMessage}</Alert>}
                <Form onSubmit={handleUploadExcel}>
                    <Form.Group>
                        <Form.Label>Excel Dosyası Seç</Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".xls,.xlsx"
                            onChange={handleFileChange}
                            required 
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                        Yükle
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default StockAndCategoryManagement;
