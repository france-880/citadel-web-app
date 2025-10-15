import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useEffect, useMemo, useState } from "react";

export default function Program() {
  const [program, setProgram] = useState(() => localStorage.getItem('selectedProgram') || 'BSIT-4A');
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');

  useEffect(() => {
    localStorage.setItem('selectedProgram', program);
  }, [program]);

  // Listen for sidebar state changes
  useEffect(() => {
    const handleSidebarToggle = () => {
      setIsCollapsed(localStorage.getItem('sidebarCollapsed') === 'true');
    };
    
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
  }, []);

  const options = ['BSIT-3A','BSIT-3B','BSIT-4A','BSIT-4C'];

  const content = useMemo(() => {
    switch (program) {
      case 'BSIT-3A':
        return { title: 'BSIT 3A', text: 'Test content for BSIT 3A.' };
      case 'BSIT-3B':
        return { title: 'BSIT 3B', text: 'Test content for BSIT 3B.' };
      case 'BSIT-4A':
        return { title: 'BSIT 4A', text: 'Test content for BSIT 4A.' };
      case 'BSIT-4C':
        return { title: 'BSIT 4C', text: 'Test content for BSIT 4C.' };
      default:
        return { title: program, text: 'No content.' };
    }
  }, [program]);

  return (
    <div className="flex content_padding">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-0' : 'ml-0'}`}>
        <Header />

      <main className="p-6 min-h-screen">
        <div className="space-y-4 md:space-y-6">
          {/* Selector lives in Sidebar; keep page in sync via storage events */}

          <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-lg shadow p-3 md:p-4">
        <div className="text-sm text-slate-500 mb-2">Schedule</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="bg-[var(--brand-100)] text-left">
                <th className="p-2">Time</th>
                <th className="p-2">Subject/Course</th>
                <th className="p-2">Room</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 7 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">07:00 - 10:00</td>
                  <td className="p-2">Computer Programming</td>
                  <td className="p-2">301</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-3 md:p-4">
        <div className="text-sm text-slate-500 mb-2">Weekly Timetable</div>
        <div className="grid grid-cols-8 gap-1 md:gap-2 text-xs md:text-sm">
          <div></div>
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d)=> (
            <div key={d} className="text-center text-slate-600">{d}</div>
          ))}
          {Array.from({ length: 10 }).map((_, r) => (
            <Fragment key={`row-${r}`}>
              <div className="text-right pr-2 text-slate-500">{7 + r}:00</div>
              {Array.from({ length: 7 }).map((_, c) => (
                <div key={`cell-${r}-${c}`} className="h-14 border rounded-md bg-white" />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
        </div>
      </main>
    </div>
    </div>
  );
}

