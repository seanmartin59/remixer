import express from 'express'
import { handler as remixHandler } from './api/remix.js'

const app = express()
app.use(express.json())

app.post('/api/remix', remixHandler)

app.listen(3000, () => {
  console.log('API server running on port 3000')
}) 