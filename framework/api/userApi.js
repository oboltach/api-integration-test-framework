import { api } from './apiClient.js'

export function getUser(userId) {
  return api.get(`/users/${userId}`)
}
