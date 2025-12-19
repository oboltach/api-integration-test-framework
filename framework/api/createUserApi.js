
import {api} from './apiClient.js'

export  function createUser(user){
  return api.post('/users', user)
}
