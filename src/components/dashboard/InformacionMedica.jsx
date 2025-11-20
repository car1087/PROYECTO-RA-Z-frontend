import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Dashboard.css';

const InformacionMedica = () => {
  const navigate = useNavigate();
  const [datosPersonales, setDatosPersonales] = useState(null);
  const [informacionMedica, setInformacionMedica] = useState(null);
  const [enfermedades, setEnfermedades] = useState([]);
  const [alergias, setAlergias] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        const [datosRes, infoRes, enfRes, alerRes, medRes] = await Promise.all([
          fetch('http://localhost:3000/api/dashboard/datos-personales', { headers }),
          fetch('http://localhost:3000/api/dashboard/informacion-medica', { headers }),
          fetch('http://localhost:3000/api/dashboard/enfermedades-base', { headers }),
          fetch('http://localhost:3000/api/dashboard/alergias', { headers }),
          fetch('http://localhost:3000/api/dashboard/medicamentos', { headers }),
        ]);

        if (!datosRes.ok || !infoRes.ok || !enfRes.ok || !alerRes.ok || !medRes.ok) {
          throw new Error('Error al cargar los datos');
        }

        const datosData = await datosRes.json();
        const infoData = await infoRes.json();
        const enfData = await enfRes.json();
        const alerData = await alerRes.json();
        const medData = await medRes.json();

        setDatosPersonales(datosData);
        setInformacionMedica(infoData);
        setEnfermedades(enfData);
        setAlergias(alerData);
        setMedicamentos(medData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <section className="modulo"><p>Cargando información médica...</p></section>;
  }

  if (error) {
    return <section className="modulo"><p>Error: {error}</p></section>;
  }

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

  const enfermedadesText = enfermedades.map(e => e.nombre_enfermedad).join(', ');
  const alergiasText = alergias.map(a => `${a.tipo_alergia}: ${a.sustancia} (${a.severidad_reaccion})`).join(', ');
  const medicamentosText = medicamentos.map(m => `${m.nombre_medicamento} - ${m.dosis} (${m.via_administracion})`).join(', ');

  return (
    <section className="modulo">
      <form className="info-form grid">
        <div className="form-group">
          <label>Nombre completo</label>
          <input type="text" value={datosPersonales?.nombre_completo || ''} disabled />
        </div>

        <div className="form-group">
          <label>Edad</label>
          <input type="number" value={calculateAge(datosPersonales?.fecha_nacimiento)} disabled />
        </div>

        <div className="form-group">
          <label>Grupo sanguíneo</label>
          <input type="text" value={datosPersonales?.grupo_sanguineo || informacionMedica?.tipo_sangre || ''} disabled />
        </div>

        <div className="form-group span-2">
          <label>Enfermedades de base</label>
          <textarea rows="2" value={enfermedadesText} disabled></textarea>
        </div>

        <div className="form-group span-2">
          <label>Alergias</label>
          <textarea rows="2" value={alergiasText} disabled></textarea>
        </div>

        <div className="form-group span-2">
          <label>Medicamentos</label>
          <textarea rows="2" value={medicamentosText} disabled></textarea>
        </div>

        <div className="botonera">
          <button
            type="button"
            className="btn"
            onClick={() => navigate('/dashboard/editar-informacion')}
          >
            Editar la información
          </button>
        </div>
      </form>

      <p className="nota">
        Esta información se mostrará al escanear tu código QR. Solo puede ser editada
        en la siguiente sección.
      </p>
    </section>
  );
};

export default InformacionMedica;