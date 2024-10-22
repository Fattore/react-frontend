import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8080/api/',
});

export const headerAPI = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}