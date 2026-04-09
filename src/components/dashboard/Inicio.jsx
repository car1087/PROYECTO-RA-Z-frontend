import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'https://proyecto-ra-z-backend-production.up.railway.app';

const Inicio = () => {
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState(null);
  const user = localStorage.getItem('user');
  const usuario = user ? JSON.parse(user) : null;
  const nombre = usuario?.nombre || usuario?.name || usuario?.email || 'usuario';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchResumen = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/dashboard/resumen`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResumen(response.data);
      } catch (err) {
        console.error('Error cargando resumen del dashboard:', err);
        setError('No se pudo cargar el resumen. Verifica tu conexión o el backend.');
      }
    };

    fetchResumen();
  }, []);

  return (
    <div className="inicio-area">
      <section className="welcome-section">
        <h2>Bienvenido{nombre ? `, ${nombre}` : ''}</h2>
        <p>Este es tu panel de control. Selecciona una sección para continuar.</p>
      </section>

      <div className="cards-container">
        <div className="card">
          <div className="card-icon">🩺</div>
          <h3>Información médica</h3>
          <p>
            {resumen?.infoMedica || 'Actualizar tu información médica ayuda a tus contactos y servicios.'}
          </p>
        </div>

        <div className="card">
          <div className="card-icon">👥</div>
          <h3>Contactos</h3>
          <p>
            {resumen?.contactos?.length
              ? `${resumen.contactos.length} contactos registrados`
              : 'Agrega tus contactos de emergencia para estar preparado.'}
          </p>
        </div>

        <div className="card">
          <div className="card-icon">🔳</div>
          <h3>Dispositivo QR</h3>
          <p>
            {resumen?.dispositivo?.estado
              ? `Estado: ${resumen.dispositivo.estado}`
              : 'Revisa tu dispositivo QR para ver su estado actual.'}
          </p>
        </div>
      </div>

      <div id="notificaciones-recientes">
        <h3>Notificaciones recientes</h3>
        <div className="botonera-recientes">
          <button className="btn" type="button">
            Actualizar
          </button>
        </div>
        <ul className="lista-notificaciones">
          {error ? (
            <li>{error}</li>
          ) : resumen?.notificaciones?.length > 0 ? (
            resumen.notificaciones.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <li>No hay notificaciones recientes.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Inicio;
