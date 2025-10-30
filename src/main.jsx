import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import GlobalProvider from "./GlobalProvider";

import { AuthProvider } from "./Context/AuthContext";
import RoleGuard from "./Components/RoleGuard";

import App from "./App.jsx";
import Login from "./Pages/Login.jsx";
import Landing_Page from "./Pages/Landing_Page.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";
import CheckEmail from "./Pages/CheckEmail.jsx";

// Dean Routes
import DeanStudentRegistration from "./Dean/Student_Registration.jsx";
import DeanUserManagement from "./Dean/User_Management.jsx";
import DeanDashboard from "./Dean/Dashboard.jsx";
import DeanDailyAttendance from "./Dean/Daily_Attendance.jsx";
import DeanNewStudent from "./Dean/New_Student.jsx";
import DeanNewUser from "./Dean/New_User.jsx";
import DeanReport from "./Dean/Report.jsx";
import DeanProfile from "./Dean/Profile.jsx";
import DeanViewStudent from "./Dean/View_Student.jsx";
import DeanViewUser from "./Dean/View_User.jsx";
import DeanEditUser from "./Dean/Edit_User.jsx";
import DeanEditStudent from "./Dean/Edit_Student.jsx";

// Generic Profile component (temporary - using DeanProfile for now)
import Profile from "./Dean/Profile.jsx";

// Program Head Routes
import FacultyLoading from "./ProgramHead/FacultyLoading.jsx";
import FacultyLoad from "./ProgramHead/FacultyLoad.jsx";
import SectionOffering from "./ProgramHead/SectionOffering.jsx";

// Professor Routes
import ProfReport from "./Prof/Report.jsx";
import Program from "./Prof/Program.jsx";
import Schedule from "./Prof/Schedule.jsx";

// SuperAdmin Routes
import SuperAdminDashboard from "./SuperAdmin/Dashboard.jsx";
import SuperAdminAcademicManagement from "./SuperAdmin/AcademicManagement.jsx";
import SuperAdminAccountManagement from "./SuperAdmin/AccountManagement.jsx";
import SuperAdminNewAccount from "./SuperAdmin/NewAccount.jsx";
import SuperAdminViewAccount from "./SuperAdmin/ViewAccount.jsx";
import SuperAdminEditAccount from "./SuperAdmin/EditAccount.jsx";
import SuperAdminStudentSummary from "./SuperAdmin/StudentSummary.jsx";
import SuperAdminReports from "./SuperAdmin/Report.jsx";
import SuperAdminSystemMaintenance from "./SuperAdmin/SystemMaintenance.jsx";

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
  {/* SUPER ADMIN ROUTES */}
  <Route
    path="/super-admin-dashboard" 
    element={
      <RoleGuard allowed={['super_admin']}>
        <SuperAdminDashboard />
      </RoleGuard>
    }
  />

  <Route
    path="/super-admin-academic" 
    element={
      <RoleGuard allowed={['super_admin']}>
        <SuperAdminAcademicManagement />
      </RoleGuard>
    }
  />

  <Route
    path="/super-admin-account" 
    element={
      <RoleGuard allowed={['super_admin']}>
        <SuperAdminAccountManagement />
      </RoleGuard>
    }
  />

  <Route
    path="/super-admin-new-account" 
    element={
      <RoleGuard allowed={['super_admin']}>
        <SuperAdminNewAccount />
      </RoleGuard>
    }
  />

  <Route
    path="/super-admin-view-account/:id" 
    element={
      <RoleGuard allowed={['super_admin']}>
        <SuperAdminViewAccount />
      </RoleGuard>
    }
  />

  <Route
    path="/super-admin-edit-account/:id" 
    element={
      <RoleGuard allowed={['super_admin']}>
        <SuperAdminEditAccount />
      </RoleGuard>
    }
  />

  <Route
    path="/super-admin-student-summary"
    element={
      <RoleGuard allowed={['super_admin']}>
        <SuperAdminStudentSummary />
      </RoleGuard>
    }
  />

  <Route
    path="/super-admin-reports"
    element={
      <RoleGuard allowed={['super_admin']}>
        <SuperAdminReports />
      </RoleGuard>
    }
  />

  <Route
    path="/super-admin-system-maintenance"
    element={
      <RoleGuard allowed={['super_admin']}>
        <SuperAdminSystemMaintenance />
      </RoleGuard>
    }
  />

  {/* DEAN ROUTES */}
    <Route
    path="/dean-dashboard"
    element={
      <RoleGuard allowed={['dean']}>
        <DeanDashboard />
      </RoleGuard>
    }
  />

    <Route
        path="/dean-daily-attendance"
        element={
          <RoleGuard allowed={['dean']}>
            <DeanDailyAttendance />
          </RoleGuard>
        }
      />

        <Route
    path="/dean-student-registration"
    element={
      <RoleGuard allowed={['dean']}>
        <DeanStudentRegistration />
      </RoleGuard>
    }
  />

  {/* Dean's User Management - Professors Only */}
  <Route
    path="/dean-user-management"
    element={
      <RoleGuard allowed={['dean']}>
        <DeanUserManagement />
      </RoleGuard>
    }
  />

<Route
    path="/dean-new-student"
    element={
      <RoleGuard allowed={['dean']}>
        <DeanNewStudent />
      </RoleGuard>
    }
  />

  {/* Dean's New User - Professors Only */}
<Route
    path="/dean-new-user"
    element={
      <RoleGuard allowed={['dean']}>
        <DeanNewUser />
      </RoleGuard>
    }
  />

<Route
    path="/dean-view-student"
    element={
      <RoleGuard allowed={['dean']}>
        <DeanViewStudent />
      </RoleGuard>
    }
  />

<Route
    path="/dean-view-user"
    element={
      <RoleGuard allowed={['dean']}>
        <DeanViewUser />
      </RoleGuard>
    }
  />

<Route
    path="/dean-edit-user/:id"
    element={
      <RoleGuard allowed={['dean']}>
        <DeanEditUser />
      </RoleGuard>
    }
  />

<Route
    path="/dean-edit-student/:id"
    element={
      <RoleGuard allowed={['dean']}>
        <DeanEditStudent />
      </RoleGuard>
    }
  />
  
  <Route
  path="/dean-report"
  element={
    <RoleGuard allowed={['dean']}>
      <DeanReport />
    </RoleGuard>
  }
/>

{/* PROFESSOR ROUTES */}
<Route
  path="/prof_report"
  element={
    <RoleGuard allowed={['prof']}>
      <ProfReport />
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
        <FacultyLoading />
    }
  />

<Route
    path="/faculty-load"
    element={
      <FacultyLoad />
    }
  />

<Route
    path="/section-offering"
    element={
      <SectionOffering />
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
  <Route path="/check-email" element={<CheckEmail />} />
  <Route path="/reset-password/:token" element={<ResetPassword />} />

      </Routes>
      </GlobalProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);