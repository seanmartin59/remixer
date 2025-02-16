import express from 'express'
import { handler as remixHandler } from './api/remix.js'

const app = express()
app.use(express.json())

app.post('/api/remix', remixHandler)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`)
}) 