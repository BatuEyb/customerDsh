import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // password_hash yerine düz password kullan
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      const response = await fetch("http://localhost/customerDsh/src/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // "password_hash" yerine "password"
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.name);
        navigate("/dashboard");
      } else {
        setError(data.message || "Geçersiz kullanıcı adı veya şifre");
      }
    } catch (error) {
      console.error("Hata: ", error);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
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
