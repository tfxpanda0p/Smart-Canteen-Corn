import api from '../lib/axios';

export const orderService = {
  placeOrder: (items) => api.post('/order/placeorder', { items }),
  getOrder: (id) => api.get(`/order/getorder/${id}`),
  getMyOrders: () => api.get('/order/totalorders'),
  getAllOrders: () => api.get('/order/allorders'),
  changeStatus: (id, status) => api.put(`/order/changestatus/${id}`, { status }),
};
