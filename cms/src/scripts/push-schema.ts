import 'dotenv/config'

import { getPayload } from 'payload'

process.env.PAYLOAD_PUSH_SCHEMA = 'true'

import config from '../payload.config'

const payload = await getPayload({ config })
await payload.db.destroy?.()
console.log('[push-schema] Database schema synced.')
process.exit(0)
