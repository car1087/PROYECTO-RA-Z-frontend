import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../../config/api';

const InformacionMedica = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se encontró token de acceso.');
      setLoading(false);
      return;
    }

    const fetchInfoMedica = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInfo(response.data.medicalInfo || response.data);
      } catch (err) {
        console.error('Error cargando información médica:', err);
        setError('No se pudo cargar la información médica.');
      } finally {
        setLoading(false);
      }
    };

    fetchInfoMedica();
  }, []);

  return (
    <div className="modulo layout-ancho">
      <div className="formulario">
        <h2>Mi información médica</h2>
        {loading ? (
          <p>Cargando información médica...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <label>Nombre completo</label>
            <input type="text" value={info?.nombre || info?.name || ''} disabled />

            <label>Grupo sanguíneo</label>
            <input type="text" value={info?.bloodType || info?.grupoSanguineo || ''} disabled />

            <label>Alergias</label>
            <textarea value={info?.alergias || info?.allergies || 'No registrada'} disabled />

            <label>Condiciones crónicas</label>
            <textarea value={info?.condiciones || info?.conditions || 'No registrada'} disabled />

            <label>Medicamentos actuales</label>
            <textarea value={info?.medicamentos || info?.medications || 'No registrada'} disabled />
          </>
        )}
      </div>
    </div>
  );
};

export default InformacionMedica;
