import {expect} from 'chai'
import {setToken} from '../utils/session.js'
import {login} from '../api/authApi.js'

export async function loginAs(email, password){
  const resp = await login(email, password);
  expect(resp.status).to.be.oneOf([200, 201]);
  expect(resp.data).to.have.property('access_token');
  expect(resp.data).to.have.property('refresh_token');

  const token = resp.data.access_token

  setToken(token)

  return resp
}
