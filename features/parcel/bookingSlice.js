import { createSlice } from '@reduxjs/toolkit';

const isServer = typeof window === 'undefined';

const getInitialState = () => {
  const defaultState = {
    name: '',
    itemValue: 0,
    pickupLocation: {
      address: '',
      coordinates: [0, 0]
    },
    dropLocation: {
      address: '',
      coordinates: [0, 0]
    },
    vehicleType: 'motorcycle',
    receiverName: '',
    deliveryTime: '',
    receiverPhone: '',
    deliveryDate: '',
    note: '',
    distance: '',
    duration: ''
  };

  if (isServer) return defaultState;

  const saved = localStorage.getItem('bookingData');
  return saved ? JSON.parse(saved) : defaultState;
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState: getInitialState(),
  reducers: {
    updateBooking: (state, action) => {
      const newState = { ...state, ...action.payload };
      if (!isServer) {
        localStorage.setItem('bookingData', JSON.stringify(newState));
      }
      return newState;
    },
    resetBooking: () => {
      if (!isServer) {
        localStorage.removeItem('bookingData');
      }
      return getInitialState();
    }
  }
});

export const { updateBooking, resetBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
