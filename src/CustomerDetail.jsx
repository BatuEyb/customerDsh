import React, { useEffect, useState } from 'react';
import { apiFetch } from './api';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerOwnQuotes from './components/CustomerOwnQuotes';
import CustomerOwnOrders from './components/CustomerOwnOrders';
import AllCustomerBalances from './CustomerBalances';
import AddPaymentForm from './components/AddPaymentForm';
import CustomerOwnBalance from './components/CustomerOwnBalances';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [activeTab, setActiveTab] = useState("info");

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: ""
    });

    useEffect(() => {
        const fetchCustomer = async () => {
            const res = await apiFetch(`get_customer.php?id=${id}`);
            const data = await res.json();
            setCustomer(data);
            setFormData(data);
        };

        fetchCustomer();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        const res = await apiFetch(`update_customer.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, ...formData })
        });
        const result = await res.json();
        alert(result.message || "Müşteri güncellendi.");
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Bu müşteriyi silmek istediğinize emin misiniz?");
        if (!confirmed) return;

        const res = await apiFetch(`delete_customer.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        const result = await res.json();
        alert(result.message || "Müşteri silindi.");
        navigate("/dashboard/listCustomer");
    };

    if (!customer) return <p>Yükleniyor...</p>;

    return (
        <div className="mt-4">
            <ul className="nav nav-tabs mt-3">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}>
                        Müşteri Bilgileri
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "quotes" ? "active" : ""}`} onClick={() => setActiveTab("quotes")}>
                        Müşteri Teklifleri
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
                        Müşteri Siparişleri
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "balance" ? "active" : ""}`} onClick={() => setActiveTab("balance")}>
                        Müşteri Bakiyesi
                    </button>
                </li>
            </ul>

            <div className="tab-content mt-3">
                {activeTab === "info" && (
                    <div className="tab-pane active">
                        <div className="mb-3">
                            <label className="form-label">Ad Soyad</label>
                            <input className="form-control" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Telefon</label>
                            <input className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input className="form-control" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Adres</label>
                            <textarea className="form-control" name="address" value={formData.address} onChange={handleChange} />
                        </div>
                        <button className="btn btn-primary me-2" onClick={handleSave}>Kaydet</button>
                        <button className="btn btn-danger" onClick={handleDelete}>Sil</button>
                    </div>
                )}

                {activeTab === "quotes" && (
                    <div className="tab-pane active">
                        <CustomerOwnQuotes customer_id={parseInt(id)} />
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="tab-pane active">
                        <CustomerOwnOrders customer_id={parseInt(id)} />
                    </div>
                )}

                {activeTab === "balance" && (
                    <>
                    
                    <div className="tab-pane active">
                        <AddPaymentForm customerId={parseInt(id)}/>
                        <CustomerOwnBalance customer_id={parseInt(id)} />
                    </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomerDetail;
