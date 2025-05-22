import React, { useEffect, useState } from 'react';
import {
  Box,
  Chip,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
  Button,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { apiFetch } from './api';
import { formatTurkishPhone } from './utils/formatters';
import { FaPen  } from 'react-icons/fa';


export default function InstallationsList() {
  // --- filtre state’leri ---
  const [customerFilter, setCustomerFilter] = useState('');
  const [brandFilter,    setBrandFilter]    = useState('');
  const [statusFilter,   setStatusFilter]   = useState('');
  const [dateFrom,       setDateFrom]       = useState('');
  const [dateTo,         setDateTo]         = useState('');
  const [igdasFilter,    setIgdasFilter]    = useState('');  // yeni
  const [tuketimFilter,  setTuketimFilter]  = useState('');  // yeni
  const [typeFilter,  setTypeFilter]  = useState('');  // yeni

  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);

  // --- her filtre değişiminde / ilk render’da data fetch et ---
  useEffect(() => {
    const params = new URLSearchParams();
  if (customerFilter) params.append('customer_name', customerFilter);
  if (igdasFilter)    params.append('igdas_adi',     igdasFilter);
  if (tuketimFilter)  params.append('tuketim_no',    tuketimFilter);
  if (brandFilter)    params.append('brand',         brandFilter);
  if (statusFilter)   params.append('order_status',  statusFilter);
  if (typeFilter)     params.append('order_type',    typeFilter);    // ← eklendi
  if (dateFrom)       params.append('date_from',     dateFrom);
  if (dateTo)         params.append('date_to',       dateTo);
    

    setLoading(true);
    apiFetch(`get_installations.php?${params.toString()}`, {
      method: 'GET',
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setRows(data.data.map(item => ({
          id:            item.installation_id,
          customerName:  item.customer_name,
          brand:         item.brand,
          serialNumber:  item.serial_number,
          orderType:     item.order_type,
          order_status:  item.order_status,
          installerName: item.ad_soyad,
          phone:         formatTurkishPhone(item.telefon1),
          igdasAdi:      item.igdas_adi,
          tuketimNo:     item.tuketim_no,
          street:        item.sokak_adi,
          building:      item.bina_no,
          flat:          item.daire_no,
          randevuTarihi: item.randevu_tarihi || 'Belirtilmemiş'
        })));
      } else {
        console.error('API hata:', data.message);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error('Fetch hata:', err);
      setLoading(false);
    });
  }, [customerFilter, igdasFilter, tuketimFilter, brandFilter, statusFilter, typeFilter, dateFrom, dateTo]);

  // --- chip renk haritaları ---
  const brandsColorMap = {
    'Demirdöküm': 'warning',
    'Baymak':     'success',
    'Eca':        'info',
    'Buderus':    'primary',
    'Bosch':      'default',
    'Vaillant':   'error',
    'Viessmann':  'warning'
  };
  const statusColorMap = {
  'Sipariş Alındı':        'warning',
  'Montaj Yapıldı':        'info',
  'Abonelik Yok':          'error',
  'Proje Onayda':          'error',
  'Sözleşme Yok':          'error',
  'Randevu Bekliyor':      'primary',
  'Randevu Alındı':        'default',
  'Gaz Açıldı':            'success',
  'İş Tamamlandı':         'success'
  };
  const typeColorMap = {
    'Tekli Satış':    'default',
    'Cihaz Değişimi': 'primary',
    'Yeni Proje':     'success'
  };
    const statusOptions = [
    'Sipariş Alındı','Montaj Yapıldı','Abonelik Yok',
    'Proje Onayda','Sözleşme Yok','Randevu Bekliyor',
    'Randevu Alındı','Gaz Açıldı','İş Tamamlandı'
    ];

  const columns = [
    { field: 'customerName',  headerName: 'Müşteri',       width: 160 },
    {
      field: 'brand',
      headerName: 'Marka',
      width: 120,
      renderCell: params => (
        <Chip size="small" label={params.value}
              color={brandsColorMap[params.value] || 'default'} />
      )
    },
    { field: 'serialNumber',  headerName: 'Seri No',       width: 245 },
    {
      field: 'orderType',
      headerName: 'Sipariş Tipi',
      width: 130,
      renderCell: params => (
        <Chip size="small" label={params.value}
              color={typeColorMap[params.value] || 'default'} />
      )
    },
    {
    field: 'order_status',
    headerName: 'Durum',
    width: 150,
    editable: true,              // hücre düzenlenebilir olsun
    type: 'singleSelect',        // dropdown
    valueOptions: statusOptions, // seçenekler
    renderCell: params => (      // badge olarak göstermeyi koruyoruz
      <Chip
        size="small"
        label={params.value}
        color={statusColorMap[params.value] || 'default'}
        deleteIcon={<FaPen size={12} style={{ marginLeft: 2, marginRight: 10 }}/>}
        onDelete={() => handleCellEdit(params)}
        sx={{ cursor: 'pointer' }}
      />
    )
    },
    { field: 'installerName', headerName: 'Ad Soyad',      width: 140 },
    { field: 'phone',         headerName: 'Telefon',       width: 135 },
    { field: 'igdasAdi',      headerName: 'İGDAŞ Adı',     width: 140 },
    { field: 'tuketimNo',     headerName: 'Tüketim No',    width: 110 },
    { field: 'street',        headerName: 'Sokak',         flex: 1, minWidth: 180 },
    { field: 'building',      headerName: 'Bina',          width: 60 },
    { field: 'flat',          headerName: 'Daire',         width: 60 },
    { field: 'randevuTarihi', headerName: 'Randevu Tarihi', width: 140 }
  ];

  return (
    <Box sx={{ width: '100%'}}>
      <h4>Montaj Listesi</h4>

      {/* --- Filtre Alanları --- */}
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="Müşteri Ara"
          size="small"
          value={customerFilter}
          onChange={e => setCustomerFilter(e.target.value)}
          sx={{ bgcolor: 'white' }}
        />
        <TextField
          label="İGDAŞ Adı"
          size="small"
          value={igdasFilter}
          onChange={e => setIgdasFilter(e.target.value)}
          sx={{ bgcolor: 'white' }}
        />
        <TextField
          label="Tüketim No"
          size="small"
          value={tuketimFilter}
          onChange={e => setTuketimFilter(e.target.value)}
          sx={{ bgcolor: 'white' }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Marka</InputLabel>
          <Select
            label="Marka"
            value={brandFilter}
            onChange={e => setBrandFilter(e.target.value)}
            sx={{ bgcolor: 'white' }}
          >
            <MenuItem value="">Tümü</MenuItem>
            {Object.keys(brandsColorMap).map(b => (
              <MenuItem key={b} value={b}>{b}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white' }}>
            <InputLabel>Sipariş Tipi</InputLabel>
            <Select
            label="Sipariş Tipi"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            >
            <MenuItem value="">Tümü</MenuItem>
            {Object.keys(typeColorMap).map(t => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
            </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Durum</InputLabel>
          <Select
            label="Durum"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            sx={{ bgcolor: 'white' }}
          >
            <MenuItem value="">Tümü</MenuItem>
            {Object.keys(statusColorMap).map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Randevu ≥"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          sx={{ bgcolor: 'white' }}
        />
        <TextField
          label="Randevu ≤"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          sx={{ bgcolor: 'white' }}
        />
        <Button size="small" onClick={() => {
            setCustomerFilter('');
            setIgdasFilter('');
            setTuketimFilter('');
            setBrandFilter('');
            setStatusFilter('');
            setTypeFilter('');         // ← ekledik
            setDateFrom('');
            setDateTo('');
        }}>
          Temizle
        </Button>
      </Stack>

      <Box sx={{ width: '100%', height:720}}>
        <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            pageSizeOptions={[15,30,50]}
            initialState={{ pagination: { paginationModel: { pageSize: 15, page: 0 } } }}
            disableRowSelectionOnClick

            // Yeni API’yi açıyoruz
            experimentalFeatures={{ newEditingApi: true }}

            // satır tamamlandığında burası çalışacak
            processRowUpdate={async (newRow, oldRow) => {
                // eğer durum değişmediyse bir şey yapma
                if (newRow.order_status === oldRow.order_status) {
                return oldRow;
                }
                try {
                const res = await apiFetch('update_installation_status.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                    installation_id: newRow.id,
                    order_item_status:    newRow.order_status
                    })
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.message || 'Kayıt hatası');
                // başarılıysa state’i güncelle
                setRows(rows.map(r => r.id === newRow.id ? newRow : r));
                return newRow;
                } catch (err) {
                alert('Güncelleme başarısız: ' + err.message);
                // hata olduysa eski satırı geri döndür (UI eski haline gelir)
                return oldRow;
                }
            }}

            // kullanıcı ESC ile vazgeçerse veya hata olduysa eski satırı geri getir
            onProcessRowUpdateError={(err) => {
                console.error('Row update error:', err);
                alert('Satır güncellenemedi.');
            }}
        />
      </Box>
    </Box>
  );
}
