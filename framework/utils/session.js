let currentToken = null

export  function setToken(token){
  currentToken = token
}
export function getToken(){
  return currentToken
}
export function clearToken(){
  currentToken = null
}
