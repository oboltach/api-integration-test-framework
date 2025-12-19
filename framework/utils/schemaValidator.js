import Ajv from 'ajv'

const ajv = new Ajv({allErrors: true, strict:false})

export function validateSchema(schema, data){
  const validate = ajv.compile(schema)
  const ok = validate(data)
  return {ok, errors: validate.errors ?? []}
}
