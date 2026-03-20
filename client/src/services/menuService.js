import api from '../lib/axios';

export const menuService = {
  getMenu: () => api.get('/menu/getmenu'),
  getAvailable: () => api.get('/menu/available'),
  addItem: (data) => api.post('/menu/additem', data),
  updateItem: (id, data) => api.put(`/menu/updateitem/${id}`, data),
  deleteItem: (id) => api.delete(`/menu/deleteitem/${id}?confirm=yes`),
};
