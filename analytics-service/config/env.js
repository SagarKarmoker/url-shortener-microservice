import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.resolve(__dirname, '../../.env')
})

export const {
  MONGO_URI,
  URL_SERVICE_PORT,
  ANALYTICS_SERVICE_PORT,
  RABBITMQ_URL,
  RABBITMQ_QUEUE_NAME
} = process.env
