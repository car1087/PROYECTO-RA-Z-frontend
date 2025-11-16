import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registro = () => {
  const [role, setRole] = useState('usuario');
  const [fullName, setFullName] = useState('');
  const [docType, setDocType] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const navigate = useNavigate();

  const handleRoleToggle = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          fullName,
          docType,
          docNumber,
          phone,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registro exitoso, navegar al login o dashboard
        navigate('/login');
      } else {
        console.error(data.message || 'Error en el registro');
      }
    } catch (error) {
      console.error('No se pudo conectar al servidor:', error);
    }
  };

  return (
    <main className="register">
      <header className="register__header">
        <h1 className="register__title">REGISTRO</h1>
        <p className="register__subtitle">Elige rol de Usuario</p>
        <div className="role-toggle" role="tablist" aria-label="Seleccionar rol de usuario">
          <button
            type="button"
            className={`role-toggle__btn ${role === 'usuario' ? 'is-active' : ''}`}
            data-role="usuario"
            aria-selected={role === 'usuario'}
            onClick={() => handleRoleToggle('usuario')}
          >
            Usuario
          </button>
          <button
            type="button"
            className={`role-toggle__btn ${role === 'cuidador' ? 'is-active' : ''}`}
            data-role="cuidador"
            aria-selected={role === 'cuidador'}
            onClick={() => handleRoleToggle('cuidador')}
          >
            Cuidador
          </button>
        </div>
      </header>

      <form className="register-form card" onSubmit={handleSubmit} noValidate>
        <input type="hidden" name="role" value={role} />

        <div className="grid-2">
          <section className="column">
            <label className="field-label" htmlFor="fullName">Nombre completo</label>
            <input
              className="input"
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Tu nombre y apellidos"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <label className="field-label" htmlFor="docType">Tipo de documento</label>
            <select
              className="input"
              id="docType"
              name="docType"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              required
            >
              <option value="" disabled>Selecciona...</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="PA">Pasaporte</option>
            </select>

            <label className="field-label" htmlFor="docNumber">Número de documento</label>
            <input
              className="input"
              id="docNumber"
              name="docNumber"
              type="text"
              inputMode="numeric"
              placeholder="Ej. 1234567890"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              required
            />

            <label className="field-label" htmlFor="phone">Número telefónico</label>
            <input
              className="input"
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="Ej. 3001234567"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </section>

          <section className="column">
            <label className="field-label" htmlFor="email">Correo electrónico</label>
            <input
              className="input"
              id="email"
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="field-label" htmlFor="password">Contraseña</label>
            <input
              className="input"
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label className="field-label" htmlFor="confirm">Confirma la contraseña</label>
            <input
              className="input"
              id="confirm"
              name="confirm"
              type="password"
              placeholder="Repite la contraseña"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            <div className="terms-row">
              <a className="terms-link" href="#" target="_blank" rel="noopener noreferrer">Términos y condiciones</a>
            </div>
            <label className="checkbox-row">
              <input
                type="checkbox"
                name="terms"
                id="terms"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />
              <span>Acepto los términos y condiciones</span>
            </label>
          </section>
        </div>

        <button className="button button--large" type="submit" disabled={!terms}>Crear cuenta</button>

        <div className="warning" role="alert" aria-live="polite">
          <span className="warning__icon" aria-hidden="true">⚠️</span>
          <p className="warning__text">Para continuar es obligatorio aceptar los términos y condiciones. El botón "Crear cuenta" se habilitará cuando completes los campos y marques la casilla.</p>
        </div>

        <p className="auth-links" style={{ textAlign: 'center', marginTop: '10px' }}>
          <a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
        </p>
      </form>
    </main>
  );
};

export default Registro;