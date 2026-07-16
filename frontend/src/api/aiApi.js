import axiosClient from './axiosClient';

export const analyzeTicketRequest = (payload) => axiosClient.post('/ai/analyze-ticket', payload);
