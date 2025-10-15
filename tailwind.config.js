/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
       "./src/App.jsx",
        "./src/App.css",
        "./src/main.jsx",
           "./src/index.css",
            "./src/Pages/Login.jsx",
            "./src/Pages/Lading_Page.jsx",
            "./src/Pages/ForgotPassword.jsx",
            "./src/Pages/ResetPassword.jsx",

   "./src/Dean/Dashboard.jsx",         
    "./src/Dean/Student_Registration.jsx",
    "./src/Dean/Daily_Attendance.jsx",
    "./src/Dean/New_Student.jsx",
    "./src/Dean/New_User.jsx",
    "./src/Dean/User_Management.jsx",
    "./src/Dean/Report.jsx",
    "./src/Dean/Profile.jsx",

    "./src/Dean/View_Student.jsx",
    "./src/Dean/View_User.jsx",

    "./src/Dean/Edit_User.jsx",
    "./src/Dean/Edit_Student.jsx",
  
     "./src/ProgramHead/Scheduling.jsx",

     "./src/Prof/ProfReport.jsx",
     "./src/Prof/Program.jsx",
     "./src/Prof/Schedule.jsx",

    "./src/Components/Sidebar.jsx",
    "./src/Components/Header.jsx"
    
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

