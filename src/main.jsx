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

// SuperAdmin Routes
import SuperAdminDashboard from "./SuperAdmin/Dashboard.jsx";
import SuperAdminAcademicManagement from "./SuperAdmin/AcademicManagement.jsx";
import AccountManagement from "./SuperAdmin/AccountManagement.jsx";
import NewAccount from "./SuperAdmin/NewAccount.jsx";
import ViewAccount from "./SuperAdmin/ViewAccount.jsx";
import EditAccount from "./SuperAdmin/EditAccount.jsx";
import SuperAdminReports from "./SuperAdmin/Reports.jsx";
import SuperAdminSystemMaintenance from "./SuperAdmin/SystemMaintenance.jsx";

import SuperAdminStudentSummary from "./SuperAdmin/StudentSummary.jsx";

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
                <RoleGuard allowed={["dean", "super_admin"]}>
                  <App />
                </RoleGuard>
              }
            />

            {/* FOR DEAN */}
            <Route
              path="/dashboard"
              element={
                <RoleGuard allowed={["dean", "super_admin"]}>
                  <Dashboard />
                </RoleGuard>
              }
            />

            {/* SUPER ADMIN */}
            <Route
              path="/super-admin-dashboard"
              element={
                <RoleGuard allowed={["super_admin"]}>
                  <SuperAdminDashboard />
                </RoleGuard>
              }
            />

            <Route
              path="/super-admin-academic"
              element={
                <RoleGuard allowed={["super_admin"]}>
                  <SuperAdminAcademicManagement />
                </RoleGuard>
              }
            />

            <Route
              path="/super-admin-account"
              element={
                <RoleGuard allowed={["super_admin"]}>
                  <AccountManagement />
                </RoleGuard>
              }
            />

            <Route
              path="/super-admin-student-summary"
              element={
                <RoleGuard allowed={["super_admin"]}>
                  <SuperAdminStudentSummary />
                </RoleGuard>
              }
            />

            <Route
              path="/super-admin-reports"
              element={
                <RoleGuard allowed={["super_admin"]}>
                  <SuperAdminReports />
                </RoleGuard>
              }
            />

            <Route
              path="/super-admin-system-maintenance"
              element={
                <RoleGuard allowed={["super_admin"]}>
                  <SuperAdminSystemMaintenance />
                </RoleGuard>
              }
            />

            {/* Super Admin's Account Management - All User Types */}
            <Route
              path="/account-management"
              element={
                <RoleGuard allowed={["super_admin"]}>
                  <AccountManagement />
                </RoleGuard>
              }
            />

            <Route
              path="/new-account"
              element={
                <RoleGuard allowed={["super_admin"]}>
                  <NewAccount />
                </RoleGuard>
              }
            />

            <Route
              path="/view-account/:id"
              element={
                <RoleGuard allowed={["super_admin"]}>
                  <ViewAccount />
                </RoleGuard>
              }
            />

            <Route
              path="/edit-account/:id"
              element={
                <RoleGuard allowed={["super_admin"]}>
                  <EditAccount />
                </RoleGuard>
              }
            />

            <Route
              path="/daily_attendance"
              element={
                <RoleGuard allowed={["dean", "super_admin"]}>
                  <Daily_Attendance />
                </RoleGuard>
              }
            />

            <Route
              path="/student_registration"
              element={
                <RoleGuard allowed={["dean"]}>
                  <Student_Registration />
                </RoleGuard>
              }
            />

            {/* Dean's User Management - Professors Only */}
            <Route
              path="/user_management"
              element={
                <RoleGuard allowed={["dean", "super_admin"]}>
                  <User_Management />
                </RoleGuard>
              }
            />

            <Route
              path="/report"
              element={
                <RoleGuard allowed={["dean", "super_admin"]}>
                  <Report />
                </RoleGuard>
              }
            />

            <Route
              path="/prof_report"
              element={
                <RoleGuard allowed={["prof", "super_admin"]}>
                  <ProfReport />
                </RoleGuard>
              }
            />

            <Route
              path="/new_student"
              element={
                <RoleGuard allowed={["dean", "super_admin"]}>
                  <New_Student />
                </RoleGuard>
              }
            />

            {/* Dean's New User - Professors Only */}
            <Route
              path="/new_user"
              element={
                <RoleGuard allowed={["dean", "super_admin"]}>
                  <New_User />
                </RoleGuard>
              }
            />

            <Route
              path="/view_student"
              element={
                <RoleGuard allowed={["dean", "super_admin"]}>
                  <View_Student />
                </RoleGuard>
              }
            />

            <Route
              path="/view_user"
              element={
                <RoleGuard allowed={["dean", "super_admin"]}>
                  <View_User />
                </RoleGuard>
              }
            />

            <Route
              path="/edit_user/:id"
              element={
                <RoleGuard allowed={["dean", "super_admin"]}>
                  <Edit_User />
                </RoleGuard>
              }
            />

            <Route
              path="/edit_student/:id"
              element={
                <RoleGuard allowed={["dean", "super_admin"]}>
                  <Edit_Student />
                </RoleGuard>
              }
            />

            <Route
              path="/profile"
              element={
                <RoleGuard
                  allowed={["dean", "prof", "program_head", "super_admin"]}
                >
                  <Profile />
                </RoleGuard>
              }
            />

            {/* Program Head Routes */}
            <Route path="/faculty-loading" element={<FacultyLoading />} />

            <Route path="/faculty-load" element={<FacultyLoad />} />

            <Route
              path="/program"
              element={
                <RoleGuard allowed={["prof", "super_admin"]}>
                  <Program />
                </RoleGuard>
              }
            />

            <Route
              path="/schedule"
              element={
                <RoleGuard allowed={["prof", "super_admin"]}>
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
