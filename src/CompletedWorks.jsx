import React, { useEffect, useState } from "react";
import CustomerCard from "./components/CustomerCard.jsx";
import CustomerFilter from "./components/customer_filter.jsx";

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);

    // Müşteri verilerini çek
    const fetchCustomers = async () => {
        try {
            const response = await fetch("http://localhost/reactDashboard/src/api/get_completed_works.php");
            const data = await response.json();
            setCustomers(data);
            setFilteredCustomers(data);
        } catch (error) {
            console.error("Müşteri verileri alınırken hata oluştu:", error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Arama işlemi
    const handleSearchChange = (searchInput) => {
        const filtered = customers.filter((customer) =>
            customer.ad_soyad.toLowerCase().includes(searchInput.toLowerCase()) ||
            customer.telefon1.toLowerCase().includes(searchInput.toLowerCase()) ||
            customer.igdas_sozlesme.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilteredCustomers(filtered);
    };

    // Filtreleme işlemi
    const handleFilterChange = (filters) => {
        let filtered = customers;

        if (filters.tuketimNo) {
            filtered = filtered.filter(c => c.tuketim_no.includes(filters.tuketimNo));
        }
        if (filters.sokak) {
            filtered = filtered.filter(c => c.sokak.toLowerCase().includes(filters.sokak.toLowerCase()));
        }
        if (filters.binaNo) {
            filtered = filtered.filter(c => c.bina_no.includes(filters.binaNo));
        }
        if (filters.isTipi) {
            filtered = filtered.filter(c => c.is_tipi === filters.isTipi);
        }
        if (filters.cihazMarkasi) {
            filtered = filtered.filter(c => c.cihaz_markasi === filters.cihazMarkasi);
        }
        if (filters.isDurumu) {
            filtered = filtered.filter(c => c.is_durumu === filters.isDurumu);
        }
        if (filters.musteriTemsilcisi) {
            filtered = filtered.filter(c => c.musteri_temsilcisi === filters.musteriTemsilcisi);
        }

        // Sipariş tarihi aralığı filtresi
        if (filters.startDate || filters.endDate) {
            filtered = filtered.filter(c => {
                if (!c.siparis_tarihi) return false; // Tarihi olmayanları filtrele
                const siparisTarihi = new Date(c.siparis_tarihi); // Tarihi Date objesine çevir

                if (filters.startDate && filters.endDate) {
                    return siparisTarihi >= new Date(filters.startDate) && siparisTarihi <= new Date(filters.endDate);
                }
                if (filters.startDate) {
                    return siparisTarihi >= new Date(filters.startDate);
                }
                if (filters.endDate) {
                    return siparisTarihi <= new Date(filters.endDate);
                }
            });
        }

        setFilteredCustomers(filtered);
    };

    return (
        <>
            {/* Müşteri Sayısı Labeli */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Tamamlanan İş Sayısı: <span className="badge bg-primary">{filteredCustomers.length}</span></h4>
            </div>

            <CustomerFilter onSearchChange={handleSearchChange} onFilterChange={handleFilterChange} />
            <div className="row">
                {filteredCustomers.map((customer) => (
                    <CustomerCard
                        key={customer.id}
                        customer={customer}
                        onUpdate={fetchCustomers}
                    />
                ))}
            </div>
        </>
    );
};

export default CustomerList;
