import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);

  useEffect(() => {
    const storedBookings = localStorage.getItem('rent_boats_bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  const saveBookings = (newBookings) => {
    setBookings(newBookings);
    localStorage.setItem('rent_boats_bookings', JSON.stringify(newBookings));
  };

  const createBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: Date.now().toString(),
      status: 'pending_confirmation_armador',
      createdAt: new Date().toISOString(),
      depositPaid: true,
      finalPaymentPaid: false
    };
    
    const updatedBookings = [...bookings, newBooking];
    saveBookings(updatedBookings);
    return newBooking;
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() }
        : booking
    );
    saveBookings(updatedBookings);
  };

  const getBookingsByUser = (userId) => {
    return bookings.filter(booking => booking.customerId === userId);
  };

  const getBookingsByOwner = (ownerId) => {
    return bookings.filter(booking => booking.ownerId === ownerId);
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      currentBooking,
      setCurrentBooking,
      createBooking,
      updateBookingStatus,
      getBookingsByUser,
      getBookingsByOwner
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};