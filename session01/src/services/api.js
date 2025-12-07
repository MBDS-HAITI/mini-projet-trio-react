const API_URL = 'http://localhost:8010/api';

// Service pour les étudiants
export const studentsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/students`);
    return response.json();
  },
  
  create: async (student) => {
    const response = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    return response.json();
  }
};

// Service pour les cours
export const coursesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/courses`);
    return response.json();
  },
  
  create: async (course) => {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    return response.json();
  }
};

// Service pour les notes
export const gradesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/grades`);
    return response.json();
  },
  
  create: async (grade) => {
    const response = await fetch(`${API_URL}/grades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grade)
    });
    return response.json();
  }
};