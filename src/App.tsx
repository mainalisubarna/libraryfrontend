import { Routes, Route } from "react-router-dom";
import "./App.css";
import SidebarWithHeader from "./Admin/Components/Navbar & Sidebar";
import NotFound from "./Admin/Pages/404Error";
import Login from "./Admin/Pages/Login";
import DashBoard from "./Admin/Pages/Dashboard";
import SecureRoute from "./Routes/Secure.Route";
import Students from "./Admin/Pages/Students";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Books from "./Admin/Pages/Books";
import Book_Transaction from "./Admin/Pages/Transactions";
import Fine_Transaction from "./Admin/Pages/Billings";
import Settings from "./Admin/Pages/Settings/index";
import VerifyEmailForm from "./Admin/Pages/VerifyEmail/index";
import VerifyOTP from "./Admin/Pages/VerifyOtp/index";
import NewPassword from "./Admin/Pages/NewPassword";
import PrivateRoute from "./Routes/PrivateRoute";
import StudentRoute from "./Routes/StudentRoute";
import StudentBookView from "./Student/Pages/Books";
import StudentTransactionView from "./Student/Pages/Transactions";
import StudentBillingsView from "./Student/Pages/Billings";
import VerifyEmailForgotPassword from "./Admin/Pages/VerifyEmail/ForgotPassword";
import NewPasswordReq from "./Admin/Pages/NewPassword/ForgotPasswordChangePassword";

function App(): any {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/activate" element={<VerifyEmailForm />}></Route>
        <Route path="/verify-otp" element={<VerifyOTP />}></Route>
        <Route path="/newPassword" element={<NewPassword />}></Route>
        <Route
          path="/forgotPassword"
          element={<VerifyEmailForgotPassword />}
        ></Route>
        <Route path="/changePassword" element={<NewPasswordReq />}></Route>
        <Route element={<SecureRoute />}>
          <Route element={<SidebarWithHeader />}>
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/students" element={<Students />}></Route>
              <Route path="/books" element={<Books />}></Route>
              <Route
                path="/transactions"
                element={<Book_Transaction />}
              ></Route>
              <Route path="/billings" element={<Fine_Transaction />}></Route>
              <Route path="/settings" element={<Settings />}></Route>
            </Route>
            <Route element={<StudentRoute />}>
              <Route path="/student/dashboard" element={<DashBoard />}></Route>
              <Route
                path="/student/books"
                element={<StudentBookView />}
              ></Route>
              <Route
                path="/student/transactions"
                element={<StudentTransactionView />}
              ></Route>
              <Route
                path="/student/billings"
                element={<StudentBillingsView />}
              ></Route>
              <Route path="/student/settings" element={<Settings />}></Route>
            </Route>
          </Route>
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
