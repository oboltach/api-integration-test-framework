import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

// cache: schema object -> compiled validate function
const validators = new WeakMap()

export function validateSchema(schema, data) {
  let validate = validators.get(schema)
  if (!validate) {
    validate = ajv.compile(schema)
    validators.set(schema, validate)
  }

  const ok = validate(data)
  return { ok, errors: validate.errors ?? [] }
}
