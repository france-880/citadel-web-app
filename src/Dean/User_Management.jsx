import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import api from "../api/axios";
import {  Edit, Check } from "lucide-react";
import toast from "react-hot-toast";
import View_User from "./View_User"; // siguraduhing tama ang path

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
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [deleting, setDeleting] = useState(false); // state para sa loading ng button
  const [selected, setSelected] = useState([]); // track selected users


  const [selectedIds, setSelectedIds] = useState([]); 
  const [showModal, setShowModal] = useState(false);


  //   // fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();

    // Check if redirected with new user
    if (location.state?.newUser) {
      setUsers(prev => [...prev, location.state.newUser]);
    }
  }, [location.state?.newUser]);

 

//   // edit user → redirect to edit page
  const handleEdit = (id) => {
    navigate(`/edit_user/${id}`);
  };


// toggle checkbox
const handleCheckboxChange = (id) => {
  setSelectedIds((prev) =>
    prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
  );
};

// select all checkbox
const handleSelectAll = (e) => {
  if (e.target.checked) {
    setSelectedIds(users.map((s) => s.id));
  } else {
    setSelectedIds([]);
  }
};

const handleDeleteSelected = () => {
  handleDelete(selectedIds);
};


const handleDelete = async (ids) => {
  if (!ids || ids.length === 0) return;

  setDeleting(true); // disable confirm button habang nag-de-delete

  const promise = api.delete("/users/delete-multiple", {
    data: { ids },
  });

  toast.promise(promise, {
    loading: "Deleting users...",
    success: (res) => {
      return res.data?.message || `${ids.length} user(s) deleted successfully!`;
    },
    error: (err) => {
      return err.response?.data?.message || "Failed to delete users.";
    },
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


// // delete function
// const handleDelete = async (ids) => {
//   try {
//     await api.delete("/users/delete-multiple", {
//       data: { ids }, 
//     });

//     toast.promise(promise, {
//       loading: "Deleting users...",
//       success: `${ids.length} user(s) deleted successfully!`,
//       error: "Failed to delete users.",
//     });
  


//     toast.success(`${ids.length} user(s) deleted successfully!`);
//     setSelectedIds([]);
//     setShowModal(false);
//     fetchUsers();
//   } catch (err) {
//     console.error("Error deleting users:", err);
//     toast.error("Failed to delete users.");
//   }
// };


  const handleAddUser = () => {
    navigate("/new_user");
  };

  const filtered = useMemo(() => {
    return users
      .filter((u) =>
        search
          ? (
              String(u.id).toLowerCase().includes(search.toLowerCase()) ||
              (u.fullname ? u.fullname.toLowerCase().includes(search.toLowerCase()) : false) ||
              (u.email ? u.email.toLowerCase().includes(search.toLowerCase()) : false)
            )
          : true
      )
      .filter((u) => (role ? u.role === role : true));
  }, [users, search, role]);
  



  return (
    <div className="flex content_padding">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen">
          {/* Page header row: Title + Actions */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#064F32]">
              User Management
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/new_user")}
                className="px-4 py-2 rounded-md text-white bg-[#FF7A00] hover:opacity-90 transition"
              >
                + New User
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="overflow-x-auto">
              <div className="flex items-center gap-3 flex-nowrap">
                <input
                  type="text"
                  placeholder="Search user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="shrink-0 w-[300px] p-1.5 rounded-md border border-gray-200 bg-white focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="shrink-0 w-[180px] p-1.5 rounded-md border border-gray-200 bg-white text-gray-700 focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none"
                >
                  <option value="">All Roles</option>
                  <option value="Program Head">Program Head</option>
                  <option value="Dean">Dean</option>
                  <option value="Professor">Professor</option>
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
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-[#064F32]/10 text-[#064F32]">
                    <th className="px-4 py-3">
                    <input
                        type="checkbox"
                        checked={users.length > 0 && selectedIds.length === users.length}
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
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((user) => (
                      <tr key={user.id} className="hover:bg-[#F6F7FB]">
                        <td className="px-4 py-3">
                          <CustomCheckbox
                            checked={selectedIds.includes(user.id)}
                            onChange={() => handleCheckboxChange(user.id)}
                            // onChange={() => toggleSelect(user.id)}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                        {user.fullname ?? user.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {user.role }
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {user.department}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                        {user.created_at ? new Date(user.created_at|| user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }) : (user.date ?? '')}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <View_User user={user} />
                            <button 
                              onClick={() => navigate(`/edit_user/${user.id}`)} 
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

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-white">
              <p className="text-sm text-gray-600">
                Showing {filtered.length} of {users.length}
              </p>
              <div className="flex gap-2">
                <button
                  disabled
                  className="px-3 py-1 rounded-md border border-gray-200 text-gray-400 cursor-not-allowed"
                >
                  Prev
                </button>
                <button className="px-3 py-1 rounded-md bg-[#064F32] text-white hover:opacity-90">
                  1
                </button>
                <button
                  disabled
                  className="px-3 py-1 rounded-md border border-gray-200 text-gray-400 cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {showModal && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
                      <div className="flex justify-center mb-3">
                        <svg
                          className="w-12 h-12 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 
                            2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 
                            1 0 011-1h2a1 1 0 011 1v3"
                          />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold mb-2 mt-10">DELETE</h2>
                      <p className="mb-4">
                        Are you sure you want to delete {selectedIds.length} user(s)?
                      </p>
                      <div className="flex justify-center gap-4 mt-10">
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
