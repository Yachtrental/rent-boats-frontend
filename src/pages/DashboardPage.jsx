import React from 'react';
import { Helmet } from 'react-helmet';

const DashboardPage = () => {
  return (
    <>
      <Helmet>
        <title>Panel de Usuario - Rent-Boats.com</title>
        <meta name="description" content="Gestiona tus reservas, barcos y perfil." />
      </Helmet>
      <div className="container mx-auto p-4 text-white">
        <h1 className="text-3xl font-bold mb-4">Panel de Usuario</h1>
        <p>Bienvenido a tu panel de control.</p>
      </div>
    </>
  );
};

export default DashboardPage;