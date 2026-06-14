import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
})

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('pgkart_user') || 'null')
  if (user?.jwtToken) {
    config.headers.Authorization = `Bearer ${user.jwtToken}`
  }
  return config
})

// Handle 401 globally — but NEVER redirect when the failed request IS the login endpoint
api.interceptors.response.use(
  response => response,
  error => {
    const isLoginRequest = error.config?.url?.includes('/api/auth/signin')
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('pgkart_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
