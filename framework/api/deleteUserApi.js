import {api} from './apiClient.js'

export  function deleteUser(userId){
  return api.delete(`/users/${userId}`)
}
