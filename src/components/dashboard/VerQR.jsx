import React from 'react';
import { useState, useEffect } from 'react';

const VerQR = () => {
  console.log('VerQR component rendered');
  const [url, setUrl] = useState('');
  const [usuario, setUsuario] = useState(null);

  const [estado, setEstado] = useState('');
  const [contactos, setContactos] = useState([]);
  const [formContacto, setFormContacto] = useState({ nombre: '', relacion: '', telefono: '' });


  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch(`https://proyecto-ra-z-backend-production.up.railway.app/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Usuario obtenido:', data.user);
          setUsuario(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [API_URL]);

  useEffect(() => {
    if (usuario) {
      const origin = window.location.origin;
      const publicUrl = `${origin}/perfil-publico/${usuario.id}`;
      console.log('URL pública construida:', publicUrl);
      setUrl(publicUrl);
    }
  }, [usuario]);

  useEffect(() => {
    const fetchEstado = async () => {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      try {
        const response = await fetch(`https://proyecto-ra-z-backend-production.up.railway.app/api/dashboard/dispositivo/estado`, { headers });
        if (response.ok) {
          const data = await response.json();
          setEstado(data.estado);
        }
      } catch (error) {
        console.error('Error fetching estado:', error);
      }
    };
    fetchEstado();
  }, [API_URL]);

  useEffect(() => {
    const fetchContactos = async () => {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      try {
        const response = await fetch(`https://proyecto-ra-z-backend-production.up.railway.app/api/dashboard/contactos`, { headers });
        if (response.ok) {
          const data = await response.json();
          setContactos(data);
        }
      } catch (error) {
        console.error('Error fetching contactos:', error);
      }
    };
    fetchContactos();
  }, [API_URL]);

  return (
    <div>
      <h2>Estado General del Dispositivo QR</h2>
      <p>Estado: {estado}</p>
      {url ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ fontSize: '1.2em' }}>ID Único: {usuario?.id}</p>
          {/* ENLACE PÚBLICO CLICKEABLE */}
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all', fontWeight: 'bold', color: '#007bff' }}>
            {url}
          </a>
        </div>
      ) : (
        <p>Cargando información del usuario...</p>
      )}
      <h3>Contactos de Emergencia</h3>
      <ul>
        {contactos.map(c => (
          <li key={c.id}>{c.nombre} ({c.relacion}) - {c.telefono}</li>
        ))}
      </ul>
      <form>
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" value={formContacto.nombre} onChange={(e) => setFormContacto({...formContacto, nombre: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Relación</label>
          <input type="text" value={formContacto.relacion} onChange={(e) => setFormContacto({...formContacto, relacion: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input type="tel" value={formContacto.telefono} onChange={(e) => setFormContacto({...formContacto, telefono: e.target.value})} />
        </div>
        <button type="button">Guardar</button>
      </form>
    </div>
  );
};

export default VerQR;