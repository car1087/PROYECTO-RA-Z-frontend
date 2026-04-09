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
        if (!token) {
          navigate('/login');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const [datosRes, infoRes, enfRes, alerRes, medRes] = await Promise.allSettled([
          fetch('https://proyecto-ra-z-backend-production.up.railway.app/api/dashboard/datos-personales', { headers }),
          fetch('https://proyecto-ra-z-backend-production.up.railway.app/api/dashboard/informacion-medica', { headers }),
          fetch('https://proyecto-ra-z-backend-production.up.railway.app/api/dashboard/enfermedades-base', { headers }),
          fetch('https://proyecto-ra-z-backend-production.up.railway.app/api/dashboard/alergias', { headers }),
          fetch('https://proyecto-ra-z-backend-production.up.railway.app/api/dashboard/medicamentos', { headers }),
        ]);

        const safeJson = async (result, fallback) => {
          if (result.status !== 'fulfilled') return fallback;
          if (!result.value.ok) return fallback;
          try {
            return await result.value.json();
          } catch {
            return fallback;
          }
        };

        const authStatuses = [datosRes, infoRes, enfRes, alerRes, medRes]
          .filter((r) => r.status === 'fulfilled')
          .map((r) => r.value.status);

        // Solo redirigir si el backend confirma token invalido/expirado.
        if (authStatuses.includes(401) || authStatuses.includes(403)) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const datosData = await safeJson(datosRes, {});
        const infoData = await safeJson(infoRes, null);
        const enfData = await safeJson(enfRes, []);
        const alerData = await safeJson(alerRes, []);
        const medData = await safeJson(medRes, []);

        setDatosPersonales(datosData);
        setInformacionMedica(infoData);
        setEnfermedades(enfData);
        setAlergias(alerData);
        setMedicamentos(medData);
      } catch {
        setError('No se pudieron cargar algunos datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return <section className="modulo"><p>Cargando información médica...</p></section>;
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
      {error && <p className="nota">{error}</p>}
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