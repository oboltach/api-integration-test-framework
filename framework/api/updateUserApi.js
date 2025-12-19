import {api} from './apiClient.js'

export  function updateUser(userId, patch){
  return api.put(`/users/${userId}`, patch)
}
