import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'https://proyecto-ra-z-backend-production.up.railway.app';

const Contactos = () => {
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se encontró token de acceso.');
      setLoading(false);
      return;
    }

    const fetchContactos = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/contactos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContactos(response.data.contactos || response.data || []);
      } catch (err) {
        console.error('Error cargando contactos:', err);
        setError('No se pudo cargar los contactos de emergencia.');
      } finally {
        setLoading(false);
      }
    };

    fetchContactos();
  }, []);

  return (
    <div className="modulo layout-ancho">
      <div className="formulario">
        <h2>Contactos de emergencia</h2>
        {loading ? (
          <p>Cargando contactos...</p>
        ) : error ? (
          <p>{error}</p>
        ) : contactos.length === 0 ? (
          <p>No hay contactos registrados.</p>
        ) : (
          <div className="lista-contactos">
            {contactos.map((contacto, index) => (
              <div className="contacto" key={index}>
                <input type="text" value={contacto.nombre || contacto.name || ''} disabled />
                <input type="text" value={contacto.telefono || contacto.phone || ''} disabled />
                <button className="btn" type="button">
                  Ver
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contactos;
