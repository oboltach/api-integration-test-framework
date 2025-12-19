import '../utils/env.js'
import axios from 'axios'
import {getToken} from '../utils/session.js'
import {sleep} from '../utils/retry.js'

export const api = axios.create({
    baseURL: process.env.BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
})
api.interceptors.request.use((config) => {
  const token = getToken()
  if(token){
    config.headers = config.headers || {}
    if(!config.headers.Authorization){
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})
api.interceptors.response.use((response) => {return response}, async (error) => {
  const method = error.config?.method?.toUpperCase()
  const url = error.config?.url
  const status = error.response?.status
  const data = error.response?.data
  console.error('API ERROR: ', {
    method,
    url,
    status,
    data
  })
  const config = error.config
  if (!config) throw error

  const m = (config.method || 'GET').toUpperCase()
  if (m !== 'GET') throw error

  const isNetworkError = !error.response
  const isServerError = status != null && status >= 500 && status <= 599
  if (!isNetworkError && !isServerError) throw error

  config.__retryCount = config.__retryCount ?? 0
  if (config.__retryCount >= 2) throw error

  config.__retryCount += 1

  // small fixed delay
  await sleep(300)

  // retry same request
  return api.request(config)
 })
