import { useState, useEffect } from 'react';

const Contactos = () => {
  const [contactos, setContactos] = useState([]);
  const [formContacto, setFormContacto] = useState({ nombre: '', relacion: '', telefono: '' });

  useEffect(() => {
    const fetchContactos = async () => {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      try {
        const response = await fetch('http://localhost:3000/api/dashboard/contactos', { headers });
        if (response.ok) {
          const data = await response.json();
          setContactos(data);
        }
      } catch (error) {
        console.error('Error fetching contactos:', error);
      }
    };
    fetchContactos();
  }, []);

  const handleSaveContacto = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/contactos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formContacto),
      });

      if (response.ok) {
        alert('Contacto agregado');
        setFormContacto({ nombre: '', relacion: '', telefono: '' });
        // Refetch contactos
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch('http://localhost:3000/api/dashboard/contactos', { headers });
        setContactos(await res.json());
      } else {
        alert('Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <section className="modulo contactos">
      <div className="contenedor">
        <h1>Contactos de Emergencia</h1>
        <div className="form-enfermedades">
          {contactos.map(c => <div key={c.id} className="enfermedad">{c.nombre} ({c.relacion}) - {c.telefono}</div>)}
        </div>
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
            <button type="button" className="btn-guardar" onClick={handleSaveContacto}>Agregar Contacto</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contactos;