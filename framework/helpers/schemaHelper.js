import { expect } from 'chai'
import { validateSchema } from '../utils/schemaValidator.js'

export function expectSchema(schema, data) {
  const r = validateSchema(schema, data)
  expect(r.ok, JSON.stringify(r.errors)).to.equal(true)
  return r
}
