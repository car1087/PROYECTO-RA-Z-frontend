import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Registro from './Registro';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
