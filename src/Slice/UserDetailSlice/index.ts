import { createSlice } from "@reduxjs/toolkit";

interface UserInterface {
  User_Id: number;
  First_Name: string;
  Last_Name: string;
  Email: string;
  photo: string;
  Student_ID: number;
  Role: string;
}

const initialState: UserInterface = {
  User_Id: Number(null),
  First_Name: "",
  Last_Name: "",
  Email: "",
  photo: "",
  Student_ID: Number(null),
  Role: "",
};

const userDetailSlice: any = createSlice({
  name: "UserDetails",
  initialState,
  reducers: {
    userDetails: (state, data) => {
      (state.User_Id = data.payload.User_Id),
        (state.Email = data.payload.Email),
        (state.First_Name = data.payload.First_Name.trim()),
        (state.Last_Name = data.payload.Last_Name.trim()),
        (state.photo = data.payload.photo),
        (state.Student_ID = data.payload.Student_Id),
        (state.Role = data.payload.Role);
    },
  },
});

export default userDetailSlice.reducer;
export const { userDetails } = userDetailSlice.actions;
