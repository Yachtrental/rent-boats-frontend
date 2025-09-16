import React from 'react';
import { Helmet } from 'react-helmet';

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Iniciar Sesión - Rent-Boats.com</title>
        <meta name="description" content="Inicia sesión en tu cuenta de Rent-Boats." />
      </Helmet>
      <div className="container mx-auto p-4 text-white">
        <h1 className="text-3xl font-bold mb-4">Iniciar Sesión</h1>
        <p>Formulario de inicio de sesión.</p>
      </div>
    </>
  );
};

export default LoginPage;