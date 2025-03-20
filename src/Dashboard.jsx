import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Add_customer from "./Add_customer";
import CustomerList from "./CustomerList";
import { FaBars, FaTimes } from "react-icons/fa";
import UpcomingAppointments from "./upcoming_appointment.jsx";
import ChartData from "./charts.jsx";



const Dashboard = () => {
    const [activePage, setActivePage] = useState("chartData");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();
    const first_name = localStorage.getItem("first_name");
    const last_name = localStorage.getItem("last_name");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        navigate("/"); // Giriş sayfasına yönlendir
    };

    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar (Masaüstü için açık, mobil için açılıp kapanabilir) */}
                <nav className={`sidebar bg-dark text-white vh-100 d-flex flex-column align-items-start p-3 
                    ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

                    {/* Kapatma Butonu (Mobil için) */}
                    <button
                        className="btn btn-danger close-btn d-md-none"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <FaTimes/>
                    </button>

                    <h4 className="text-center w-100">
                        <a href="/dashboard" className="text-white text-decoration-none">Admin Panel</a>
                    </h4>

                    <nav className="nav flex-column w-100">
                        <a href="#" className={`nav-link text-white ${activePage === "chartData" ? "active" : ""}`} onClick={() => setActivePage("chartData")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                className="bi bi-person-plus-fill" viewBox="0 0 16 16">
                                <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                <path fill-rule="evenodd"
                                    d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                            Veriler
                        </a>
                        <a href="#" className={`nav-link text-white ${activePage === "addCustomer" ? "active" : ""}`} onClick={() => setActivePage("addCustomer")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-person-plus-fill" viewBox="0 0 16 16">
                                <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                <path fill-rule="evenodd"
                                      d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                            Yeni Müşteri Ekle
                        </a>
                        <a href="#" className={`nav-link text-white ${activePage === "customerList" ? "active" : ""}`} onClick={() => setActivePage("customerList")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-list-task" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z"/>
                                <path
                                    d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z"/>
                                <path fill-rule="evenodd"
                                      d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z"/>
                            </svg>
                            Müşteri Listesi
                        </a>
                        <a href="#" className={`nav-link text-white ${activePage === "upcomingAppointments" ? "active" : ""}`}
                           onClick={() => setActivePage("upcomingAppointments")}>
                            Yaklaşan Randevular
                        </a>
                    </nav>
                    <div className="dropdown">
                        <button 
                            className="btn btn-secondary dropdown-toggle" 
                            type="button" 
                            onClick={() => setIsOpen(!isOpen)}
                            aria-expanded={isOpen}
                        >
                            Merhaba, <b>{first_name ? first_name : "Misafir"}</b>
                        </button>
                        {isOpen && (
                            <ul className="dropdown-menu show" style={{ position: "absolute" }}>
                                <li>
                                    <button 
                                        className="dropdown-item text-danger" 
                                        onClick={handleLogout}
                                    >
                                        Çıkış Yap
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                </nav>

                {/* Ana İçerik */}
                <main className="col-md-9 offset-md-3 px-4 bg-light">
                    {/* Sidebar Açma Butonu (Mobil için) */}
                    <button className="btn btn-primary d-md-none mt-2" onClick={() => setIsSidebarOpen(true)}>
                        <FaBars/>
                    </button>
                    <div className="mt-3">
                        {activePage === "chartData" && <ChartData/>}
                        {activePage === "addCustomer" && <Add_customer/>}
                        {activePage === "customerList" && <CustomerList/>}
                        {activePage === "upcomingAppointments" && <UpcomingAppointments/>}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
