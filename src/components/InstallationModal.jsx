import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Collapse } from 'react-bootstrap';
import { apiFetch } from '../api';

const OrderInstallationModal = ({ show, onHide, order, onSaved }) => {
  const [items, setItems] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (order && Array.isArray(order.items)) {
      const mapped = order.items.map(it => ({
        order_item_id: it.order_item_id,
        product_name: it.product_name,
        serial_number : it.serial_number,
        // varsa nested installation, yoksa mevcut düz alan
        tuketim_no: it.installation?.tuketim_no || it.tuketim_no || '',
        igdas_adi: it.installation?.service_name || it.igdas_adi || '',
        ad_soyad: it.installation?.ad_soyad || it.ad_soyad || '',
        telefon1: it.installation?.phone_number || it.telefon1 || '',
        telefon2: it.installation?.phone_number2 || it.telefon2 || '',
        il: it.installation?.address?.split(', ')[0] || it.il || '',
        ilce: it.installation?.address?.split(', ')[1] || it.ilce || '',
        mahalle: it.installation?.address?.split(', ')[2] || it.mahalle || '',
        sokak_adi: it.installation?.address?.split(', ')[3] || it.sokak_adi || '',
        bina_no: it.installation?.address?.split(', ')[4] || it.bina_no || '',
        daire_no: it.installation?.address?.split(', ')[5] || it.daire_no || '',
        randevu_tarihi: it.installation?.randevu_tarihi || it.randevu_tarihi || '',
        hata_durumu: it.installation?.hata_durumu ?? it.hata_durumu ?? 0,
        hata_sebebi: it.installation?.hata_sebebi || it.hata_sebebi || '',
        not_text: it.installation?.not_text || it.not_text || '',
        delivery: it.delivery ?? it.delivery ?? 0,
        servis_yonlendirildi: it.servis_yonlendirildi ?? it.servis_yonlendirildi ?? 0,
        order_item_status: it.order_item_status?.order_item_status || it.order_item_status || '',
      }));
      setItems(mapped);
      // installation bilgisi olanları açık, diğerleri kapalı
      const exp = {};
      mapped.forEach(it => {
        exp[it.order_item_id] = Boolean(it.tuketim_no || it.igdas_adi || it.ad_soyad || it.telefon1 || it.telefon2 || it.randevu_tarihi);
      });
      setExpanded(exp);
    }
  }, [order]);

  const toggleExpand = id => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isValidTurkishMobile = (value) => {
    const validPrefixes = [
      '501','505','506','507','508','509',
      '530','531','532','533','534','535','536','537','538','539',
      '540','541','542','543','544','545','546','547','548','549',
      '550','551','552','553','554','555','556','557','558','559'
    ];
    return (/^\d{10}$/.test(value) && validPrefixes.includes(value.substring(0, 3)));
  };

  const handleChange = (idx, field, value) => {
    if (['telefon1', 'telefon2'].includes(field)) {
      if (!/^\d{0,10}$/.test(value)) return;
      if (value.length === 10 && !isValidTurkishMobile(value)) {
        alert("Geçersiz telefon numarası! Lütfen geçerli bir GSM numarası girin.");
        return;
      }
    }
    if (field === 'tuketim_no' && !/^\d{0,11}$/.test(value)) return;

    const updated = [...items];
    updated[idx][field] = value;
    setItems(updated);
  };

  const handleSave = () => {
    // sadece açık olanlar güncellenecek
    const toSave = items.map(it => ({
      order_item_id:        it.order_item_id,
      // 👉 always include these three
      serial_number:        it.serial_number,
      delivery:             it.delivery,
      servis_yonlendirildi: it.servis_yonlendirildi,
      order_item_status: it.order_item_status,
      // 👉 only include installation‐fields if that row is expanded
      ...(expanded[it.order_item_id] && {
        tuketim_no:     it.tuketim_no,
        igdas_adi:      it.igdas_adi,
        ad_soyad:       it.ad_soyad,
        telefon1:       it.telefon1,
        telefon2:       it.telefon2,
        il:             it.il,
        ilce:           it.ilce,
        mahalle:        it.mahalle,
        sokak_adi:      it.sokak_adi,
        bina_no:        it.bina_no,
        daire_no:       it.daire_no,
        randevu_tarihi: it.randevu_tarihi,
        hata_durumu:    it.hata_durumu,
        hata_sebebi:    it.hata_sebebi,
        not_text:       it.not_text
      })
    }));
    for (const item of toSave) {
      for (const phone of [item.telefon1, item.telefon2]) {
        if (phone && !isValidTurkishMobile(phone)) {
          alert(`Geçersiz telefon numarası: ${phone}`);
          return;
        }
      }
    }
    apiFetch('update_order_installations.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ order_id: order.id, items: toSave})
    })
      .then(async res => {
        const text = await res.text();
        const clean = text.trim().replace(/^\uFEFF/, '');
        let data;
        try { data = JSON.parse(clean); }
        catch (err) { alert('Sunucudan geçerli JSON gelmedi.'); return; }

        if (data.success) {
          onSaved(order.id, toSave);
          onHide(); alert('Güncelleme Başarılı.');
        } else alert('Güncelleme hatası: ' + data.message);
      })
      .catch(() => alert('Sunucu hatası'));
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Sipariş Montaj Bilgileri Düzenle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {items.map((it, idx) => (
          <div key={it.order_item_id}
              className={`mb-4 p-3 border rounded ${idx % 2 === 1 ? 'bg-light' : 'bg-white'}`}
            >
            <Row className="align-items-center">
              <Col md={9} ><h5>{`${idx + 1}. ${it.product_name}`}</h5></Col>
              <Col md={3} className="text-end">
                <Button size="sm" onClick={() => toggleExpand(it.order_item_id)}>
                  {expanded[it.order_item_id] ? 'Kapat' : 'Montaj Bilgisi Ekle'}
                </Button>
              </Col>
            </Row>
            {/* Diğer Bilgiler */}
                <Row>
                  {/* Seri Numarası Alanı */}
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>SERİ NUMARASI</Form.Label>
                      <Form.Control
                        type="text"
                        value={it.serial_number || ''}
                        onChange={e => handleChange(idx, 'serial_number', e.target.value)}
                        placeholder="Seri No giriniz"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} className="mb-2">
                    <Form.Group>
                      <Form.Label>TESLİMAT YAPILDI</Form.Label>
                      <Form.Select
                        name="delivery"
                        value={it.delivery}
                        onChange={e => handleChange(idx, 'delivery', e.target.value)}
                      >
                        <option value={0}>Hayır</option>
                        <option value={1}>Evet</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-2">
                    <Form.Group>
                      <Form.Label>SİPARİŞ DURUMU</Form.Label>
                      <Form.Select value={it.order_item_status} onChange={e => handleChange(idx, 'order_item_status', e.target.value)}>
                        {['Sipariş Alındı','Montaj Yapıldı','Abonelik Yok','Proje Onayda','Sözleşme Yok','Randevu Bekliyor','Randevu Alındı','Gaz Açıldı','İş Tamamlandı'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
            <Collapse in={expanded[it.order_item_id]}>
              <div>
                <Form className="mt-3">
                <>
                <hr />
                {/* İGDAŞ Bilgileri */}
                <h5 className="mt-3">İGDAŞ Bilgileri</h5>
                <Row>
                  {['igdas_adi', 'tuketim_no', 'randevu_tarihi'].map(fld => (
                    <Col md={4} className="mb-2" key={fld}>
                      <Form.Group>
                        <Form.Label>{fld.replace('_', ' ').toUpperCase()}</Form.Label>
                        <Form.Control
                          type={fld === 'randevu_tarihi' ? 'date' : (fld === 'tuketim_no' ? 'tel' : 'text')}
                          name={fld}
                          value={it[fld]}
                          onChange={e => handleChange(idx, fld, e.target.value)}
                          pattern={fld === 'tuketim_no' ? '\\d{11}' : undefined}
                          maxLength={fld === 'tuketim_no' ? 11 : undefined}
                          placeholder={fld === 'tuketim_no' ? 'XXXXXXXXXXX' : undefined}
                        />
                        {fld === 'tuketim_no' && <Form.Text className="text-muted">11 haneli tüketim numarası giriniz.</Form.Text>}
                      </Form.Group>
                    </Col>
                  ))}
                </Row>

                {/* Montaj Bilgileri */}
                <h5 className="mt-4">Montaj Bilgileri</h5>
                <Row>
                  {['ad_soyad', 'telefon1', 'telefon2'].map(fld => (
                    <Col md={4} className="mb-2" key={fld}>
                      <Form.Group>
                        <Form.Label>{fld.replace('_', ' ').toUpperCase()}</Form.Label>
                        <Form.Control
                          type={fld.startsWith('telefon') ? 'tel' : 'text'}
                          name={fld}
                          value={it[fld]}
                          onChange={e => handleChange(idx, fld, e.target.value)}
                          pattern={fld.startsWith('telefon') ? '\\d{10}' : undefined}
                          maxLength={fld.startsWith('telefon') ? 10 : undefined}
                          placeholder={fld.startsWith('telefon') ? '5XXXXXXXXX' : undefined}
                        />
                        {fld.startsWith('telefon') && <Form.Text className="text-muted">Başında 0 olmadan 10 haneli giriniz.</Form.Text>}
                      </Form.Group>
                    </Col>
                  ))}
                </Row>

                {/* Adres Bilgileri */}
                <h5 className="mt-4">Adres Bilgileri</h5>
                <Row>
                  {['il', 'ilce', 'mahalle', 'sokak_adi', 'bina_no', 'daire_no'].map(fld => (
                    <Col md={2} className="mb-2" key={fld}>
                      <Form.Group>
                        <Form.Label>{fld.replace('_', ' ').toUpperCase()}</Form.Label>
                        <Form.Control
                          name={fld}
                          value={it[fld]}
                          onChange={e => handleChange(idx, fld, e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  ))}
                </Row>

                {/* Hata ve Not Bilgileri */}
                <h5 className="mt-4">Hata ve Not Bilgileri</h5>
                <Row>
                  <Col md={3} className="mb-2">
                    <Form.Group>
                      <Form.Label>HATA DURUMU</Form.Label>
                      <Form.Select
                        name="hata_durumu"
                        value={it.hata_durumu}
                        onChange={e => handleChange(idx, 'hata_durumu', e.target.value)}
                      >
                        <option value={0}>Yok</option>
                        <option value={1}>Var</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {['hata_sebebi', 'not_text'].map(fld => (
                    <Col md={4} className="mb-2" key={fld}>
                      <Form.Group>
                        <Form.Label>{fld.replace('_', ' ').toUpperCase()}</Form.Label>
                        <Form.Control
                          name={fld}
                          value={it[fld]}
                          onChange={e => handleChange(idx, fld, e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  ))}
                </Row>
              </>
                </Form>
              </div>
            </Collapse>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Kapat</Button>
        <Button variant="primary" onClick={handleSave}>Hepsini Kaydet</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderInstallationModal;
