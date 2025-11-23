import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function PerfilPublico() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/perfil-publico/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <div className="loading">Cargando información...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!profile) return <div>Perfil no encontrado</div>;

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

  return (
    <div className="perfil-publico">
      <header>
        <h1>Información Médica de Emergencia</h1>
      </header>

      <section className="modulo">
        <h2>Datos Personales</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Nombre completo:</label>
            <span>{profile.informacion_medica?.nombre_completo || 'No disponible'}</span>
          </div>
          <div className="info-item">
            <label>Edad:</label>
            <span>{profile.informacion_medica?.fecha_nacimiento ? calculateAge(profile.informacion_medica.fecha_nacimiento) : 'No disponible'}</span>
          </div>
          <div className="info-item">
            <label>Grupo sanguíneo:</label>
            <span>{profile.informacion_medica?.grupo_sanguineo || profile.informacion_medica?.tipo_sangre || 'No disponible'}</span>
          </div>
        </div>
      </section>

      <section className="modulo">
        <h2>Enfermedades de Base</h2>
        <ul className="lista-enfermedades">
          {profile.enfermedades_base && profile.enfermedades_base.length > 0 ? (
            profile.enfermedades_base.map((enfermedad, index) => (
              <li key={index}>{enfermedad.nombre_enfermedad}</li>
            ))
          ) : (
            <li>No hay enfermedades registradas</li>
          )}
        </ul>
      </section>

      <section className="modulo">
        <h2>Alergias</h2>
        <ul className="lista-alergias">
          {profile.alergias && profile.alergias.length > 0 ? (
            profile.alergias.map((alergia, index) => (
              <li key={index}>
                {alergia.tipo_alergia}: {alergia.sustancia} (Severidad: {alergia.severidad_reaccion})
              </li>
            ))
          ) : (
            <li>No hay alergias registradas</li>
          )}
        </ul>
      </section>

      <section className="modulo">
        <h2>Medicamentos</h2>
        <ul className="lista-medicamentos">
          {profile.medicamentos && profile.medicamentos.length > 0 ? (
            profile.medicamentos.map((medicamento, index) => (
              <li key={index}>
                {medicamento.nombre_medicamento} - {medicamento.dosis} ({medicamento.via_administracion})
              </li>
            ))
          ) : (
            <li>No hay medicamentos registrados</li>
          )}
        </ul>
      </section>

      <section className="modulo">
        <h2>Contactos de Emergencia</h2>
        <ul className="lista-contactos">
          {profile.contactos_emergencia && profile.contactos_emergencia.length > 0 ? (
            profile.contactos_emergencia.map((contacto, index) => (
              <li key={index}>
                {contacto.nombre} ({contacto.relacion}) - {contacto.telefono}
              </li>
            ))
          ) : (
            <li>No hay contactos de emergencia registrados</li>
          )}
        </ul>
      </section>
    </div>
  );
}

export default PerfilPublico;