import axios from 'axios'

// In dev: Vite proxies /api/* -> http://localhost:5000/*
// In prod: set VITE_API_URL to the backend origin.
const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

export const fetchSymptoms = () => api.get('/symptoms').then((r) => r.data.symptoms)

export const fetchDiseases = () => api.get('/diseases').then((r) => r.data.diseases)

export const fetchDisease = (name) =>
  api.get(`/diseases/${encodeURIComponent(name)}`).then((r) => r.data)

export const predictDisease = (symptoms) =>
  api.post('/predict', { symptoms }).then((r) => r.data)

export default api
