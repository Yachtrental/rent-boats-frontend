import React from 'react';
import { Helmet } from 'react-helmet';

const SearchResultsPage = () => {
  return (
    <>
      <Helmet>
        <title>Resultados de Búsqueda - Rent-Boats.com</title>
        <meta name="description" content="Resultados de búsqueda para alquiler de barcos." />
      </Helmet>
      <div className="container mx-auto p-4 text-white">
        <h1 className="text-3xl font-bold mb-4">Resultados de Búsqueda</h1>
        <p>Aquí se mostrarán los barcos disponibles.</p>
      </div>
    </>
  );
};

export default SearchResultsPage;