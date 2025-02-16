export const handler = async function(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { text } = req.body
    // Simple text transformation for now
    const remixedText = text.split('').reverse().join('')
    res.status(200).json({ remixedText })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: 'Error processing request' })
  }
} 