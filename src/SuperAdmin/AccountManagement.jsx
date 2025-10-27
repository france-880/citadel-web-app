import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Edit, Check, Eye } from "lucide-react";
import toast from "react-hot-toast";
import ViewAccount from "./ViewAccount";

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
  // ✅ Corrected and optimized Account_Management.jsx
export default function Account_Management() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);

  // ✅ Fetch accounts from backend with filter + pagination
  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts", {
        params: {
          search,
          role,
          page,
          per_page: 10,
        },
      });

      const data = res.data;
      setAccounts(data.data || []);
      setLastPage(data.last_page || 1);
      setFrom(data.from || 0);
      setTo(data.to || 0);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      toast.error("Failed to load accounts.");
    }
  };

  // ✅ Auto refresh when filters or page change
  useEffect(() => {
    fetchAccounts();
  }, [search, role, page]);

  // ✅ Reset to page 1 if filter/search changes
  useEffect(() => {
    setPage(1);
  }, [search, role]);

  const handleEdit = (id) => navigate(`/edit-account/${id}`);

  // Checkbox controls
  const handleCheckboxChange = (id) => {  
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((sid) => sid !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(accounts.map((u) => u.id));
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

    const promise = api.delete("/accounts/delete-multiple", { data: { ids } });

    toast.promise(promise, {
      loading: "Deleting accounts...",
      success: (res) =>
        res.data?.message ||
        `${ids.length} account(s) deleted successfully!`,
      error: (err) =>
        err.response?.data?.message || "Failed to delete accounts.",
    });

    try {
      await promise;
      setSelectedIds([]);
      setShowModal(false);  
      fetchAccounts();
    } catch (err) {
      console.error("Error deleting accounts:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex content_padding">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#064F32]">
              Account Management 
            </h1>
            <button
              onClick={() => navigate("/new-account")}
              className="px-4 py-2 rounded-md text-white bg-[#FF7A00] hover:opacity-90 transition"
            >
              + New Account
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <input
                type="text"
                placeholder="Search account..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="shrink-0 w-[300px] p-1.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="shrink-0 w-[180px] p-1.5 rounded-md border border-gray-200 text-gray-700 focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none"
              >
                <option value="">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="program_head">Program Head</option>
                <option value="dean">Dean</option>
                <option value="secretary">Secretary</option>
                <option value="guard">Guard</option>
                <option value="prof">Professor</option>
              </select>

              {selectedIds.length > 0 && (
                <button
                  onClick={() => setShowModal(true)}
                  className="px-2 py-2 rounded-md text-white text-sm bg-red-600 hover:bg-red-700 transition"
                >
                  Delete Selected
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-[#064F32]/10 text-[#064F32]">
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          accounts.length > 0 &&
                          selectedIds.length === accounts.length
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
                  {accounts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        No accounts found
                      </td>
                    </tr>
                  ) : (
                    accounts.map((account) => (
                      <tr key={account.id} className="hover:bg-[#F6F7FB]">
                        <td className="px-4 py-3">
                          <CustomCheckbox
                            checked={selectedIds.includes(account.id)}
                            onChange={() => handleCheckboxChange(account.id)}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {account.fullname ?? account.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {account.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {account.role}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {account.department ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {account.created_at
                            ? new Date(account.created_at).toLocaleDateString(
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
                            <ViewAccount account={account} />
                            <button
                              onClick={() => handleEdit(account.id)}
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

            {/* ✅ Pagination Section */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-white">
              <p className="text-sm text-gray-600">
                Showing {from}–{to} of {total} accounts
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="px-3 py-1 text-sm text-gray-600">
                  Page {page} of {lastPage}
                </span>
                <button
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 disabled:opacity-50"
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
                  <strong>{selectedIds.length}</strong> account(s)?
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
