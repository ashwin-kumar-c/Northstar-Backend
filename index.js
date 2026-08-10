import express from 'express'

const app = express()
const port = process.env.PORT || 3001
// const host = '127.0.0.1'

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.get('/api/message', (req, res) => {
  res.json({
    message: 'Hello from the separate Express backend!',
    timestamp: new Date().toISOString(),
  })
})

app.post('/api/greet', (req, res) => {
  const name = String(req.body?.name || '').trim()

  res.json({
    greeting: `Hi ${name || 'there'}, your React app is talking to the separate Express backend.`,
  })
})

// app.listen(port, host, () => {
//   console.log(`Express backend running at http://${host}:${port}`)

app.listen(port, () => {
  console.log(`Express backend running at ${port}`)
})
