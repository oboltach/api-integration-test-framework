import {api} from './apiClient.js'

export  function login(email, password){
  return api.post('/auth/login', {email, password})
}
