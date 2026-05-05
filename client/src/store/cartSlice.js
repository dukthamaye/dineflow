import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, { payload }) => {
      const existing = state.items.find(i => i._id === payload._id);
      if (existing) existing.quantity += 1;
      else state.items.push({ ...payload, quantity: 1 });
    },
    removeFromCart: (state, { payload }) => {
      const existing = state.items.find(i => i._id === payload);
      if (!existing) return;
      if (existing.quantity === 1) state.items = state.items.filter(i => i._id !== payload);
      else existing.quantity -= 1;
    },
    clearCart: state => { state.items = []; },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;