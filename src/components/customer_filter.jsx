import React, { useState } from "react";
import './customer_filter.css';
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
    const [musteriTemsilcisi, setmusteriTemsilcisi] = useState('');
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
        onFilterChange({ tuketimNo, sokak, binaNo, isTipi, cihazMarkasi, isDurumu, startDate, endDate, musteriTemsilcisi });
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
        setmusteriTemsilcisi('');

        onFilterChange({
            tuketimNo: '', sokak: '', binaNo: '', isTipi: '',
            cihazMarkasi: '', isDurumu: '', startDate: '',
            endDate: '', musteriTemsilcisi: ''
        });
    };

    return (
        <div className="filters-container mt-3 row">
            <div class="col-12">
            <button
                className="btn btn-primary filter-button"
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            >
                {isFiltersVisible ? <div><img src="src/assets/svg/caret-up-fill.svg"/> <img
                        src="src/assets/svg/filter-square-fill.svg"/></div> :
                    <div><img src="src/assets/svg/caret-down-fill.svg"/> <img
                        src="src/assets/svg/filter-square-fill.svg"/></div>}
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
                                    <option value="Proje Onayda">Proje Onayda</option>
                                    <option value="Randevu Alındı">Randevu Alındı</option>
                                    <option value="Proje Onaylandı">Proje Onaylandı</option>
                                    <option value="Proje Red">Proje Red</option>
                                    <option value="Servis Yönlendirildi">Servis Yönlendirildi</option>
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

                        <div className="row">
                            <div className="col-md-12">
                                <div class="btn-group float-end" role="group" aria-label="Basic mixed styles example">
                                    <button className="btn btn-primary mt-2" onClick={handleApplyFilters}>
                                        <img src="src/assets/svg/search.svg"/>
                                    </button>
                                    <button className="btn btn-danger mt-2" onClick={handleResetFilters}>
                                        <img src="src/assets/svg/arrow-clockwise.svg"/>
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
