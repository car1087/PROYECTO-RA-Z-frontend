import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Registro from './Registro';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';
import Inicio from './components/dashboard/Inicio';
import InformacionMedica from './components/dashboard/InformacionMedica';
import EditarInformacion from './components/dashboard/EditarInformacion';
import Contactos from './components/dashboard/Contactos';
import DispositivoQR from './components/dashboard/DispositivoQR';
import VerQR from './components/dashboard/VerQR';
import EstadoInicialQR from './components/dashboard/EstadoInicialQR';
import Ajustes from './components/dashboard/Ajustes';
import Notificaciones from './components/dashboard/Notificaciones';
import PerfilPublico from './components/PerfilPublico';
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/perfil-publico/:id" element={<PerfilPublico />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }>
        <Route index element={<Inicio />} />
        <Route path="informacion-medica" element={<InformacionMedica />} />
        <Route path="editar-informacion" element={<EditarInformacion />} />
        <Route path="contactos" element={<Contactos />} />
        <Route path="dispositivo-qr" element={<DispositivoQR />}>
          <Route index element={<EstadoInicialQR />} />
          <Route path="ver-qr" element={<VerQR />} />
        </Route>
        <Route path="ajustes" element={<Ajustes />} />
        <Route path="notificaciones" element={<Notificaciones />} />
      </Route>
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
