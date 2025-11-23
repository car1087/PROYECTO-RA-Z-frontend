import { Link } from 'react-router-dom';

const DispositivoQR = () => {
  return (
    <div className="card">
      <h2>Mi dispositivo QR</h2>

      <div className="opciones-submodulos">
        <Link to="ver-qr" className="link-submodulo">
          Ver código QR e ID único
        </Link>
      </div>
    </div>
  );
};

export default DispositivoQR;