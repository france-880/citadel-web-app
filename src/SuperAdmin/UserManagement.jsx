import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import SuperAdminSidebar from "../Components/SuperAdminSidebar";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  MoreVertical,
  Users,
  UserPlus,
  Shield,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

function CustomCheckbox({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded 
                   checked:bg-[#064F32] checked:border-[#064F32] cursor-pointer"
      />
      {checked && (
        <CheckCircle className="w-3 h-3 text-white absolute left-0.5 top-0.5 pointer-events-none" />
      )}
    </label>
  );
}

export default function UserManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Dummy data for SuperAdmin - includes all user types
  const [users, setUsers] = useState([
    {
      id: 1,
      fullname: "Dr. Maria Santos",
      email: "maria.santos@university.edu",
      role: "super_admin",
      department: "Administration",
      status: "active",
      created_at: "2023-01-15T08:00:00Z",
      last_login: "2024-01-15T10:30:00Z",
      phone: "+1-555-0101"
    },
    {
      id: 2,
      fullname: "Dr. Robert Garcia",
      email: "robert.garcia@university.edu",
      role: "dean",
      department: "College of Engineering",
      status: "active",
      created_at: "2023-01-20T08:00:00Z",
      last_login: "2024-01-14T16:45:00Z",
      phone: "+1-555-0102"
    },
    {
      id: 3,
      fullname: "Dr. Lisa Chen",
      email: "lisa.chen@university.edu",
      role: "dean",
      department: "College of Arts and Sciences",
      status: "active",
      created_at: "2023-02-01T08:00:00Z",
      last_login: "2024-01-15T09:15:00Z",
      phone: "+1-555-0103"
    },
    {
      id: 4,
      fullname: "Prof. John Cruz",
      email: "john.cruz@university.edu",
      role: "program_head",
      department: "College of Information Technology",
      status: "active",
      created_at: "2023-02-10T08:00:00Z",
      last_login: "2024-01-15T11:20:00Z",
      phone: "+1-555-0104"
    },
    {
      id: 5,
      fullname: "Dr. Anna Reyes",
      email: "anna.reyes@university.edu",
      role: "program_head",
      department: "College of Information Technology",
      status: "active",
      created_at: "2023-02-15T08:00:00Z",
      last_login: "2024-01-14T14:30:00Z",
      phone: "+1-555-0105"
    },
    {
      id: 6,
      fullname: "Prof. Michael Torres",
      email: "michael.torres@university.edu",
      role: "prof",
      department: "College of Information Technology",
      status: "active",
      created_at: "2023-03-01T08:00:00Z",
      last_login: "2024-01-15T08:45:00Z",
      phone: "+1-555-0106"
    },
    {
      id: 7,
      fullname: "Engr. Sarah Martinez",
      email: "sarah.martinez@university.edu",
      role: "prof",
      department: "College of Engineering",
      status: "active",
      created_at: "2023-03-05T08:00:00Z",
      last_login: "2024-01-14T17:10:00Z",
      phone: "+1-555-0107"
    },
    {
      id: 8,
      fullname: "Engr. David Lee",
      email: "david.lee@university.edu",
      role: "prof",
      department: "College of Engineering",
      status: "inactive",
      created_at: "2023-03-10T08:00:00Z",
      last_login: "2024-01-10T15:20:00Z",
      phone: "+1-555-0108"
    },
    {
      id: 9,
      fullname: "Prof. Carlos Mendez",
      email: "carlos.mendez@university.edu",
      role: "prof",
      department: "College of Arts and Sciences",
      status: "active",
      created_at: "2023-03-15T08:00:00Z",
      last_login: "2024-01-15T12:00:00Z",
      phone: "+1-555-0109"
    },
    {
      id: 10,
      fullname: "Prof. Elena Rodriguez",
      email: "elena.rodriguez@university.edu",
      role: "prof",
      department: "College of Arts and Sciences",
      status: "active",
      created_at: "2023-03-20T08:00:00Z",
      last_login: "2024-01-14T13:45:00Z",
      phone: "+1-555-0110"
    },
    {
      id: 11,
      fullname: "James Wilson",
      email: "james.wilson@university.edu",
      role: "guard",
      department: "Security",
      status: "active",
      created_at: "2023-04-01T08:00:00Z",
      last_login: "2024-01-15T07:30:00Z",
      phone: "+1-555-0111"
    },
    {
      id: 12,
      fullname: "Maria Gonzalez",
      email: "maria.gonzalez@university.edu",
      role: "guard",
      department: "Security",
      status: "active",
      created_at: "2023-04-05T08:00:00Z",
      last_login: "2024-01-14T18:00:00Z",
      phone: "+1-555-0112"
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (id) => {
    // Navigate to edit user page
    console.log('Edit user:', id);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

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
      setSelectedIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Delete multiple users
  const handleDeleteSelected = () => {
    handleDelete(selectedIds);
  };

  const handleDelete = async (ids) => {
    if (!ids || ids.length === 0) return;
    setDeleting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUsers(prev => prev.filter(user => !ids.includes(user.id)));
    setSelectedIds([]);
    setShowModal(false);
    setDeleting(false);
  };

  // Filter users based on search, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullname.toLowerCase().includes(search.toLowerCase()) ||
                         user.email.toLowerCase().includes(search.toLowerCase()) ||
                         user.department.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !role || user.role === role;
    const matchesStatus = !status || user.status === status;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role) => {
    const colors = {
      super_admin: "bg-purple-100 text-purple-800",
      dean: "bg-blue-100 text-blue-800",
      program_head: "bg-green-100 text-green-800",
      prof: "bg-orange-100 text-orange-800",
      guard: "bg-gray-100 text-gray-800"
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getRoleDisplayName = (role) => {
    const names = {
      super_admin: "Super Admin",
      dean: "Dean",
      program_head: "Program Head",
      prof: "Professor",
      guard: "Security Guard"
    };
    return names[role] || role;
  };

  if (isLoading) {
    return (
      <div className="flex" style={{ paddingLeft: '300px', paddingTop: '70px' }}>
        <SuperAdminSidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6 min-h-screen">
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#064F32]"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex" style={{ paddingLeft: '300px', paddingTop: '70px' }}>
      <SuperAdminSidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen bg-gray-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#064F32] mb-2">User Management</h1>
              <p className="text-gray-600">Manage all system users and their access levels</p>
            </div>
            <button className="bg-[#064F32] text-white px-4 py-2 rounded-lg hover:bg-[#053d27] transition-colors flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add New User
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Administrators</p>
                  <p className="text-2xl font-bold text-purple-600">{users.filter(u => ['super_admin', 'dean'].includes(u.role)).length}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Faculty</p>
                  <p className="text-2xl font-bold text-orange-600">{users.filter(u => ['prof', 'program_head'].includes(u.role)).length}</p>
                </div>
                <Users className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                />
              </div>
              
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32] min-w-[180px]"
              >
                <option value="">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="dean">Dean</option>
                <option value="program_head">Program Head</option>
                <option value="prof">Professor</option>
                <option value="guard">Security Guard</option>
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32] min-w-[140px]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {selectedIds.length > 0 && (
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 rounded-lg text-white text-sm bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected ({selectedIds.length})
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-[#064F32]/10 text-[#064F32]">
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          filteredUsers.length > 0 &&
                          selectedIds.length === filteredUsers.length
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Department</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Last Login</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <CustomCheckbox
                            checked={selectedIds.includes(user.id)}
                            onChange={() => handleCheckboxChange(user.id)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.fullname}</p>
                            <p className="text-xs text-gray-500">{user.phone}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {getRoleDisplayName(user.role)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{user.department}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleView(user)}
                              className="p-2 text-gray-600 hover:text-[#064F32] hover:bg-[#064F32]/10 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(user.id)}
                              className="p-2 text-gray-600 hover:text-[#064F32] hover:bg-[#064F32]/10 rounded-lg transition-colors"
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                                user.status === 'active' ? 'text-green-600' : 'text-red-600'
                              }`}
                              title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                            >
                              {user.status === 'active' ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Details Modal */}
          {showUserModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900">{selectedUser.fullname}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                      {getRoleDisplayName(selectedUser.role)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <p className="text-gray-900">{selectedUser.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedUser.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="text-gray-900">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Login</label>
                    <p className="text-gray-900">
                      {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
                <h2 className="text-xl font-bold mb-4 mt-4">Delete Users</h2>
                <p className="mb-6">
                  Are you sure you want to delete{" "}
                  <strong>{selectedIds.length}</strong> user(s)? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    disabled={deleting}
                    className={`px-4 py-2 text-white rounded-lg transition-colors ${
                      deleting
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-700 hover:bg-red-800"
                    }`}
                  >
                    {deleting ? "Deleting..." : "Confirm Delete"}
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
