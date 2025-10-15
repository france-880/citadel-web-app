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
  Shield,
  Users,
  UserCheck,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Settings,
  Database,
  FileText,
  Calendar,
  BarChart3
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

export default function RolePermissionManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState("roles"); // "roles" or "permissions" or "logs"

  // Dummy data for roles
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Super Admin",
      code: "super_admin",
      description: "Full system access and administration",
      status: "active",
      user_count: 1,
      created_at: "2023-01-15T08:00:00Z",
      permissions: {
        user_management: { create: true, read: true, update: true, delete: true },
        role_management: { create: true, read: true, update: true, delete: true },
        college_management: { create: true, read: true, update: true, delete: true },
        program_management: { create: true, read: true, update: true, delete: true },
        attendance_management: { create: true, read: true, update: true, delete: true },
        scheduling: { create: true, read: true, update: true, delete: true },
        reports: { create: true, read: true, update: true, delete: true },
        system_settings: { create: true, read: true, update: true, delete: true }
      }
    },
    {
      id: 2,
      name: "Dean",
      code: "dean",
      description: "College-level administration and oversight",
      status: "active",
      user_count: 2,
      created_at: "2023-01-20T08:00:00Z",
      permissions: {
        user_management: { create: false, read: true, update: true, delete: false },
        role_management: { create: false, read: true, update: false, delete: false },
        college_management: { create: true, read: true, update: true, delete: false },
        program_management: { create: true, read: true, update: true, delete: false },
        attendance_management: { create: true, read: true, update: true, delete: true },
        scheduling: { create: true, read: true, update: true, delete: true },
        reports: { create: true, read: true, update: true, delete: false },
        system_settings: { create: false, read: true, update: false, delete: false }
      }
    },
    {
      id: 3,
      name: "Program Head",
      code: "program_head",
      description: "Program-specific management and coordination",
      status: "active",
      user_count: 2,
      created_at: "2023-02-01T08:00:00Z",
      permissions: {
        user_management: { create: false, read: true, update: false, delete: false },
        role_management: { create: false, read: true, update: false, delete: false },
        college_management: { create: false, read: true, update: false, delete: false },
        program_management: { create: true, read: true, update: true, delete: false },
        attendance_management: { create: true, read: true, update: true, delete: false },
        scheduling: { create: true, read: true, update: true, delete: true },
        reports: { create: false, read: true, update: false, delete: false },
        system_settings: { create: false, read: false, update: false, delete: false }
      }
    },
    {
      id: 4,
      name: "Professor",
      code: "prof",
      description: "Faculty member with teaching and attendance responsibilities",
      status: "active",
      user_count: 5,
      created_at: "2023-02-10T08:00:00Z",
      permissions: {
        user_management: { create: false, read: false, update: false, delete: false },
        role_management: { create: false, read: false, update: false, delete: false },
        college_management: { create: false, read: false, update: false, delete: false },
        program_management: { create: false, read: true, update: false, delete: false },
        attendance_management: { create: true, read: true, update: true, delete: false },
        scheduling: { create: false, read: true, update: false, delete: false },
        reports: { create: false, read: true, update: false, delete: false },
        system_settings: { create: false, read: false, update: false, delete: false }
      }
    },
    {
      id: 5,
      name: "Security Guard",
      code: "guard",
      description: "Security personnel with limited system access",
      status: "active",
      user_count: 2,
      created_at: "2023-03-01T08:00:00Z",
      permissions: {
        user_management: { create: false, read: false, update: false, delete: false },
        role_management: { create: false, read: false, update: false, delete: false },
        college_management: { create: false, read: false, update: false, delete: false },
        program_management: { create: false, read: false, update: false, delete: false },
        attendance_management: { create: true, read: true, update: false, delete: false },
        scheduling: { create: false, read: false, update: false, delete: false },
        reports: { create: false, read: false, update: false, delete: false },
        system_settings: { create: false, read: false, update: false, delete: false }
      }
    }
  ]);

  // Dummy data for access logs
  const [accessLogs, setAccessLogs] = useState([
    {
      id: 1,
      user: "Dr. Maria Santos",
      role: "Super Admin",
      action: "Created new role",
      module: "Role Management",
      details: "Created role 'Program Head' with permissions",
      ip_address: "192.168.1.100",
      timestamp: "2024-01-15T10:30:00Z",
      status: "success"
    },
    {
      id: 2,
      user: "Dr. Robert Garcia",
      role: "Dean",
      action: "Updated user permissions",
      module: "User Management",
      details: "Modified permissions for user 'Prof. John Cruz'",
      ip_address: "192.168.1.101",
      timestamp: "2024-01-15T09:15:00Z",
      status: "success"
    },
    {
      id: 3,
      user: "Prof. John Cruz",
      role: "Program Head",
      action: "Viewed attendance report",
      module: "Reports",
      details: "Generated attendance report for January 2024",
      ip_address: "192.168.1.102",
      timestamp: "2024-01-15T08:45:00Z",
      status: "success"
    },
    {
      id: 4,
      user: "Engr. Sarah Martinez",
      role: "Professor",
      action: "Failed login attempt",
      module: "Authentication",
      details: "Invalid password entered",
      ip_address: "192.168.1.103",
      timestamp: "2024-01-15T08:20:00Z",
      status: "failed"
    },
    {
      id: 5,
      user: "James Wilson",
      role: "Security Guard",
      action: "Marked student attendance",
      module: "Attendance Management",
      details: "Marked attendance for 25 students",
      ip_address: "192.168.1.104",
      timestamp: "2024-01-15T07:30:00Z",
      status: "success"
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (id) => {
    const role = roles.find(r => r.id === id);
    setSelectedRole(role);
    setShowRoleModal(true);
  };

  const handleView = (role) => {
    setSelectedRole(role);
    setShowPermissionModal(true);
  };

  const toggleRoleStatus = (roleId) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId 
        ? { ...role, status: role.status === 'active' ? 'inactive' : 'active' }
        : role
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
      setSelectedIds(filteredRoles.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Delete multiple roles
  const handleDeleteSelected = () => {
    handleDelete(selectedIds);
  };

  const handleDelete = async (ids) => {
    if (!ids || ids.length === 0) return;
    setDeleting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRoles(prev => prev.filter(role => !ids.includes(role.id)));
    setSelectedIds([]);
    setShowModal(false);
    setDeleting(false);
  };

  // Filter roles based on search, role, and status
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(search.toLowerCase()) ||
                         role.description.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || role.code === roleFilter;
    const matchesStatus = !statusFilter || role.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (code) => {
    const colors = {
      super_admin: "bg-purple-100 text-purple-800",
      dean: "bg-blue-100 text-blue-800",
      program_head: "bg-green-100 text-green-800",
      prof: "bg-orange-100 text-orange-800",
      guard: "bg-gray-100 text-gray-800"
    };
    return colors[code] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getLogStatusColor = (status) => {
    return status === 'success' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getModuleIcon = (module) => {
    const icons = {
      'User Management': Users,
      'Role Management': Shield,
      'College Management': Database,
      'Program Management': FileText,
      'Attendance Management': UserCheck,
      'Scheduling': Calendar,
      'Reports': BarChart3,
      'System Settings': Settings,
      'Authentication': Shield
    };
    const IconComponent = icons[module] || Activity;
    return <IconComponent className="w-4 h-4" />;
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
              <h1 className="text-3xl font-bold text-[#064F32] mb-2">Role & Permission Management</h1>
              <p className="text-gray-600">Manage user roles, permissions, and access control</p>
            </div>
            <button className="bg-[#064F32] text-white px-4 py-2 rounded-lg hover:bg-[#053d27] transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Role
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Roles</p>
                  <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
                </div>
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Roles</p>
                  <p className="text-2xl font-bold text-green-600">{roles.filter(r => r.status === 'active').length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-purple-600">{roles.reduce((sum, role) => sum + role.user_count, 0)}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Access Logs</p>
                  <p className="text-2xl font-bold text-orange-600">{accessLogs.length}</p>
                </div>
                <Activity className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("roles")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "roles"
                      ? "border-[#064F32] text-[#064F32]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Roles & Permissions
                </button>
                <button
                  onClick={() => setActiveTab("logs")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "logs"
                      ? "border-[#064F32] text-[#064F32]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Access Logs
                </button>
              </nav>
            </div>
          </div>

          {/* Roles Tab Content */}
          {activeTab === "roles" && (
            <>
              {/* Filters */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search roles..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                    />
                  </div>
                  
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
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
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
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

              {/* Roles Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="bg-[#064F32]/10 text-[#064F32]">
                        <th className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={
                              filteredRoles.length > 0 &&
                              selectedIds.length === filteredRoles.length
                            }
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th className="px-4 py-3 font-semibold">Role Name</th>
                        <th className="px-4 py-3 font-semibold">Code</th>
                        <th className="px-4 py-3 font-semibold">Description</th>
                        <th className="px-4 py-3 font-semibold">Users</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Created</th>
                        <th className="px-4 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredRoles.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-4 py-6 text-center text-sm text-gray-500"
                          >
                            No roles found
                          </td>
                        </tr>
                      ) : (
                        filteredRoles.map((role) => (
                          <tr key={role.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <CustomCheckbox
                                checked={selectedIds.includes(role.id)}
                                onChange={() => handleCheckboxChange(role.id)}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{role.name}</p>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(role.code)}`}>
                                  {role.code}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 font-mono">{role.code}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{role.description}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{role.user_count}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(role.status)}`}>
                                {role.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {new Date(role.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleView(role)}
                                  className="p-2 text-gray-600 hover:text-[#064F32] hover:bg-[#064F32]/10 rounded-lg transition-colors"
                                  title="View Permissions"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEdit(role.id)}
                                  className="p-2 text-gray-600 hover:text-[#064F32] hover:bg-[#064F32]/10 rounded-lg transition-colors"
                                  title="Edit Role"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => toggleRoleStatus(role.id)}
                                  className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                                    role.status === 'active' ? 'text-green-600' : 'text-red-600'
                                  }`}
                                  title={role.status === 'active' ? 'Deactivate' : 'Activate'}
                                >
                                  {role.status === 'active' ? (
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
            </>
          )}

          {/* Access Logs Tab Content */}
          {activeTab === "logs" && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="bg-[#064F32]/10 text-[#064F32]">
                      <th className="px-4 py-3 font-semibold">User</th>
                      <th className="px-4 py-3 font-semibold">Role</th>
                      <th className="px-4 py-3 font-semibold">Action</th>
                      <th className="px-4 py-3 font-semibold">Module</th>
                      <th className="px-4 py-3 font-semibold">Details</th>
                      <th className="px-4 py-3 font-semibold">IP Address</th>
                      <th className="px-4 py-3 font-semibold">Timestamp</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {accessLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{log.user}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(log.role.toLowerCase().replace(' ', '_'))}`}>
                            {log.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{log.action}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getModuleIcon(log.module)}
                            <span className="text-sm text-gray-700">{log.module}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate" title={log.details}>
                          {log.details}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-mono">{log.ip_address}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLogStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Role Details Modal */}
          {showRoleModal && selectedRole && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Role Details</h3>
                  <button
                    onClick={() => setShowRoleModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role Name</label>
                    <p className="text-gray-900">{selectedRole.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Code</label>
                    <p className="text-gray-900 font-mono">{selectedRole.code}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-gray-900">{selectedRole.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRole.status)}`}>
                      {selectedRole.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User Count</label>
                    <p className="text-gray-900">{selectedRole.user_count}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="text-gray-900">{new Date(selectedRole.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Permissions Modal */}
          {showPermissionModal && selectedRole && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Permissions for {selectedRole.name}</h3>
                  <button
                    onClick={() => setShowPermissionModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Module</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Create</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Read</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Update</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {Object.entries(selectedRole.permissions).map(([module, permissions]) => (
                        <tr key={module}>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900 capitalize">
                            {module.replace('_', ' ')}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {permissions.create ? (
                              <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                            )}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {permissions.read ? (
                              <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                            )}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {permissions.update ? (
                              <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                            )}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {permissions.delete ? (
                              <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
                <h2 className="text-xl font-bold mb-4 mt-4">Delete Roles</h2>
                <p className="mb-6">
                  Are you sure you want to delete{" "}
                  <strong>{selectedIds.length}</strong> role(s)? This action cannot be undone.
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
