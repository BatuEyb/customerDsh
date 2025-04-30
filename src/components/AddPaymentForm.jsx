import React, { useState } from "react";
import { apiFetch } from "../api";

const AddPaymentForm = ({ customerId, onPaymentAdded }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await apiFetch("add_payment.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          customer_id: customerId,
          amount,
          description
        })
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setAmount("");
        setDescription("");
        if (onPaymentAdded) onPaymentAdded();
      } else {
        setMessage({ type: "danger", text: data.error || "Bir hata oluştu." });
      }

    } catch (error) {
      setMessage({ type: "danger", text: "İstek gönderilirken bir hata oluştu." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded p-3 bg-white mt-3">
      <h5>Ödeme Ekle</h5>

      {message && (
        <div className={`alert alert-${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Tutar (₺)</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Açıklama</label>
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Opsiyonel"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Kaydediliyor..." : "Ödeme Ekle"}
      </button>
    </form>
  );
};

export default AddPaymentForm;
