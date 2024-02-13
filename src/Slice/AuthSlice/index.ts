import { createSlice } from "@reduxjs/toolkit";

interface AuthInterface {
  isLogged: boolean;
  jwtToken: string;
}

const initialState: AuthInterface = {
  isLogged: false,
  jwtToken: "",
};

const authSlice: any = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    login: (state, data) => {
      (state.isLogged = true), (state.jwtToken = data.payload);
    },
    logout: () => {
      localStorage.setItem("persist:root", "");
    },
  },
});

export default authSlice.reducer;
export const { login, logout, setLoading } = authSlice.actions;
