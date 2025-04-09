import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal, Button, Form } from 'react-bootstrap';
import Add_customer from "./Add_customer";
import CustomerList from "./CustomerList";
import { FaRegUser, FaBars, FaTimes, FaChartBar, FaUsers, FaUserPlus, FaClipboardList, FaPlusCircle, FaPlusSquare ,FaBox } from "react-icons/fa";
import ChartData from "./charts.jsx";
import StockManagement from "./StockManagement.jsx";
import StockAndCategoryManagement from "./AddStock.jsx";
import AddCustomer from "./AddCustomer.jsx";
import CustomerList2 from "./CustomerList2.jsx";
import CreateQuote from "./CreateQuote.jsx";
import ListQuotes from "./ListQuotes.jsx";

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState("chartData"); // State'i burada tanımlıyoruz

    useEffect(() => {
        const path = location.pathname.replace("/dashboard/", "") || "chartData";
        setActivePage(path); // State'i güncelliyoruz
    }, [location]);

    const handlePageChange = (page) => {
        navigate(`/dashboard/${page}`); // URL'yi değiştir
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        navigate("/");
    };

    const [showLogModal, setShowLogModal] = useState(false);
    const [activityLog, setActivityLog] = useState('');

    const fetchActivityLog = async () => {
        try {
            const response = await fetch('http://localhost/customerDsh/src/api/get_activity_log.php', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setActivityLog(data.log);
                setShowLogModal(true);
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert('Loglar yüklenemedi!');
        }
    };


    return (
        <div className="d-flex">
            {/* Sidebar */}
            <nav className={`sidebar bg-dark text-white vh-100 d-flex flex-column align-items-start p-2 shadow-lg 
                ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

                <button className="btn btn-danger close-btn d-md-none" onClick={() => setIsSidebarOpen(false)}>
                    <FaTimes />
                </button>

                <h4 className="text-center w-100 mb-3">
                    Admin Paneli
                </h4>

                <nav className="nav flex-column w-100">
                    <a className={`nav-link text-white ${activePage === "chartData" ? "active" : ""}`} 
                        onClick={() => handlePageChange("chartData")}>
                        <FaChartBar className="me-2" /> Yönetim Paneli (Veriler)
                    </a>

                    <h6 className="text-white mt-3 fw-bold">Bireysel Müşteriler</h6>
                    <a className={`nav-link text-white ${activePage === "customerList" ? "active" : ""}`} 
                        onClick={() => handlePageChange("customerList")}>
                        <FaUsers className="me-2" /> Müşteri Listesi
                    </a>
                    <a className={`nav-link text-white ${activePage === "addCustomer" ? "active" : ""}`} 
                        onClick={() => handlePageChange("addCustomer")}>
                        <FaUserPlus className="me-2" /> Müşteri Ekle
                    </a>

                    <h6 className="text-white mt-3 fw-bold">Stok Yönetimi</h6>
                    <a className={`nav-link text-white ${activePage === "stockManagement" ? "active" : ""}`} 
                        onClick={() => handlePageChange("stockManagement")}>
                        <FaBox  className="me-2" /> Stok Takibi
                    </a>
                    <a className={`nav-link text-white ${activePage === "addStock" ? "active" : ""}`} 
                        onClick={() => handlePageChange("addStock")}>
                        <FaPlusSquare  className="me-2" /> Stok Oluştur
                    </a>

                    <h6 className="text-white mt-3 fw-bold">Cari Yönetimi</h6>
                    <a className={`nav-link text-white ${activePage === "listCustomer2" ? "active" : ""}`} 
                        onClick={() => handlePageChange("listCustomer2")}>
                        <FaBox  className="me-2" /> Cari Listesi
                    </a>
                    <a className={`nav-link text-white ${activePage === "addCustomer2" ? "active" : ""}`} 
                        onClick={() => handlePageChange("addCustomer2")}>
                        <FaPlusSquare  className="me-2" /> Cari Oluştur
                    </a>

                    <h6 className="text-white mt-3 fw-bold">Teklif Yönetimi</h6>
                    <a className={`nav-link text-white ${activePage === "listQuotes" ? "active" : ""}`} 
                        onClick={() => handlePageChange("listQuotes")}>
                        <FaBox  className="me-2" /> Teklif Listesi
                    </a>
                    <a className={`nav-link text-white ${activePage === "addQuote" ? "active" : ""}`} 
                        onClick={() => handlePageChange("addQuote")}>
                        <FaPlusSquare  className="me-2" /> Teklif Oluştur
                    </a>
                </nav>
            </nav>

            {/* Ana İçerik */}
            <div className="main-content w-100">
                {/* Navbar */}
                <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm p-2">
                    <button className="btn btn-primary d-md-none" onClick={() => setIsSidebarOpen(true)}>
                        <FaBars />
                    </button>
                    <div className="dropdown ms-auto">
                        <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <FaRegUser />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><span className="dropdown-item-text fw-bold">Merhaba, {localStorage.getItem("name") || "Misafir"}</span></li>
                            <li><button className="dropdown-item text-danger" onClick={handleLogout}>Çıkış Yap</button></li>
                            <li><button className="dropdown-item" variant="info" onClick={fetchActivityLog}>Logları Görüntüle</button></li>
                        </ul>
                    </div>
                </nav>

                {/* Dinamik İçerik */}
                <main className="col-md-9 offset-md-3 px-4 bg-light">
                    <div className="mt-3">
                        {activePage === "chartData" && <ChartData />}
                        {activePage === "customerList" && <CustomerList />}
                        {activePage === "addCustomer" && <Add_customer />}
                        {activePage === "stockManagement" && <StockManagement />}
                        {activePage === "addStock" && <StockAndCategoryManagement />}
                        {activePage === "listCustomer2" && <CustomerList2 />}
                        {activePage === "addCustomer2" && <AddCustomer />}
                        {activePage === "listQuotes" && <ListQuotes />}
                        {activePage === "addQuote" && <CreateQuote />}
                    </div>
                </main>
                <Modal show={showLogModal} onHide={() => setShowLogModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Aktivite Logları</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <pre style={{ whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto' }}>
                            {activityLog}
                        </pre>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowLogModal(false)}>Kapat</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default Dashboard;
