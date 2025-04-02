import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Add_customer from "./Add_customer";
import CustomerList from "./CustomerList";
import { FaRegUser, FaBars, FaTimes, FaChartBar, FaUsers, FaUserPlus, FaClipboardList, FaPlusCircle } from "react-icons/fa";
import ChartData from "./charts.jsx";
import ProductManager from "./ProductManager.jsx";
import AddProduct from "./AddProduct.jsx";

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

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <nav className={`sidebar bg-dark text-white vh-100 d-flex flex-column align-items-start p-2 shadow-lg 
                ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

                <button className="btn btn-danger close-btn d-md-none" onClick={() => setIsSidebarOpen(false)}>
                    <FaTimes />
                </button>

                <h4 className="text-center w-100 mb-3">
                    <a href="/dashboard" className="text-white text-decoration-none fw-bold">Admin Panel</a>
                </h4>

                <nav className="nav flex-column w-100">
                    <a className={`nav-link text-white ${activePage === "chartData" ? "active" : ""}`} 
                        onClick={() => handlePageChange("chartData")}>
                        <FaChartBar className="me-2" /> Yönetim Paneli (Veriler)
                    </a>

                    <h6 className="text-white mt-3 fw-bold">Kampanyalı Satışlar</h6>
                    <a className={`nav-link text-white ${activePage === "customerList" ? "active" : ""}`} 
                        onClick={() => handlePageChange("customerList")}>
                        <FaUsers className="me-2" /> Müşteri Listesi
                    </a>
                    <a className={`nav-link text-white ${activePage === "addCustomer" ? "active" : ""}`} 
                        onClick={() => handlePageChange("addCustomer")}>
                        <FaUserPlus className="me-2" /> Müşteri Ekle
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
                            <li><span className="dropdown-item-text fw-bold">Merhaba, {localStorage.getItem("first_name") || "Misafir"}</span></li>
                            <li><button className="dropdown-item text-danger" onClick={handleLogout}>Çıkış Yap</button></li>
                        </ul>
                    </div>
                </nav>

                {/* Dinamik İçerik */}
                <main className="col-md-9 offset-md-3 px-4 bg-light">
                    <div className="mt-3">
                        {activePage === "chartData" && <ChartData />}
                        {activePage === "customerList" && <CustomerList />}
                        {activePage === "addCustomer" && <Add_customer />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
