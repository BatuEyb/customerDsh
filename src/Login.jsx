import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "./api";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // password_hash yerine düz password kullan
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await apiFetch('login.php', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    });

    const data = await response.json();

    if (data.success) {
        // Giriş başarılıysa, kullanıcı bilgilerini localStorage'a kaydet
        localStorage.setItem('user_id', data.user_id); // Kullanıcı ID'sini kaydediyoruz
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', data.username);
        localStorage.setItem('name', data.name);
        // Dashboard'a yönlendir
        navigate('/dashboard');
    } else {
        // Giriş başarısızsa hata mesajı
        setError(data.message || 'Giriş yaparken bir hata oluştu');
    }
};

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100 h-100">
        {/* Sol Taraf: Başlık ve Açıklama */}
        <div className="col-lg-8 col-md-8 d-none d-md-flex flex-column justify-content-center align-items-center text-white bg-primary p-5">
          <h1 className="fw-bold">Hoş Geldiniz!</h1>
          <p className="lead text-center" style={{ maxWidth: "500px" }}>
            Hızlı ve güvenli bir şekilde giriş yaparak panelinize erişebilirsiniz.
          </p>
        </div>

        {/* Sağ Taraf: Login Formu */}
        <div className="col-lg-4 col-md-4 col-sm-12 d-flex align-items-center justify-content-center bg-light p-5">
          <div style={{ width: "100%", maxWidth: "500px" }}>
            <h2 className="text-center mb-4">Giriş Yap</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
              <label htmlFor="username" className="form-label">Kullanıcı Adı</label>
              <input
                type="text"
                id="username"
                className="form-control form-control-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Şifre</label>
              <input
                type="password"
                id="password"
                className="form-control form-control-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              className="btn btn-primary w-100 btn-lg"
              onClick={handleLogin}
            >
              Giriş Yap
            </button>

            <p className="mt-3 text-center">
              <a href="#" className="text-primary">Şifremi Unuttum</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
