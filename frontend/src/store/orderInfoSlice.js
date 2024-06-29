import { createSlice } from "@reduxjs/toolkit";

const dt = new Date();
const year = dt.getFullYear();
const month = String(dt.getMonth() + 1).padStart(2, "0");
const day = String(dt.getDate()).padStart(2, "0");
const fullDate = year + "-" + month + "-" + day;
const weekDay = dt.getDay();

const initialState = {
  curDate: fullDate,
  curWeekDay: weekDay,
  curTime: "",
  curSpecialistId: null,
  curServiceIds: [],
  morningTime: [],
  afternoonTime: [],
  eveningTime: [],
};

export const orderInfoSlice = createSlice({
  name: "orderInfo",
  initialState,
  reducers: {
    setCurDate: (state, action) => {
      state.curDate = action.payload;
    },
    setSpecialistId: (state, action) => {
      state.curSpecialistId = action.payload;
    },
    setCurServiceIds: (state, action) => {
      state.curServiceIds = action.payload;
    },
    setCurDateTime: (state, action) => {
      state.morningTime = action.payload.morningTime;
      state.afternoonTime = action.payload.afternoonTime;
      state.eveningTime = action.payload.eveningTime;
    },
    setCurTime: (state, action) => {
      state.curTime = action.payload;
    },
    setCurWeekDay: (state, action) => {
      state.curWeekDay = action.payload;
    },
  },
});

export const {
  setCurDate,
  setSpecialistId,
  setCurServiceIds,
  setCurDateTime,
  setCurTime,
  setCurWeekDay,
} = orderInfoSlice.actions;

export default orderInfoSlice.reducer;
