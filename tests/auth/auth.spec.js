import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import users from '../../framework/fixture/users.json' with {type: 'json'};
import {loginAs} from '../../framework/helpers/authHelper.js'
import {clearToken} from '../../framework/utils/session.js'
import {getMe} from '../../framework/api/authProfileApi.js'
import {login} from '../../framework/api/authApi.js'
import {expectSchema} from '../../framework/helpers/schemaHelper.js'
import loginSchema from '../../framework/schema/loginResponse.schema.json' with {type: 'json'};
import errorSchema from '../../framework/schema/errorResponse.schema.json' with {type: 'json'};
import userSchema from '../../framework/schema/userProfile.schema.json' with {type: 'json'};


describe('Auth suite', () => {
  beforeEach(() => {
    clearToken()
  });
  it('Login - positive + GET Profile', async() => {
    const respLogin = await loginAs(users.valid_user.email, users.valid_user.password)
    expectSchema(loginSchema, respLogin.data);
    const respMe = await getMe();
    expect(respMe.status).to.equal(200);
    expectSchema(userSchema, respMe.data)
    expect(respMe.data).to.have.property('email', users.valid_user.email)
  });
  it('Login - negative (401)', async() => {
    try{
      await login(users.invalid_user.email, users.invalid_user.password)
      throw new Error('Call should fail, but it passed');
    }
    catch(error){
      expect(error).to.have.property('response');
      expect(error.response.status).to.equal(401);
      expectSchema(errorSchema, error.response.data)
      expect(error.response.data).to.have.property('message', 'Unauthorized')
    }
  });
});
