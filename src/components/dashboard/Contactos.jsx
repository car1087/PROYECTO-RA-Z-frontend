import { useState, useEffect } from 'react';
import './EditarInformacion.css';

const Contactos = () => {
  const [contactos, setContactos] = useState([]);
  const [formContacto, setFormContacto] = useState({ nombre: '', relacion: '', telefono: '' });
  const [editingContactoId, setEditingContactoId] = useState(null);

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
      const method = editingContactoId ? 'PUT' : 'POST';
      const url = editingContactoId ? `http://localhost:3000/api/contactos/${editingContactoId}` : 'http://localhost:3000/api/contactos';
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formContacto),
      });

      if (response.ok) {
        alert(editingContactoId ? 'Contacto actualizado' : 'Contacto agregado');
        setFormContacto({ nombre: '', relacion: '', telefono: '' });
        setEditingContactoId(null);
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

  const handleEditContacto = (contacto) => {
    setEditingContactoId(contacto.id);
    setFormContacto({
      nombre: contacto.nombre,
      relacion: contacto.relacion,
      telefono: contacto.telefono
    });
  };

  const handleDeleteContacto = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/dashboard/contactos-emergencia/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        // Refetch contactos
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch('http://localhost:3000/api/dashboard/contactos', { headers });
        setContactos(await res.json());
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <section className="modulo contactos">
      <div className="contenedor">
        <h1>Contactos de Emergencia</h1>
        <ul className="form-enfermedades">
          {contactos.map(c => (
            <li key={c.id} className="enfermedad-item">
              <span>{c.nombre} ({c.relacion}) - {c.telefono}</span>
              <div className="buttons">
                <button type="button" onClick={() => handleEditContacto(c)}>✏️</button>
                <button type="button" onClick={() => handleDeleteContacto(c.id)}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
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
            <button type="button" className="btn-guardar" onClick={handleSaveContacto}>{editingContactoId ? 'Actualizar contacto' : 'Agregar contacto'}</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contactos;