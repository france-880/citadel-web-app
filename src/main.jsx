import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import GlobalProvider from "./GlobalProvider";

import { AuthProvider } from './Context/AuthContext';
import RoleGuard from "./Components/RoleGuard";

import App from "./App.jsx";
import Login from "./Pages/Login.jsx";
import Landing_Page from "./Pages/Landing_Page.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";


import Student_Registration from "./Dean/Student_Registration.jsx";
import User_Management from "./Dean/User_Management.jsx";
import Dashboard from "./Dean/Dashboard.jsx";
import Daily_Attendance from "./Dean/Daily_Attendance.jsx";
import New_Student from "./Dean/New_Student.jsx";
import New_User from "./Dean/New_User.jsx";
import Report from "./Dean/Report.jsx";
import Profile from "./Dean/Profile.jsx";

import View_Student from "./Dean/View_Student.jsx";
import View_User from "./Dean/View_User.jsx";

import Edit_User from "./Dean/Edit_User.jsx";
import Edit_Student from "./Dean/Edit_Student.jsx";


import FacultyLoading from "./ProgramHead/FacultyLoading.jsx";
import FacultyLoad from "./ProgramHead/FacultyLoad.jsx";


import ProfReport from "./Prof/Report.jsx";
import Program from "./Prof/Program.jsx";
import Schedule from "./Prof/Schedule.jsx";

// SuperAdmin Dashboard - For Super Admin System Overview
import SuperAdminDashboard from "./SuperAdmin/Dashboard.jsx";
import CollegeProgramManagement from "./SuperAdmin/CollegeProgramManagement.jsx";
import SuperAdminUserManagement from "./SuperAdmin/UserManagement.jsx";
import RolePermissionManagement from "./SuperAdmin/RolePermissionManagement.jsx";
import ReportAttendance from "./SuperAdmin/ReportAttendance.jsx";

import ChangePassword from "./Components/ChangePassword.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <GlobalProvider>
      <Routes>
      {/* Public Routes - No Authentication Required */}
      <Route path="/login" element={<Login />} />
      <Route path="/landing" element={<Landing_Page />} />
      
      {/* Protected Routes */}
      <Route
        path="/app"
        element={
          <RoleGuard allowed={['dean','super_admin']}>
            <App />
          </RoleGuard>
        }
      />

  {/* FOR DEAN */}
        <Route
    path="/dashboard"
    element={
      <RoleGuard allowed={['dean','super_admin']}>
        <Dashboard />
      </RoleGuard>
    }
  />

  {/* FOR SUPER ADMIN - System Overview Dashboard (Temporarily without login for testing) */}
  <Route
    path="/super-admin-dashboard"
    element={<SuperAdminDashboard />}
  />

  {/* FOR SUPER ADMIN - College & Program Management (Temporarily without login for testing) */}
  <Route
    path="/college-program-management"
    element={<CollegeProgramManagement />}
  />

  {/* FOR SUPER ADMIN - User Management (Temporarily without login for testing) */}
  <Route
    path="/super-admin-user-management"
    element={<SuperAdminUserManagement />}
  />

  {/* FOR SUPER ADMIN - Role & Permission Management (Temporarily without login for testing) */}
  <Route
    path="/role-permission-management"
    element={<RolePermissionManagement />}
  />

  {/* FOR SUPER ADMIN - Reports & Attendance (Temporarily without login for testing) */}
  <Route
    path="/super-admin-reports"
    element={<ReportAttendance />}
  />

    <Route
        path="/daily_attendance"
        element={
          <RoleGuard allowed={['dean','super_admin']}>
            <Daily_Attendance />
          </RoleGuard>
        }
      />

        <Route
    path="/student_registration"
    element={
      <RoleGuard allowed={['dean','super_admin']}>
        <Student_Registration />
      </RoleGuard>
    }
  />

  <Route
    path="/user_management"
    element={
      <RoleGuard allowed={['dean','super_admin']}>
        <User_Management />
      </RoleGuard>
    }
  />
  
  <Route
  path="/report"
  element={
    <RoleGuard allowed={['dean', 'super_admin']}>
      <Report />
    </RoleGuard>
  }
/>

<Route
  path="/prof_report"
  element={
    <RoleGuard allowed={['prof', 'super_admin']}>
      <ProfReport />
    </RoleGuard>
  }
/>


<Route
    path="/new_student"
    element={
      <RoleGuard allowed={['dean','super_admin']}>
        <New_Student />
      </RoleGuard>
    }
  />

<Route
    path="/new_user"
    element={
      <RoleGuard allowed={['dean','super_admin']}>
        <New_User />
      </RoleGuard>
    }
  />

<Route
    path="/view_student"
    element={
      <RoleGuard allowed={['dean','super_admin']}>
        <View_Student />
      </RoleGuard>
    }
  />

<Route
    path="/view_user"
    element={
      <RoleGuard allowed={['dean','super_admin']}>
        <View_User />
      </RoleGuard>
    }
  />

<Route
    path="/edit_user/:id"
    element={
      <RoleGuard allowed={['dean','super_admin']}>
        <Edit_User />
      </RoleGuard>
    }
  />

<Route
    path="/edit_student/:id"
    element={
      <RoleGuard allowed={['dean','super_admin']}>
        <Edit_Student />
      </RoleGuard>
    }
  />

<Route
    path="/profile"
    element={
      <RoleGuard allowed={['dean', 'prof','program_head',  'super_admin']}>
        <Profile />
      </RoleGuard>
    }
  />


  {/* Program Head Routes */}
  <Route
    path="/faculty-loading"
    element={
      <RoleGuard allowed={['program_head', 'super_admin']}>
        <FacultyLoading />
      </RoleGuard>
    }
  />

<Route
    path="/faculty-load"
    element={
      <RoleGuard allowed={['program_head', 'super_admin']}>
        <FacultyLoad />
      </RoleGuard>
    }
  />


<Route
    path="/program"
    element={
      <RoleGuard allowed={['prof', 'super_admin']}>
        <Program />
      </RoleGuard>
    }
  />

<Route
    path="/schedule"
    element={
      <RoleGuard allowed={['prof', 'super_admin']}>
        <Schedule />
      </RoleGuard>
    }
  />


  {/* Catch-all */}
  <Route path="*" element={<Navigate to="/login" replace />} />
  <Route path="/changepassword" element={<ChangePassword />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password/:token" element={<ResetPassword />} />

      </Routes>
      </GlobalProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
