import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const BoatDetailsPage = () => {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>Detalles del Barco - Rent-Boats.com</title>
        <meta name="description" content={`Detalles para el barco ${id}.`} />
      </Helmet>
      <div className="container mx-auto p-4 text-white">
        <h1 className="text-3xl font-bold mb-4">Detalles del Barco: {id}</h1>
        <p>Información detallada sobre el barco seleccionado.</p>
      </div>
    </>
  );
};

export default BoatDetailsPage;