import React, { useState } from 'react';

const AddCustomer = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [customerType, setCustomerType] = useState('');
    const [tcIdentityNumber, setTcIdentityNumber] = useState('');
    const [taxNumber, setTaxNumber] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const customerData = {
            name,
            email,
            phone,
            address,
            customer_type: customerType,
            tc_identity_number: tcIdentityNumber,
            tax_number: taxNumber
        };
    
        // Veriyi logla
        console.log("Gönderilen Veriler:", customerData); // Bu, gönderilen veriyi konsolda gösterecektir.
    
        try {
            const response = await fetch('http://localhost/customerDsh/src/api/add_customer.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(customerData)
            });
    
            const result = await response.json();
            if (result.success) {
                setMessage('Müşteri başarıyla eklendi.');
                setError('');
            } else {
                setMessage('');
                setError(result.message || 'Bir hata oluştu.');
            }
        } catch (error) {
            setError('Bir hata oluştu.');
            setMessage('');
        }
    };

    return (
        <div className="mt-3">
            <h2 className="mb-4">Müşteri Ekle</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className='row'>
                <h3 className="mb-2">Müşteri Bilgileri</h3>
                <div className="col-md-4 mb-3">
                    <label htmlFor="name" className="form-label">Adı</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="name"
                        placeholder="Müşteri Adı"
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="email"
                        placeholder="Email adresi"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <label htmlFor="phone" className="form-label">Telefon</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="phone"
                        placeholder="Telefon Numarası"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)} 
                    />
                </div>
                <hr />
                <h3 className="mb-2">Fatura Bilgileri</h3>
                <div className="col-md-4">
                    <label htmlFor="customerType" className="form-label">Müşteri Tipi</label>
                    <select 
                        className="form-select" 
                        id="customerType" 
                        value={customerType} 
                        onChange={(e) => setCustomerType(e.target.value)}
                    >
                        <option value="">Seçiniz</option>
                        <option value="Bireysel">Bireysel</option>
                        <option value="Kurumsal">Kurumsal</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <label htmlFor="tcIdentityNumber" className="form-label">TC Kimlik Numarası</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="tcIdentityNumber"
                        placeholder="TC Kimlik Numarası"
                        value={tcIdentityNumber}
                        onChange={(e) => setTcIdentityNumber(e.target.value)} 
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="taxNumber" className="form-label">Vergi Numarası</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="taxNumber"
                        placeholder="Vergi Numarası"
                        value={taxNumber}
                        onChange={(e) => setTaxNumber(e.target.value)} 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Adres</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="address"
                        placeholder="Adres"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)} 
                    />
                </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Müşteri Ekle</button>
            </form>
        </div>
    );
};

export default AddCustomer;
