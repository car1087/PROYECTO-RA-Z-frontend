import { useState, useEffect } from 'react';

const EstadoInicialQR = () => {
  const [estado, setEstado] = useState('');

  useEffect(() => {
    const fetchEstado = async () => {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      try {
        const response = await fetch('http://localhost:3000/api/dashboard/dispositivo/estado', { headers });
        if (response.ok) {
          const data = await response.json();
          setEstado(data.estado);
        }
      } catch (error) {
        console.error('Error fetching estado:', error);
      }
    };
    fetchEstado();
  }, []);

  return (
    <div>
      <h2>Estado General del Dispositivo QR</h2>
      <p>Estado: {estado}</p>
    </div>
  );
};

export default EstadoInicialQR;