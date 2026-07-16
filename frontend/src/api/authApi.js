import axiosClient from './axiosClient';

export const loginRequest = (email, password) =>
  axiosClient.post('/auth/login', {
    email,
    password,
  });

export const registerRequest = (
  name,
  email,
  password
) =>
  axiosClient.post('/auth/register', {
    name,
    email,
    password,
  });

export const getMeRequest = () =>
  axiosClient.get('/auth/me');