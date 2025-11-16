import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
          fetch('http://localhost:3000/api/dashboard/datos-personales', { headers }),
          fetch('http://localhost:3000/api/dashboard/enfermedades-base', { headers }),
          fetch('http://localhost:3000/api/dashboard/alergias', { headers }),
          fetch('http://localhost:3000/api/dashboard/medicamentos', { headers }),
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
  }, []);

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
          setUserEmail(data.user.email);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

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
      const response = await fetch('http://localhost:3000/api/informacion-medica', {
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
      const response = await fetch('http://localhost:3000/api/medicamentos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formMedicamento),
      });

      if (response.ok) {
        alert('Medicamento agregado');
        setFormMedicamento({ nombre_medicamento: '', dosis: '', via_administracion: '', cantidad_dosis_dia: '' });
        // Refetch medicamentos
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch('http://localhost:3000/api/dashboard/medicamentos', { headers });
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
      const response = await fetch('http://localhost:3000/api/alergias', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formAlergia),
      });

      if (response.ok) {
        alert('Alergia agregada');
        setFormAlergia({ tipo_alergia: '', sustancia: '', severidad_reaccion: '' });
        // Refetch alergias
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch('http://localhost:3000/api/dashboard/alergias', { headers });
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
      const response = await fetch('http://localhost:3000/api/enfermedades', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formEnfermedad),
      });

      if (response.ok) {
        alert('Enfermedad agregada');
        setFormEnfermedad({ nombre_enfermedad: '' });
        // Refetch enfermedades
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch('http://localhost:3000/api/dashboard/enfermedades-base', { headers });
        setEnfermedades(await res.json());
      } else {
        alert('Error al guardar');
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
            <div className="form-enfermedades">
              {medicamentos.map(m => <div key={m.id} className="enfermedad">{m.nombre_medicamento} - {m.dosis} ({m.via_administracion})</div>)}
            </div>
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
              <button type="button" className="btn-guardar" onClick={handleSaveMedicamento}>Guardar cambios</button>
              <button type="button" className="btn-volver" onClick={handleBackToMenu}>Volver al menú</button>
            </div>
          </form>
        );
      case 'alergias':
        return (
          <form className="formulario">
            <h2>Alergias</h2>
            <div className="form-enfermedades">
              {alergias.map(a => <div key={a.id} className="enfermedad">{a.tipo_alergia}: {a.sustancia} ({a.severidad_reaccion})</div>)}
            </div>
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
              <button type="button" className="btn-guardar" onClick={handleSaveAlergia}>Guardar cambios</button>
              <button type="button" className="btn-volver" onClick={handleBackToMenu}>Volver al menú</button>
            </div>
          </form>
        );
      case 'enfermedades_base':
        return (
          <form className="formulario">
            <h2>Enfermedades de Base</h2>
            <div className="form-enfermedades">
              {enfermedades.map(e => <div key={e.id} className="enfermedad">{e.nombre_enfermedad}</div>)}
            </div>
            <div className="form-group">
              <label>Nombre de la enfermedad</label>
              <textarea rows="2" value={formEnfermedad.nombre_enfermedad} onChange={(e) => setFormEnfermedad({...formEnfermedad, nombre_enfermedad: e.target.value})}></textarea>
            </div>
            <div className="botonera">
              <button type="button" className="btn-guardar" onClick={handleSaveEnfermedad}>Guardar cambios</button>
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
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleSubmodulo('datos_personales'); }}>Datos personales</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleSubmodulo('enfermedades_base'); }}>Enfermedades de base</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleSubmodulo('medicamentos'); }}>Medicamentos</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleSubmodulo('alergias'); }}>Alergias</a></li>
            </ul>

            <button className="btn" onClick={handleVolver}>
              ← Volver
            </button>
          </>
        ) : (
          renderForm()
        )}
      </div>
    </section>
  );
};

export default EditarInformacion;