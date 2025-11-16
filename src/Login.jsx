import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Conectamos al backend real
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Si el login es bueno, guardamos el TOKEN REAL
        localStorage.setItem('token', data.token);
        // 3. Navegamos al dashboard
        navigate('/dashboard');
      } else {
        // Si el backend dice que el email o pass es incorrecto
        console.error(data.message || 'Error en el login');
        // (Aquí podrías mostrar un mensaje de error al usuario)
      }

    } catch (error) {
      // Si el servidor (puerto 3000) está apagado o hay un error de red
      console.error('No se pudo conectar al servidor:', error);
    }
  };

  return (
    <main className="login">
      {/* Columna izquierda: icono/ilustración */}
      <section className="login__left">
        {/* pin médico con marco tipo escáner */}
        <svg className="icon-hero" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* Fondo */}
          <rect width="200" height="200" fill="none"/>

          {/* Marco tipo escáner son las 4 esquinas */}
          <g fill="none" stroke="var(--azulceleste)" strokeWidth="8" strokeLinecap="round">
            <path d="M20 50 V30 Q20 20 30 20 H50"/>
            <path d="M150 20 H170 Q180 20 180 30 V50"/>
            <path d="M180 150 V170 Q180 180 170 180 H150"/>
            <path d="M50 180 H30 Q20 180 20 170 V150"/>
          </g>

          {/* Pin de ubicación */}
          <g transform="translate(100,100)">
            {/* contorno corazon */}
            <g transform="translate(0,-12) scale(1)">
              <path d="
                M0 -35
                C-20 -35 -40 -15 -40 5
                C-40 25 -15 45 0 65
                C15 45 40 25 40 5
                C40 -15 20 -35 0 -35
                Z
              " fill="var(--azulceleste)"/>
            </g>

            {/* cuadrado interior para contraste */}
            <rect x="-60" y="-60" width="120" height="122"
              fill="none"
              stroke="var(--azulceleste)"
              strokeWidth="10"
              rx="15"
              ry="15" />

            {/* cruz médica */}
            <g fill="var(--grisclaro)">
              <rect x="-6" y="-20" width="12" height="36" rx="2"/>
              <rect x="-18" y="-13" width="36" height="12" rx="2"/>
            </g>
          </g>
        </svg>
      </section>

      {/* Columna derecha: formulario de acceso */}
      <section className="login__right">
        <h1 className="brand-title">PILD</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field-label">Usuario</label>
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="field-label">Contraseña</label>
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Ingrese su Contraseña"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="button" type="submit">Iniciar Sesión</button>
        </form>

        <p className="auth-meta">¿Olvidaste tu Contraseña? · ¿No tienes Cuenta?</p>

        <p className="auth-links">
          <Link to="/registro">Crear Cuenta</Link> ·
          <a href="#tutorial">Ver Tutorial</a>
        </p>
      </section>
    </main>
  );
};

export default Login;