import { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import './Dashboard.css'; // Asegúrate de que el CSS esté en src/Dashboard.css

const Dashboard = () => {
  // --- (Aquí va toda la LÓGICA que ya tenías) ---
  // (useState, useEffect, handleLogout, etc.)
  const navigate = useNavigate();
  const [sidebarActive, setSidebarActive] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [loadingSesion, setLoadingSesion] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    const savedAvatar = localStorage.getItem('avatarPreview');
    if (savedAvatar) {
      setAvatarPreview(savedAvatar);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchUsuario = async () => {
      try {
        const response = await fetch('https://proyecto-ra-z-backend-production.up.railway.app/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setUsuario(data.user);
          return;
        }

        // Solo cerrar sesion si el backend confirma token invalido/expirado.
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error validando sesion:', error);
      } finally {
        setLoadingSesion(false);
      }
    };
    fetchUsuario();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      if (typeof imageData === 'string') {
        setAvatarPreview(imageData);
        localStorage.setItem('avatarPreview', imageData);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- (Fin de la Lógica) ---


  // --- (Aquí va el HTML) ---
  return (

    // Pega aquí el contenido de tu HTML,
    // pero SOLO la parte de adentro del <body>

    <div className="dashboard">

      {/* 🧭 Sidebar */}
      <aside className={`sidebar ${sidebarActive ? 'active' : ''}`} id="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            {/* OJO: React no puede cargar "assets/img...", 
                tendrás que mover la imagen a la carpeta 'public' */}
            <img src="/LOGO_PILD.png" alt="Logo PILD" className="logo-pild" />
            <div className="logo-text">
              <h1>PILD</h1>
              <p>Personal Identification and Localization Devices</p>
            </div>
          </div>
        </div>

        {/* 📋 Menú lateral */}
        <ul className="menu">
          <li><Link to="/dashboard"><span className="icon">🏠</span> Inicio</Link></li>
          <li><Link to="/dashboard/informacion"><span className="icon">🩺</span> Mi información médica</Link></li>
          <li><Link to="/dashboard/contactos"><span className="icon">👥</span> Contactos de emergencia</Link></li>
          <li><Link to="/dashboard/qr"><span className="icon">🔳</span> Mi dispositivo QR</Link></li>
          <li><Link to="/dashboard/ajustes"><span className="icon">⚙️</span> Ajustes de cuenta</Link></li>
        </ul>
      </aside>

      {/* 🧩 Contenido principal */}
      <main className="main-content">

        {/* 🔝 Barra superior */}
        <header className="topbar">
          <button className="toggle-btn" id="toggle-btn" onClick={toggleSidebar}>☰</button>
          <div className="user-panel">
            <a href="#" className="logout" onClick={handleLogout}>Cerrar sesión</a>
            <div className="user-avatar">
              <label className="avatar" htmlFor="avatar-upload" title="Subir foto de perfil">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Foto de perfil" />
                ) : (
                  <span className="avatar-placeholder">👤</span>
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              <span className="avatar-upload-text">Subir foto</span>
              <span className="user-role">{usuario?.email || ''}</span>
            </div>
          </div>
        </header>

        {/* 📦 Contenedor dinámico donde se cargarán los módulos */}
        <section className="content">
          <div id="contenido-dinamico">
            {loadingSesion ? <p>Cargando sesion...</p> : <Outlet />}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;