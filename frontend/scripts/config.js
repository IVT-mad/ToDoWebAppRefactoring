export const API_URL = "http://localhost/web-project-dia2025-main/backend";

export function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
  };
}
