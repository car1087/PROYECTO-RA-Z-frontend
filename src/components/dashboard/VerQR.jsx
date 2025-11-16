import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

const VerQR = () => {
  const [url, setUrl] = useState('');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch('http://localhost:3000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUsuario(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (usuario) {
      const origin = window.location.origin;
      const publicUrl = `${origin}/perfil-publico/${usuario.id}`;
      setUrl(publicUrl);
    }
  }, [usuario]);

  return (
    <div>
      <h3>Ver código QR e ID único</h3>
      {url ? (
        <div>
          <p>ID único: {usuario?.id}</p>
          <QRCode value={url} />
        </div>
      ) : (
        <p>Cargando QR...</p>
      )}
    </div>
  );
};

export default VerQR;