const Inicio = () => {
  return (
    <div className="inicio-area">
      {/* Barra de búsqueda */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Buscar en el panel..." />
        <button>Buscar</button>
      </div>

      {/* Sección de bienvenida */}
      <div className="welcome-section">
        <h2>Hola, carlos</h2>
        <p>Bienvenido a tu panel de control. Aquí puedes gestionar tu información médica y dispositivo QR.</p>
      </div>

      {/* Contenedor de tarjetas */}
      <div className="cards-container">
        {/* Tarjeta: Historial Médico */}
        <div className="card">
          <div className="card-icon">📋</div>
          <h3>Historial Médico</h3>
          <p>Revisa y actualiza tu información médica personal.</p>
          <button className="btn">Ver Historial</button>
        </div>

        {/* Tarjeta: QR Activo */}
        <div className="card">
          <div className="card-icon">🔳</div>
          <h3>QR Activo</h3>
          <p>Genera y comparte tu código QR para emergencias.</p>
          <button className="btn">Ver QR</button>
        </div>

        {/* Tarjeta: Notificaciones */}
        <div className="card">
          <div className="card-icon">🔔</div>
          <h3>Notificaciones</h3>
          <p>Recibe alertas sobre actualizaciones y recordatorios.</p>
          <button className="btn">Ver Notificaciones</button>
        </div>
      </div>
    </div>
  );
};

export default Inicio;