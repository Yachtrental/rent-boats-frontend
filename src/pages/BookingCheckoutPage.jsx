import React from 'react';
import { Helmet } from 'react-helmet';

const BookingCheckoutPage = () => {
  return (
    <>
      <Helmet>
        <title>Checkout de Reserva - Rent-Boats.com</title>
        <meta name="description" content="Completa el pago de tu reserva de barco." />
      </Helmet>
      <div className="container mx-auto p-4 text-white">
        <h1 className="text-3xl font-bold mb-4">Checkout de Reserva</h1>
        <p>Completa los detalles para finalizar tu reserva.</p>
      </div>
    </>
  );
};

export default BookingCheckoutPage;