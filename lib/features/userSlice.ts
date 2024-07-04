
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    totalCount: {},
    recentProducts: [],
    recentCustomers: [],
    viewItem: 'abhay',
  }
export const AdminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
      getTotalCount: (state, action) => {
        state.totalCount = action.payload
      },
      setViewItem: (state, action) => {
        state.viewItem = action.payload
      },
      getRecentProducts: (state, action) => {
        state.recentProducts = action.payload
      },
      getRecentCustomers: (state, action) => {
        state.recentCustomers = action.payload
      },
    
    },
  })


  export const {getTotalCount,setViewItem,getRecentCustomers,getRecentProducts}  = AdminSlice.actions
  export default AdminSlice.reducer