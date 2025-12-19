export function sleep(ms){
  return new Promise((res) => setTimeout(res, ms))
}
export function parseRetryAfter(headerValue){
  if(!headerValue) return null
  const secs = Number(headerValue)
  if(!Number.isNaN(secs)) return secs * 1000
  const dateMs = Date.parse(headerValue)
  return Number.isNaN(dateMs) ? null : Math.max(0, dateMs - Date.now())
}
