import { useEffect, useState } from "react";
import { BarChart, Bar,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend} from "recharts";
import 'bootstrap/dist/css/bootstrap.min.css';

function Card({ children, className }) {
  return (
    <div className={`card shadow-sm mb-3 ${className}`}>
      <div className="card-body">{children}</div>
    </div>
  );
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FFF", "#FF5733"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost/customerDsh/src/api/dashboard_data.php")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error.message}</p>;

  // Her 3 cihazı bir grup haline getirme
  const chunkedDevices = [];
  for (let i = 0; i < data.device_counts.length; i += 3) {
    chunkedDevices.push(data.device_counts.slice(i, i + 3));
  }
  
  return (
    <div className="mt-4">
      <div className="row">
        <div className="col-md-4">
          <Card className="border border-primary border-2">
            <h2 className="h5">Toplam Müşteri</h2>
            <p className="display-4">{data.total_customers}</p>
            <span className="cardIcons">
                <svg width="114px" height="114px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.5 7.5C15.5 9.433 13.933 11 12 11C10.067 11 8.5 9.433 8.5 7.5C8.5 5.567 10.067 4 12 4C13.933 4 15.5 5.567 15.5 7.5Z" fill="#0d6efd"></path> <path opacity="0.4" d="M19.5 7.5C19.5 8.88071 18.3807 10 17 10C15.6193 10 14.5 8.88071 14.5 7.5C14.5 6.11929 15.6193 5 17 5C18.3807 5 19.5 6.11929 19.5 7.5Z" fill="#0d6efd"></path> <path opacity="0.4" d="M4.5 7.5C4.5 8.88071 5.61929 10 7 10C8.38071 10 9.5 8.88071 9.5 7.5C9.5 6.11929 8.38071 5 7 5C5.61929 5 4.5 6.11929 4.5 7.5Z" fill="#0d6efd"></path> <path d="M18 16.5C18 18.433 15.3137 20 12 20C8.68629 20 6 18.433 6 16.5C6 14.567 8.68629 13 12 13C15.3137 13 18 14.567 18 16.5Z" fill="#0d6efd"></path> <path opacity="0.4" d="M22 16.5C22 17.8807 20.2091 19 18 19C15.7909 19 14 17.8807 14 16.5C14 15.1193 15.7909 14 18 14C20.2091 14 22 15.1193 22 16.5Z" fill="#0d6efd"></path> <path opacity="0.4" d="M2 16.5C2 17.8807 3.79086 19 6 19C8.20914 19 10 17.8807 10 16.5C10 15.1193 8.20914 14 6 14C3.79086 14 2 15.1193 2 16.5Z" fill="#0d6efd"></path> </g></svg>
            </span>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="border border-success border-2">
            <h2 className="h5">Tamamlanan İşler</h2>
            <p className="display-4">{data.completed_jobs_count}</p>
            <span className="cardIcons">
                <svg width="114px" height="114px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M9.59236 3.20031C9.34886 3.40782 9.2271 3.51158 9.09706 3.59874C8.79896 3.79854 8.46417 3.93721 8.1121 4.00672C7.95851 4.03705 7.79903 4.04977 7.48008 4.07522L7.48007 4.07523C6.67869 4.13918 6.278 4.17115 5.94371 4.28923C5.17051 4.56233 4.56233 5.17051 4.28923 5.94371C4.17115 6.278 4.13918 6.67869 4.07523 7.48007L4.07522 7.48008C4.04977 7.79903 4.03705 7.95851 4.00672 8.1121C3.93721 8.46417 3.79854 8.79896 3.59874 9.09706C3.51158 9.2271 3.40781 9.34887 3.20028 9.59239L3.20027 9.5924C2.67883 10.2043 2.4181 10.5102 2.26522 10.8301C1.91159 11.57 1.91159 12.43 2.26522 13.1699C2.41811 13.4898 2.67883 13.7957 3.20027 14.4076L3.20031 14.4076C3.4078 14.6511 3.51159 14.7729 3.59874 14.9029C3.79854 15.201 3.93721 15.5358 4.00672 15.8879C4.03705 16.0415 4.04977 16.201 4.07522 16.5199L4.07523 16.5199C4.13918 17.3213 4.17115 17.722 4.28923 18.0563C4.56233 18.8295 5.17051 19.4377 5.94371 19.7108C6.27799 19.8288 6.67867 19.8608 7.48 19.9248L7.48008 19.9248C7.79903 19.9502 7.95851 19.963 8.1121 19.9933C8.46417 20.0628 8.79896 20.2015 9.09706 20.4013C9.22711 20.4884 9.34887 20.5922 9.5924 20.7997C10.2043 21.3212 10.5102 21.5819 10.8301 21.7348C11.57 22.0884 12.43 22.0884 13.1699 21.7348C13.4898 21.5819 13.7957 21.3212 14.4076 20.7997C14.6511 20.5922 14.7729 20.4884 14.9029 20.4013C15.201 20.2015 15.5358 20.0628 15.8879 19.9933C16.0415 19.963 16.201 19.9502 16.5199 19.9248L16.52 19.9248C17.3213 19.8608 17.722 19.8288 18.0563 19.7108C18.8295 19.4377 19.4377 18.8295 19.7108 18.0563C19.8288 17.722 19.8608 17.3213 19.9248 16.52L19.9248 16.5199C19.9502 16.201 19.963 16.0415 19.9933 15.8879C20.0628 15.5358 20.2015 15.201 20.4013 14.9029C20.4884 14.7729 20.5922 14.6511 20.7997 14.4076C21.3212 13.7957 21.5819 13.4898 21.7348 13.1699C22.0884 12.43 22.0884 11.57 21.7348 10.8301C21.5819 10.5102 21.3212 10.2043 20.7997 9.5924C20.5922 9.34887 20.4884 9.22711 20.4013 9.09706C20.2015 8.79896 20.0628 8.46417 19.9933 8.1121C19.963 7.95851 19.9502 7.79903 19.9248 7.48008L19.9248 7.48C19.8608 6.67867 19.8288 6.27799 19.7108 5.94371C19.4377 5.17051 18.8295 4.56233 18.0563 4.28923C17.722 4.17115 17.3213 4.13918 16.5199 4.07523L16.5199 4.07522C16.201 4.04977 16.0415 4.03705 15.8879 4.00672C15.5358 3.93721 15.201 3.79854 14.9029 3.59874C14.7729 3.51158 14.6511 3.40781 14.4076 3.20027C13.7957 2.67883 13.4898 2.41811 13.1699 2.26522C12.43 1.91159 11.57 1.91159 10.8301 2.26522C10.5102 2.4181 10.2043 2.67883 9.5924 3.20027L9.59236 3.20031Z" fill="#198754"></path> <path d="M16.3736 9.86298C16.6914 9.54515 16.6914 9.02984 16.3736 8.71201C16.0557 8.39417 15.5404 8.39417 15.2226 8.71201L10.3723 13.5623L8.77753 11.9674C8.4597 11.6496 7.94439 11.6496 7.62656 11.9674C7.30873 12.2853 7.30873 12.8006 7.62656 13.1184L9.79685 15.2887C10.1147 15.6065 10.63 15.6065 10.9478 15.2887L16.3736 9.86298Z" fill="#198754"></path> </g></svg>
            </span>
          </Card>
        </div>

        {/* New Section for Total Faulty Jobs */}
        <div className="col-md-4">
          <Card className="border border-danger border-2">
            <h2 className="h5">Toplam Hatalı İşler</h2>
            <p className="display-4">{data.hasErrorWorks}</p>
            <span className="cardIcons">
            <svg width="114px" height="114px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M12 3C9.68925 3 8.23007 5.58716 5.31171 10.7615L4.94805 11.4063C2.52291 15.7061 1.31034 17.856 2.40626 19.428C3.50217 21 6.21356 21 11.6363 21H12.3637C17.7864 21 20.4978 21 21.5937 19.428C22.6897 17.856 21.4771 15.7061 19.0519 11.4063L18.6883 10.7615C15.7699 5.58716 14.3107 3 12 3Z" fill="#dc3545"></path> <path d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V8C11.25 7.58579 11.5858 7.25 12 7.25Z" fill="#dc3545"></path> <path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="#dc3545"></path> </g></svg>
            </span>
          </Card>
        </div>

        {/* 📌 Carousel: Cihazlar */}
        
            <div id="deviceCarousel" className="carousel carousel-dark slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                {chunkedDevices.map((deviceGroup, groupIndex) => (
                  <div className={`carousel-item ${groupIndex === 0 ? 'active' : ''}`} key={groupIndex}>
                    <div className="row">
                      {deviceGroup.map((device, index) => (
                        <div className="col-12 col-md-4" key={index}>
                          <Card>
                            <h2 className="h5">{device.brand}</h2>
                            <span className="interests_item bg-primary text-white">Toplam: {device.total}</span>
                            <span className="interests_item bg-success text-white">Tamamlanan: {device.completed}</span>
                            <span className="interests_item bg-danger text-white">Hatalı: {device.faulty}</span>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Indicators (Göstergeler) */}
              <div className="carousel-indicators">
                {chunkedDevices.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    data-bs-target="#deviceCarousel"
                    data-bs-slide-to={index}
                    className={index === 0 ? "active" : ""}
                    aria-current={index === 0 ? "true" : "false"}
                    aria-label={`Slide ${index + 1}`}
                  ></button>
                ))}
              </div>

              {/* Carousel Kontrolleri (Sol ve Sağ Butonlar) */}
              <button className="carousel-control-prev" type="button" data-bs-target="#deviceCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#deviceCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>


        {/* 📌 Günlük Sipariş Sayısı Grafiği */}
        <div className="col-md-9">
          <Card>
            <h2 className="h5">Günlük Sipariş Sayısı</h2>
            {data.daily_orders.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.daily_orders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tarih" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="siparis_sayisi" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>Günlük sipariş verisi bulunamadı.</p>
            )}
          </Card>
        </div>

        <div className="col-md-4">
            <Card>
            <h2 className="h5">Müşterilerin Cihaz Tercihleri</h2>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                <Pie
                    data={data.device_percentages}
                    dataKey="percentage"
                    nameKey="brand"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                >
                    {data.device_percentages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                </PieChart>
            </ResponsiveContainer>
            </Card>
        </div>

       {/* 📌 Tablo: Müşteri Temsilcilerinin Satış Verileri */}
        <div className="col-md-8">
            <Card className="height-300">
                <h2 className="h5 mb-3">Müşteri Temsilcileri Verileri</h2>
                {data.sales_representative_top_brands && data.sales_representative_top_brands.length > 0 ? (
                    <div id="salesRepresentativeCarousel" className="musteriTemsilcisi carousel carousel-dark slide" data-bs-ride="carousel">
                        

                        <div className="carousel-inner">
                            {data.sales_representative_top_brands.reduce((chunks, item, index) => {
                                if (index % 2 === 0) {
                                    chunks.push([item]);  // Start a new chunk
                                } else {
                                    chunks[chunks.length - 1].push(item);  // Add to the current chunk
                                }
                                return chunks;
                            }, []).map((chunk, chunkIndex) => (
                                <div className={`carousel-item ${chunkIndex === 0 ? 'active' : ''}`} key={chunkIndex}>
                                    <div className="row">
                                        {chunk.map((item, index) => (
                                            <div key={index} className="col-md-6">
                                                <Card className="shadow-sm musteri_temsilcisi_item">
                                                    <h5 className="mb-2">{item.representative}</h5>
                                                    <p><strong>En Çok Sattığı Marka:</strong> {item.top_brand}</p>
                                                    <p><strong>Toplam Satış:</strong> {item.total_sales}</p>

                                                    {/* 📌 Marka Dağılımı */}
                                                    <div>
                                                        <strong>Marka Dağılımı:</strong>
                                                        <div className="d-flex flex-wrap gap-2 mt-2">
                                                            {Object.entries(item.brand_sales).map(([brand, count], i) => (
                                                                <span key={i} className="badge bg-primary p-2">
                                                                    {brand}: {count}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Carousel Controls */}
                        <div className=" position-absolute">
                            <button
                                className="btn btn-sm me-2"
                                type="button"
                                data-bs-target="#salesRepresentativeCarousel"
                                data-bs-slide="prev"
                            >
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button
                                className="btn btn-sm "
                                type="button"
                                data-bs-target="#salesRepresentativeCarousel"
                                data-bs-slide="next"
                            >
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>Müşteri Temsilcisi Bulunamadı.</p>
                )}
            </Card>
        </div>

        <div className="col-md-8">
          <Card className="height-300">
            <h2 className="h5">Önümüzdeki 7 Gün Randevular</h2>
            {data.upcoming_appointments.length > 0 ? (
              <ul className="list-group heightAuto">
                {data.upcoming_appointments.map((appt, index) => (
                  <li key={index} className="list-group-item">
                    Müşteri Adı :{appt.ad_soyad}<br/>Telefon Numarası : {appt.telefon1} 
                    <br/>
                    Adres : {appt.il}, {appt.ilce}, {appt.mahalle}, {appt.sokak_adi}, {appt.bina_no}, {appt.daire_no}
                    <br/>
                    <span className="interests_item">Randevu Tarihi :{appt.randevu_tarihi}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Önümüzdeki 7 gün içinde randevu yok.</p>
            )}
          </Card>
        </div>
        
        <div className="col-md-4">
          <Card className="height-300">
            <h2 className="h5">Son Güncellenenler</h2>
            {data.last_updated.length > 0 ? (
              <ul className="list-group heightAuto">
                {data.last_updated.map((appt, index) => (
                  <li key={index} className="list-group-item">
                    {appt.ad_soyad} - {appt.telefon1}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Gün İçerisinde Güncellenen İş Yok.</p>
            )}
          </Card>
        </div>

      </div>
    </div>
    
  );
}
