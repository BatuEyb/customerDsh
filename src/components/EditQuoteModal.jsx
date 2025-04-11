import React from "react";
import { Modal, Button, Form, Row } from "react-bootstrap";

const EditQuoteModal = ({
  show,
  onHide,
  quote,
  onSaveChanges,
  editedQuote,
  setEditedQuote,
}) => {
  if (!quote) return null;

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...editedQuote.items];
    const item = { ...updatedItems[index], [field]: value };

    const quantity = parseFloat(item.quantity) || 0;
    const unit_price = parseFloat(item.unit_price) || 0;
    const discounted_unit_price = parseFloat(item.discounted_unit_price) || 0;
    const discount = parseFloat(item.discount) || 0;

    if (field === "discounted_unit_price") {
      item.discount = ((1 - discounted_unit_price / unit_price) * 100).toFixed(2);
    } else if (field === "discount") {
      item.discounted_unit_price = (unit_price * (1 - discount / 100)).toFixed(2);
    }

    const finalPrice = parseFloat(item.discounted_unit_price || unit_price);
    item.total_price = (quantity * finalPrice).toFixed(2);

    updatedItems[index] = item;
    const newTotalAmount = updatedItems.reduce(
      (sum, item) => sum + parseFloat(item.total_price || 0),
      0
    );

    setEditedQuote({
      ...editedQuote,
      items: updatedItems,
      total_amount: newTotalAmount.toFixed(2),
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Teklifi Düzenle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            <Row>
          {/* Müşteri Adı */}
          <Form.Group className="mb-3 col-md-3">
            <Form.Label>Müşteri Adı</Form.Label>
            <Form.Control
              type="text"
              value={editedQuote.customer_name || ""}
              readOnly
              plaintext
            />
          </Form.Group>

          {/* Müşteri Adresi */}
          <Form.Group className="mb-3 col-md-9">
            <Form.Label>Adres</Form.Label>
            <Form.Control
              type="text"
              value={editedQuote.customer_address || ""}
              readOnly
              plaintext
            />
          </Form.Group>
          </Row>
          {/* Durum Seçimi */}
          <Form.Group className="mb-3">
            <Form.Label>Durum</Form.Label>
            <Form.Select
              value={editedQuote.status || "Bekliyor"}
              onChange={(e) =>
                setEditedQuote({ ...editedQuote, status: e.target.value })
              }
            >
              <option value="Bekliyor">Bekliyor</option>
              <option value="Onaylandı">Onaylandı</option>
              <option value="Reddedildi">Reddedildi</option>
            </Form.Select>
          </Form.Group>

          <h5>Ürünler</h5>
          {/* Ürünler Listesi */}
          {editedQuote.items.map((item, index) => (
            <div key={index} className="mb-3 border rounded p-3">
              <Row>
              <Form.Group className="mb-3 col-md-1">
                <Form.Label>Sıra</Form.Label>
                <Form.Control
                  type="text"
                  value={index + 1}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3 col-md-8">
                <Form.Label>Ürün Adı</Form.Label>
                <Form.Control
                  type="text"
                  value={item.product_name || ""}
                  disabled
                />
              </Form.Group>

              <Form.Group className="mb-3 col-md-3">
                <Form.Label>Birim Fiyat</Form.Label>
                <Form.Control
                  type="text"
                  value={parseFloat(item.unit_price).toFixed(2) || ""}
                  disabled
                />
              </Form.Group>
              </Row>
              <Row>
              <Form.Group className="mb-3 col-md-2">
                <Form.Label>Adet</Form.Label>
                <Form.Control
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3 col-md-2">
                <Form.Label>İskonto (%)</Form.Label>
                <Form.Control
                  type="number"
                  value={item.discount}
                  onChange={(e) =>
                    handleItemChange(index, "discount", e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3 col-md-8">
                <Form.Label>İskontolu Fiyat</Form.Label>
                <Form.Control
                  type="number"
                  value={item.discounted_unit_price}
                  onChange={(e) =>
                    handleItemChange(index, "discounted_unit_price", e.target.value)
                  }
                />
              </Form.Group>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Toplam</Form.Label>
                <Form.Control
                  type="text"
                  value={parseFloat(item.total_price).toFixed(2) || ""}
                  disabled
                />
              </Form.Group>
            </div>
          ))}

          <h5 className="mt-3">
            Toplam Tutar: {Number(editedQuote.total_amount || 0).toFixed(2)} ₺
          </h5>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          İptal
        </Button>
        <Button variant="primary" onClick={onSaveChanges}>
          Kaydet
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditQuoteModal;
