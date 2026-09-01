import { createSlice } from "@reduxjs/toolkit";

const LectureSlice = createSlice({
  name: "lectures",
  initialState: {
    lectures: [],
  },
  reducers: {
    setLectures: (state, action) => {
      state.lectures = action.payload;
    },
  },
});

export const { setLectures } = LectureSlice.actions;
export default LectureSlice.reducer;
