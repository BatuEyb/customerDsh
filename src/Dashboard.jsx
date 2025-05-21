import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import { FaUserCircle, FaBars, FaTimes, FaTools, FaListAlt, FaUserPlus , FaUsers , FaPlusSquare , FaWarehouse , FaShoppingBasket , FaCartPlus , FaMoneyBillWave , FaBoxOpen , FaChartPie   } from "react-icons/fa";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { apiFetch } from "./api.js";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Tooltip from '@mui/material/Tooltip';
import ChartData from "./Charts.jsx";
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
import UserModal from "./components/UserModal.jsx";
import InstallationsList from "./InstallationsList.jsx";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("chartData"); // State'i burada tanımlıyoruz

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (q) => {
    setQuery(q);
    if (q.length < 2) {
      setOptions([]);
      return;
    }
    setIsLoading(true);
    apiFetch(`searchCustomer.php?search=${encodeURIComponent(q)}`, {
        credentials: 'include'
      })
      .then(async (r) => {
        const text = await r.text();
        console.log("Ham dönen veri:", text);
        try {
          const json = JSON.parse(text);
          if (json.success) {
            console.log("Gelen müşteri listesi:", json.customers);
            const normalized = json.customers.map(c => ({
              ...c,
              name: c.name || c.company_name || c.full_name || "İsimsiz"
            }));
            setOptions(normalized);
          } else {
            console.warn("Başarısız json:", json);
          }
        } catch (e) {
          console.error("JSON parse hatası:", e, text);
        }
      })
      .catch(error => {
        console.error("API HATASI:", error);
      })
      .finally(() => setIsLoading(false));
  };

  const handleSelect = (selected) => {
    if (selected.length > 0) {
      navigate(`/dashboard/listCustomer/${selected[0].id}`);
    }
  };

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
            const response = await apiFetch('get_activity_log.php', {
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

    const handleSave = async (form) => {
        const endpoint = editingUser
          ? `user_api.php?action=update&id=${editingUser.id}`
          : 'user_api.php?action=add';
    
        const res = await apiFetch(endpoint, {
          credentials: 'include',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
    
        const result = await res.json();
        alert(result.message || result.error);
        setShowModal(false);
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
                        <FaChartPie  className="me-2" /> <span className="sidebarLabel">Yönetim Paneli (Veriler)</span>
                    </a>
                    </Tooltip>
                    <hr/>
                    <Tooltip title="Stok Takibi" placement="right">
                    <a className={`nav-link text-white ${activePage === "stockManagement" ? "active" : ""}`} 
                        onClick={() => handlePageChange("stockManagement")}>
                        <FaWarehouse  className="me-2" /> <span className="sidebarLabel">Stok Takibi</span>
                    </a>
                    </Tooltip>
                    <Tooltip title="Stok Oluştur" placement="right">
                    <a className={`nav-link text-white ${activePage === "addStock" ? "active" : ""}`} 
                        onClick={() => handlePageChange("addStock")}>
                        <FaBoxOpen className="me-2" /> <span className="sidebarLabel">Stok Oluştur</span>
                    </a>
                    </Tooltip>

                    <hr/>
                    <Tooltip title="Cari Listesi" placement="right">
                    <a className={`nav-link text-white ${activePage === "listCustomer" ? "active" : ""}`} 
                        onClick={() => handlePageChange("listCustomer")}>
                        <FaUsers className="me-2" /> <span className="sidebarLabel">Cari Listesi</span>
                    </a>
                    </Tooltip>
                    <Tooltip title="Cari Oluştur" placement="right">
                    <a className={`nav-link text-white ${activePage === "addCustomer2" ? "active" : ""}`} 
                        onClick={() => handlePageChange("addCustomer2")}>
                        <FaUserPlus  className="me-2" /> <span className="sidebarLabel">Cari Oluştur</span>
                    </a>
                    </Tooltip>

                    <hr/>
                    <Tooltip title="Teklif Listesi" placement="right">
                    <a className={`nav-link text-white ${activePage === "listQuotes" ? "active" : ""}`} 
                        onClick={() => handlePageChange("listQuotes")}>
                        <FaListAlt className="me-2" /> <span className="sidebarLabel">Teklif Listesi</span>
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
                        <FaShoppingBasket className="me-2" /> <span className="sidebarLabel">Sipariş Listesi</span>
                    </a>
                    </Tooltip>
                    <Tooltip title="Montaj Listele" placement="right">
                    <a className={`nav-link text-white ${activePage === "listInstallations" ? "active" : ""}`} 
                        onClick={() => handlePageChange("listInstallations")}>
                        <FaTools className="me-2" /> <span className="sidebarLabel">Montaj Listesi</span>
                    </a>
                    </Tooltip>
                    <Tooltip title="Sipariş Oluştur" placement="right">
                    <a className={`nav-link text-white ${activePage === "addOrder" ? "active" : ""}`} 
                        onClick={() => handlePageChange("addOrder")}>
                        <FaCartPlus className="me-2" /> <span className="sidebarLabel">Sipariş Oluştur</span>
                    </a>
                    </Tooltip>
                    <hr/>
                    <Tooltip title="Bakiye Listesi" placement="right">
                    <a className={`nav-link text-white ${activePage === "listBalances" ? "active" : ""}`} 
                        onClick={() => handlePageChange("listBalances")}>
                        <FaMoneyBillWave className="me-2" /> <span className="sidebarLabel">Bakiye Listesi</span>
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
                    <a href="/dashboard">
                        <img src="../src/assets/kobiGo-logo-w.png" alt="" srcSet="" width="149px"/>
                    </a>
                    
                    {/* ————— Arama Çubuğu ————— */}
                    <div className="mx-auto" style={{ width: 1200 }}>
                    <AsyncTypeahead
                        id="customer-search"
                        isLoading={isLoading}
                        labelKey="name"
                        minLength={2}
                        onSearch={handleSearch}
                        options={options}
                        onChange={handleSelect}
                        placeholder="🔍 Müşteri ara..."
                        className="custom-typeahead"
                        renderMenuItemChildren={(opt, props) => (
                        <div className="p-3 border-bottom">
                            <strong className="d-block">{opt.name}</strong>
                            <small className="text-muted">Telefon : {opt.phone}</small><br />
                            <small className="text-muted">TC : {opt.tc_identity_number} / VN : {opt.tax_number}</small>
                        </div>
                        )}
                    />
                    </div>

                    <div className="dropdown ms-auto">
                        <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <FaUserCircle size={24} color='white'/>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><span className="dropdown-item-text fw-bold">Merhaba, {localStorage.getItem("name") || "Misafir"}</span></li>
                            <li><button className="dropdown-item text-danger" onClick={handleLogout}>Çıkış Yap</button></li>
                            <li><button className="dropdown-item" variant="info" onClick={fetchActivityLog}>Logları Görüntüle</button></li>
                            <li><button className="dropdown-item" onClick={() => { setEditingUser(null); setShowModal(true); }}>Yeni Kullanıcı</button></li>
                        </ul>
                    </div>
                </nav>

                {/* Dinamik İçerik */}
                <main className="col-md-9 offset-md-3 px-4">
                    <div className="mt-3">
                    {location.pathname.includes("chartData") && <ChartData />}
                    {location.pathname.includes("stockManagement") && <StockManagement />}
                    {location.pathname.includes("addStock") && <StockAndCategoryManagement />}
                    {location.pathname.includes("listCustomer") && !location.pathname.includes("listCustomer/") && <CustomerList2 />}
                    {location.pathname.includes("addCustomer2") && <AddCustomer />}
                    {location.pathname.includes("listQuotes") && <ListQuotes />}
                    {location.pathname.includes("addQuote") && <CreateQuote />}
                    {location.pathname.includes("listCustomer/") && <CustomerDetail />}
                    {location.pathname.includes("listOrder") && <ListOrders />}
                    {location.pathname.includes("listInstallations") && <InstallationsList />}
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
                <UserModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                    user={editingUser}
                />

            </div>
        </div>
    );
};

export default Dashboard;
