// ✅ Corrected and optimized User_Management.jsx

import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Edit, Check } from "lucide-react";
import toast from "react-hot-toast";
import View_User from "./View_User";

function CustomCheckbox({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded 
                   checked:bg-[#FF7A00] checked:border-[#FF7A00] cursor-pointer"
      />
      {checked && (
        <Check className="w-3 h-3 text-white absolute left-0.5 top-0.5 pointer-events-none" />
      )}
    </label>
  );
}

export default function User_Management() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  // Pagination state
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);

  // Listen to sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = () => {
      setIsSidebarCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
    };
    window.addEventListener("sidebarToggle", handleSidebarToggle);
    return () => window.removeEventListener("sidebarToggle", handleSidebarToggle);
  }, []);

  // ✅ Fetch all departments
  const fetchDepartments = async () => {
    try {
      const res = await api.get("/users/departments/all");
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  // ✅ Fetch users from backend with filter + pagination
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users", {
        params: {
          search,
          department,
          page,
          per_page: 10,
        },
      });

      const data = res.data;
      setUsers(data.data || []);
      setLastPage(data.last_page || 1);
      setFrom(data.from || 0);
      setTo(data.to || 0);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users.");
    }
  };

  // ✅ Load departments on mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // ✅ Auto refresh when filters or page change
  useEffect(() => {
    fetchUsers();
  }, [search, department, page]);

  // ✅ Reset to page 1 if filter/search changes
  useEffect(() => {
    setPage(1);
  }, [search, department]);

  const handleEdit = (id) => navigate(`/dean-edit-user/${id}`);

  // Checkbox controls
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(users.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  // ✅ Delete multiple users
  const handleDeleteSelected = () => {
    handleDelete(selectedIds);
  };

  const handleDelete = async (ids) => {
    if (!ids || ids.length === 0) return;
    setDeleting(true);

    const promise = api.delete("/users/delete-multiple", { data: { ids } });

    toast.promise(promise, {
      loading: "Deleting users...",
      success: (res) =>
        res.data?.message || `${ids.length} user(s) deleted successfully!`,
      error: (err) => err.response?.data?.message || "Failed to delete users.",
    });

    try {
      await promise;
      setSelectedIds([]);
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting users:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`flex content_padding ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen bg-gray-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#064F32] mb-2">
                User Management
              </h1>
              <p className="text-gray-600">
                Manage system users and their roles
              </p>
            </div>
            <button
              onClick={() => navigate("/dean-new-user")}
              className="px-6 py-2 rounded-md text-white bg-[#FF7A00] hover:opacity-90 transition shadow"
            >
              + New User
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-[220px] p-2 rounded-md border border-gray-200 bg-white focus:ring-2 focus:ring-[#064F32]/30 outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="px-2 py-1 rounded bg-gray-100 text-gray-500 hover:bg-gray-200"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-[180px] p-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#064F32]/30 outline-none"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              {selectedIds.length > 0 && (
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition ml-auto"
                >
                  Delete Selected
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#064F32]/10 text-[#064F32]">
                    <th className="px-4 py-3">
                      <CustomCheckbox
                        checked={
                          users.length > 0 &&
                          selectedIds.length === users.length
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="table-title">Name</th>
                    <th className="table-title">Email</th>
                    <th className="table-title">Role</th>
                    <th className="table-title">Department</th>
                    <th className="table-title">Date Registered</th>
                    <th className="table-title">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-[#F6F7FB]">
                        <td className="px-4 py-3">
                          <CustomCheckbox
                            checked={selectedIds.includes(user.id)}
                            onChange={() => handleCheckboxChange(user.id)}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {user.fullname ?? user.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {user.role}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {user.department ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "2-digit",
                                }
                              )
                            : ""}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <View_User user={user} />
                            <button
                              onClick={() => handleEdit(user.id)}
                              className="w-8 h-8 text-[#064F32] bg-[#064F32]/10 px-[6px] py-[2px] rounded-md border border-[#064F32]/30 hover:text-[#064F32] hover:bg-[#064F32]/20"
                            >
                              <Edit className="w-full h-full" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Section */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Showing {from}–{to} of {total} users
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-md border border-gray-200 text-gray-400 cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>
                <button className="px-3 py-1 rounded-md bg-[#064F32] text-white hover:opacity-90">
                  {page}
                </button>
                <button
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  className="px-3 py-1 rounded-md border border-gray-200 text-gray-400 cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Delete Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
                <h2 className="text-xl font-bold mb-4 mt-4">Delete</h2>
                <p className="mb-6">
                  Are you sure you want to delete{" "}
                  <strong>{selectedIds.length}</strong> user(s)?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    disabled={deleting}
                    className={`px-4 py-2 text-white rounded ${
                      deleting
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-700 hover:bg-red-800"
                    }`}
                  >
                    {deleting ? "Deleting..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}