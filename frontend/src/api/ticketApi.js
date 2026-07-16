import axiosClient from './axiosClient';

export const createTicketRequest = (payload) => axiosClient.post('/tickets', payload);
export const getTicketsRequest = (params = {}) => axiosClient.get('/tickets', { params });
export const updateTicketRequest = (id, payload) => axiosClient.put(`/tickets/${id}`, payload);
