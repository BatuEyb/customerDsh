import React, { useState } from "react";
import './customer_filter.css';
import { FaSearch, FaSync, FaChevronDown, FaChevronUp, FaFilter } from "react-icons/fa";
const CustomerFilter = ({ onSearchChange, onFilterChange }) => {
    const [searchInput, setSearchInput] = useState('');
    const [tuketimNo, setTuketimNo] = useState('');
    const [sokak, setSokak] = useState('');
    const [binaNo, setBinaNo] = useState('');
    const [isTipi, setIsTipi] = useState('');
    const [cihazMarkasi, setCihazMarkasi] = useState('');
    const [isDurumu, setisDurumu] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [projestartDate, setprojeStartDate] = useState('');
    const [projeendDate, setprojeEndDate] = useState('');
    const [musteriTemsilcisi, setmusteriTemsilcisi] = useState('');
    const [hataSebebi, sethataSebebi] = useState('');
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    // Arama girişini yönet
    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
        onSearchChange(event.target.value);
    };

    // Enter tuşuna basılınca ara
    const handleSearchKeyPress = (event) => {
        if (event.key === 'Enter') {
            onSearchChange(searchInput);
        }
    };

    // Filtreleri uygula
    const handleApplyFilters = () => {
        onFilterChange({ tuketimNo, sokak, binaNo, isTipi, cihazMarkasi, isDurumu, startDate, endDate, projestartDate, projeendDate, musteriTemsilcisi, hataSebebi });
    };

    const handleResetFilters = () => {
        setTuketimNo('');
        setSokak('');
        setBinaNo('');
        setIsTipi('');
        setCihazMarkasi('');
        setisDurumu('');
        setStartDate('');
        setEndDate('');
        setprojeStartDate('');
        setprojeEndDate('');
        setmusteriTemsilcisi('');
        sethataSebebi('');

        onFilterChange({
            tuketimNo: '', sokak: '', binaNo: '', isTipi: '',
            cihazMarkasi: '', isDurumu: '', startDate: '',
            endDate: '',projestartDate:'' , projeendDate: '' ,musteriTemsilcisi: '', hataSebebi: ''
        });
    };

    const handleQuickFilter = (filterType) => {
        let updatedFilters = { isDurumu: '', hataSebebi: '' };

        switch (filterType) {
            case "montajBekleyen":
                updatedFilters.isDurumu = "Sipariş Alındı";
                break;
            case "projeBekleyen":
                updatedFilters.isDurumu = "Montaj Yapıldı";
                break;
            case "randevuBekleyen":
                updatedFilters.isDurumu = "Randevu Bekliyor";
                break;
            case "servisBekleyen":
                updatedFilters.isDurumu = "Gaz Açıldı";
                break;
            case "tamamlanan":
                updatedFilters.isDurumu = "İş Tamamlandı";
                break;
            case "hatalı":
                updatedFilters.hataSebebi = true;
                break;
            default:
                break;
        }

        setisDurumu(updatedFilters.isDurumu);
        onFilterChange(updatedFilters);
    };

    return (
        <div className="filters-container mt-1 row">
            <div class="col-12">
            <div className="row">
                <div className="button-group d-flex flex-wrap mb-2">
                    <div className="col-md-2 col-sm-12 p-1">
                       <button className="btn btn-info w-100 text-white" onClick={() => handleQuickFilter("montajBekleyen")}>Montaj Bekleyen</button>
                    </div>
                    <div className="col-md-2 col-sm-6 p-1">
                        <button className="btn btn-warning w-100 text-white" onClick={() => handleQuickFilter("projeBekleyen")}>Proje Bekleyen</button>
                    </div>
                    <div className="col-md-2 col-sm-6 p-1">
                        <button className="btn btn-primary w-100" onClick={() => handleQuickFilter("randevuBekleyen")}>Randevu Bekleyen</button>
                    </div>
                    <div className="col-md-2 col-sm-6 p-1">
                        <button className="btn btn-success w-100" onClick={() => handleQuickFilter("servisBekleyen")}>Servis Bekleyen</button>
                    </div>
                    <div className="col-md-2 col-sm-6 p-1">
                        <button className="btn btn-secondary w-100" onClick={() => handleQuickFilter("tamamlanan")}>Tamamlanan İşler</button>
                    </div>
                    <div className="col-md-2 col-sm-6 p-1">
                        <button className="btn btn-danger w-100" onClick={() => handleQuickFilter("hatalı")}>Hatalı İşler</button>
                    </div>
                </div>
            </div>
            <button className="btn btn-primary me-2 filter-button" onClick={handleResetFilters}>
                <FaSync />
            </button>
            <button
                className="btn btn-primary filter-button"
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            >
                {isFiltersVisible ? <FaChevronUp /> : <FaChevronDown />} <FaFilter />
            </button>
            <div className="search-container">
                <input
                    type="text"
                className="search-input"
                placeholder="İsim veya telefon numarası ara..."
                value={searchInput}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
                />
            </div>
            </div>
            {isFiltersVisible && (
                <div class="col-12">
                    <div id="filters" className="filters-content mb-3">
                        <div className="row mb-2">
                            <div className="col-md-4">
                                <label className="form-label">Tüketim Numarası</label>
                                <input type="text" placeholder="Tüketim No" className="form-control" value={tuketimNo}
                                       onChange={(e) => setTuketimNo(e.target.value)}/>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">İş Durumu</label>
                                <select value={isDurumu} className="form-select"
                                        onChange={(e) => setisDurumu(e.target.value)}>
                                    <option value="">İş Durumunu Seçiniz</option>
                                        <option value="Sipariş Alındı">Sipariş Alındı</option>
                                        <option value="Montaj Yapıldı">Montaj Yapıldı</option>
                                        <option value="Abonelik Yok">Abonelik Yok</option>
                                        <option value="Proje Onayda">Proje Onayda</option>
                                        <option value="Sözleşme Yok">Sözleşme Yok</option>
                                        <option value="Randevu Bekliyor">Randevu Bekliyor</option>
                                        <option value="Randevu Alındı">Randevu Alındı</option>
                                        <option value="Gaz Açıldı">Gaz Açıldı</option>
                                        <option value="İş Tamamlandı">İş Tamamlandı / Servis Yönlendirildi</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">İş Tipi</label>
                                <select value={isTipi} className="form-select"
                                        onChange={(e) => setIsTipi(e.target.value)}>
                                    <option value="">İş Tipi Seçiniz</option>
                                    <option value="Cihaz Değişimi">Cihaz Değişimi</option>
                                    <option value="Sıfır Proje">Sıfır Proje</option>
                                    <option value="Tekli Satış">Tekli Satış</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <label className="form-label">Sokak Adı</label>
                                <input type="text" placeholder="Sokak Adı" className="form-control" value={sokak}
                                       onChange={(e) => setSokak(e.target.value)}/>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Bina Numarası</label>
                                <input type="text" placeholder="Bina No" className="form-control" value={binaNo}
                                       onChange={(e) => setBinaNo(e.target.value)}/>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-md-6">
                                <label className="form-label">Müşteri Temsilcisi</label>
                                <select value={musteriTemsilcisi} className="form-select"
                                        onChange={(e) => setmusteriTemsilcisi(e.target.value)}>
                                    <option value="">Müşteri Temsilcisi Seçin</option>
                                    <option value="Batuhan Eyüboğlu">Batuhan Eyüboğlu</option>
                                    <option value="Çiler Şahin">Çiler Şahin</option>
                                    <option value="Melisa Şimşek">Melisa Şimşek</option>
                                    <option value="Selin Beyler">Selin Beyler</option>
                                    <option value="Aytekin Demir">Aytekin Demir</option>
                                </select>
                            </div>
                            <div className="col-md-4" style={{ display: "none" }}>
                                <label className="form-label">Hata Sebebi</label>
                                <input type="text" placeholder="Hata Sebebi" className="form-control" value={hataSebebi}
                                       onChange={(e) => sethataSebebi(e.target.value)}/>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Cihaz Markası</label>
                                <select value={cihazMarkasi} className="form-select"
                                        onChange={(e) => setCihazMarkasi(e.target.value)}>
                                    <option value="">Cihaz Markası Seç</option>
                                    <option value="Demirdöküm">Demirdöküm</option>
                                    <option value="Baymak">Baymak</option>
                                    <option value="Eca">Eca</option>
                                    <option value="Buderus">Buderus</option>
                                    <option value="Bosch">Bosch</option>
                                    <option value="Vaillant">Vaillant</option>
                                    <option value="Viessmann">Viessmann</option>
                                </select>
                            </div>
                        </div>

                        {/* Sipariş Tarihi Aralığı */}
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <label className="form-label">Sipariş Tarihi Başlangıç:</label>
                                <input type="date" className="form-control" value={startDate}
                                       onChange={(e) => setStartDate(e.target.value)}/>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Sipariş Tarihi Bitiş:</label>
                                <input type="date" className="form-control" value={endDate}
                                       onChange={(e) => setEndDate(e.target.value)}/>
                            </div>
                        </div>

                        {/* Proje Tarihi Aralığı */}
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <label className="form-label">Randevu Tarihi Başlangıç:</label>
                                <input type="date" className="form-control" value={projestartDate}
                                       onChange={(e) => setprojeStartDate(e.target.value)}/>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Randevu Tarihi Bitiş:</label>
                                <input type="date" className="form-control" value={projeendDate}
                                       onChange={(e) => setprojeEndDate(e.target.value)}/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div class="btn-group float-end" role="group" aria-label="Basic mixed styles example">
                                    <button className="btn btn-primary mt-2" onClick={handleApplyFilters}>
                                        <FaSearch />
                                    </button>
                                    <button className="btn btn-danger mt-2" onClick={handleResetFilters}>
                                        <FaSync />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerFilter;
