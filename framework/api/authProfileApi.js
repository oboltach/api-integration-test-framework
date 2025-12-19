import {api} from './apiClient.js'

export  function getMe(){
  return api.get('/auth/profile')
}
