import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams  } from "react-router-dom";
import { Modal, Button, Form } from 'react-bootstrap';
import { FaUserCircle, FaBars, FaTimes, FaChartBar, FaUsers, FaUserPlus, FaClipboardList, FaPlusCircle, FaPlusSquare ,FaBox, FaDollarSign  } from "react-icons/fa";
import Tooltip from '@mui/material/Tooltip';
import QuickCustomer from "./add_customer";
import CustomerList from "./CustomerList";
import ChartData from "./charts.jsx";
import StockManagement from "./StockManagement.jsx";
import StockAndCategoryManagement from "./AddStock.jsx";
import AddCustomer from "./AddCustomer.jsx";
import CustomerList2 from "./CustomerList2.jsx";
import CreateQuote from "./CreateQuote.jsx";
import ListQuotes from "./ListQuotes.jsx";
import CustomerDetail from "./CustomerDetail.jsx";
import CreateOrder from "./CreateOrder.jsx";
import ListOrders from "./ListOrders.jsx";
import CustomerBalances from "./CustomerBalances.jsx";

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
            <nav className={`sidebar bg-white text-white vh-100 d-flex flex-column align-items-start p-0 shadow-sm 
                ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

                <button className="btn btn-danger close-btn d-md-none" onClick={() => setIsSidebarOpen(false)}>
                    <FaTimes />
                </button>

                <nav className="nav flex-column w-100">
                    {/* Yönetim Paneli (Veriler) */}
                    <Tooltip title="Yönetim Planı" placement="right">
                    <a className={`nav-link text-white ${activePage === "chartData" ? "active" : ""}`} 
                        onClick={() => handlePageChange("chartData")}
                        >
                        <FaChartBar className="me-2" /> <span className="sidebarLabel">Yönetim Paneli (Veriler)</span>
                    </a>
                    </Tooltip>
                    <hr/>
                    <Tooltip title="Müşteri Listesi" placement="right">
                    <a className={`nav-link text-white ${activePage === "customerList" ? "active" : ""}`} 
                        onClick={() => handlePageChange("customerList")}>
                        <FaUsers className="me-2" /> <span className="sidebarLabel">Müşteri Listesi</span>
                    </a>
                    </Tooltip>
                    <Tooltip title="Müşteri Ekle" placement="right">
                    <a className={`nav-link text-white ${activePage === "quickCustomer" ? "active" : ""}`} 
                        onClick={() => handlePageChange("quickCustomer")}>
                        <FaUserPlus className="me-2" /> <span className="sidebarLabel">Müşteri Ekle</span>
                    </a>
                    </Tooltip>

                    <hr/>
                    <Tooltip title="Stok Takibi" placement="right">
                    <a className={`nav-link text-white ${activePage === "stockManagement" ? "active" : ""}`} 
                        onClick={() => handlePageChange("stockManagement")}>
                        <FaBox className="me-2" /> <span className="sidebarLabel">Stok Takibi</span>
                    </a>
                    </Tooltip>
                    <Tooltip title="Stok Oluştur" placement="right">
                    <a className={`nav-link text-white ${activePage === "addStock" ? "active" : ""}`} 
                        onClick={() => handlePageChange("addStock")}>
                        <FaPlusSquare className="me-2" /> <span className="sidebarLabel">Stok Oluştur</span>
                    </a>
                    </Tooltip>

                    <hr/>
                    <Tooltip title="Cari Listesi" placement="right">
                    <a className={`nav-link text-white ${activePage === "listCustomer" ? "active" : ""}`} 
                        onClick={() => handlePageChange("listCustomer")}>
                        <FaDollarSign className="me-2" /> <span className="sidebarLabel">Cari Listesi</span>
                    </a>
                    </Tooltip>
                    <Tooltip title="Cari Oluştur" placement="right">
                    <a className={`nav-link text-white ${activePage === "addCustomer2" ? "active" : ""}`} 
                        onClick={() => handlePageChange("addCustomer2")}>
                        <FaPlusSquare className="me-2" /> <span className="sidebarLabel">Cari Oluştur</span>
                    </a>
                    </Tooltip>

                    <hr/>
                    <Tooltip title="Teklif Listesi" placement="right">
                    <a className={`nav-link text-white ${activePage === "listQuotes" ? "active" : ""}`} 
                        onClick={() => handlePageChange("listQuotes")}>
                        <FaClipboardList className="me-2" /> <span className="sidebarLabel">Teklif Listesi</span>
                    </a>
                    </Tooltip>
                    <Tooltip title="Teklif Oluştur" placement="right">
                    <a className={`nav-link text-white ${activePage === "addQuote" ? "active" : ""}`} 
                        onClick={() => handlePageChange("addQuote")}>
                        <FaPlusSquare className="me-2" /> <span className="sidebarLabel">Teklif Oluştur</span>
                    </a>
                    </Tooltip>
                    <hr/>
                    <Tooltip title="Sipariş Listele" placement="right">
                    <a className={`nav-link text-white ${activePage === "listOrder" ? "active" : ""}`} 
                        onClick={() => handlePageChange("listOrder")}>
                        <FaPlusSquare className="me-2" /> <span className="sidebarLabel">Sipariş Listesi</span>
                    </a>
                    </Tooltip>
                    <Tooltip title="Sipariş Oluştur" placement="right">
                    <a className={`nav-link text-white ${activePage === "addOrder" ? "active" : ""}`} 
                        onClick={() => handlePageChange("addOrder")}>
                        <FaPlusSquare className="me-2" /> <span className="sidebarLabel">Sipariş Oluştur</span>
                    </a>
                    </Tooltip>
                    <hr/>
                    <Tooltip title="Bakiye Listesi" placement="right">
                    <a className={`nav-link text-white ${activePage === "listBalances" ? "active" : ""}`} 
                        onClick={() => handlePageChange("listBalances")}>
                        <FaPlusSquare className="me-2" /> <span className="sidebarLabel">Bakiye Listesi</span>
                    </a>
                    </Tooltip>
                </nav>
            </nav>

            {/* Ana İçerik */}
            <div className="main-content w-100">
                {/* Navbar */}
                <nav className="navbar navbar-expand-lg navbar-light bg-primary shadow-sm px-4">
                    <button className="btn btn-primary d-md-none" onClick={() => setIsSidebarOpen(true)}>
                        <FaBars />
                    </button>
                    <img src="../src/assets/kobiGo-logo-w.png" alt="" srcset="" width="149px"/>
                    <div className="dropdown ms-auto">
                        <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <FaUserCircle size={24} color='white'/>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><span className="dropdown-item-text fw-bold">Merhaba, {localStorage.getItem("name") || "Misafir"}</span></li>
                            <li><button className="dropdown-item text-danger" onClick={handleLogout}>Çıkış Yap</button></li>
                            <li><button className="dropdown-item" variant="info" onClick={fetchActivityLog}>Logları Görüntüle</button></li>
                        </ul>
                    </div>
                </nav>

                {/* Dinamik İçerik */}
                <main className="col-md-9 offset-md-3 px-4">
                    <div className="mt-3">
                    {location.pathname.includes("chartData") && <ChartData />}
                    {location.pathname.includes("customerList") && <CustomerList />}
                    {location.pathname.includes("quickCustomer") && <QuickCustomer />}
                    {location.pathname.includes("stockManagement") && <StockManagement />}
                    {location.pathname.includes("addStock") && <StockAndCategoryManagement />}
                    {location.pathname.includes("listCustomer") && !location.pathname.includes("listCustomer/") && <CustomerList2 />}
                    {location.pathname.includes("addCustomer2") && <AddCustomer />}
                    {location.pathname.includes("listQuotes") && <ListQuotes />}
                    {location.pathname.includes("addQuote") && <CreateQuote />}
                    {location.pathname.includes("listCustomer/") && <CustomerDetail />}
                    {location.pathname.includes("listOrder") && <ListOrders />}
                    {location.pathname.includes("addOrder") && <CreateOrder />}
                    {location.pathname.includes("listBalances") && <CustomerBalances />}
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
