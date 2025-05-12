import React, { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaCrown } from "react-icons/fa";
import { Carousel, OverlayTrigger, Tooltip as BSTooltip  } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip } from '@mui/material';
import { apiFetch } from "./api";
import DashboardShortcuts from "./components/DashboardShortcuts";
import { formatTurkishPhone } from "./utils/formatters";


// Kart bileşeni
function Card({ children, className = '' }) {
  return (
    <div className={`card shadow-sm mb-3 ${className}`}>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Renkler
const PRIMARY = "#3f75d7";
const SECONDARY = "#FF8552";
const COLORS = [
  '#8884d8', // Marka 1
  '#82ca9d', // Marka 2
  '#ffc658', // Marka 3
  '#ff8042', // Marka 4
  '#8dd1e1', // Marka 5
  '#a4de6c', // Marka 6
  '#d0ed57', // Marka 7
  '#d88884', // Marka 8
  '#84d8c4', // Marka 9
  '#c684d8', // Marka 10
  '#e1e18d', // Marka 11
  '#84a6d8', // Marka 12
  '#d8a384', // Marka 13
];

export default function Dashboard() {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [balance, setBalance] = useState({ total_debt: 0, total_payment: 0, total_balance: 0 });
  const [movements, setMovements] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [salesByRep, setSalesByRep] = useState([]);
  const [kombiSalesByRep, setKombiSalesByRep] = useState([]);
  const [kombiSalesSummary, setKombiSalesSummary] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [payments, setPayments] = useState([]);
  const [brandDistribution, setBrandDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    async function fetchAll() {
      try {
        const endpoints = [
          ["total_customers", data => setTotalCustomers(data.total_customers)],
          ["total_orders", data => setTotalOrders(data.total_orders)],
          ["balance", data => setBalance(data)],
          ["recent_movements", data => setMovements(data)],
          ["upcoming_appointments", data => setAppointments(data)],
          ["recent_customers", data => setRecentCustomers(data)],
          ["sales_by_rep", data => setSalesByRep(data)],
          ["brand_sales_distribution", data => setBrandDistribution(
            // Dönüş verisini sayısal değere çevir
            data.map(item => ({ brand: item.brand, quantity_sold: Number(item.quantity_sold) }))
          )],
          ["kombi_sales_by_rep", data => setKombiSalesByRep(data)],
          ["quotes_overview", data => setQuotes(
            data.map(q => ({
              ...q,
              total_amount: Number(q.total_amount),
              items: q.items.map(i => ({
                ...i,
                quantity: Number(i.quantity),
                total_price: Number(i.total_price)
              }))
            }))
          )],
          ["orders_overview", data => setOrders(
            data.map(o => ({
              ...o,
              total_amount: Number(o.total_amount),
              items: o.items.map(i => ({
                ...i,
                quantity: Number(i.quantity),
                total_amount: Number(i.total_amount)
              }))
            }))
          )],
          ["today_payments", data => setPayments(
            data.map(p => ({
              ...p,
              amount: Number(p.amount) || 0
            }))
          )],
          ["kombi_sales_by_brand", data => setKombiSalesSummary(
            data.map(item => ({
              brand: item.brand,
              total_sold: Number(item.total_sold),
              completed: Number(item.completed),
              pending: Number(item.pending)
            }))
          )],
          ["orders_list", data => setOrdersList(
            data.map(inst => ({
              id:            inst.installation_id,
              tuketimNo:     inst.tuketim_no,
              igdasAdi:      inst.igdas_adi,
              randevuTarihi: inst.randevu_tarihi,
              installerName: inst.ad_soyad,
              phone:         formatTurkishPhone(inst.telefon1),
              street:        inst.sokak_adi,
              building:      inst.bina_no,
              flat:          inst.daire_no,
              orderType:     inst.order_type,
          
              // Yeni eklenenler:
              brand:         inst.brand,
              serialNumber:  inst.serial_number,
              customerName:  inst.customer_name,
          
              category: ({
                'Sipariş Alındı':   'Montaj Yapılmalı',
                'Montaj Yapıldı':   'Proje Çizilmeli',
                'Abonelik Yok':     'Hatalı İş',
                'Proje Onayda':     'Hatalı İş',
                'Sözleşme Yok':     'Hatalı İş',
                'Randevu Bekliyor': 'Randevu Alınmalı',
                'Randevu Alındı':   'Randevu Alındı',
                'Gaz Açıldı':       'Servis Yönlendirilmeli'
              }[inst.order_status] || inst.order_status)
            }))
          )]
        ];
        await Promise.all(endpoints.map(async ([action, setter]) => {
          const res = await apiFetch(`dashboard_data.php?action=${action}`, { credentials: 'include' });
          const json = await res.json();
          setter(json);
        }));
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error.message}</p>;

  const formattedData = salesByRep.map(rep => ({
    ...rep,
    total_sales_revenue: Number(rep.total_sales_revenue),  // veya +rep.total_sales_revenue
  }));

  // Grafik için veri kontrolü
  const hasBrandData = brandDistribution && brandDistribution.length > 0;
  const todayQuotes = quotes.filter(q => dayjs(q.created_at).isSame(dayjs(), 'day'));
  const todayOrders = orders.filter(o => dayjs(o.created_at).isSame(dayjs(), 'day'));
  const maxSales = Math.max(...kombiSalesByRep.map(rep => rep.kombi_sold_count));

  // Helper: Diziyi 2'li gruplara ayırır
  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
      arr.slice(index * size, index * size + size)
    );
  };
  const groupedData = chunkArray(kombiSalesSummary, 3);

  const brandsColorMap = {
    'Demirdöküm': 'warning',
    'Baymak':  'info',
    'Eca':'primary',
    'Buderus':'success',
    'Bosch':'default',
    'Vaillant':'error',
    'Viessmann':'error',
  };

  const statusColorMap = {
    'Montaj Yapılmalı': 'warning',
    'Proje Çizilmeli':  'info',
    'Randevu Alınmalı':'primary',
    'Servis Yönlendirilmeli':'success',
    'Randevu Alındı':'default',
    'Hatalı İş':       'error'
  };
  
  const typeColorMap = {
    'Tekli Satış':     'primary',
    'Cihaz Değişimi':  'secondary',
    'Yeni Proje':      'success'
  };

  

  const columns = [
    { field: 'customerName',  headerName: 'Müşteri Adı',  width: 150 },
    { 
      field: 'brand',         headerName: 'Marka',
      width: 90,
      renderCell: params => (
        <Chip
          label={params.value}
          size="small"
          color={brandsColorMap[params.value] || 'default'}
        />
      )
    },
    { field: 'serialNumber',  headerName: 'Seri No',      width: 150 },
    {
      field: 'orderType',
      headerName: 'Sipariş Tipi',
      width: 100,
      renderCell: params => (
        <Chip
          label={params.value}
          size="small"
          color={typeColorMap[params.value] || 'default'}
        />
      )
    },
    {
      field: 'category',
      headerName: 'Durum',
      width: 140,
      renderCell: params => (
        <Chip
          label={params.value}
          size="small"
          color={statusColorMap[params.value] || 'default'}
        />
      )
    },
    { field: 'installerName', headerName: 'Ad Soyad',     width: 140 },
    { field: 'phone',         headerName: 'Telefon',      width: 135 },
    { field: 'igdasAdi',      headerName: 'İGDAŞ Adı',    width: 140 },
    { field: 'tuketimNo',     headerName: 'Tüketim No',   width: 110 },
    { field: 'street',        headerName: 'Sokak',        width: 130 },
    { field: 'building',      headerName: 'Bina',         width: 60 },
    { field: 'flat',          headerName: 'Daire',        width: 60 },
    { field: 'randevuTarihi', headerName: 'Randevu Tarihi', width: 100 },  
  ];

  return (
    <>
    <div className="row">

    </div>
    <div className="row"> 
      <div className="col-md-9 my-4">
        <div className="row g-3">
          <h5 className="mb-0 mt-0">Genel Veriler</h5>
            <div className="col-md-3">
              <Card className="border-2 border-primary">
                <h5>Toplam Müşteri</h5>
                <p className="display-4">{totalCustomers}</p>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="border-2 border-primary">
                <h5>Toplam Sipariş</h5>
                <p className="display-4">{totalOrders}</p>
              </Card>
            </div>
            <div className="col-md-6">
              <Card className="border-2 border-warning">
                <div className="row">
                  <div className="col-md-8">
                    <h5>Toplam Bakiye</h5>
                    <p className="display-4">{balance.total_balance} TL</p>
                  </div>
                  <div className="col-md-4">
                    <p>Sipariş Tutarı: <br /><span className="text-danger">{balance.total_debt} TL </span></p>
                    <p>Gelen Ödeme: <br /><span className="text-success">{balance.total_payment} TL</span></p>
                  </div>
                </div>
              </Card>
            </div>
      </div>

        {/* KPI Kartlar */}
        <div className="row g-3 mb-3">
          <h5 className="mt-3">Aksiyon Bekleyen İşler</h5>
          <Box sx={{ height: 267, width: '100%' }}>
            <DataGrid className="border-2"
              rows={ordersList}
              columns={columns}
              // **v8 kontrollü pagination**
              pagination
              paginationModel={paginationModel}
              onPaginationModelChange={(newModel) => setPaginationModel(newModel)}

              // sayfa boyutu seçenekleri
              pageSizeOptions={[5, 10, 20]}

              
            />
          </Box>
        </div>

        <div className="row g-3">
          <h5 className="mb-0 mt-4">Marka Bazlı Satış Özeti</h5>
          { groupedData.length > 0 ? (
          <div className="col-12 markaSatis mt-0">
            <Carousel indicators={false} interval={5000} >
              {groupedData.map((group, idx) => (
                <Carousel.Item key={idx}>
                  <div className="row">
                    {group.map((brandData, subIdx) => (
                      <div key={subIdx} className="col-md-4 ps-0 pe-0">
                        <div className="card p-3 m-2 border-2">
                          <div className="card-body p-0">
                            <h5>{brandData.brand}</h5>
                            <span className="interests_item bg-primary text-white">
                              Toplam Satış: {brandData.total_sold}
                            </span>
                            <span className="interests_item bg-success text-white">
                              Tamamlanan: {brandData.completed}
                            </span>
                            <span className="interests_item bg-danger text-white">
                              Bekleyen: {brandData.pending}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        ) : (
          <div className="col-12">
            <div className="card p-3">
              <p>Marka bazlı kombi satış verisi bulunamadı.</p>
            </div>
          </div>
        )}
        </div>

        {/* Temsilciye Göre Kombi Satışları - Kart Bazlı */}
        <div className="row g-3">
          <h5 className="mt-4">Müşteri Temsilcisi Satış Özeti</h5>
          {kombiSalesByRep.map(rep => {
            // Marka dağılımını tek bir string halinde hazırlıyoruz
            const tooltipContent = Object
              .entries(rep.brands)
              .map(([brand, count]) => `${brand}: ${count}`)
              .join('\n');

            return (
              <div key={rep.user_id} className="col-md-3 mt-0">
                <Card className="border-2">
                  <h5>
                    {rep.representative}
                    {rep.kombi_sold_count === maxSales && (
                      <FaCrown
                        className="text-warning firstReps"
                        title="En çok satış yapan temsilci"
                      />
                    )}
                  </h5>

                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <BSTooltip id={`tooltip-${rep.user_id}`}>
                        {/* Satır satır göstermek için <div> kullandık */}
                        {Object.entries(rep.brands).map(([brand, count]) => (
                          <div key={brand}>
                            {brand}: {count}
                          </div>
                        ))}
                      </BSTooltip>
                    }
                  >
                    {/* Hover alanı */}
                    <p className="interests_item bg-warning text-white mb-0" style={{ cursor: 'pointer' }}>
                      Toplam Satış Adeti: {rep.kombi_sold_count}
                    </p>
                  </OverlayTrigger>

                </Card>
              </div>
            );
          })}
        </div>

        {/* Grafikler */}
        <div className="row g-3">
          <div className="col-md-6">
            <Card className="border-2">
              <h5>7 Günlük Sipariş Hareketleri</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={movements}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={dateString => {
                      const d = new Date(dateString);
                      const day   = String(d.getDate()).padStart(2, '0');
                      const month = String(d.getMonth() + 1).padStart(2, '0');
                      const year  = String(d.getFullYear()).slice(-2);
                      return `${day}.${month}.${year}`;
                    }}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    // tooltip’ta label olarak gelen timestamp’i aynı fonksiyonla biçimlendiriyoruz
                    labelFormatter={timestamp => {
                      const d     = new Date(timestamp);
                      const day   = String(d.getDate()).padStart(2, '0');
                      const month = String(d.getMonth() + 1).padStart(2, '0');
                      const year  = String(d.getFullYear()).slice(-2);
                      return `${day}.${month}.${year}`;
                    }}
                    // eğer tooltip değerlerinin yanındaki etiket metnini de özelleştirmek isterseniz
                    formatter={(value, name) => [value, name]} 
                  />
                  <Line type="monotone" dataKey="count" name="Sipariş Adeti" stroke={PRIMARY} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <div className="col-md-6">
            <Card className="border-2">
              <h5>Temsilci Bazlı Satış Cirosu</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formattedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="representative" />
                  <YAxis/>
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} TL`, 'Toplam Ciro']} />
                  <Bar dataKey="total_sales_revenue" name="Toplam Ciro">
                  {formattedData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          {/* Marka Dağılımı Kartı */}
          <div className="col-md-6 mt-0">
            <Card className="border-2">
              <h5>Marka Dağılımı</h5>
              {hasBrandData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={brandDistribution}
                      dataKey="quantity_sold"
                      nameKey="brand"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {brandDistribution.map((entry, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p>Marka verisi bulunamadı.</p>
              )}
            </Card>
          </div>
          <div className="col-md-6 mt-0">
            <Card className="border-2"> 
              <h5>Önümüzdeki 7 Gün Randevular</h5>
              <ul className="list-group list-group-flush">
                {appointments.map((apt, idx) => (
                  <li key={idx} className="list-group-item">
                    {dayjs(apt.randevu_tarihi).format('DD.MM.YYYY')} - {apt.ad_soyad}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Son Eklenen Müşteriler */}
        <div className="row g-3">
          <div className="col-md-6">
            <Card className="border-2">
              <h5>Son Eklenen 7 Müşteri</h5>
              <ul className="list-group list-group-flush">
                {recentCustomers.map(c => (
                  <li key={c.id} className="list-group-item">
                    {c.name} ({c.email})
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>


      <div className="col-md-3 my-4">
      
      <DashboardShortcuts/>

      <div className="row g-3">
        <h5 className="mb-0 mt-4">Ödemeler</h5>
        {payments.length > 0 ? (
          payments.map(pay => (
            <div key={pay.id} className="col-md-12 col-lg-12">
              <Card className="border-2 border-success">
                <h5 className="interests_item bg-success text-white">Ödeme #{pay.id}</h5>
                <p><strong>Müşteri:</strong> {pay.customer_name}</p>
                <p><strong>Miktar:</strong> {pay.amount.toFixed(2)} TL</p>
                <p><strong>İşlem Tarihi:</strong> {dayjs(pay.transaction_date).format('DD.MM.YYYY HH:mm')}</p>
                {pay.description && <p><strong>Açıklama:</strong> {pay.description}</p>}
                <p><strong>İşleyen:</strong> {pay.processed_by}</p>
              </Card>
            </div>
          ))
        ) : (
          <div className="col-12">
            <Card className="border-2 border-success"><p>Bugün ödeme bulunamadı.</p></Card>
          </div>
        )}
      </div>


        {/* Verilen Teklifler Kart Bazlı */}
        <div className="row g-3">
          <h5 className="mb-0">Teklifler</h5>
          {todayQuotes.length > 0 ? (
          todayQuotes.map(q => (
            <div key={q.id} className="col-md-12 col-lg-12">
              <Card className="border-2 border-primary">
                <h5 className="interests_item bg-primary text-white">Teklif #{q.id}</h5>
                <p><strong>Oluşturan:</strong> {q.creator_name}</p>
                <p><strong>Durum:</strong> {q.status}</p>
                <p><strong>Tutar:</strong> {q.total_amount.toFixed(2)}</p>
                <p><strong>Tarih:</strong> {dayjs(q.created_at).format('DD.MM.YYYY')}</p>
                <h6 className="mt-3">Ürünler:</h6>
                <ul className="list-group list-group-flush">
                  {q.items.map((item, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{item.product_name} ({item.quantity} Adet)</span>
                      <span>{item.total_price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))
        ) : (
          <div className="col-12">
            <Card className="border-2 border-primary"><p>Bugün oluşturulmuş teklif bulunamadı.</p></Card>
          </div>
        )}
        </div>

        {/* Siparişler */}
        <div className="row g-3">
        <h5 className="mb-0">Siparişler</h5>
          {todayOrders.length > 0 ? (
              todayOrders.map(o => (
                <div key={o.id} className="col-md-12 col-lg-12">
                  <Card className="border-2 border-warning">
                    <h5 className="interests_item bg-warning text-white">Sipariş #{o.id}</h5>
                    <p><strong>Sipariş Alan:</strong> {o.creator_name}</p>
                    <p><strong>Müşteri:</strong> {o.customer_name}</p>
                    <p><strong>Durum:</strong> {o.status}</p>
                    <p><strong>Tutar:</strong> {o.total_amount.toFixed(2)} TL</p>
                    <p><strong>Tarih:</strong> {dayjs(o.created_at).format('DD.MM.YYYY')}</p>
                    <h6 className="mt-3">Ürünler:</h6>
                    <ul className="list-group list-group-flush">
                      {o.items.map((item, idx) => (
                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                          <span>{item.product_name} <br />({item.quantity} Adet)</span>
                          <hr />
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              ))
            ) : (
              <div className="col-12">
                <Card className="border-2 border-warning"><p>Bugün oluşturulan sipariş bulunamadı.</p></Card>
              </div>
          )}
        </div>

      </div>
    </div>
    </>
  );
}
