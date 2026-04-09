import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import './EditarInformacion.css';

const EditarInformacion = () => {
  const navigate = useNavigate();
  const [selectedForm, setSelectedForm] = useState(null);

  // States for fetched data
  const [datosPersonales, setDatosPersonales] = useState({});
  const [enfermedades, setEnfermedades] = useState([]);
  const [alergias, setAlergias] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);

  // States for form data
  const [formDatos, setFormDatos] = useState({ nombre_completo: '', fecha_nacimiento: '', grupo_sanguineo: '', tipo_documento: '', numero_documento: '', numero_telefono: '', edad: '' });
  const [userEmail, setUserEmail] = useState('');
  const [formMedicamento, setFormMedicamento] = useState({ nombre_medicamento: '', dosis: '', via_administracion: '', cantidad_dosis_dia: '' });
  const [formAlergia, setFormAlergia] = useState({ tipo_alergia: '', sustancia: '', severidad_reaccion: '' });
  const [formEnfermedad, setFormEnfermedad] = useState({ nombre_enfermedad: '' });
  const [editingEnfermedadId, setEditingEnfermedadId] = useState(null);
  const [editingMedicamentoId, setEditingMedicamentoId] = useState(null);
  const [editingAlergiaId, setEditingAlergiaId] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      try {
        const [datosRes, enfRes, alerRes, medRes] = await Promise.all([
          fetch(`${API_URL}/api/dashboard/datos-personales`, { headers }),
          fetch(`${API_URL}/api/dashboard/enfermedades-base`, { headers }),
          fetch(`${API_URL}/api/dashboard/alergias`, { headers }),
          fetch(`${API_URL}/api/dashboard/medicamentos`, { headers }),
        ]);

        const datos = await datosRes.json();
        const enf = await enfRes.json();
        const aler = await alerRes.json();
        const med = await medRes.json();

        setDatosPersonales(datos);
        setEnfermedades(enf);
        setAlergias(aler);
        setMedicamentos(med);

        setFormDatos({
          nombre_completo: datos.nombre_completo || '',
          fecha_nacimiento: datos.fecha_nacimiento || '',
          grupo_sanguineo: datos.grupo_sanguineo || '',
          tipo_documento: datos.tipo_documento || '',
          numero_documento: datos.numero_documento || '',
          numero_telefono: datos.numero_telefono || '',
          edad: datos.fecha_nacimiento ? calculateAge(datos.fecha_nacimiento) : ''
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [API_URL]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.user.email);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [API_URL]);

  const handleSubmodulo = (modulo) => {
    setSelectedForm(modulo);
  };

  const handleVolver = () => {
    navigate('/dashboard/informacion');
  };

  const handleBackToMenu = () => {
    setSelectedForm(null);
  };

  const handleSaveDatos = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/informacion-medica`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDatos),
      });

      if (response.ok) {
        alert('Datos personales guardados');
      } else {
        alert('Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSaveMedicamento = async () => {
    const token = localStorage.getItem('token');
    try {
      const method = editingMedicamentoId ? 'PUT' : 'POST';
      const url = editingMedicamentoId ? `${API_URL}/api/medicamentos/${editingMedicamentoId}` : `${API_URL}/api/medicamentos`;
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formMedicamento),
      });

      if (response.ok) {
        alert(editingMedicamentoId ? 'Medicamento actualizado' : 'Medicamento agregado');
        setFormMedicamento({ nombre_medicamento: '', dosis: '', via_administracion: '', cantidad_dosis_dia: '' });
        setEditingMedicamentoId(null);
        // Refetch medicamentos
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch(`${API_URL}/api/dashboard/medicamentos`, { headers });
        setMedicamentos(await res.json());
      } else {
        alert('Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSaveAlergia = async () => {
    const token = localStorage.getItem('token');
    try {
      const method = editingAlergiaId ? 'PUT' : 'POST';
      const url = editingAlergiaId ? `${API_URL}/api/alergias/${editingAlergiaId}` : `${API_URL}/api/alergias`;
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formAlergia),
      });

      if (response.ok) {
        alert(editingAlergiaId ? 'Alergia actualizada' : 'Alergia agregada');
        setFormAlergia({ tipo_alergia: '', sustancia: '', severidad_reaccion: '' });
        setEditingAlergiaId(null);
        // Refetch alergias
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch(`${API_URL}/api/dashboard/alergias`, { headers });
        setAlergias(await res.json());
      } else {
        alert('Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSaveEnfermedad = async () => {
    const token = localStorage.getItem('token');
    try {
      const method = editingEnfermedadId ? 'PUT' : 'POST';
      const url = editingEnfermedadId ? `${API_URL}/api/enfermedades/${editingEnfermedadId}` : `${API_URL}/api/enfermedades`;
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formEnfermedad),
      });

      if (response.ok) {
        alert(editingEnfermedadId ? 'Enfermedad actualizada' : 'Enfermedad agregada');
        setFormEnfermedad({ nombre_enfermedad: '' });
        setEditingEnfermedadId(null);
        // Refetch enfermedades
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch(`${API_URL}/api/dashboard/enfermedades-base`, { headers });
        setEnfermedades(await res.json());
      } else {
        alert('Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditEnfermedad = (enfermedad) => {
    setEditingEnfermedadId(enfermedad.id);
    setFormEnfermedad({ nombre_enfermedad: enfermedad.nombre_enfermedad });
  };

  const handleDeleteEnfermedad = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/enfermedades/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        // Refetch enfermedades
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch(`${API_URL}/api/dashboard/enfermedades-base`, { headers });
        setEnfermedades(await res.json());
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditMedicamento = (medicamento) => {
    setEditingMedicamentoId(medicamento.id);
    setFormMedicamento({
      nombre_medicamento: medicamento.nombre_medicamento,
      dosis: medicamento.dosis,
      via_administracion: medicamento.via_administracion,
      cantidad_dosis_dia: medicamento.cantidad_dosis_dia
    });
  };

  const handleDeleteMedicamento = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/medicamentos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        // Refetch medicamentos
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch(`${API_URL}/api/dashboard/medicamentos`, { headers });
        setMedicamentos(await res.json());
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditAlergia = (alergia) => {
    setEditingAlergiaId(alergia.id);
    setFormAlergia({
      tipo_alergia: alergia.tipo_alergia,
      sustancia: alergia.sustancia,
      severidad_reaccion: alergia.severidad_reaccion
    });
  };

  const handleDeleteAlergia = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/alergias/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        // Refetch alergias
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch(`${API_URL}/api/dashboard/alergias`, { headers });
        setAlergias(await res.json());
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderForm = () => {
    switch (selectedForm) {
      case 'datos_personales':
        return (
          <form className="formulario">
            <h2>Datos Personales</h2>
            <div className="form-group">
              <label>Nombre completo</label>
              <input type="text" value={formDatos.nombre_completo} onChange={(e) => setFormDatos({...formDatos, nombre_completo: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Tipo de documento</label>
              <select value={formDatos.tipo_documento} onChange={(e) => setFormDatos({...formDatos, tipo_documento: e.target.value})}>
                <option value="">Seleccione</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="PA">Pasaporte</option>
              </select>
            </div>
            <div className="form-group">
              <label>Número de documento</label>
              <input type="text" value={formDatos.numero_documento} onChange={(e) => setFormDatos({...formDatos, numero_documento: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Fecha de nacimiento</label>
              <input type="date" value={formDatos.fecha_nacimiento} onChange={(e) => {
                const newFecha = e.target.value;
                setFormDatos({
                  ...formDatos,
                  fecha_nacimiento: newFecha,
                  edad: newFecha ? calculateAge(newFecha) : ''
                });
              }} />
            </div>
            <div className="form-group">
              <label>Número de teléfono</label>
              <input type="tel" value={formDatos.numero_telefono} onChange={(e) => setFormDatos({...formDatos, numero_telefono: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Edad</label>
              <input type="number" value={formDatos.edad} disabled />
            </div>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input type="email" value={userEmail} disabled />
            </div>
            <div className="form-group">
              <label>Grupo sanguíneo</label>
              <select value={formDatos.grupo_sanguineo} onChange={(e) => setFormDatos({...formDatos, grupo_sanguineo: e.target.value})}>
                <option value="">Seleccione</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div className="botonera">
              <button type="button" className="btn-guardar" onClick={handleSaveDatos}>Guardar cambios</button>
              <button type="button" className="btn-volver" onClick={handleBackToMenu}>Volver al menú</button>
            </div>
          </form>
        );
      case 'medicamentos':
        return (
          <form className="formulario">
            <h2>Medicamentos</h2>
            <ul className="form-enfermedades">
              {medicamentos.map(m => (
                <li key={m.id} className="enfermedad-item">
                  <span>{m.nombre_medicamento} - {m.dosis} ({m.via_administracion})</span>
                  <div className="buttons">
                    <button type="button" onClick={() => handleEditMedicamento(m)}>✏️</button>
                    <button type="button" onClick={() => handleDeleteMedicamento(m.id)}>🗑️</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="form-group">
              <label>Nombre del medicamento</label>
              <input type="text" value={formMedicamento.nombre_medicamento} onChange={(e) => setFormMedicamento({...formMedicamento, nombre_medicamento: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Dosis</label>
              <input type="text" value={formMedicamento.dosis} onChange={(e) => setFormMedicamento({...formMedicamento, dosis: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Vía de administración</label>
              <input type="text" value={formMedicamento.via_administracion} onChange={(e) => setFormMedicamento({...formMedicamento, via_administracion: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Cantidad de dosis al día</label>
              <input type="number" value={formMedicamento.cantidad_dosis_dia} onChange={(e) => setFormMedicamento({...formMedicamento, cantidad_dosis_dia: e.target.value})} />
            </div>
            <div className="botonera">
              <button type="button" className="btn-guardar" onClick={handleSaveMedicamento}>{editingMedicamentoId ? 'Actualizar medicamento' : 'Agregar medicamento'}</button>
              <button type="button" className="btn-volver" onClick={handleBackToMenu}>Volver al menú</button>
            </div>
          </form>
        );
      case 'alergias':
        return (
          <form className="formulario">
            <h2>Alergias</h2>
            <ul className="form-enfermedades">
              {alergias.map(a => (
                <li key={a.id} className="enfermedad-item">
                  <span>{a.tipo_alergia}: {a.sustancia} ({a.severidad_reaccion})</span>
                  <div className="buttons">
                    <button type="button" onClick={() => handleEditAlergia(a)}>✏️</button>
                    <button type="button" onClick={() => handleDeleteAlergia(a.id)}>🗑️</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="form-group">
              <label>Tipo de alergia</label>
              <input type="text" value={formAlergia.tipo_alergia} onChange={(e) => setFormAlergia({...formAlergia, tipo_alergia: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Sustancia</label>
              <input type="text" value={formAlergia.sustancia} onChange={(e) => setFormAlergia({...formAlergia, sustancia: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Severidad de reacción</label>
              <input type="text" value={formAlergia.severidad_reaccion} onChange={(e) => setFormAlergia({...formAlergia, severidad_reaccion: e.target.value})} />
            </div>
            <div className="botonera">
              <button type="button" className="btn-guardar" onClick={handleSaveAlergia}>{editingAlergiaId ? 'Actualizar alergia' : 'Agregar alergia'}</button>
              <button type="button" className="btn-volver" onClick={handleBackToMenu}>Volver al menú</button>
            </div>
          </form>
        );
      case 'enfermedades_base':
        return (
          <form className="formulario">
            <h2>Enfermedades de Base</h2>
            <ul className="form-enfermedades">
              {enfermedades.map(e => (
                <li key={e.id} className="enfermedad-item">
                  <span>{e.nombre_enfermedad}</span>
                  <div className="buttons">
                    <button type="button" onClick={() => handleEditEnfermedad(e)}>✏️</button>
                    <button type="button" onClick={() => handleDeleteEnfermedad(e.id)}>🗑️</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="form-group">
              <label>Nombre de la enfermedad</label>
              <textarea rows="2" value={formEnfermedad.nombre_enfermedad} onChange={(e) => setFormEnfermedad({...formEnfermedad, nombre_enfermedad: e.target.value})}></textarea>
            </div>
            <div className="botonera">
              <button type="button" className="btn-guardar" onClick={handleSaveEnfermedad}>{editingEnfermedadId ? 'Actualizar enfermedad' : 'Agregar enfermedad'}</button>
              <button type="button" className="btn-volver" onClick={handleBackToMenu}>Volver al menú</button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <section className="modulo editar-info">
      <div className="contenedor">
        {!selectedForm ? (
          <>
            <ul>
              <li><NavLink to="#" onClick={(e) => { e.preventDefault(); handleSubmodulo('datos_personales'); }} className={selectedForm === 'datos_personales' ? 'active' : ''}>Datos personales</NavLink></li>
              <li><NavLink to="#" onClick={(e) => { e.preventDefault(); handleSubmodulo('enfermedades_base'); }} className={selectedForm === 'enfermedades_base' ? 'active' : ''}>Enfermedades de base</NavLink></li>
              <li><NavLink to="#" onClick={(e) => { e.preventDefault(); handleSubmodulo('medicamentos'); }} className={selectedForm === 'medicamentos' ? 'active' : ''}>Medicamentos</NavLink></li>
              <li><NavLink to="#" onClick={(e) => { e.preventDefault(); handleSubmodulo('alergias'); }} className={selectedForm === 'alergias' ? 'active' : ''}>Alergias</NavLink></li>
            </ul>
          </>
        ) : (
          renderForm()
        )}
      </div>
    </section>
  );
};

export default EditarInformacion;