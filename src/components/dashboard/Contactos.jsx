import { useState, useEffect } from 'react';

const API = 'https://proyecto-ra-z-backend-production.up.railway.app/api';

const Contactos = () => {
  const [contactos, setContactos] = useState([]);
  const [formContacto, setFormContacto] = useState({ nombre: '', relacion: '', telefono: '' });
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const fetchContactos = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        const response = await fetch(`${API}/dashboard/contactos`, { headers });
        if (response.ok) {
          const data = await response.json();
          setContactos(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching contactos:', error);
      }
    };
    fetchContactos();
  }, []);

  const handleSaveContacto = async () => {
    const token = localStorage.getItem('token');
    const nombre = formContacto.nombre.trim();
    const relacion = formContacto.relacion.trim();
    const telefono = formContacto.telefono.trim();

    setMensaje('');

    if (!nombre || !relacion || !telefono) {
      setMensaje('Completa nombre, telefono y relacion antes de guardar.');
      return;
    }

    if (!token) {
      setMensaje('Tu sesion no es valida. Inicia sesion nuevamente.');
      return;
    }

    setGuardando(true);

    try {
      const payload = {
        nombre,
        telefono,
        relacion,
      };

      const response = await fetch(`${API}/contactos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMensaje('Contacto agregado correctamente.');
        setFormContacto({ nombre: '', relacion: '', telefono: '' });

        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch(`${API}/dashboard/contactos`, { headers });
        const data = await res.json();
        setContactos(Array.isArray(data) ? data : []);
      } else {
        const data = await response.json().catch(() => ({}));
        setMensaje(data.message || 'No se pudo guardar el contacto.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error de conexion al guardar el contacto.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="modulo contactos">
      <div className="contenedor">
        <h1>Contactos de Emergencia</h1>
        <div className="form-enfermedades">
          {contactos.map(c => <div key={c.id} className="enfermedad">{c.nombre} ({c.relacion}) - {c.telefono}</div>)}
        </div>
        {mensaje && <p className="nota">{mensaje}</p>}
        <form className="formulario">
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
          <div className="botonera">
            <button type="button" className="btn-guardar" onClick={handleSaveContacto} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Agregar Contacto'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contactos;