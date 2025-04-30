import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { apiFetch } from '../api';

const OrderInstallationModal = ({ show, onHide, order, onSaved }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (order && Array.isArray(order.items)) {
      setItems(order.items.map(it => ({
        order_item_id: it.order_item_id,
        product_name: it.product_name,
        tuketim_no: it.installation?.tuketim_no || '',
        igdas_adi: it.installation?.service_name || '',
        ad_soyad: it.installation?.ad_soyad || '',
        telefon1: it.installation?.phone_number || '',
        telefon2: it.installation?.phone_number2 || '',
        il: it.installation?.address?.split(', ')[0] || '',
        ilce: it.installation?.address?.split(', ')[1] || '',
        mahalle: it.installation?.address?.split(', ')[2] || '',
        sokak_adi: it.installation?.address?.split(', ')[3] || '',
        bina_no: it.installation?.address?.split(', ')[4] || '',
        daire_no: it.installation?.address?.split(', ')[5] || '',
        randevu_tarihi: it.installation?.randevu_tarihi || '',
        hata_durumu: it.installation?.hata_durumu ?? 0,
        hata_sebebi: it.installation?.hata_sebebi || '',
        not_text: it.installation?.not_text || ''
      })));
    }
  }, [order]);

  const handleChange = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = value;
    setItems(newItems);
  };

  const handleSave = () => {
    const order_id = order.id;  // <<< Burada değişken tanımlıyoruz
  
    apiFetch('update_order_installations.php', {
        method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ order_id, items })
  })
    .then(async res => {
      const text = await res.text();
      const clean = text.trim().replace(/^\uFEFF/, '');
      let data;
      try {
        data = JSON.parse(clean);
      } catch (err) {
        console.error('Temizlenmiş RESPONSE:', clean);
        alert('Sunucudan geçerli JSON gelmedi.');
        return;
      }

      if (data.success) {
        onSaved(order_id, items);  // <-- parent’a haber veriyoruz
        onHide();                  // <-- modalı kapatıyoruz
        alert('Güncelleme Başarılı.');
      } else {
        alert('Güncelleme hatası: ' + data.message);
      }
    })
    .catch(err => {
      console.error('Fetch hatası:', err);
      alert('Sunucu hatası');
    });
};

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Sipariş Montaj Bilgileri Düzenle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {items.map((it, idx) => (
          <div key={it.order_item_id} className="mb-4 p-3 border rounded">
            <h5>{`${idx + 1}. ${it.product_name}`}</h5>
            <Form>
              <Row>
                {['tuketim_no', 'igdas_adi', 'ad_soyad', 'telefon1', 'telefon2', 'randevu_tarihi', 'hata_sebebi', 'not_text'].map(fld => (
                  <Col md={3} className="mb-2" key={fld}>
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
                {['il', 'ilce', 'mahalle', 'sokak_adi', 'bina_no', 'daire_no'].map(fld => (
                  <Col md={2} className="mb-2" key={fld}>
                    <Form.Group>
                      <Form.Label>{fld.toUpperCase()}</Form.Label>
                      <Form.Control
                        name={fld}
                        value={it[fld]}
                        onChange={e => handleChange(idx, fld, e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                ))}
                <Col md={3} className="mb-2">
                  <Form.Group>
                    <Form.Label>Hata Durumu</Form.Label>
                    <Form.Select
                      name="hata_durumu"
                      value={it.hata_durumu}
                      onChange={e => handleChange(idx, 'hata_durumu', e.target.value)}>
                      <option value={0}>Yok</option>
                      <option value={1}>Var</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
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