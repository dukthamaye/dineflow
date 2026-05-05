import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], currentOrder: null },
  reducers: {
    setOrders: (state, { payload }) => { state.orders = payload; },
    setCurrentOrder: (state, { payload }) => { state.currentOrder = payload; },
    clearCurrentOrder: (state) => { state.currentOrder = null; }
  }
});

export const { setOrders, setCurrentOrder, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;