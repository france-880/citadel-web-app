import axios from "axios";

// Reusable axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api", // Laravel API endpoint
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // kunin sa login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add interceptors for debugging
api.interceptors.request.use(
  (config) => {
    console.log("🔄 API Request:", config.method?.toUpperCase(), config.url);
    console.log("📤 Request Params:", config.params);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const collegeAPI = {
  getAll: () => api.get("/colleges"),
  getById: (id) => api.get(`/colleges/${id}`),
  create: (data) => api.post("/colleges", data),
  update: (id, data) => api.put(`/colleges/${id}`, data),
  delete: (id) => api.delete(`/colleges/${id}`),
  getAvailableDeans: () => api.get("/colleges/deans/available"),
};

export const programAPI = {
  getAll: () => api.get("/programs"),
  getById: (id) => api.get(`/programs/${id}`),
  getByCollege: (collegeId) => api.get(`/programs/college/${collegeId}`),
  create: (data) => api.post("/programs", data),
  update: (id, data) => api.put(`/programs/${id}`, data),
  delete: (id) => api.delete(`/programs/${id}`),
  getAvailableProgramHeads: () => api.get("/programs/program-heads/available"),
  
  // Subject assignment methods
  getSubjects: (programId) => api.get(`/programs/${programId}/subjects`),
  assignSubject: (programId, subjectId, semester, yearLevel) => api.post(`/programs/${programId}/subjects`, { 
    subject_id: subjectId,
    semester: semester,
    year_level: yearLevel
  }),
  updateSubjectAssignment: (programId, subjectId, semester, yearLevel) => api.put(`/programs/${programId}/subjects/${subjectId}`, {
    semester: semester,
    year_level: yearLevel
  }),
  unassignSubject: (programId, subjectId) => api.delete(`/programs/${programId}/subjects/${subjectId}`),
};

export const subjectAPI = {
  getAll: () => api.get("/subjects"),
  getById: (id) => api.get(`/subjects/${id}`),
  getByType: (type) => api.get(`/subjects/type/${type}`),
  create: (data) => api.post("/subjects", data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

export const yearSectionAPI = {
  getAll: () => api.get("/year-sections"),
};

export const studentAPI = {
  getAll: (params = {}) => api.get("/students", { params }),
  getAllWithLogs: () => api.get("/students-with-logs"), // NEW
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post("/students", data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  deleteMultiple: (ids) =>
    api.delete("/students/delete-multiple", { data: { ids } }),
};


export default api;