import { Fragment } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";

export default function Schedule() {
  return (
    <div className="flex content_padding">
      <Sidebar />
      <div className="flex-1">
        <Header />

        <main className="p-6 min-h-screen">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#064F32]">Schedule</h1>
          </div>

          <div className="space-y-6">
          {/* Schedule Section */}
            <div className="bg-white rounded-lg shadow p-5 md:p-6">
            <div className="text-sm text-slate-500">Schedule</div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs">
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

          {/* Weekly Timetable Section */}
            <div className="bg-white rounded-lg shadow p-5 md:p-6">
            <div className="text-sm text-slate-500">Weekly Timetable</div>
            <div className="mt-3 grid grid-cols-8 gap-2 text-xs">
              <div></div>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="text-center text-slate-600">
                  {d}
                </div>
              ))}
              {Array.from({ length: 10 }).map((_, r) => (
                <Fragment key={`row-${r}`}>
                  <div className="text-right pr-2 text-slate-500">{7 + r}:00</div>
                  {Array.from({ length: 7 }).map((_, c) => (
                    <div
                      key={`cell-${r}-${c}`}
                      className="h-14 border rounded-md bg-white"
                    />
                  ))}
                </Fragment>
              ))}
            </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
