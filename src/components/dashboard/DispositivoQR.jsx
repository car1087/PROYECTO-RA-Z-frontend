import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'https://proyecto-ra-z-backend-production.up.railway.app';

const DispositivoQR = () => {
  const [dispositivo, setDispositivo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se encontró token de acceso.');
      setLoading(false);
      return;
    }

    const fetchDispositivo = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/dispositivo-qr`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDispositivo(response.data.dispositivo || response.data || null);
      } catch (err) {
        console.error('Error cargando dispositivo QR:', err);
        setError('No se pudo cargar los datos del dispositivo QR.');
      } finally {
        setLoading(false);
      }
    };

    fetchDispositivo();
  }, []);

  return (
    <div className="modulo layout-ancho">
      <div className="formulario">
        <h2>Mi dispositivo QR</h2>
        {loading ? (
          <p>Cargando datos del dispositivo...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <div className="info-qr-id">
              <div className="qr-mini">QR</div>
              <div className="info-qr-texto">
                <p>Dispositivo ID: {dispositivo?.id || 'No disponible'}</p>
                <p>
                  Estado:{' '}
                  <span className={
                    dispositivo?.estado === 'activo'
                      ? 'estado-activo'
                      : dispositivo?.estado === 'inactivo'
                      ? 'estado-inactivo'
                      : 'estado-parcial'
                  }>
                    {dispositivo?.estado || 'Desconocido'}
                  </span>
                </p>
              </div>
            </div>
            <label>Nombre del dispositivo</label>
            <input type="text" value={dispositivo?.nombre || dispositivo?.name || ''} disabled />
            <label>Ubicación</label>
            <input type="text" value={dispositivo?.ubicacion || dispositivo?.location || 'No disponible'} disabled />
          </>
        )}
      </div>
    </div>
  );
};

export default DispositivoQR;
