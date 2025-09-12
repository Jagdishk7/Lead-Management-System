import http from './http';

// List leads with server-side pagination and filters
export async function listLeads(params = {}) {
  const { data } = await http.get('/leads', { params });
  return data; // { items, total, page, pages }
}

// Optional helpers for future use
export async function getLead(id) {
  const { data } = await http.get(`/leads/${id}`);
  return data;
}

export async function updateLead(id, payload) {
  const { data } = await http.patch(`/leads/${id}`, payload);
  return data;
}

export async function deleteLead(id) {
  await http.delete(`/leads/${id}`);
}

