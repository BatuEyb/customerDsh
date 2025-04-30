import React, { useEffect, useState } from 'react';
import { apiFetch } from './api';
import { useNavigate } from 'react-router-dom';

const CustomerCard = ({ customer }) => {
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/dashboard/listCustomer/${id}`);
    };

    return (
        <div className="col-md-3" onClick={() => handleClick(customer.id)} style={{ cursor: 'pointer' }}>
            <div className="customer-card card mb-3">
                <h5 className="card-header bg-primary text-white ad_soyad">
                    {customer.name}<br />
                    <span className="largeSpan telefon1">{customer.phone}</span>
                </h5>
                <div className="card-body">
                    <p className="card-text">Mail Adresi :
                        <span className="il"> {customer.email}</span>
                    </p>
                    <p className="card-text">T.C. Numarası :
                        <span className="il"> {customer.tc_identity_number}</span>
                    </p>
                    <p className="card-text">Vergi Numarası :
                        <span className="il"> {customer.tax_number}</span>
                    </p>
                    <p className="card-text">Adres :
                        <span className="il"> {customer.address}</span>
                    </p>
                </div>
                <div className="card-footer">
                    <span className="badge bg-primary"> {customer.customer_type}</span>
                </div>
            </div>
        </div>
    );
};

const CustomerList2 = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [error, setError] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [tcTaxFilter, setTcTaxFilter] = useState('');
    const [customerTypeFilter, setCustomerTypeFilter] = useState('');
    const [phoneFilter, setPhoneFilter] = useState('');

    // Müşterileri PHP'den al
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await apiFetch('list_customer.php', {
                    method: 'GET',
                    credentials: 'include',  // Çerezlerin ve kimlik doğrulama bilgilerin dahil edilmesi için
                });
        
                if (response.ok) {
                    const data = await response.json();
                    setCustomers(data);
                    setFilteredCustomers(data);
                } else {
                    setError('Müşteriler alınırken bir hata oluştu.');
                }
            } catch (error) {
                setError('Bir hata oluştu.');
            }
        };

        fetchCustomers();
    }, []);

    // Filtreleme fonksiyonu
    const filterCustomers = () => {
        let filtered = customers;

        // İsimle filtreleme
        if (nameFilter) {
            filtered = filtered.filter(customer =>
                customer.name.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }

        // TC Kimlik / Vergi Numarasıyla filtreleme
        if (tcTaxFilter) {
            filtered = filtered.filter(customer =>
                (customer.tc_identity_number && customer.tc_identity_number.includes(tcTaxFilter)) || 
                (customer.tax_number && customer.tax_number.includes(tcTaxFilter))
            );
        }

        // Telefon numarasıyla filtreleme
        if (phoneFilter) {
            filtered = filtered.filter(customer =>
                customer.phone && customer.phone.includes(phoneFilter)
            );
        }

        // Müşteri tipiyle filtreleme
        if (customerTypeFilter) {
            filtered = filtered.filter(customer =>
                customer.customer_type && customer.customer_type.toLowerCase().includes(customerTypeFilter.toLowerCase())
            );
        }

        setFilteredCustomers(filtered);
    };

    // Filtreler değiştiğinde çağrılacak
    useEffect(() => {
        if (customers.length > 0) {
            filterCustomers();
        }
    }, [nameFilter, tcTaxFilter, customerTypeFilter, phoneFilter, customers]);

    return (
        <div className="mt-3">
            <h2 className="mb-2">Müşteri Listesi</h2>

            <div className="mb-4">
                <div className="card shadow-sm">
                    <div className="card-header bg-light">
                        <strong>Filtreleme Seçenekleri</strong>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            {/* İsim filtresi */}
                            <div className="col-md-3">
                                <label className="form-label fw-bold">İsim Soyisim</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="İsimle Ara"
                                    value={nameFilter}
                                    onChange={(e) => setNameFilter(e.target.value)}
                                />
                            </div>

                            {/* TC Kimlik ve Vergi Numarası filtresi */}
                            <div className="col-md-3">
                                <label className="form-label fw-bold">TC / Vergi No</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Numarayla Ara"
                                    value={tcTaxFilter}
                                    onChange={(e) => setTcTaxFilter(e.target.value)}
                                />
                            </div>

                            {/* Telefon Numarası filtresi */}
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Telefon</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Telefonla Ara"
                                    value={phoneFilter}
                                    onChange={(e) => setPhoneFilter(e.target.value)}
                                />
                            </div>

                            {/* Müşteri Tipi filtresi */}
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Müşteri Tipi</label>
                                <select
                                    className="form-select"
                                    value={customerTypeFilter}
                                    onChange={(e) => setCustomerTypeFilter(e.target.value)}
                                >
                                    <option value="">Seçin</option>
                                    <option value="Bireysel">Bireysel</option>
                                    <option value="Kurumsal">Kurumsal</option>
                                </select>
                            </div>
                        </div>

                        {/* Temizle butonu */}
                        <div className="mt-3 text-end">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => {
                                    setNameFilter('');
                                    setTcTaxFilter('');
                                    setPhoneFilter('');
                                    setCustomerTypeFilter('');
                                }}
                            >
                                Filtreleri Temizle
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {error && <div className="alert alert-danger">{error}</div>}

            {/* Filtrelenmiş müşteri kartları */}
            <div className="row">
                {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                        <CustomerCard key={customer.id} customer={customer} />
                    ))
                ) : (
                    <div className="col-12">
                        <p>Henüz filtrelenmiş müşteri bulunmamaktadır.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerList2;
