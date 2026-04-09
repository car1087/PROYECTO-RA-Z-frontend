import { useState } from 'react';

const Ajustes = () => {
  const [seccion, setSeccion] = useState('menu');

  if (seccion === 'menu') {
    return (
      <section className="modulo">
        <h2>Ajustes de Cuenta</h2>

        <div className="opciones-submodulos">
          <button
            className="link-submodulo"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onClick={() => setSeccion('credenciales')}
          >
            Cambiar correo o contrasena
          </button>

          <button
            className="link-submodulo"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onClick={() => setSeccion('notificaciones')}
          >
            Preferencias de notificacion
          </button>

          <button
            className="link-submodulo"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#FF6B6B' }}
            onClick={() => setSeccion('eliminar')}
          >
            Eliminar cuenta
          </button>
        </div>
      </section>
    );
  }

  if (seccion === 'credenciales') {
    return (
      <section className="modulo">
        <h2>Cambiar correo o contrasena</h2>

        <form className="info-form">
          <div className="form-group">
            <label>Nuevo correo</label>
            <input type="email" placeholder="usuario@correo.com" />
          </div>

          <div className="form-group">
            <label>Contrasena actual</label>
            <input type="password" placeholder="********" />
          </div>

          <div className="form-group">
            <label>Nueva contrasena</label>
            <input type="password" placeholder="********" />
          </div>

          <div className="botonera">
            <button type="button" className="btn-volver" onClick={() => setSeccion('menu')}>
              Volver
            </button>
            <button type="button" className="btn btn-guardar">Guardar cambios</button>
          </div>
        </form>
      </section>
    );
  }

  if (seccion === 'notificaciones') {
    return (
      <section className="modulo">
        <h2>Preferencias de notificacion</h2>

        <form className="info-form">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <input id="notif-email" type="checkbox" defaultChecked />
            <label htmlFor="notif-email">Correo electronico</label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <input id="notif-sms" type="checkbox" />
            <label htmlFor="notif-sms">SMS</label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <input id="notif-push" type="checkbox" />
            <label htmlFor="notif-push">Push en la app</label>
          </div>

          <div className="botonera">
            <button type="button" className="btn-volver" onClick={() => setSeccion('menu')}>
              Volver
            </button>
            <button type="button" className="btn btn-guardar">Guardar preferencias</button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="modulo">
      <h2 style={{ color: '#FF6B6B' }}>Eliminar cuenta</h2>

      <p className="nota">Esta accion es irreversible.</p>

      <form className="info-form">
        <div className="form-group">
          <label>Escribe ELIMINAR para confirmar</label>
          <input type="text" placeholder="ELIMINAR" />
        </div>

        <div className="botonera">
          <button type="button" className="btn-volver" onClick={() => setSeccion('menu')}>
            Volver
          </button>
          <button type="button" className="btn" style={{ backgroundColor: '#FF6B6B' }}>
            Eliminar cuenta
          </button>
        </div>
      </form>
    </section>
  );
};

export default Ajustes;