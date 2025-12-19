import { describe, it, beforeEach, after } from 'mocha'
import { expect } from 'chai'
import {makeUser} from '../../framework/utils/dataFactory.js'
import {getUser} from '../../framework/api/userApi.js'
import {createUser} from '../../framework/api/createUserApi.js'
import {updateUser} from '../../framework/api/updateUserApi.js'
import {deleteUser} from '../../framework/api/deleteUserApi.js'
import {expectSchema} from '../../framework/helpers/schemaHelper.js'
import userSchema from '../../framework/schema/userProfile.schema.json' with {type: 'json'};
import deleteUserSchema from '../../framework/schema/entityNotFound.schema.json' with {type: 'json'};
import { findUserByEmail } from '../../framework/db/dbQueries.js'
import { dbClose } from '../../framework/db/dbClient.js'

describe('CRUD User suite', () => {
  let user
  let id
  let createResp
  beforeEach(async () => {
    user = makeUser({password: 'test6667'});
    createResp = await createUser(user);
    expect(createResp.status).to.be.oneOf([200, 201]);
    expectSchema(userSchema, createResp.data);
    id = createResp.data.id;
  });
  after(async () => {
    if(process.env.ALLOW_DB_TESTS === 'true'){
      await dbClose()
    }
  });
  it('CREATE User', async() => {
    //assert values
    expect(createResp.data.email).to.equal(user.email);
    expect(createResp.data.name).to.equal(user.name);

    //db verification
    if(process.env.ALLOW_DB_TESTS === 'true'){
      const result  = await findUserByEmail(user.email);
      expect(result.rowCount).to.equal(1);
      expect(result.rows[0].email).to.equal(user.email);
      expect(result.rows[0].name).to.equal(user.name);
    }
  });
  it('GET User', async() => {
    const userResp = await getUser(id);
    expect(userResp.status).to.equal(200);
    expectSchema(userSchema, userResp.data);
    expect(userResp.data.email).to.equal(user.email);
  });
  it('UPDATE User + Get Profile', async() => {
    const patch = {name: `updated_${Date.now()}`}
    const updateResp = await updateUser(id, patch);
    expect(updateResp.status).to.equal(200);
    expectSchema(userSchema, updateResp.data);
    expect(updateResp.data.name).to.equal(patch.name)
    // get profile
    const userResp = await getUser(id);
    expect(userResp.status).to.equal(200);
    expectSchema(userSchema, userResp.data);
    expect(userResp.data.name).to.equal(patch.name)
    //db verification
    if(process.env.ALLOW_DB_TESTS === 'true'){
      const result = await findUserByEmail(user.email)
      expect(result.rowCount).to.equal(1)
      expect(result.rows[0].email).to.equal(user.email)
      expect(result.rows[0].name).to.equal(patch.name)
    }
  });
  it('DELETE User + Get Profile', async() => {
    const deleteResp = await deleteUser(id);
    expect(deleteResp.status).to.be.oneOf([200, 204]);
    expect(deleteResp.data).to.equal(true);
    try{
      await getUser(id)
      throw new Error('Expected GET after delete to fail, but it passed')
    }catch(e){
      expect(e).to.have.property('response')
      expect(e.response.status).to.equal(400);
      expectSchema(deleteUserSchema, e.response.data);
      expect(e.response.data.name).to.equal('EntityNotFoundError')
    }
    //db verification
    if(process.env.ALLOW_DB_TESTS === 'true'){
      const result = await findUserByEmail(user.email);
      expect(result.rowCount).to.equal(0);
      expect(result.rows).to.have.length(0);
    }
  });
});
