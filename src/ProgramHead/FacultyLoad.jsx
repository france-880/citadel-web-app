import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function FacultyLoad() {
  // Table State for Faculty List
  const [facultyList, setFacultyList] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);

  // Sample faculty data
  const sampleFacultyData = [
    { id: 1, code: 'IT101', name: 'Raul Gutierrez' },
    { id: 2, code: 'IT102', name: 'Raul Gutierrez' },
    { id: 3, code: 'IT103', name: 'Raul Gutierrez' },

  ];

  // Fetch faculty data with pagination
  const fetchFacultyData = () => {
    const itemsPerPage = 10;
    const filteredData = sampleFacultyData.filter(item => 
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    setFacultyList(paginatedData);
    setTotal(filteredData.length);
    setLastPage(Math.ceil(filteredData.length / itemsPerPage));
    setFrom(startIndex + 1);
    setTo(Math.min(endIndex, filteredData.length));
  };

  // Effect to fetch data when search or page changes
  useEffect(() => {
    fetchFacultyData();
  }, [search, page]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="flex content_padding">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#064F32]">
              Faculty Load
            </h1>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by code or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-[#064F32]/10 text-[#064F32]">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {facultyList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-6 text-center text-sm text-gray-500"
                      >
                        No faculty found
                      </td>
                    </tr>
                  ) : (
                    facultyList.map((faculty, index) => (
                      <tr key={faculty.id} className="hover:bg-[#F6F7FB]">
                        <td className="px-6 py-4 text-sm text-gray-700 text-center">
                          {from + index}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {faculty.code}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {faculty.name}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Section */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-white">
              <p className="text-sm text-gray-600">
                Showing {from}–{to} of {total} faculty
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Prev
                </button>
                <span className="px-3 py-1 text-sm text-gray-600">
                  Page {page} of {lastPage}
                </span>
                <button
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



