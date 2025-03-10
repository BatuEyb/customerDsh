import { useState } from "react";
import Add_customer from "./Add_customer";
import CustomerList from "./CustomerList";
import { FaBars, FaTimes } from "react-icons/fa";
import UpcomingAppointments from "./upcoming_appointment.jsx";
import CompletedWorks from "./CompletedWorks.jsx";
import FaultyWork from "./FaultyWork.jsx";

const Dashboard = () => {
    const [activePage, setActivePage] = useState("addCustomer");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                        <a href="#" className={`nav-link text-white ${activePage === "completedWorks" ? "active" : ""}`} onClick={() => setActivePage("completedWorks")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-check-lg" viewBox="0 0 16 16">
                                <path
                                    d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                            </svg>
                            Tamamlanan İşler
                        </a>
                        <a href="#" className={`nav-link text-white ${activePage === "faultyWorks" ? "active" : ""}`} onClick={() => setActivePage("faultyWorks")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                <path
                                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                            </svg>
                            Hatalı İşler
                        </a>

                        <a href="#" className={`nav-link text-white ${activePage === "customerList" ? "active" : ""}`} onClick={() => setActivePage("faultyWorks")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-building-fill-gear" viewBox="0 0 16 16">
                                <path
                                    d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7.256A4.5 4.5 0 0 0 12.5 8a4.5 4.5 0 0 0-3.59 1.787A.5.5 0 0 0 9 9.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .39-.187A4.5 4.5 0 0 0 8.027 12H6.5a.5.5 0 0 0-.5.5V16H3a1 1 0 0 1-1-1zm2 1.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m3 0v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5M7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5M4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/>
                                <path
                                    d="M11.886 9.46c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
                            </svg>
                            Proje Bekleyen İşler
                        </a>
                        <a href="#" className={`nav-link text-white ${activePage === "customerList" ? "active" : ""}`} onClick={() => setActivePage("faultyWorks")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                <path
                                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                            </svg>
                            Montaj Bekleyen İşler
                        </a>
                        <a href="#" className={`nav-link text-white ${activePage === "customerList" ? "active" : ""}`} onClick={() => setActivePage("faultyWorks")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                <path
                                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                            </svg>
                            Randevu Bekleyen İşler
                        </a>
                        <a href="#" className={`nav-link text-white ${activePage === "customerList" ? "active" : ""}`} onClick={() => setActivePage("faultyWorks")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                <path
                                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                            </svg>
                            Servis Bekleyen İşler
                        </a>
                    </nav>
                    <div className="row">
                        <div className="col-12">
                            <span>Merhaba, </span><span>Batuhan</span>
                            <a href="#">Çıkış Yap</a>
                        </div>
                    </div>
                </nav>

                {/* Ana İçerik */}
                <main className="col-md-9 offset-md-3 px-4 bg-light">
                    {/* Sidebar Açma Butonu (Mobil için) */}
                    <button className="btn btn-primary d-md-none mt-2" onClick={() => setIsSidebarOpen(true)}>
                        <FaBars/>
                    </button>

                    <h2 className="mt-4">Hoş Geldiniz!</h2>
                    <div className="mt-3">
                        {activePage === "addCustomer" && <Add_customer/>}
                        {activePage === "customerList" && <CustomerList/>}
                        {activePage === "upcomingAppointments" && <UpcomingAppointments/>}
                        {activePage === "completedWorks" && <CompletedWorks/>}
                        {activePage === "faultyWorks" && <FaultyWork/>}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
