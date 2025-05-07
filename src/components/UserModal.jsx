import React, { useState, useEffect } from 'react';

const UserModal = ({ show, onClose, onSave, user }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'employee',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        password: '',
        role: user.role || 'employee',
      });
    } else {
      setForm({
        name: '',
        email: '',
        username: '',
        password: '',
        role: 'employee',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.username || !form.role) {
      alert('Tüm alanlar doldurulmalıdır.');
      return;
    }

    onSave(form);
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">{user ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Ad Soyad</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Kullanıcı Adı</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Şifre {user ? '(Değiştirmek için girin)' : ''}</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Rol</label>
              <select
                className="form-select"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="admin">Yönetici</option>
                <option value="employee">Çalışan</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>İptal</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              {user ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
