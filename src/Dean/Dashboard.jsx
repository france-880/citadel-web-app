import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

export default function Dashboard() {
 
  const boxes = [
    { id: 1, title: "Total Student Registered", count: 1500 },
    { id: 2, title: "Total Regular Student", count: 1000 },
    { id: 3, title: "Total Irregular Student", count: 500 },
  ];


  return (
    <div className="flex content_padding">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6  min-h-screen">
          {/* Page header row: Title + Actions */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#064F32]">Dashboard</h1>
          </div>
          

 
          <div className="flex justify-center gap-x-12">
  {boxes.map(({ id, title, count }) => (
    <div
      key={id}
      className="flex flex-col w-[250px] h-[120px] bg-white shadow-md rounded-md relative"
    >
      {/* Green left border accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-green-700 rounded-l-md"></div>

      {/* Title */}
      <div className="mt-4 ml-6 text-sm font-medium text-gray-700">
        {title}
      </div>

      {/* Count */}
      <div className="flex-1 flex justify-center items-center">
        <p className="text-2xl font-bold text-black">{count}</p>
      </div>
    </div>
  ))}
</div>


 



          </main>
      </div>
    </div>
  );
}