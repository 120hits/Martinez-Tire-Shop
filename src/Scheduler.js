import React, { useState, useEffect } from 'react';  
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { db } from './firebaseConfig'; 
import { collection, getDocs, addDoc } from 'firebase/firestore';

const localizer = momentLocalizer(moment);

const Scheduler = () => {
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });

  // Fetch booked time slots from Firebase
  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, 'appointments'));
      const fetchedEvents = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        start: doc.data().start.toDate(),
        end: doc.data().end.toDate(),
      }));
      setEvents(fetchedEvents);
    };

    fetchEvents();
  }, []);

  // Handle customer appointment booking
  const handleSelectSlot = (slotInfo) => {
    const isBooked = events.some(event => 
      (slotInfo.start >= event.start && slotInfo.start < event.end) || 
      (slotInfo.end > event.start && slotInfo.end <= event.end)
    );

    if (!isBooked) {
      setSelectedSlot(slotInfo);
    }
  };

  const handleConfirmAppointment = async () => {
    const newEvent = {
      title: `${customerInfo.name}'s Appointment`,
      start: selectedSlot.start,
      end: selectedSlot.end,
      ...customerInfo,
    };

    // Save the new event to Firebase
    await addDoc(collection(db, 'appointments'), newEvent);

    // Update local state to reflect the new booking
    setEvents([...events, newEvent]);
    setSelectedSlot(null); // Reset selected slot
    setCustomerInfo({ name: '', email: '', phone: '' }); // Reset customer info
  };

  // Function to get the color based on event status
  const eventStyleGetter = (event) => {
    return {
      style: { backgroundColor: 'red' }, // All booked events will be red
    };
  };

  const slotStyleGetter = (date) => {
    const isBooked = events.some(event => 
      (date >= event.start && date < event.end) || 
      (moment(date).add(1, 'hour') > event.start && moment(date).add(1, 'hour') <= event.end)
    );

    const backgroundColor = isBooked ? 'red' : 'green'; // Color slots
    return { style: { backgroundColor } };
  };

  return (
    <div style={{ height: 500 }}>
      <h1>Tire Shop Appointment Scheduler</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        defaultView="week"
        views={['week', 'day']}
        step={60}
        timeslots={1}
        min={new Date(2024, 9, 28, 8, 0)}  // Start at 8:00 AM
        max={new Date(2024, 9, 28, 18, 0)} // End at 6:00 PM
        eventPropGetter={eventStyleGetter}
        slotPropGetter={slotStyleGetter}
      />

      {selectedSlot && (
        <div>
          <h2>Confirm Your Appointment</h2>
          <p>Selected Slot: {moment(selectedSlot.start).format('LLLL')}</p>
          <input 
            type="text" 
            placeholder="Name" 
            value={customerInfo.name} 
            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={customerInfo.email} 
            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} 
          />
          <input 
            type="tel" 
            placeholder="Phone" 
            value={customerInfo.phone} 
            onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} 
          />
          <button onClick={handleConfirmAppointment}>Confirm Appointment</button>
        </div>
      )}
    </div>
  );
};

export default Scheduler;
