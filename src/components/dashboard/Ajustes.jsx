import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../../../config/api';

const Ajustes = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se encontró token de acceso.');
      setLoading(false);
      return;
    }

    const fetchAjustes = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/auth/usuarios/ajustes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConfig(response.data || {});
      } catch (err) {
        console.error('Error cargando ajustes:', err);
        setError('No se pudieron cargar los ajustes de la cuenta.');
      } finally {
        setLoading(false);
      }
    };

    fetchAjustes();
  }, []);

  return (
    <div className="modulo layout-ancho">
      <div className="formulario">
        <h2>Ajustes de cuenta</h2>
        {loading ? (
          <p>Cargando ajustes...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <label>Email</label>
            <input type="text" value={config?.email || config?.correo || ''} disabled />

            <label>Nombre</label>
            <input type="text" value={config?.nombre || config?.name || ''} disabled />

            <label>Notificaciones</label>
            <input
              type="text"
              value={config?.notificaciones ? 'Activadas' : 'Desactivadas'}
              disabled
            />

            <label>Preferencias</label>
            <textarea
              value={config?.preferencias || config?.preferences || 'No hay preferencias guardadas.'}
              disabled
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Ajustes;
