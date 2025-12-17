import { createContext, useContext, useEffect, useState } from "react";
import { sessions, trainers } from "../api/client";
import { useAuth } from "./AuthContext";

export const BookingsContext = createContext();

export const BookingsProvider = ({ children }) => {
  const { loading: authLoading, user } = useAuth();
  const [classBookings, setClassBookings] = useState([]);
  const [trainerBookings, setTrainerBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // =============================
  // LOAD BOOKINGS (CLASSES + PT)
  // =============================
  const loadAllBookings = async () => {
    try {
      const classRes = await sessions.getMemberBookings(); // CLASS BOOKINGS
      const trainerRes = await trainers.getMemberSessions(); // PT BOOKINGS

      setClassBookings(classRes);
      setTrainerBookings(trainerRes);
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
    setLoading(false);
  };

  // =============================
  // CLASS BOOKINGS
  // =============================
  const bookClassSession = async (sessionId) => {
    const res = await sessions.book(sessionId);

    // Append new booking
    setClassBookings((prev) => [...prev, res]);

    return res;
  };

  const cancelClassBooking = async (bookingId) => {
    await sessions.cancel(bookingId);

    // Remove cancelled booking from context
    setClassBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  // =============================
  // TRAINER BOOKINGS (PT)
  // =============================
  const bookTrainerSession = async (trainerId, startTime, endTime) => {
    const res = await trainers.bookSession(trainerId, {
      startTime,
      endTime,
    });

    setTrainerBookings((prev) => [...prev, res]);
    return res;
  };


  const cancelTrainerSession = async (sessionId) => {
    await trainers.cancelSession(sessionId);

    // Remove from context
    setTrainerBookings((prev) => prev.filter((s) => s.id !== sessionId));
  };

  // ============================================================
  // AUTO LOAD BOOKINGS AFTER LOGIN
  // Token existing in localStorage = logged in
  // ============================================================
  useEffect(() => {
    if (!authLoading && user) {
      loadAllBookings();
    }
  }, [authLoading, user]);

  return (
    <BookingsContext.Provider
      value={{
        loading,

        // Class bookings
        classBookings,
        bookClassSession,
        cancelClassBooking,

        // Trainer bookings
        trainerBookings,
        bookTrainerSession,
        cancelTrainerSession,

        // Reload all
        refreshBookings: loadAllBookings,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};
