import React, { useEffect, useState } from "react";
import CustomerCard from "./components/CustomerCard.jsx";
import CustomerFilter from "./components/customer_filter.jsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DejaVuSans from "./assets/DejaVuSans-normal.js";
import { FaDownload } from "react-icons/fa";


const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [customersPerPage, setCustomersPerPage] = useState(4); // Dinamik hale getirildi

    // Müşteri verilerini çek
    const fetchCustomers = async () => {
        try {
            const response = await fetch("http://localhost/customerDsh/src/api/get_all_customers.php");
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

    const [title, setTitle] = useState("Tüm Müşteriler");

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
        if (filters.hataSebebi) {
            filtered = filtered.filter(c => c.hata_sebebi && c.hata_sebebi.trim() !== "");
        }

        // Başlık güncelleme işlemi
        let newTitle = "Tüm Müşteriler"; // Varsayılan başlık

        if (filters.isDurumu) {
            if (filters.isDurumu === "Sipariş Alındı") {
                newTitle = "Montaj Bekleyen Müşteriler";
            } else if (filters.isDurumu === "Montaj Yapıldı") {
                newTitle = "Proje Bekleyen Müşteriler";
            } else if (filters.isDurumu === "Randevu Bekliyor") {
                newTitle = "Randevu Bekleyen Müşteriler";
            } else if (filters.isDurumu === "Gaz Açıldı") {
                newTitle = "Servis Bekleyen Müşteriler";
            } else if (filters.isDurumu === "İş Tamamlandı") {
                newTitle = "Süreci Tamamlanan Müşteriler";
            }
        }

        if (filters.hataSebebi) {
            newTitle = "Hatalı Müşteriler"; // Hata sebebi filtresi aktifse başlık güncelleniyor
        }

        setTitle(newTitle); // Başlık son olarak set edilir

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

        // Proje tarihi aralığı filtresi
        if (filters.projestartDate || filters.projeendDate) {
            filtered = filtered.filter(c => {
                if (!c.siparis_tarihi) return false; // Tarihi olmayanları filtrele
                const siparisTarihi = new Date(c.randevu_tarihi); // Tarihi Date objesine çevir

                if (filters.projestartDate && filters.projeendDate) {
                    return siparisTarihi >= new Date(filters.projestartDate) && siparisTarihi <= new Date(filters.projeendDate);
                }
                if (filters.projestartDate) {
                    return siparisTarihi >= new Date(filters.projestartDate);
                }
                if (filters.projeendDate) {
                    return siparisTarihi <= new Date(filters.projeendDate);
                }
            });
        }

        setFilteredCustomers(filtered);
        setCurrentPage(1);
    };

 

    const showAll = () => {
        setCustomersPerPage(filteredCustomers.length); // Tüm müşterileri göster
        setCurrentPage(1);
    };

    const resetPagination = () => {
        setCustomersPerPage(4); // Sayfalama sistemine geri dön
        setCurrentPage(1);
    };

    // Sayfalama işlemi
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);


    const generatePDF = (filters) => {
        const doc = new jsPDF({ orientation: "landscape" });
    
        // 📌 DejaVuSans fontunu ekle
        doc.addFileToVFS("DejaVuSans.ttf", DejaVuSans);
        doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
        doc.setFont("DejaVuSans");
    
        // **Sayfa bilgilerini hazırlayalım**
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
    
        // **Tarayıcıdan giriş yapan kullanıcıyı al**
        const firstName = localStorage.getItem("first_name") || "Bilinmeyen";
        const lastName = localStorage.getItem("last_name") || "Kullanıcı";
        const loggedInUser = `${firstName} ${lastName}`;
    
        // **Oluşturulma Tarihini alalım**
        const today = new Date();
        const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}`;
    
        // **Toplam müşteri sayısını alalım**
        const totalCustomers = filteredCustomers.length;
    
        // 🔹 Filtre başlığını belirle
        let filterTitle = title;
    
        // **Başlık**
        doc.text(filterTitle, 14, 10);
    
        // **Tablo için sütun başlıkları (Sıra No eklendi)**
        const tableColumn = ["Sıra No", "Tüketim No", "İGDAŞ Sözleşme Adı", "Ad Soyad", "Telefon", "Sokak", "Bina No", "Daire No", "İş Tipi", "Cihaz Markası", "Müşteri Temsilcisi"];
    
        const tableRows = [];

        filteredCustomers.forEach((customer, index) => {
            // **İlk satır: Normal müşteri bilgileri**
            tableRows.push([
                index + 1, // Sıra No
                customer.tuketim_no,
                customer.igdas_sozlesme,
                customer.ad_soyad,
                customer.telefon1,
                customer.sokak_adi,
                customer.bina_no,
                customer.daire_no,
                customer.is_tipi,
                customer.cihaz_markasi,
                customer.musteri_temsilcisi
            ]);

            // **Randevu tarihini uygun formata çevir**
            let formattedDate = "—";
            if (customer.randevu_tarihi) {
            const date = new Date(customer.randevu_tarihi);
            const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
            formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} - ${dayNames[date.getDay()]}`;
            }
        
            // **İkinci satır: Hata Sebebi (Tüm sütunları birleştir)**
            tableRows.push([
                {
                    content: `Hata Sebebi: ${customer.hata_sebebi || "—"}`,
                    colSpan: 6, // **İlk 8 sütunu kaplayacak**
                    styles: { textColor: [255, 0, 0], fontStyle: "normal", halign: "left" }
                },
                {
                    content: `Randevu Tarihi: ${formattedDate}`,
                    colSpan: 5, // **Son 2 sütunu kaplayacak**
                    styles: { textColor: [0, 128, 0], fontStyle: "normal", halign: "right" }
                }
            ]);
        });
    
        // **Tabloyu oluştur**
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { font: "DejaVuSans", fontSize: 8 },
            headStyles: { fontStyle: "normal", fillColor: [200, 200, 200], textColor: 0 },
            bodyStyles: { fontStyle: "normal" },
            didDrawPage: function (data) {
                // Sayfa bilgilerini her sayfada ekle
                // 📌 Sayfanın alt kısmındaki bilgileri ekleyelim
                const pageNumber = doc.internal.getNumberOfPages();
    
                // **Toplam Müşteri Sayısı** Sol Alt Köşe
                doc.setFontSize(8);
                doc.text(`Toplam Müşteri Sayısı: ${totalCustomers}`, 14, pageHeight - 10);
    
                // **Raporu Oluşturan** Ortaya
                const text = `Raporu Oluşturan: ${loggedInUser}`;
                const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                const xPosition = (pageWidth - textWidth) / 2; // Ortalamak için x konumunu ayarla
                doc.text(text, xPosition, pageHeight - 10); // Sayfanın altına ekle
    
                // **Oluşturulma Tarihi** Sağ Alt Köşe
                doc.text(`Oluşturulma Tarihi: ${formattedDate}`, pageWidth - 70, pageHeight - 10);
    
                // **Sayfa Numarası** Sağ Üst Köşe
                doc.text(`Sayfa: ${pageNumber}`, pageWidth - 40, 10); // Sayfa numarasını sağ üst köşeye yerleştir
            }
        });
    
        // 🔹 Dosya adı: "eykom_musteriler_gün-ay-yıl.pdf"
        const dateString = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
        const fileName = `Eykom ${filterTitle} ${dateString}.pdf`;
    
        // **PDF'i doğrudan indir**
        doc.save(fileName);
    };

    return (
        <>
            <h2>Bireysel Müşteriler</h2>
            <CustomerFilter onSearchChange={handleSearchChange} onFilterChange={handleFilterChange}/>
            {/* Müşteri Sayısı Labeli */}
            <div className="card mb-2">
                <div class="card-body p-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5>{title}: <span className="badge bg-primary">{filteredCustomers.length}</span></h5>
                        <button onClick={generatePDF} className="btn btn-primary">
                            <FaDownload size={20} /> Rapor İndir
                        </button>
                    </div>
                </div>
            </div>
            <div className="row">
                {currentCustomers.map((customer) => (
                    <CustomerCard
                        key={customer.id}
                        customer={customer}
                        onUpdate={fetchCustomers}
                    />
                ))}
            </div>

            {/* Sayfalama */}
            <nav>
                <ul className="pagination justify-content-center mt-3">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button onClick={() => paginate(currentPage - 1)} className="page-link">«</button>
                    </li>
                    {pageNumbers.map((number) => (
                        <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                            <button onClick={() => paginate(number)} className="page-link">
                                {number}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button onClick={() => paginate(currentPage + 1)} className="page-link">»</button>
                    </li>
                    {/* Tümünü Göster Butonu */}
                    <li className="page-item">
                        <button onClick={showAll} className="page-link">Tümünü Göster</button>
                    </li>
                    {/* Sayfalama Sıfırla Butonu */}
                    {customersPerPage !== 4 && (
                        <li className="page-item">
                            <button onClick={resetPagination} className="page-link">Sayfalara Böl</button>
                        </li>
                    )}
                </ul>
            </nav>
        </>
    );
};

export default CustomerList;
