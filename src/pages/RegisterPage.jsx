import React from 'react';
import { Helmet } from 'react-helmet';

const RegisterPage = () => {
  return (
    <>
      <Helmet>
        <title>Registro - Rent-Boats.com</title>
        <meta name="description" content="Crea una nueva cuenta en Rent-Boats." />
      </Helmet>
      <div className="container mx-auto p-4 text-white">
        <h1 className="text-3xl font-bold mb-4">Crear Cuenta</h1>
        <p>Formulario de registro.</p>
      </div>
    </>
  );
};

export default RegisterPage;