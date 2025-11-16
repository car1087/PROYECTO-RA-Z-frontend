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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div>
      <h1>Perfil Público</h1>
      <h2>Nombre: {profile.nombre}</h2>
      <h3>Grupo Sanguíneo: {profile.grupoSanguineo}</h3>
      <h3>Alergias: {profile.alergias}</h3>
      <h3>Medicamentos: {profile.medicamentos}</h3>
      <h3>Contactos de Emergencia:</h3>
      <ul>
        {profile.contactosEmergencia && profile.contactosEmergencia.map((contacto, index) => (
          <li key={index}>{contacto.nombre}: {contacto.telefono}</li>
        ))}
      </ul>
    </div>
  );
}

export default PerfilPublico;