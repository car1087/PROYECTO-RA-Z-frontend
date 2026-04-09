import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarActive, setSidebarActive] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      window.location.href = '/login';
      return;
    }
    try {
      setUsuario(JSON.parse(user));
    } catch (error) {
      console.error('Error parsing user:', error);
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
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
          <li><Link to="/dashboard/informacion-medica"><span className="icon">🩺</span> Mi información médica</Link></li>
          <li><Link to="/dashboard/contactos"><span className="icon">👥</span> Contactos de emergencia</Link></li>
          <li><Link to="/dashboard/dispositivo-qr"><span className="icon">🔳</span> Mi dispositivo QR</Link></li>
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
              <div className="profile-photo">👤</div>
              <span className="user-role">{usuario ? usuario.rol : 'Cargando...'}</span>
            </div>
          </div>
        </header>

        {/* 📦 Contenedor dinámico donde se cargarán los módulos */}
        <section className="content">
          <div id="contenido-dinamico">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;