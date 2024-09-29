import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

const Admin = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(db, 'appointments'));
      const appointmentsList = querySnapshot.docs.map(doc => doc.data());
      setAppointments(appointmentsList);
    };
    fetchAppointments();
  }, []);

  return (
    <div>
      <h2>Scheduled Appointments</h2>
      <ul>
        {appointments.map((appointment, index) => (
          <li key={index}>
            {appointment.name} ({appointment.email}) - {new Date(appointment.date.seconds * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
