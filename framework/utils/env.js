import dotenv from 'dotenv'

const envName = process.env.ENV
dotenv.config({ path: envName ? `.env.${envName}` : '.env' })
