import axios from 'axios'

const url = window.location.toString()

let ACTIVE_ENV = 'prod'
if (url.includes('localhost')) {
  ACTIVE_ENV = 'dev'
}

export const apiClient = axios.create({
  withCredentials: true,
  baseURL: ACTIVE_ENV === 'dev' ? 'http://localhost:8000' : '/api',
  headers:
    ACTIVE_ENV === 'dev'
      ? {
          Authorization: 'Bearer TESTER',
          'X-User': 'tester',
        }
      : {},
})
