const API_URL = import.meta.env.VITE_API_URL;

// Helper avec gestion des erreurs HTTP
const apiFetch = async (url, options = {}) => {
  const res = await fetch(url, {
    credentials: 'include',
    ...options
  });

  if (!res.ok) {
  const err = await res.json().catch(() => ({}));
  throw new Error(err.error || err.message || `Erreur HTTP ${res.status}`);
}
  return res;
};

// ========================================
// 🎓 Service Étudiants
// ========================================
export const studentsAPI = {
  getAll: async () => {
    const res = await apiFetch(`${API_URL}/students`);
    return res.json();
  },

  getById: async (id) => {
    const res = await apiFetch(`${API_URL}/students/${id}`);
    return res.json();
  },
getMyGradeById: async (id) => {
  const res = await apiFetch(`${API_URL}/grades/${id}/student`);
  return res.json();
},

  getMyProfile: async () => {
    const res = await apiFetch(`${API_URL}/students/me/profile`);
    return res.json();
  },

  create: async (student) => {
    const res = await apiFetch(`${API_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    return res.json();
  },

  update: async (id, student) => {
    const res = await apiFetch(`${API_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await apiFetch(`${API_URL}/students/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  enrollInCourse: async (studentId, courseId) => {
    const res = await apiFetch(
      `${API_URL}/students/${studentId}/courses/${courseId}`,
      { method: 'POST' }
    );
    return res.json();
  },

  unenrollFromCourse: async (studentId, courseId) => {
    const res = await apiFetch(
      `${API_URL}/students/${studentId}/courses/${courseId}`,
      { method: 'DELETE' }
    );
    return res.json();
  }
};

// ========================================
// 📚 Service Cours
// ========================================
export const coursesAPI = {
  getAll: async () => {
    const res = await apiFetch(`${API_URL}/courses`);
    return res.json();
  },
getMyCourses: async () => {
  const res = await apiFetch(`${API_URL}/courses/me`);
  return res.json();
},

  getById: async (id) => {
    const res = await apiFetch(`${API_URL}/courses/${id}`);
    return res.json();
  },
getByIdStudent: async (id) => {
    const res = await apiFetch(`${API_URL}/courses/${id}/student`);
    return res.json();
  },

  getEnrolledStudents: async (id) => {
    const res = await apiFetch(`${API_URL}/courses/${id}/students`);
    return res.json();
  },

  create: async (course) => {
    const res = await apiFetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    return res.json();
  },

  update: async (id, course) => {
    const res = await apiFetch(`${API_URL}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await apiFetch(`${API_URL}/courses/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};

// ========================================
// 📝 Service Notes
// ========================================
export const gradesAPI = {
  getAll: async () => {
    const res = await apiFetch(`${API_URL}/grades`);
    return res.json();
  },

  getMyGrades: async () => {
    const res = await apiFetch(`${API_URL}/grades/me`);
    return res.json();
  },

  getById: async (id) => {
    const res = await apiFetch(`${API_URL}/grades/${id}`);
    return res.json();
  },

  getByStudent: async (studentId) => {
    const res = await apiFetch(`${API_URL}/grades/student/${studentId}`);
    return res.json();
  },

  getByCourse: async (courseId) => {
    const res = await apiFetch(`${API_URL}/grades/course/${courseId}`);
    return res.json();
  },
getMyGradeById: async (id) => {
    const res = await apiFetch(`${API_URL}/grades/${id}/student`);
    return res.json();
  },

  create: async (grade) => {
    const res = await apiFetch(`${API_URL}/grades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grade)
    });
    return res.json();
  },

  update: async (id, grade) => {
    const res = await apiFetch(`${API_URL}/grades/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grade)
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await apiFetch(`${API_URL}/grades/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};

// ========================================
// 📊 Statistiques
// ========================================
export const statsAPI = {
  getAdminDashboard: async () => {
    const res = await apiFetch(`${API_URL}/stats/admin/dashboard`);
    return res.json();
  },

  getScolariteDashboard: async () => {
    const res = await apiFetch(`${API_URL}/stats/scolarite/dashboard`);
    return res.json();
  },

  getStudentDashboard: async () => {
    const res = await apiFetch(`${API_URL}/stats/student/dashboard`);
    return res.json();
  },

  getStudentStats: async (id) => {
    const res = await apiFetch(`${API_URL}/stats/student/${id}`);
    return res.json();
  },

  getCourseStats: async (id) => {
    const res = await apiFetch(`${API_URL}/stats/course/${id}`);
    return res.json();
  }
};

// ========================================
// 🔐 Authentification
// ========================================
export const authAPI = {
  getStatus: async () => {
    try {
      const res = await apiFetch(`${API_URL}/auth/status`);
      return res.json();
    } catch (err) {
      console.error('Erreur auth status:', err);
      return { authenticated: false };
    }
  },

  logout: async () => {
    const res = await apiFetch(`${API_URL}/auth/logout`, {
      method: 'POST'
    });
    return res.json();
  }
};

// ========================================
// 👤 Utilisateurs (Invitations)
// ========================================
export const usersAPI = {
  invite: async (userData) => {
    const res = await apiFetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },
 getAll: async () => {
    const res = await apiFetch(`${API_URL}/users`);
    return res.json();
  },

  delete: async (id) => {
    const res = await apiFetch(`${API_URL}/users/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }

};
