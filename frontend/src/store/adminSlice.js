import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdminActions: false,
  curEditType: "",
  isEdit: false,
  curCategoryIds: [],
  curOrderId: null,
  curTimeArray: [],
  curBeginDate: "",
  curTimeTable: "",
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setIsAdminActions: (state, action) => {
      state.isAdminActions = action.payload;
    },
    setCurEditType: (state, action) => {
      state.curEditType = action.payload;
    },
    setIsEdit: (state, action) => {
      state.isEdit = action.payload;
    },
    setCurCategoryIds: (state, action) => {
      state.curCategoryIds = action.payload;
    },
    setCurOrderId: (state, action) => {
      state.curOrderId = action.payload;
    },
    setCurTimeArray: (state, action) => {
      state.curTimeArray = action.payload;
    },
    setCurBeginDate: (state, action) => {
      state.curBeginDate = action.payload;
    },
    setCurTimeTable: (state, action) => {
      state.curTimeTable = action.payload;
    },
  },
});

export const {
  setIsAdminActions,
  setCurEditType,
  setIsEdit,
  setCurCategoryIds,
  setCurTimeArray,
  setCurBeginDate,
  setCurTimeTable,
  setCurOrderId,
} = adminSlice.actions;

export default adminSlice.reducer;
