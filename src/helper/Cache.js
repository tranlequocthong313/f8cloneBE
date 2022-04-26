const { createClient } = require('redis')
const REDIS_PORT = process.env.PORT || 6379

const client = createClient(REDIS_PORT)

// ;(async () => {
//   client.on('error', err => console.log('Redis Client Error', err))
//   await client.connect()
// })()

const cache = async (key, callback) => {
  const DEFAULT_EXPIRATION = 3600

  try {
    const dataCached = await client.get(key)

    if (dataCached !== null) return JSON.parse(data)

    const data = await callback()
    client.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(data))
    return data
  } catch (error) {
    console.error(error.message)
  }
}

module.exports = cache
