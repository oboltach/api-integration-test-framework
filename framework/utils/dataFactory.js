export  function makeUser(overrides = {}){
  const ts = Date.now()
  const base = {
    name: `user_${ts}`,
    email: `user_${ts}@example.com`,
    password: 'Test1234',
    avatar: 'https://picsum.photos/200'
  }
  return {...base, ...overrides}
}
